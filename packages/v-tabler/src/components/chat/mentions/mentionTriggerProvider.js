const DEFAULT_CHAT_MENTION_TRIGGERS = Object.freeze({
    brand: Object.freeze(['brand', 'Marke']),
    partner: Object.freeze(['partner'])
})

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const validateTriggerDefinitions = (definitions) => {
    if (!definitions || typeof definitions !== 'object' || Array.isArray(definitions)) {
        throw new TypeError('Mention trigger definitions must be an object keyed by mention type.')
    }

    const definitionEntries = Object.entries(definitions)
    if (!definitionEntries.length) {
        throw new Error('Mention trigger definitions must contain at least one mention type.')
    }

    const triggerTypes = new Map()

    definitionEntries.forEach(([type, triggers]) => {
        if (!type.trim() || type !== type.trim()) {
            throw new Error('Mention trigger types must not be empty.')
        }
        if (!Array.isArray(triggers) || triggers.length === 0) {
            throw new Error(`Mention type "${type}" must define at least one trigger.`)
        }

        triggers.forEach((trigger) => {
            if (typeof trigger !== 'string' || !trigger.trim() || !/^[^\s@[\]]+$/u.test(trigger)) {
                throw new Error(`Mention type "${type}" contains an invalid trigger.`)
            }

            const normalizedTrigger = trigger.toLowerCase()
            const existingType = triggerTypes.get(normalizedTrigger)
            if (existingType) {
                throw new Error(
                    `Mention trigger "${trigger}" is assigned to both "${existingType}" and "${type}".`
                )
            }
            triggerTypes.set(normalizedTrigger, type)
        })
    })
}

/**
 * Create a provider that finds the active @trigger query immediately before the caret.
 */
export const createMentionTriggerProvider = (definitions) => {
    validateTriggerDefinitions(definitions)

    const triggerEntries = Object.entries(definitions).flatMap(([type, triggers]) =>
        triggers.map((trigger) => ({ type, trigger }))
    )
    const triggerPattern = triggerEntries
        .map(({ trigger }) => escapeRegExp(trigger))
        .sort((left, right) => right.length - left.length)
        .join('|')
    const activeTriggerPattern = new RegExp(
        `(^|[^\\p{L}\\p{N}_@])@(${triggerPattern})(?:[ \\t]+([^@\\n]*))?$`,
        'iu'
    )
    const typesByTrigger = new Map(
        triggerEntries.map(({ type, trigger }) => [trigger.toLowerCase(), type])
    )

    return ({ text, cursorIndex }) => {
        if (typeof text !== 'string' || !Number.isInteger(cursorIndex)) {
            throw new TypeError(
                'Mention trigger providers require text and an integer cursorIndex.'
            )
        }
        if (cursorIndex < 0 || cursorIndex > text.length) {
            throw new RangeError('Mention trigger cursorIndex is outside the supplied text.')
        }

        const textBeforeCursor = text.slice(0, cursorIndex)
        const match = activeTriggerPattern.exec(textBeforeCursor)
        if (!match) return null

        const boundary = match[1]
        const trigger = match[2]
        const query = match[3] ?? ''
        const start = match.index + boundary.length

        return {
            type: typesByTrigger.get(trigger.toLowerCase()),
            trigger,
            query,
            replaceRange: { start, end: cursorIndex }
        }
    }
}

export const defaultMentionTriggerProvider = createMentionTriggerProvider(
    DEFAULT_CHAT_MENTION_TRIGGERS
)

export { DEFAULT_CHAT_MENTION_TRIGGERS }
