<template>
    <div class="flex gap-4 flex-wrap justify-between w-[100%]" data-pagination-component>
        <div class="pagination-label text-muted">
            <slot name="pagination-label" :data="{ perPage, currentPage, totalEntries }">
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
                        :class="[' text-default', isPageSelected(page) ? activeClasses : inactiveClasses]"
                    >
                        {{ page > Number.MAX_SAFE_INTEGER ? '...': page }}
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
const PAGE_CHANGED_EVENT = 'page-changed'
const createIntermediateIndexRange = (currentPage, maxIntermediateButtons, totalPages) => {
    if (totalPages < maxIntermediateButtons) return [...Array(totalPages).keys()].map(i => i + 1)

    if (currentPage <= Math.ceil((maxIntermediateButtons - 1) / 2) || currentPage === 1) {
        return [...Array(maxIntermediateButtons).keys()].map(i => i + 1)
    } else if (currentPage === totalPages) {
        return [...Array(maxIntermediateButtons).keys()].map(i => totalPages - i).reverse()
    } else {
        return [...Array(maxIntermediateButtons).keys()].map(
            i => i + currentPage - Math.ceil((maxIntermediateButtons - 1) / 2)
        )
    }
}
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
                'bg-primary text-onprimary hover:text-default hover:bg-inherit! border border-primary border-2 rounded-sm px-2'
        },
        inactiveClasses: {
            type: String,
            default: 'bg-inherit hover:text-primary-hover transition-colors ease'
        },
        disabledClasses: {
            type: String,
            default: 'text-disabled bg-inherit'
        }
    },
    data() {
        return {}
    },
    computed: {
        pages() {
            const intermediateRange = createIntermediateIndexRange(
                this.currentPage,
                this.maxVisibleButtons - 2,
                this.totalPages
            )
            return [...new Set([1, ...intermediateRange, this.totalPages])]
        },
        isInFirstPage() {
            return this.currentPage === 1
        },
        isInLastPage() {
            return this.currentPage === this.totalPages
        },
        last() {
            return this.lastLabel === '' ? this.totalPages : this.lastLabel
        },
        paginationLabel() {
            return `Showing entries ${this.perPage * this.currentPage - this.perPage + 1} to ${
                this.perPage * this.currentPage
            } of ${this.totalEntries} entries`
        }
    },
    methods: {
        onCLickFirstPage() {
            this.$emit(PAGE_CHANGED_EVENT, 1)
        },
        onClickPreviousPage() {
            if (this.currentPage === 1) return
            this.$emit(PAGE_CHANGED_EVENT, this.currentPage - 1)
        },
        onClickPage(page) {
            this.$emit(PAGE_CHANGED_EVENT, page)
        },
        onClickNextPage() {
            if (this.currentPage === this.totalPages) return
            this.$emit(PAGE_CHANGED_EVENT, this.currentPage + 1)
        },
        onClickLastPage() {
            this.$emit(PAGE_CHANGED_EVENT, this.totalPages)
        },
        isPageSelected(page) {
            return this.currentPage === page
        }
    }
}
</script>
