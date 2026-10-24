import { afterEach, describe, expect, it, vi } from 'vitest'
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import ChatInput from '../ChatInput.vue'

const options = {
  brand: [
    { id: '1', label: 'ADIDAS' },
    { id: '2', label: 'ADIDAS ORIGINALS' }
  ],
  partner: [{ id: '3', label: 'DYSON' }]
}

const waitForOptions = () => new Promise((resolve) => setTimeout(resolve, 230))
const getMenu = () => new DOMWrapper(document.body.querySelector('.mention-menu'))

const placeCaretAtEnd = (element) => {
  const range = document.createRange()
  range.selectNodeContents(element)
  range.collapse(false)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}

const enterEditorText = async (wrapper, text) => {
  const editor = wrapper.get('[contenteditable="true"]')
  editor.element.textContent = text
  placeCaretAtEnd(editor.element)
  await editor.trigger('input')
  await nextTick()
  return wrapper.get('[contenteditable="true"]')
}

describe('ChatInput mentions', () => {
  const wrappers = []

  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  })

  const mountInput = (props) => {
    const wrapper = mount(ChatInput, {
      props,
      attachTo: document.body
    })
    wrappers.push(wrapper)
    return wrapper
  }

  const mountControlledInput = (props) => {
    const model = ref(props.modelValue ?? '')
    const parent = mount(
      defineComponent({
        setup: () => () =>
          h(ChatInput, {
            ...props,
            modelValue: model.value,
            'onUpdate:modelValue': (value) => {
              model.value = value
            }
          })
      }),
      { attachTo: document.body }
    )
    wrappers.push(parent)
    return { model, wrapper: parent.getComponent(ChatInput) }
  }

  it('preserves the textarea path and string model without an option provider', async () => {
    const wrapper = mountInput({ modelValue: '' })
    const textarea = wrapper.get('textarea')

    expect(textarea.exists()).toBe(true)
    expect(wrapper.find('[contenteditable="true"]').exists()).toBe(false)

    await textarea.setValue('Plain message')
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['Plain message'])

    wrapper.vm.focus()
    expect(document.activeElement).toBe(textarea.element)

    wrapper.vm.clear()
    await nextTick()
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([''])

    await wrapper.setProps({ modelValue: 'External message' })
    expect(textarea.element.value).toBe('External message')
  })

  it('emits one model update when recalling a plain message', async () => {
    const wrapper = mountInput({
      modelValue: '',
      recallLastMessage: () => 'Previous message'
    })
    const textarea = wrapper.get('textarea')

    await textarea.trigger('keydown', { key: 'ArrowUp' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([['Previous message']])
    expect(textarea.element.selectionStart).toBe('Previous message'.length)
    expect(textarea.element.selectionEnd).toBe('Previous message'.length)
  })

  it('gives the mention editor an accessible name', async () => {
    const wrapper = mountInput({
      modelValue: '',
      mentionOptionProvider: vi.fn(),
      placeholder: 'Ask about a brand'
    })
    await nextTick()

    expect(wrapper.get('[role="combobox"]').attributes('aria-label')).toBe('Ask about a brand')
  })

  it('keeps the mention editor focusable while it is used as the popover anchor', async () => {
    const wrapper = mountInput({ modelValue: '', mentionOptionProvider: vi.fn() })
    await nextTick()

    expect(wrapper.get('[data-mention-anchor]').element.firstElementChild).toBe(
      wrapper.get('[contenteditable="true"]').element
    )

    wrapper.vm.focus()
    await nextTick()

    expect(document.activeElement).toBe(wrapper.get('[contenteditable="true"]').element)

    const updateCount = wrapper.emitted('update:modelValue')?.length ?? 0
    wrapper.vm.clear()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toHaveLength(updateCount + 1)
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([
      { content: '', serializedContent: '', parts: [] }
    ])
  })

  it('keeps the editor element and focus stable while typing', async () => {
    const wrapper = mountInput({ modelValue: '', mentionOptionProvider: vi.fn() })
    await nextTick()
    const editor = wrapper.get('[contenteditable="true"]')
    const editorElement = editor.element
    editorElement.focus()
    editorElement.textContent = '@'
    placeCaretAtEnd(editorElement)

    await editor.trigger('input')
    await nextTick()

    expect(wrapper.get('[contenteditable="true"]').element).toBe(editorElement)
    expect(document.activeElement).toBe(editorElement)

    const replaceChildren = vi.spyOn(editorElement, 'replaceChildren')
    wrapper.get('[data-text-part]').element.textContent = '@b'
    placeCaretAtEnd(editorElement)

    await editor.trigger('input')
    await nextTick()

    expect(replaceChildren).not.toHaveBeenCalled()
    expect(wrapper.get('[contenteditable="true"]').element).toBe(editorElement)
    expect(document.activeElement).toBe(editorElement)
  })

  it('reads edited DOM into normalized parts without persisting the trailing sentinel', async () => {
    const initialDraft = {
      content: 'ADIDAS',
      serializedContent: '@brand[ADIDAS]',
      parts: [
        {
          kind: 'mention',
          type: 'brand',
          trigger: 'brand',
          id: '1',
          label: 'ADIDAS',
          resolved: true
        }
      ]
    }
    const wrapper = mountInput({ modelValue: initialDraft, mentionOptionProvider: vi.fn() })
    await nextTick()
    const editor = wrapper.get('[contenteditable="true"]')
    const mention = editor.get('[data-mention-index]').element
    const lineBreak = document.createElement('br')
    const trailingBreak = document.createElement('br')
    trailingBreak.setAttribute('data-trailing-break', '')
    editor.element.replaceChildren(
      document.createTextNode('A'),
      document.createTextNode('B'),
      mention,
      lineBreak,
      document.createTextNode('C'),
      trailingBreak
    )
    placeCaretAtEnd(editor.element)

    await editor.trigger('input')
    await nextTick()

    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toEqual({
      content: 'ABADIDAS\nC',
      serializedContent: 'AB@brand[ADIDAS]\nC',
      parts: [{ kind: 'text', text: 'AB' }, initialDraft.parts[0], { kind: 'text', text: '\nC' }]
    })
  })

  it('uses a controlled, collision-aware popover without dismissing editor interactions', async () => {
    const optionProvider = vi.fn().mockResolvedValue(options.brand)
    const wrapper = mountInput({ modelValue: '', mentionOptionProvider: optionProvider })
    await nextTick()
    const popoverRoot = wrapper.findComponent({ name: 'PopoverRoot' })

    popoverRoot.vm.$emit('update:open', true)
    await nextTick()
    expect(popoverRoot.props('open')).toBe(false)

    const editor = await enterEditorText(wrapper, '@brand adi')
    const popoverContent = wrapper.findComponent({ name: 'PopoverContent' })

    expect(popoverRoot.props('open')).toBe(true)
    expect(popoverContent.props()).toMatchObject({
      asChild: true,
      side: 'bottom',
      align: 'start',
      sideOffset: 4,
      collisionPadding: 8,
      avoidCollisions: true,
      sideFlip: true,
      positionStrategy: 'fixed',
      hideWhenDetached: true
    })
    expect(document.activeElement).toBe(editor.element)

    await waitForOptions()
    await editor.trigger('pointerdown')
    await editor.trigger('click')
    await nextTick()

    expect(popoverRoot.props('open')).toBe(true)
    expect(optionProvider).toHaveBeenCalledTimes(1)

    wrapper.element.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await nextTick()
    await nextTick()

    expect(popoverRoot.props('open')).toBe(false)
    expect(wrapper.get('[contenteditable="true"]').attributes('aria-expanded')).toBe('false')
  })

  it('closes mention suggestions with Escape', async () => {
    const optionProvider = vi.fn().mockResolvedValue(options.brand)
    const wrapper = mountInput({
      modelValue: '',
      mentionOptionProvider: optionProvider
    })
    await nextTick()
    const editor = await enterEditorText(wrapper, '@marke ')

    await editor.trigger('keydown', { key: 'Escape' })
    wrapper.findComponent({ name: 'PopoverRoot' }).vm.$emit('update:open', false)
    await editor.trigger('keyup', { key: 'Escape' })
    await nextTick()

    expect(wrapper.findComponent({ name: 'PopoverRoot' }).props('open')).toBe(false)
    expect(getMenu().exists()).toBe(false)

    await enterEditorText(wrapper, '@marke a')

    expect(wrapper.findComponent({ name: 'PopoverRoot' }).props('open')).toBe(true)
  })

  it('renders the first Shift+Enter after a mention as a visible trailing line', async () => {
    const initialDraft = {
      content: 'ADIDAS',
      serializedContent: '@brand[ADIDAS]',
      parts: [
        {
          kind: 'mention',
          type: 'brand',
          trigger: 'brand',
          id: '1',
          label: 'ADIDAS',
          resolved: true
        }
      ]
    }
    const wrapper = mountInput({
      modelValue: initialDraft,
      mentionOptionProvider: vi.fn()
    })
    await nextTick()
    const editor = wrapper.get('[contenteditable="true"]')
    placeCaretAtEnd(editor.element)

    await editor.trigger('keydown', { key: 'Enter', shiftKey: true })
    await nextTick()

    const updatedEditor = wrapper.get('[contenteditable="true"]')
    expect(wrapper.emitted('update:modelValue').at(-1)[0].content).toBe('ADIDAS\n')
    expect(updatedEditor.find('[data-trailing-break]').exists()).toBe(true)

    await updatedEditor.trigger('input')
    expect(wrapper.emitted('update:modelValue').at(-1)[0].content).toBe('ADIDAS\n')
  })

  it('applies external structured draft updates', async () => {
    const { model, wrapper } = mountControlledInput({ mentionOptionProvider: vi.fn() })
    await nextTick()
    const updateCount = wrapper.emitted('update:modelValue').length
    const externalDraft = {
      content: 'DYSON',
      serializedContent: '@partner[DYSON]',
      parts: [
        {
          kind: 'mention',
          type: 'partner',
          trigger: 'partner',
          id: '3',
          label: 'DYSON',
          resolved: true
        }
      ]
    }

    model.value = externalDraft
    await nextTick()

    expect(wrapper.get('[data-mention-index]').text()).toContain('DYSON')
    expect(model.value).toEqual(externalDraft)
    expect(wrapper.emitted('update:modelValue')).toHaveLength(updateCount)
  })

  it('normalizes external portable text and blocks unresolved submissions', async () => {
    const { model, wrapper } = mountControlledInput({
      mentionOptionProvider: vi.fn().mockResolvedValue([])
    })
    await nextTick()

    model.value = 'Sales for @brand[ADIDAS]'
    await nextTick()
    const sendButton = wrapper.get('button.btn-primary-md')
    await sendButton.trigger('click')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(sendButton.attributes('disabled')).toBeDefined()
    expect(model.value).toMatchObject({
      content: 'Sales for ADIDAS',
      serializedContent: 'Sales for @brand[ADIDAS]',
      parts: [
        { kind: 'text', text: 'Sales for ' },
        { kind: 'mention', type: 'brand', id: null, label: 'ADIDAS', resolved: false }
      ]
    })

    await wrapper.get('[role="combobox"]').trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(sendButton.attributes('disabled')).toBeDefined()
  })

  it.each(['Sales for @brand[ADIDAS]', ''])(
    'normalizes an equivalent external string exactly once: %j',
    async (portableText) => {
      const { model, wrapper } = mountControlledInput({
        modelValue: portableText,
        mentionOptionProvider: vi.fn().mockResolvedValue([])
      })
      await nextTick()
      const normalizedDraft = model.value
      const updateCount = wrapper.emitted('update:modelValue').length

      model.value = portableText
      await nextTick()

      expect(model.value).toEqual(normalizedDraft)
      expect(wrapper.emitted('update:modelValue')).toHaveLength(updateCount + 1)
    }
  )

  it.each([
    ['missing content', ({ parts, serializedContent }) => ({ parts, serializedContent })],
    ['stale serialized content', (draft) => ({ ...draft, serializedContent: 'Outdated content' })],
    [
      'fragmented text parts',
      (draft) => ({
        ...draft,
        parts: [
          { kind: 'text', text: 'Sales ' },
          { kind: 'text', text: 'for ' },
          ...draft.parts.slice(1)
        ]
      })
    ]
  ])('corrects external structured drafts with %s', async (_description, buildIncomingDraft) => {
    const normalizedDraft = {
      content: 'Sales for DYSON',
      serializedContent: 'Sales for @partner[DYSON]',
      parts: [
        { kind: 'text', text: 'Sales for ' },
        { kind: 'mention', type: 'partner', trigger: 'partner', ...options.partner[0], resolved: true }
      ]
    }
    const { model, wrapper } = mountControlledInput({
      modelValue: normalizedDraft,
      mentionOptionProvider: vi.fn()
    })
    await nextTick()
    const updateCount = wrapper.emitted('update:modelValue').length

    model.value = buildIncomingDraft(normalizedDraft)
    await nextTick()

    expect(model.value).toEqual(normalizedDraft)
    expect(wrapper.emitted('update:modelValue')).toHaveLength(updateCount + 1)

    await wrapper.get('button.btn-primary-md').trigger('click')
    expect(wrapper.emitted('submit')).toEqual([[normalizedDraft]])
  })

  it('preserves the caret and open menu when normalizing equivalent editor content', async () => {
    const { model, wrapper } = mountControlledInput({
      mentionOptionProvider: vi.fn().mockResolvedValue(options.brand)
    })
    await nextTick()
    const text = '@brand adi'
    const editor = await enterEditorText(wrapper, text)
    const normalizedDraft = model.value
    const updateCount = wrapper.emitted('update:modelValue').length
    const { anchorNode, anchorOffset } = window.getSelection()
    expect(editor.attributes('aria-expanded')).toBe('true')

    model.value = text
    await nextTick()

    expect(model.value).toEqual(normalizedDraft)
    expect(wrapper.emitted('update:modelValue')).toHaveLength(updateCount + 1)
    expect(editor.attributes('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(editor.element)
    expect(window.getSelection().anchorNode).toBe(anchorNode)
    expect(window.getSelection().anchorOffset).toBe(anchorOffset)
  })

  it('loads options and inserts a resolved chip', async () => {
    const optionProvider = vi.fn(({ type }) => Promise.resolve(options[type]))
    const wrapper = mountInput({ modelValue: '', mentionOptionProvider: optionProvider })
    await nextTick()
    const editor = wrapper.get('[contenteditable="true"]')
    editor.element.textContent = 'Wieviele Klicks hatte die @Marke adi'
    placeCaretAtEnd(editor.element)
    expect(wrapper.findComponent({ name: 'ChatMentionEditor' }).vm.getSelectionRange().end).toBe(
      editor.element.textContent.length
    )

    await editor.trigger('input')
    const inputPayload = wrapper
      .findComponent({ name: 'ChatMentionEditor' })
      .emitted('input-parts')
      .at(-1)[0]
    expect(inputPayload.caretIndex).toBe(editor.element.textContent.length)
    expect(wrapper.emitted('update:modelValue').at(-1)[0].content).toBe(
      'Wieviele Klicks hatte die @Marke adi'
    )
    await nextTick()
    expect(wrapper.findComponent({ name: 'PopoverRoot' }).props('open')).toBe(true)
    expect(getMenu().exists()).toBe(true)
    expect(getMenu().attributes('role')).toBe('listbox')
    expect(getMenu().attributes('id')).toBe(
      wrapper.get('[contenteditable="true"]').attributes('aria-controls')
    )
    await waitForOptions()
    await nextTick()

    expect(optionProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'brand',
        query: 'adi',
        signal: expect.any(AbortSignal)
      })
    )
    const optionButtons = getMenu().findAll('[role="option"]')
    expect(optionButtons).toHaveLength(2)

    await optionButtons[0].trigger('mousedown')
    const draft = wrapper.emitted('update:modelValue').at(-1)[0]

    expect(draft.content).toBe('Wieviele Klicks hatte die ADIDAS')
    expect(draft.serializedContent).toBe('Wieviele Klicks hatte die @Marke[ADIDAS]')
    expect(draft.parts.find((part) => part.kind === 'mention')).toEqual(
      expect.objectContaining({ id: '1', type: 'brand', resolved: true })
    )
    expect(wrapper.get('[data-mention-index]').text()).toContain('ADIDAS')
  })

  it('uses a replacement option provider after mount', async () => {
    const initialProvider = vi.fn().mockResolvedValue([])
    const replacementProvider = vi.fn().mockResolvedValue(options.brand)
    const wrapper = mountInput({ modelValue: '', mentionOptionProvider: initialProvider })
    await nextTick()

    await enterEditorText(wrapper, '@brand first')
    await waitForOptions()
    await wrapper.setProps({ mentionOptionProvider: replacementProvider })
    await enterEditorText(wrapper, '@brand second')
    await waitForOptions()

    expect(initialProvider).toHaveBeenCalledTimes(1)
    expect(replacementProvider).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'brand', query: 'second' })
    )
  })

  it('blocks pasted unresolved mentions until they are resolved', async () => {
    const optionProvider = vi.fn(() => Promise.resolve(options.brand))
    const wrapper = mountInput({
      modelValue: 'Klicks für @Marke[ADIDAS]',
      mentionOptionProvider: optionProvider
    })
    await nextTick()

    expect(wrapper.get('button.btn-primary-md').attributes('disabled')).toBeDefined()
    const warning = wrapper.get('[role="alert"]')
    const unresolvedChip = wrapper.get('[data-mention-index]')
    expect(warning.text()).toContain('Resolve mentions')
    expect(warning.classes()).toContain('text-warning')
    expect(unresolvedChip.classes()).toEqual(
      expect.arrayContaining(['border-warning-border', 'bg-warning-bg'])
    )
    expect(unresolvedChip.get('.i-tabler-alert-circle').classes()).toContain('text-warning')

    await wrapper.get('[data-mention-index]').trigger('click')
    await nextTick()
    await nextTick()

    const draft = wrapper.emitted('update:modelValue').at(-1)[0]
    expect(draft).toEqual({
      content: 'Klicks für ADIDAS',
      serializedContent: 'Klicks für @Marke[ADIDAS]',
      parts: [
        { kind: 'text', text: 'Klicks für ' },
        {
          kind: 'mention',
          type: 'brand',
          trigger: 'Marke',
          id: '1',
          label: 'ADIDAS',
          resolved: true
        }
      ]
    })
    expect(wrapper.get('button.btn-primary-md').attributes('disabled')).toBeUndefined()
  })

  it('rejects stale suggestions while another mention lookup is loading', async () => {
    const pendingPartnerRequests = []
    const optionProvider = vi.fn(({ type }) =>
      type === 'brand'
        ? Promise.resolve(options.brand)
        : new Promise((resolve) => pendingPartnerRequests.push({ resolve }))
    )
    const wrapper = mountInput({
      modelValue: '@brand[Unknown brand] @partner[Unknown partner]',
      mentionOptionProvider: optionProvider
    })
    await nextTick()
    const initialDraft = wrapper.emitted('update:modelValue').at(-1)[0]
    const [brandChip, partnerChip] = wrapper.findAll('[data-mention-index]')
    const editor = wrapper.get('[role="combobox"]')

    await brandChip.trigger('click')
    await flushPromises()
    expect(getMenu().findAll('[role="option"]')).toHaveLength(options.brand.length)
    await editor.trigger('keydown', { key: 'ArrowDown' })
    const menu = wrapper.findComponent({ name: 'ChatMentionMenu' })

    await partnerChip.trigger('click')
    const activeDescendantWhileLoading = editor.attributes('aria-activedescendant')
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true
    })
    editor.element.dispatchEvent(enterEvent)
    await nextTick()

    expect(enterEvent.defaultPrevented).toBe(true)
    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toEqual(initialDraft)
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(activeDescendantWhileLoading).toBeUndefined()
    expect(getMenu().findAll('[role="option"]')).toHaveLength(0)

    menu.vm.$emit('select', options.brand.at(-1))
    await nextTick()

    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toEqual(initialDraft)
    expect(wrapper.emitted('submit')).toBeUndefined()

    pendingPartnerRequests[0].resolve(options.partner)
    await flushPromises()
    await editor.trigger('keydown', { key: 'Enter' })

    const mentions = wrapper.emitted('update:modelValue').at(-1)[0].parts.filter(
      (part) => part.kind === 'mention'
    )
    expect(mentions[0]).toEqual(initialDraft.parts[0])
    expect(mentions[1]).toMatchObject({
      type: 'partner',
      ...options.partner[0],
      resolved: true
    })
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('submits structured content after resolution', async () => {
    const initialDraft = {
      content: 'Klicks für ADIDAS',
      serializedContent: 'Klicks für @brand[ADIDAS]',
      parts: [
        { kind: 'text', text: 'Klicks für ' },
        {
          kind: 'mention',
          type: 'brand',
          trigger: 'brand',
          id: '1',
          label: 'ADIDAS',
          resolved: true
        }
      ]
    }
    const wrapper = mountInput({
      modelValue: initialDraft,
      mentionOptionProvider: vi.fn()
    })

    await wrapper.get('button.btn-primary-md').trigger('click')

    expect(wrapper.emitted('submit')).toEqual([[initialDraft]])
  })

  it('can convert an unresolved mention to plain text when lookup fails', async () => {
    const wrapper = mountInput({
      modelValue: 'Klicks für @Marke[UNKNOWN]',
      mentionOptionProvider: vi.fn().mockResolvedValue([])
    })
    await nextTick()

    await wrapper.get('[data-mention-index]').trigger('click')
    await nextTick()
    await getMenu()
      .findAll('button')
      .find((button) => button.text() === 'Use as plain text')
      .trigger('mousedown')

    const draft = wrapper.emitted('update:modelValue').at(-1)[0]
    expect(draft.content).toBe('Klicks für UNKNOWN')
    expect(draft.serializedContent).toBe('Klicks für UNKNOWN')
    expect(draft.parts).toEqual([{ kind: 'text', text: 'Klicks für UNKNOWN' }])
  })

  it('copies mentions using their portable syntax', async () => {
    const initialDraft = {
      content: 'Klicks für ADIDAS',
      serializedContent: 'Klicks für @Marke[ADIDAS]',
      parts: [
        { kind: 'text', text: 'Klicks für ' },
        {
          kind: 'mention',
          type: 'brand',
          trigger: 'Marke',
          id: '1',
          label: 'ADIDAS',
          resolved: true
        }
      ]
    }
    const wrapper = mountInput({
      modelValue: initialDraft,
      mentionOptionProvider: vi.fn()
    })
    const setData = vi.fn()
    const preventDefault = vi.fn()

    wrapper.findComponent({ name: 'ChatMentionEditor' }).vm.$emit('copy', {
      event: { clipboardData: { setData }, preventDefault },
      range: { start: 'Klicks für '.length, end: initialDraft.content.length }
    })

    expect(preventDefault).toHaveBeenCalled()
    expect(setData).toHaveBeenCalledWith('text/plain', '@Marke[ADIDAS]')
  })

  it('does not submit while an IME composition is active', async () => {
    const wrapper = mountInput({
      modelValue: '入力中',
      mentionOptionProvider: vi.fn()
    })
    await nextTick()
    const editor = wrapper.get('[contenteditable="true"]')

    await editor.trigger('compositionstart')
    await editor.trigger('keydown', { key: 'Enter', isComposing: true })

    expect(wrapper.emitted('submit')).toBeUndefined()
  })
})
