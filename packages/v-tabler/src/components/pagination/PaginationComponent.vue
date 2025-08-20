<template>
    <div class="flex gap-4 flex-wrap justify-between w-[100%]" data-pagination-component>
        <div class="pagination-label text-muted">
            <slot
                name="pagination-label"
                :data="{
                    perPage: perPage || 0,
                    currentPage: currentPage || 1,
                    totalEntries: totalEntries || 0
                }"
            >
                {{ paginationLabel }}
            </slot>
        </div>
        <div>
            <ul class="pagination flex flex-wrap justify-between gap-8">
                <li class="pagination-item">
                    <button
                        type="button"
                        :disabled="isInFirstPage"
                        @click="onClickPreviousPage"
                        :class="['text-default', isInFirstPage ? disabledClasses : inactiveClasses]"
                    >
                        {{ previousLabel }}
                    </button>
                </li>

                <li v-for="page in pages" :key="page" class="pagination-item">
                    <button
                        type="button"
                        :disabled="isPageSelected(page)"
                        @click="onClickPage(page)"
                        :class="[
                            ' text-default',
                            isPageSelected(page) ? activeClasses : inactiveClasses
                        ]"
                    >
                        {{ page > Number.MAX_SAFE_INTEGER ? '...' : page }}
                    </button>
                </li>

                <li class="pagination-item">
                    <button
                        type="button"
                        :disabled="isInLastPage"
                        @click="onClickNextPage"
                        :class="[' text-default', isInLastPage ? disabledClasses : inactiveClasses]"
                    >
                        {{ nextLabel }}
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { usePagination } from '@/composables'

export default {
    name: 'pagination-component',
    props: {
        maxVisibleButtons: {
            type: Number,
            default: 5
        },
        totalPages: {
            type: Number,
            required: true
        },
        totalEntries: {
            type: Number,
            required: true
        },
        perPage: {
            type: Number,
            required: true
        },
        currentPage: {
            type: Number,
            required: true
        },
        firstLabel: {
            type: [String, Number],
            default: 1
        },
        lastLabel: {
            type: [String, Number],
            default: ''
        },
        previousLabel: {
            type: String,
            default: 'Previous'
        },
        nextLabel: {
            type: String,
            default: 'Next'
        },
        activeClasses: {
            type: String,
            default:
                'bg-primary text-onprimary hover:text-default hover:bg-inherit! border border-solid border-primary border-2 rounded-sm px-2 color-transition'
        },
        inactiveClasses: {
            type: String,
            default: 'bg-inherit hover:text-primary-hover color-transition'
        },
        disabledClasses: {
            type: String,
            default: 'text-disabled bg-inherit'
        }
    },
    emits: ['page-changed'],
    setup(props, { emit }) {
        const {
            pages,
            isInFirstPage,
            isInLastPage,
            last,
            paginationLabel,
            // onClickFirstPage,
            onClickPreviousPage,
            onClickPage,
            onClickNextPage,
            // onClickLastPage,
            isPageSelected
        } = usePagination(props)

        // const handleFirstPageClick = () => {
        //     const result = onClickFirstPage()
        //     if (result?.shouldEmitPageChanged) {
        //         emit(result.eventName, result.eventData)
        //     }
        // }

        const handlePreviousPageClick = () => {
            const result = onClickPreviousPage()
            if (result?.shouldEmitPageChanged) {
                emit(result.eventName, result.eventData)
            }
        }

        const handlePageClick = page => {
            const result = onClickPage(page)
            if (result?.shouldEmitPageChanged) {
                emit(result.eventName, result.eventData)
            }
        }

        const handleNextPageClick = () => {
            const result = onClickNextPage()
            if (result?.shouldEmitPageChanged) {
                emit(result.eventName, result.eventData)
            }
        }

        // const handleLastPageClick = () => {
        //     const result = onClickLastPage()
        //     if (result?.shouldEmitPageChanged) {
        //         emit(result.eventName, result.eventData)
        //     }
        // }

        return {
            pages,
            isInFirstPage,
            isInLastPage,
            last,
            paginationLabel,
            // onClickFirstPage: handleFirstPageClick,
            onClickPreviousPage: handlePreviousPageClick,
            onClickPage: handlePageClick,
            onClickNextPage: handleNextPageClick,
            // onClickLastPage: handleLastPageClick,
            isPageSelected
        }
    }
}
</script>
