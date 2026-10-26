import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatMentionMenu from '../mentions/ChatMentionMenu.vue'

const requiredProps = {
  menuId: 'mention-menu'
}

const wrappers = []
const mountMenu = (props = {}) => {
  const wrapper = mount(ChatMentionMenu, { props: { ...requiredProps, ...props } })
  wrappers.push(wrapper)
  return wrapper
}
const originalScrollIntoView = HTMLElement.prototype.scrollIntoView
const scrollIntoView = vi.fn()

beforeAll(() => {
  HTMLElement.prototype.scrollIntoView = scrollIntoView
})
afterAll(() => {
  if (originalScrollIntoView) HTMLElement.prototype.scrollIntoView = originalScrollIntoView
  else delete HTMLElement.prototype.scrollIntoView
})
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  scrollIntoView.mockClear()
})

describe('ChatMentionMenu', () => {
  it.each(['entity', 'plain text'])('activates the %s row on click, preserving focus on mouse-down', async (row) => {
    const option = { id: '1', label: 'ADIDAS' }
    const wrapper = mountMenu({ options: [option], allowPlainText: true })
    const button = row === 'entity' ? wrapper.findAll('button')[0] : wrapper.findAll('button')[1]
    const action = row === 'entity' ? 'select' : 'use-plain-text'
    const mouseDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true })

    button.element.dispatchEvent(mouseDown)

    expect(mouseDown.defaultPrevented).toBe(true)
    expect(wrapper.emitted(action)).toBeUndefined()
    await button.trigger('click')
    expect(wrapper.emitted(action)).toEqual(row === 'entity' ? [[option]] : [[]])
  })

  it('exposes one selected option outside the Tab sequence and scrolls new highlights into view', async () => {
    const wrapper = mountMenu({
      options: [{ id: '1', label: 'ADIDAS' }],
      allowPlainText: true
    })
    const [entity, plainText] = wrapper.findAll('button')
    expect(wrapper.findAll('[role="option"]')).toHaveLength(2)
    expect(wrapper.findAll('button').every((button) => button.attributes('tabindex') === '-1')).toBe(true)
    expect(entity.attributes('aria-selected')).toBe('true')
    expect(plainText.attributes('aria-selected')).toBe('false')
    const plainTextId = plainText.attributes('id')
    expect(plainTextId).toBeTruthy()

    await plainText.trigger('mouseenter')
    expect(wrapper.emitted('highlight-plain-text')).toEqual([[]])
    scrollIntoView.mockClear()
    await wrapper.setProps({ plainTextHighlighted: true })

    expect(wrapper.findAll('[aria-selected="true"]').map((row) => row.element)).toEqual([plainText.element])
    expect(plainText.attributes('id')).toBe(plainTextId)
    expect(plainText.classes()).toContain('bg-primary-lt')
    expect(scrollIntoView).toHaveBeenCalledExactlyOnceWith({ block: 'nearest' })
    expect(scrollIntoView.mock.instances[0]).toBe(plainText.element)

    await entity.trigger('mouseenter')
    expect(wrapper.emitted('highlight')).toEqual([[0]])
    scrollIntoView.mockClear()
    await wrapper.setProps({ plainTextHighlighted: false })
    expect(scrollIntoView).toHaveBeenCalledExactlyOnceWith({ block: 'nearest' })
    expect(scrollIntoView.mock.instances[0]).toBe(entity.element)
  })

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
