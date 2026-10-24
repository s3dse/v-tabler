import { onBeforeUnmount, ref } from 'vue'

const MENTION_SEARCH_DEBOUNCE_MS = 200

const validateOptions = (options) => {
    if (!Array.isArray(options)) {
        throw new TypeError('mentionOptionProvider must return an array.')
    }
    options.forEach((option) => {
        if (
            option === null ||
            typeof option !== 'object' ||
            !['string', 'number'].includes(typeof option.id) ||
            !String(option.id).trim() ||
            typeof option.label !== 'string' ||
            !option.label.trim()
        ) {
            throw new TypeError('Mention options require a non-empty id and label.')
        }
    })
    return options
}

export const useMentionOptions = (optionProvider) => {
    const options = ref([])
    const loading = ref(false)
    const error = ref(null)
    const highlightedIndex = ref(0)
    const open = ref(false)
    let activeRequest = null
    let debounceTimer = null
    let requestSequence = 0

    const cancelPendingRequest = () => {
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = null
        activeRequest?.abort()
        activeRequest = null
    }

    const close = () => {
        requestSequence += 1
        cancelPendingRequest()
        open.value = false
        loading.value = false
        error.value = null
        options.value = []
        highlightedIndex.value = 0
    }

    const executeSearch = async (context) => {
        const sequence = ++requestSequence
        activeRequest?.abort()
        activeRequest = new AbortController()
        loading.value = true
        error.value = null
        open.value = true

        try {
            const result = await optionProvider({
                type: context.type,
                query: context.query,
                signal: activeRequest.signal
            })
            if (sequence !== requestSequence) return null

            options.value = validateOptions(result)
            highlightedIndex.value = 0
            return options.value
        } catch (providerError) {
            if (providerError?.name === 'AbortError' || sequence !== requestSequence) return null
            options.value = []
            error.value = providerError
            return null
        } finally {
            if (sequence === requestSequence) loading.value = false
        }
    }

    const search = (context) => {
        requestSequence += 1
        cancelPendingRequest()
        open.value = true
        loading.value = true
        error.value = null
        options.value = []
        debounceTimer = setTimeout(() => {
            debounceTimer = null
            executeSearch(context)
        }, MENTION_SEARCH_DEBOUNCE_MS)
    }

    const searchImmediately = (context) => {
        requestSequence += 1
        cancelPendingRequest()
        return executeSearch(context)
    }

    const moveHighlight = (direction) => {
        if (!options.value.length) return
        const nextIndex = highlightedIndex.value + direction
        highlightedIndex.value = (nextIndex + options.value.length) % options.value.length
    }

    const highlight = (index) => {
        highlightedIndex.value = index
    }

    onBeforeUnmount(cancelPendingRequest)

    return {
        options,
        loading,
        error,
        highlightedIndex,
        open,
        close,
        search,
        searchImmediately,
        moveHighlight,
        highlight
    }
}

export { MENTION_SEARCH_DEBOUNCE_MS }
