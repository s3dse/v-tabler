const PORTABLE_MENTION_PATTERN = /@([^\s@[\]]+)\[((?:\\.|[^\]\\])*)\]/gu

const mentionLength = (part) => (part.kind === 'text' ? part.text.length : part.label.length)

export const mentionPartSpans = (parts) => {
    let start = 0
    return parts.map((part) => {
        const end = start + mentionLength(part)
        const span = { part, start, end }
        start = end
        return span
    })
}

const appendPart = (parts, part) => {
    if (part.kind === 'text' && !part.text) return parts

    const previousPart = parts.at(-1)
    if (part.kind === 'text' && previousPart?.kind === 'text') {
        return [...parts.slice(0, -1), { kind: 'text', text: previousPart.text + part.text }]
    }
    return [...parts, part]
}

export const mergeMentionParts = (parts) => parts.reduce(appendPart, [])

const escapeMentionLabel = (label) =>
    label.replace(/\\/g, '\\\\').replace(/\[/g, '\\[').replace(/\]/g, '\\]')

const unescapeMentionLabel = (label) => label.replace(/\\(\\|\[|\])/g, '$1')

export const serializeMentionParts = (parts) =>
    parts
        .map((part) =>
            part.kind === 'text' ? part.text : `@${part.trigger}[${escapeMentionLabel(part.label)}]`
        )
        .join('')

export const mentionPartsToContent = (parts) =>
    parts.map((part) => (part.kind === 'text' ? part.text : part.label)).join('')

export const createMentionDraft = (parts) => {
    const mergedParts = mergeMentionParts(parts)
    return {
        content: mentionPartsToContent(mergedParts),
        serializedContent: serializeMentionParts(mergedParts),
        parts: mergedParts
    }
}

const resolvePortableTrigger = (trigger, triggerProvider) => {
    const triggerText = `@${trigger}`
    const match = triggerProvider({ text: triggerText, cursorIndex: triggerText.length })
    return match?.replaceRange.start === 0 && match.replaceRange.end === triggerText.length
        ? match
        : null
}

export const parseSerializedMentions = (value, triggerProvider) => {
    if (!value) return []

    const parts = []
    let previousEnd = 0

    for (const match of value.matchAll(PORTABLE_MENTION_PATTERN)) {
        const triggerMatch = resolvePortableTrigger(match[1], triggerProvider)
        const label = unescapeMentionLabel(match[2])
        if (!triggerMatch || !label.trim()) continue

        if (match.index > previousEnd) {
            parts.push({ kind: 'text', text: value.slice(previousEnd, match.index) })
        }
        parts.push({
            kind: 'mention',
            type: triggerMatch.type,
            trigger: match[1],
            id: null,
            label,
            resolved: false
        })
        previousEnd = match.index + match[0].length
    }

    if (previousEnd < value.length) {
        parts.push({ kind: 'text', text: value.slice(previousEnd) })
    }

    return mergeMentionParts(parts.length ? parts : [{ kind: 'text', text: value }])
}

const isValidTextPart = (part) => part?.kind === 'text' && typeof part.text === 'string'

const isValidMentionPart = (part) =>
    part?.kind === 'mention' &&
    typeof part.type === 'string' &&
    Boolean(part.type.trim()) &&
    typeof part.trigger === 'string' &&
    Boolean(part.trigger.trim()) &&
    typeof part.label === 'string' &&
    Boolean(part.label.trim()) &&
    typeof part.resolved === 'boolean' &&
    (part.resolved
        ? ['string', 'number'].includes(typeof part.id) && String(part.id).trim().length > 0
        : part.id === null || part.id === undefined)

export const isMentionDraft = (value) =>
    value !== null &&
    typeof value === 'object' &&
    Array.isArray(value.parts) &&
    value.parts.every((part) => isValidTextPart(part) || isValidMentionPart(part))

export const normalizeMentionDraft = (value, triggerProvider) => {
    if (isMentionDraft(value)) {
        return createMentionDraft(value.parts.map((part) => ({ ...part })))
    }
    if (typeof value !== 'string') {
        throw new TypeError('Mention input values must be a string or a valid ChatDraft.')
    }
    return createMentionDraft(parseSerializedMentions(value, triggerProvider))
}

export const hasUnresolvedMentions = (draft) =>
    draft.parts.some((part) => part.kind === 'mention' && !part.resolved)

const sliceMentionParts = (parts, { start, end }, includePartialMentions = false) =>
    mentionPartSpans(parts).flatMap(({ part, start: partStart, end: partEnd }) => {
        const sliceStart = Math.max(start, partStart)
        const sliceEnd = Math.min(end, partEnd)
        if (sliceStart >= sliceEnd) return []

        if (part.kind === 'mention') {
            const containsMention = start <= partStart && partEnd <= end
            return includePartialMentions || containsMention ? [part] : []
        }

        return [
            {
                kind: 'text',
                text: part.text.slice(sliceStart - partStart, sliceEnd - partStart)
            }
        ]
    })

export const replaceMentionRange = (parts, { start, end }, insertedParts) => {
    const length = mentionPartsToContent(parts).length
    if (start < 0 || end < start || end > length) {
        throw new RangeError('Mention replacement range is outside the draft content.')
    }

    return mergeMentionParts([
        ...sliceMentionParts(parts, { start: 0, end: start }),
        ...insertedParts,
        ...sliceMentionParts(parts, { start: end, end: length })
    ])
}

export const serializeMentionRange = (parts, range) =>
    serializeMentionParts(sliceMentionParts(parts, range, true))

export const contentLength = (parts) =>
    parts.reduce((length, part) => length + mentionLength(part), 0)
