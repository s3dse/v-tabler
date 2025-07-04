<template>
    <div
        v-click-outside="closeDropdown"
        class="dropdown-component action-dropdown-component relative"
    >
        <div
            @click="toggleDropdown"
            :class="[
                'dropdown-button',
                buttonClassList
                    ? buttonClassList
                    : 'btn-base-default rounded-sm py-1 text-center w-full'
            ]"
            type="button"
            ref="dropdown-container"
        >
            <slot name="toggle-label" />
            <span class="ms-2 chevron" :class="[show ? upIcon : downIcon]"></span>
        </div>
        <Teleport to="body">
            <div
                v-show="show"
                :class="[
                    'dropdown-container absolute z-600',
                    dropdownContainerClassList
                        ? dropdownContainerClassList
                        : ' w-fit bg-surface text-default divide-y divide-border border border border-1 border-solid border-border rounded-sm shadow-lg w-44'
                ]"
                ref="dropdown-content"
                :style="dropdownStyles"
            >
                <ul :class="[ulClassList ? ulClassList : 'text-sm text-default']">
                    <li
                        v-for="(item, index) in options"
                        :key="index"
                        :class="[
                            liClassList
                                ? liClassList
                                : 'hovered-minor block py-2 text-right cursor-pointer'
                        ]"
                        @click="onSelect(item)"
                    >
                        <slot name="item" :item="item">
                            <p class="block w-[100%] px-8">{{ item }}</p>
                        </slot>
                    </li>
                </ul>
            </div>
        </Teleport>
    </div>
</template>
<script>
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import { useTemplateRef, Teleport } from 'vue'
import { clickOutside } from '@/directives/click-outside'
import { useDropdownPosition, POSITION_RELATIVE_TO_TRIGGER } from '../../composables/use-dropdown-position'
export default {
    setup() {
        const containerRef = useTemplateRef('dropdown-container')
        const dropdownContentRef = useTemplateRef('dropdown-content')

        const { updateDropdownPosition, dropdownStyles } = useDropdownPosition(containerRef, {
            positionToTrigger: POSITION_RELATIVE_TO_TRIGGER.ADJACENT
        })
        return {
            updateDropdownPosition,
            dropdownStyles,
            dropdownContentRef
        }
    },
    directives: {
        clickOutside
    },
    name: 'action-dropdown-component',
    props: {
        options: {
            type: Array,
            default: () => []
        },
        buttonClassList: {
            type: String,
            default: ''
        },
        upIcon: {
            type: String,
            default: 'i-custom-chevron-up text-default'
        },
        downIcon: {
            type: String,
            default: 'i-custom-chevron-down text-default'
        },
        dropdownContainerClassList: {
            type: String,
            default: ''
        },
        ulClassList: {
            type: String,
            default: ''
        },
        liClassList: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            show: false
        }
    },
    methods: {
        closeDropdown() {
            this.show = false
        },
        toggleDropdown() {
            this.show = !this.show
            if (this.show) {
                this.updateDropdownPosition(this.dropdownContentRef)
            }
        },
        onSelect(item) {
            this.$emit('on-select', item)
            this.closeDropdown()
        }
    }
}
</script>
