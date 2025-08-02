<template>
    <div v-click-outside="closeDropdown" class="dropdown-component relative">
        <div
            @click="toggleDropdown"
            :class="[
                'dropdown-button',
                buttonClassList
                    ? buttonClassList
                    : 'btn-base-default rounded-sm border px-4 py-1 w-full'
            ]"
            type="button"
            ref="dropdown-container"
        >
            <slot name="toggle-label" v-bind="{ currentItem }">
                {{ currentItem }}
            </slot>
            <span class="ms-2" :class="[show ? upIcon : downIcon]"></span>
        </div>
        <Teleport to="body">
            <div
                v-show="show"
                :class="[
                    'dropdown-container absolute z-600',
                    dropdownContainerClassList
                        ? dropdownContainerClassList
                        : 'w-fit bg-surface text-default divide-y border border-1 border-solid border-border divide-border rounded-sm shadow-lg w-44'
                ]"
                ref="dropdown-content"
                :style="dropdownStyles"
            >
                <ul :class="[ulClassList ? ulClassList : 'text-sm text-default']">
                    <li
                        v-for="(item, index) in options"
                        :key="index"
                        :aria-selected="isSelected(item)"
                        :data-selected="isSelected(item)"
                        @click="setCurrentItem(item)"
                        :class="[
                            liClassList
                                ? liClassList
                                : 'hovered-minor data-[selected=true]:selected-minor hover:data-[selected=true]:selected-hovered-minor block py-2 text-right cursor-pointer'
                        ]"
                    >
                        <slot
                            name="itemlabel"
                            v-bind="{ item, index, isSelected, getActiveClassList }"
                        >
                            <p class="block w-[100%] px-8" :class="getActiveClassList(item)">
                                {{ item }}
                            </p>
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
    name: 'dropdown-component',
    props: {
        modelValue: {
            type: [String, Boolean, Number],
            required: false
        },
        value: {
            type: [String, Boolean, Number],
            required: false
        },
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
        activeClassList: {
            type: String,
            default: ''
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
    computed: {
        currentItem: {
            get() {
                return this.modelValue || this.value
            },
            set(v) {
                this.internalCurrentItem = v
            }
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
        setCurrentItem(item) {
            this.$emit('update:modelValue', item)
            this.$emit('input', item)
        },
        isSelected(item) {
            return this.currentItem === item
        },
        getActiveClassList(item) {
            return this.currentItem === item ? this.activeClassList : ''
        }
    }
}
</script>
