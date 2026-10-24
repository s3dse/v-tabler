import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatMentionMenu from '../mentions/ChatMentionMenu.vue'

const requiredProps = {
  menuId: 'mention-menu'
}

const mountMenu = (props = {}) => mount(ChatMentionMenu, { props: { ...requiredProps, ...props } })

describe('ChatMentionMenu', () => {
  it('uses explicit semantic colors for options and the plain-text action', () => {
    const wrapper = mountMenu({
      options: [
        { id: '1', label: 'ADIDAS' },
        { id: '2', label: 'ADIDAS ORIGINALS' }
      ],
      highlightedIndex: 0,
      allowPlainText: true
    })
    const menu = wrapper.get('[role="listbox"]')
    const [highlightedOption, normalOption, plainTextAction] = wrapper.findAll('button')

    expect(menu.classes()).toEqual(expect.arrayContaining(['bg-surface', 'text-default']))
    expect(highlightedOption.classes()).toEqual(
      expect.arrayContaining(['bg-primary-lt', 'text-default'])
    )
    expect(normalOption.classes()).toEqual(
      expect.arrayContaining(['bg-transparent', 'text-default', 'hover:bg-surface-hover'])
    )
    expect(plainTextAction.classes()).toEqual(
      expect.arrayContaining([
        'bg-transparent',
        'text-muted',
        'hover:bg-surface-hover',
        'hover:text-default'
      ])
    )
  })

  it.each([
    [{ loading: true }, 'status', 'Loading suggestions...', 'text-muted'],
    [{ error: new Error('failed') }, 'alert', 'Suggestions could not be loaded.', 'text-error'],
    [{}, 'status', 'No matching options.', 'text-muted']
  ])('styles the loading, error, and empty states', (props, role, text, colorClass) => {
    const wrapper = mountMenu(props)
    const state = wrapper.get(`[role="${role}"]`)

    expect(state.text()).toBe(text)
    expect(state.classes()).toContain(colorClass)
  })
})
