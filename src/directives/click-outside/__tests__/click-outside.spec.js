import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { clickOutside } from '../click-outside'

describe('click outside directive', async () => {
    it('should work', async () => {
        const elem = document.createElement('div')
        if (document.body) {
            document.body.appendChild(elem)
        }
        const Child = {
            name: 'Child',
            template: `<div class="child" v-click-outside="onOutsideClick"></div>`,
            data() {
                return {
                    outsideClickCount: 0
                }
            },
            methods: {
                onOutsideClick() {
                    this.outsideClickCount = this.outsideClickCount + 1
                }
            },
            attachTo: elem
        }
        const wrapper = mount(Child, {
            global: {
                directives: {
                    clickOutside
                }
            }
        })

        document.dispatchEvent(new Event('click'))
        const childWrapper = wrapper.findComponent(Child)
        expect(childWrapper.vm.outsideClickCount).toBe(1)
    })
})
