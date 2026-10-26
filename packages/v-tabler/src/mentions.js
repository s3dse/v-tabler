import {
    createMentionDraft,
    isMentionDraft
} from './components/chat/mentions/mentionDraft.js'

/**
 * @typedef {Object} ChatTextPart
 * @property {'text'} kind
 * @property {string} text
 */

/**
 * @typedef {Object} ChatResolvedMentionPart
 * @property {'mention'} kind
 * @property {string} type
 * @property {string} trigger
 * @property {string | number} id
 * @property {string} label
 * @property {true} resolved
 */

/**
 * @typedef {Object} ChatUnresolvedMentionPart
 * @property {'mention'} kind
 * @property {string} type
 * @property {string} trigger
 * @property {null} [id]
 * @property {string} label
 * @property {false} resolved
 */

/**
 * @typedef {ChatResolvedMentionPart | ChatUnresolvedMentionPart} ChatMentionPart
 */

/**
 * @typedef {Object} ChatDraft
 * @property {string} content
 * @property {string} serializedContent
 * @property {Array<ChatTextPart | ChatMentionPart>} parts
 */

const hasCanonicalDraftContent = (value) => {
    const canonicalDraft = createMentionDraft(value.parts)
    return (
        value.content === canonicalDraft.content &&
        value.serializedContent === canonicalDraft.serializedContent
    )
}

/**
 * Tests whether a value is a canonical structured chat draft.
 *
 * @param {unknown} value
 * @returns {value is ChatDraft}
 */
export const isChatDraft = (value) =>
    isMentionDraft(value) &&
    typeof value.content === 'string' &&
    typeof value.serializedContent === 'string' &&
    hasCanonicalDraftContent(value)
