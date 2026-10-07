export const ChatVariant = Object.freeze({
    CARD: 'card',
    EMBEDDED: 'embedded'
})

export const DEFAULT_CHAT_VARIANT = ChatVariant.CARD

const CHAT_VARIANT_VALUES = Object.freeze(Object.values(ChatVariant))

export const isChatVariant = value => CHAT_VARIANT_VALUES.includes(value)

export const assertValidChatLayout = ({ floating, variant }) => {
    if (floating && variant === ChatVariant.EMBEDDED) {
        throw new Error('ChatComponent: variant="embedded" cannot be combined with floating mode')
    }
}
