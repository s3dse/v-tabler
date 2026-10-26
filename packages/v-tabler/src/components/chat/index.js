import ChatComponent from './ChatComponent.vue'
import ChatInput from './ChatInput.vue'
import ChatHeader from './ChatHeader.vue'
import { useChatLogic } from './useChatLogic'
import { useAutoHeight } from './useAutoHeight'
import TypingIndicator from './TypingIndicator.vue'
import {
    createMentionTriggerProvider,
    defaultMentionTriggerProvider,
    DEFAULT_CHAT_MENTION_TRIGGERS
} from './mentions/mentionTriggerProvider.js'
export {
    ChatComponent,
    ChatInput,
    ChatHeader,
    useChatLogic,
    useAutoHeight,
    TypingIndicator,
    createMentionTriggerProvider,
    defaultMentionTriggerProvider,
    DEFAULT_CHAT_MENTION_TRIGGERS
}
