import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import ChatInput from '../ChatInput.vue'
import { createMentionDraft } from '../mentions/mentionDraft.js'
import { defaultMentionTriggerProvider } from '../mentions/mentionTriggerProvider.js'

const IME_PROCESS_KEY_CODE = 229
const originalScrollIntoView = HTMLElement.prototype.scrollIntoView

beforeAll(() => {
  HTMLElement.prototype.scrollIntoView = vi.fn()
})
afterAll(() => {
  if (originalScrollIntoView) HTMLElement.prototype.scrollIntoView = originalScrollIntoView
  else delete HTMLElement.prototype.scrollIntoView
})

const options = {
  brand: [
    { id: '1', label: 'ADIDAS' },
    { id: '2', label: 'ADIDAS ORIGINALS' }
  ],
  partner: [{ id: '3', label: 'DYSON' }]
}

const existingBrandMention = {
  kind: 'mention',
  type: 'brand',
  trigger: 'brand',
  id: 'existing-brand',
  label: 'ADIDAS',
  resolved: true
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
    const mentionEditor = wrapper.findComponent({ name: 'ChatMentionEditor' })
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
    const caretIndex = 'ABADIDAS\n'.length
    const caretDomOffset = Array.from(editor.element.childNodes).indexOf(lineBreak) + 1
    mentionEditor.vm.restoreCaret(caretIndex)
    await nextTick()

    expect(window.getSelection().anchorNode).toBe(editor.element)
    expect(window.getSelection().anchorOffset).toBe(caretDomOffset)

    await editor.trigger('input')
    await nextTick()

    expect(mentionEditor.emitted('input-parts').at(-1)[0].caretIndex).toBe(caretIndex)
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
    await optionButtons[0].trigger('click')
    const draft = wrapper.emitted('update:modelValue').at(-1)[0]

    expect(draft.content).toBe('Wieviele Klicks hatte die ADIDAS')
    expect(draft.serializedContent).toBe('Wieviele Klicks hatte die @Marke[ADIDAS]')
    expect(draft.parts.find((part) => part.kind === 'mention')).toEqual(
      expect.objectContaining({ id: '1', type: 'brand', resolved: true })
    )
    expect(wrapper.get('[data-mention-index]').text()).toContain('ADIDAS')
  })

  it.each([true, false])(
    'ignores autocomplete ranges crossing an existing chip (resolved: %s)',
    async (resolved) => {
      const initialDraft = createMentionDraft([
        { kind: 'text', text: '@brand ' },
        { ...existingBrandMention, id: resolved ? existingBrandMention.id : null, resolved }
      ])
      const optionProvider = vi.fn().mockResolvedValue(options.brand)
      const { model, wrapper } = mountControlledInput({
        modelValue: initialDraft,
        mentionOptionProvider: optionProvider
      })
      await nextTick()
      const editor = wrapper.get('[role="combobox"]')
      placeCaretAtEnd(editor.element)

      await editor.trigger('keyup', { key: 'ArrowRight' })
      await waitForOptions()

      expect(optionProvider).not.toHaveBeenCalled()
      expect(editor.attributes('aria-expanded')).toBe('false')
      expect(model.value).toEqual(initialDraft)
    }
  )

  it('protects trigger-like chip labels from custom providers', async () => {
    const prefix = 'Compare '
    const initialDraft = createMentionDraft([
      { kind: 'text', text: prefix },
      { ...existingBrandMention, label: '@brand ADIDAS' }
    ])
    const triggerProvider = vi.fn(({ cursorIndex }) => ({
      type: 'brand',
      trigger: 'brand',
      query: 'ADIDAS',
      replaceRange: { start: prefix.length, end: cursorIndex }
    }))
    const optionProvider = vi.fn().mockResolvedValue(options.brand)
    const { model, wrapper } = mountControlledInput({
      modelValue: initialDraft,
      mentionTriggerProvider: triggerProvider,
      mentionOptionProvider: optionProvider
    })
    await nextTick()
    const editor = wrapper.get('[role="combobox"]')
    placeCaretAtEnd(editor.element)

    await editor.trigger('keyup', { key: 'ArrowRight' })
    await waitForOptions()

    expect(triggerProvider).toHaveBeenCalledWith({
      text: initialDraft.content,
      cursorIndex: initialDraft.content.length
    })
    expect(optionProvider).not.toHaveBeenCalled()
    expect(editor.attributes('aria-expanded')).toBe('false')
    expect(model.value).toEqual(initialDraft)
  })

  it.each(['before', 'after'])(
    'inserts a mention in text immediately %s an existing chip',
    async (position) => {
      const existingMention = {
        kind: 'mention',
        type: 'partner',
        trigger: 'partner',
        id: 'existing-partner',
        label: 'ACME (EU)',
        resolved: true
      }
      const triggerPart = { kind: 'text', text: '@brand adi' }
      const initialDraft = createMentionDraft(
        position === 'before' ? [triggerPart, existingMention] : [existingMention, triggerPart]
      )
      const optionProvider = vi.fn().mockResolvedValue(options.brand)
      const { model, wrapper } = mountControlledInput({
        modelValue: initialDraft,
        mentionOptionProvider: optionProvider
      })
      await nextTick()
      const editor = wrapper.get('[role="combobox"]')
      placeCaretAtEnd(wrapper.get('[data-text-part]').element)

      await editor.trigger('keyup', { key: 'ArrowRight' })
      await waitForOptions()

      expect(optionProvider).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'brand', query: 'adi' })
      )
      const option = getMenu().get('[role="option"]')
      await option.trigger('mousedown')
      await option.trigger('click')

      const insertedMention = {
        kind: 'mention',
        type: 'brand',
        trigger: 'brand',
        ...options.brand[0],
        resolved: true
      }
      expect(model.value.parts).toEqual(
        position === 'before'
          ? [insertedMention, existingMention]
          : [existingMention, insertedMention]
      )
    }
  )

  it('cancels the active lookup when a resolved-chip click moves the caret', async () => {
    const pendingRequests = []
    const optionProvider = vi.fn(
      ({ signal }) => new Promise((resolve) => pendingRequests.push({ signal, resolve }))
    )
    const initialDraft = createMentionDraft([
      { kind: 'text', text: '@brand ' },
      existingBrandMention
    ])
    const { model, wrapper } = mountControlledInput({
      modelValue: initialDraft,
      mentionOptionProvider: optionProvider
    })
    await nextTick()
    const editor = wrapper.get('[role="combobox"]')
    const mentionEditor = wrapper.findComponent({ name: 'ChatMentionEditor' })
    const resolvedChip = wrapper.get('[data-mention-index]')
    placeCaretAtEnd(wrapper.get('[data-text-part]').element)
    await editor.trigger('keyup', { key: 'ArrowLeft' })
    await waitForOptions()
    const [request] = pendingRequests
    const caretChangeCount = mentionEditor.emitted('caret-change').length
    expect(request.signal.aborted).toBe(false)
    expect(editor.attributes('aria-expanded')).toBe('true')

    placeCaretAtEnd(editor.element)
    await resolvedChip.trigger('click')

    expect(mentionEditor.emitted('caret-change')).toHaveLength(caretChangeCount + 1)
    expect(mentionEditor.emitted('caret-change').at(-1)).toEqual([initialDraft.content.length])
    expect(pendingRequests).toHaveLength(1)
    expect(request.signal.aborted).toBe(true)
    expect(editor.attributes('aria-expanded')).toBe('false')

    request.resolve(options.brand)
    await flushPromises()

    expect(getMenu().exists()).toBe(false)
    expect(model.value).toEqual(initialDraft)
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
    expect(getMenu().findAll('[role="option"]')).toHaveLength(options.brand.length + 1)
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
    expect(getMenu().findAll('[role="option"]').map((row) => row.text())).toEqual(['Use as plain text'])

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

  it('cancels chip resolution when editor input shifts mention indexes', async () => {
    const pendingRequests = []
    const optionProvider = vi.fn(
      ({ signal }) => new Promise((resolve) => pendingRequests.push({ resolve, signal }))
    )
    const { model, wrapper } = mountControlledInput({
      modelValue: '@brand[PREFIX] @brand[UNKNOWN] @partner[OTHER]',
      mentionOptionProvider: optionProvider
    })
    await nextTick()
    const initialDraft = model.value
    const editedDraft = createMentionDraft(initialDraft.parts.slice(2))
    const editor = wrapper.get('[role="combobox"]')
    const [, targetChip] = wrapper.findAll('[data-mention-index]')

    await targetChip.trigger('click')
    const [request] = pendingRequests
    expect(request.signal.aborted).toBe(false)
    expect(editor.attributes('aria-expanded')).toBe('true')

    wrapper.findAll('[data-mention-index]')[0].element.remove()
    wrapper.findAll('[data-text-part]')[0].element.remove()
    placeCaretAtEnd(editor.element)
    await editor.trigger('input')
    await nextTick()

    expect(model.value).toEqual(editedDraft)
    expect(request.signal.aborted).toBe(true)
    expect(editor.attributes('aria-expanded')).toBe('false')

    request.resolve([{ id: 'stale-brand', label: 'UNKNOWN' }])
    await flushPromises()

    expect(model.value).toEqual(editedDraft)
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

  it.each(['click', 'Enter', ' '])('keeps disabled unresolved chips inert on %j', async (event) => {
    const optionProvider = vi.fn()
    const wrapper = mountInput({
      modelValue: '@brand[UNKNOWN]',
      mentionOptionProvider: optionProvider,
      disabled: true
    })
    await nextTick()
    const editor = wrapper.get('[role="combobox"]')
    const chip = wrapper.get('[data-mention-index]')
    const updateCount = wrapper.emitted('update:modelValue').length

    expect(editor.attributes()).toMatchObject({
      'aria-disabled': 'true',
      contenteditable: 'false',
      'aria-expanded': 'false'
    })
    expect(chip.attributes()).toMatchObject({ role: 'button', 'aria-disabled': 'true' })
    expect(chip.attributes('tabindex')).toBeUndefined()
    expect(chip.classes()).not.toContain('cursor-pointer')

    if (event === 'click') await chip.trigger('click')
    else await chip.trigger('keydown', { key: event })
    await flushPromises()

    expect(optionProvider).not.toHaveBeenCalled()
    expect(editor.attributes('aria-expanded')).toBe('false')
    expect(getMenu().exists()).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toHaveLength(updateCount)
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('cancels resolution when disabled and restores chip activation when re-enabled', async () => {
    const requests = []
    const optionProvider = vi.fn(
      ({ signal }) => new Promise((resolve) => requests.push({ resolve, signal }))
    )
    const wrapper = mountInput({
      modelValue: '@brand[UNKNOWN]',
      mentionOptionProvider: optionProvider
    })
    await nextTick()
    const initialDraft = wrapper.emitted('update:modelValue').at(-1)[0]
    const editor = wrapper.get('[role="combobox"]')
    const chip = wrapper.get('[data-mention-index]')

    await chip.trigger('click')
    await editor.trigger('keydown', { key: 'ArrowDown' })
    expect(editor.attributes('aria-expanded')).toBe('true')
    expect(editor.attributes('aria-activedescendant')).toBeTruthy()

    await wrapper.setProps({ disabled: true })
    await nextTick()

    expect(requests[0].signal.aborted).toBe(true)
    expect(editor.attributes('aria-expanded')).toBe('false')
    expect(editor.attributes('aria-activedescendant')).toBeUndefined()
    expect(document.body.querySelector('.mention-menu[data-state="open"]')).toBeNull()
    expect(chip.attributes('aria-disabled')).toBe('true')
    requests[0].resolve([{ id: 'late', label: 'UNKNOWN' }])
    await flushPromises()
    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toEqual(initialDraft)

    await wrapper.setProps({ disabled: false })
    expect(chip.attributes('aria-disabled')).toBeUndefined()
    expect(chip.attributes('tabindex')).toBe('0')
    await chip.trigger('click')
    requests[1].resolve([{ id: 'resolved', label: 'UNKNOWN' }])
    await flushPromises()

    expect(wrapper.emitted('update:modelValue').at(-1)[0].parts[0]).toMatchObject({
      id: 'resolved',
      label: 'UNKNOWN',
      resolved: true
    })
  })

  it.each(['Enter', ' '])('opens chip resolution with %j and moves focus and the caret to the editor', async (key) => {
    const { model, wrapper } = mountControlledInput({
      modelValue: 'Before @brand[UNKNOWN] after',
      mentionOptionProvider: vi.fn().mockResolvedValue([])
    })
    await nextTick()
    const initialDraft = model.value
    const chip = wrapper.get('[data-mention-index]')
    const editor = wrapper.get('[role="combobox"]')
    const mentionEditor = wrapper.findComponent({ name: 'ChatMentionEditor' })
    chip.element.focus()

    await chip.trigger('keydown', { key })
    await flushPromises()

    expect(editor.attributes('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(editor.element)
    expect(mentionEditor.vm.getSelectionRange()).toEqual({
      start: 'Before UNKNOWN'.length,
      end: 'Before UNKNOWN'.length
    })
    expect(mentionEditor.emitted('keydown')).toBeUndefined()
    expect(model.value).toEqual(initialDraft)
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('wraps through entities and plain text in both directions, then converts with Enter', async () => {
    const { model, wrapper } = mountControlledInput({
      modelValue: '@brand[UNKNOWN]',
      mentionOptionProvider: vi.fn().mockResolvedValue(options.brand)
    })
    await wrapper.get('[data-mention-index]').trigger('click')
    await flushPromises()
    const editor = wrapper.get('[role="combobox"]')
    const expectHighlight = (label) => {
      const selected = getMenu().findAll('[aria-selected="true"]')
      expect(selected).toHaveLength(1)
      expect(selected[0].text()).toBe(label)
      expect(editor.attributes('aria-activedescendant')).toBe(selected[0].attributes('id'))
      expect(document.activeElement).toBe(editor.element)
    }
    expectHighlight('ADIDAS')

    for (const [key, label] of [
      ['ArrowUp', 'Use as plain text'],
      ['ArrowUp', 'ADIDAS ORIGINALS'],
      ['ArrowDown', 'Use as plain text'],
      ['ArrowDown', 'ADIDAS'],
      ['ArrowDown', 'ADIDAS ORIGINALS'],
      ['ArrowDown', 'Use as plain text']
    ]) {
      await editor.trigger('keydown', { key })
      expectHighlight(label)
    }
    await editor.trigger('keydown', { key: 'Enter' })

    expect(model.value).toEqual(createMentionDraft([{ kind: 'text', text: 'UNKNOWN' }]))
    expect(editor.attributes('aria-expanded')).toBe('false')
    expect(editor.attributes('aria-activedescendant')).toBeUndefined()
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it.each(['loading', 'empty', 'error'])('requires explicit plain-text selection during %s', async (state) => {
    const pendingRequests = []
    const optionProvider = vi.fn(({ signal }) => {
      if (state === 'empty') return Promise.resolve([])
      if (state === 'error') return Promise.reject(new Error('Lookup failed'))
      return new Promise((resolve) => pendingRequests.push({ resolve, signal }))
    })
    const { model, wrapper } = mountControlledInput({
      modelValue: '@brand[UNKNOWN]',
      mentionOptionProvider: optionProvider
    })
    await wrapper.get('[data-mention-index]').trigger('click')
    await flushPromises()
    const initialDraft = model.value
    const editor = wrapper.get('[role="combobox"]')
    expect(editor.attributes('aria-activedescendant')).toBeUndefined()

    await editor.trigger('keydown', { key: 'Enter' })
    expect(model.value).toEqual(initialDraft)
    expect(wrapper.emitted('submit')).toBeUndefined()

    await editor.trigger('keydown', { key: 'ArrowDown' })
    const plainTextOption = getMenu().get('[role="option"]')
    expect(plainTextOption.text()).toBe('Use as plain text')
    expect(plainTextOption.attributes('aria-selected')).toBe('true')
    expect(editor.attributes('aria-activedescendant')).toBe(plainTextOption.attributes('id'))
    await editor.trigger('keydown', { key: 'ArrowUp' })
    expect(plainTextOption.attributes('aria-selected')).toBe('true')
    await editor.trigger('keydown', { key: 'Enter' })

    const convertedDraft = createMentionDraft([{ kind: 'text', text: 'UNKNOWN' }])
    expect(model.value).toEqual(convertedDraft)
    expect(editor.attributes('aria-expanded')).toBe('false')
    expect(wrapper.emitted('submit')).toBeUndefined()
    if (state === 'loading') {
      expect(pendingRequests[0].signal.aborted).toBe(true)
      pendingRequests[0].resolve([{ id: 'late', label: 'UNKNOWN' }])
      await flushPromises()
      expect(model.value).toEqual(convertedDraft)
      expect(editor.attributes('aria-expanded')).toBe('false')
    }
  })

  it('preserves hovered plain-text selection across exact-match results and resets it for another chip', async () => {
    const pendingRequests = []
    const { model, wrapper } = mountControlledInput({
      modelValue: '@brand[UNKNOWN] @partner[OTHER]',
      mentionOptionProvider: vi.fn(() => new Promise((resolve) => pendingRequests.push({ resolve })))
    })
    await nextTick()
    const initialDraft = model.value
    const [brandChip, partnerChip] = wrapper.findAll('[data-mention-index]')
    const editor = wrapper.get('[role="combobox"]')
    await brandChip.trigger('click')
    await getMenu().get('button').trigger('mouseenter')
    const fallbackId = editor.attributes('aria-activedescendant')
    expect(fallbackId).toBeTruthy()

    pendingRequests[0].resolve([{ id: 'exact', label: 'UNKNOWN' }, ...options.brand])
    await flushPromises()

    expect(model.value).toEqual(initialDraft)
    expect(editor.attributes('aria-activedescendant')).toBe(fallbackId)
    expect(getMenu().get('[aria-selected="true"]').text()).toBe('Use as plain text')
    await getMenu().findAll('[role="option"]')[0].trigger('mouseenter')
    expect(getMenu().get('[aria-selected="true"]').text()).toBe('UNKNOWN')
    await editor.trigger('keydown', { key: 'ArrowUp' })
    expect(getMenu().get('[aria-selected="true"]').text()).toBe('Use as plain text')

    await partnerChip.trigger('click')
    expect(editor.attributes('aria-activedescendant')).toBeUndefined()
    await editor.trigger('keydown', { key: 'Enter' })
    expect(model.value).toEqual(initialDraft)
    await editor.trigger('keydown', { key: 'ArrowDown' })
    await editor.trigger('keydown', { key: 'Enter' })

    expect(model.value.parts).toEqual([initialDraft.parts[0], { kind: 'text', text: ' OTHER' }])
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it.each([
    { key: 'Escape', shiftKey: false },
    { key: 'Tab', shiftKey: false },
    { key: 'Tab', shiftKey: true }
  ])('dismisses resolution without selection on $key (shift: $shiftKey)', async (keyProperties) => {
    const { model, wrapper } = mountControlledInput({
      modelValue: '@brand[UNKNOWN]',
      mentionOptionProvider: vi.fn().mockResolvedValue([])
    })
    await wrapper.get('[data-mention-index]').trigger('click')
    await flushPromises()
    const initialDraft = model.value
    const editor = wrapper.get('[role="combobox"]')
    await editor.trigger('keydown', { key: 'ArrowDown' })
    const event = new KeyboardEvent('keydown', { ...keyProperties, bubbles: true, cancelable: true })
    editor.element.dispatchEvent(event)
    await nextTick()

    expect(event.defaultPrevented).toBe(keyProperties.key === 'Escape')
    expect(editor.attributes('aria-expanded')).toBe('false')
    expect(editor.attributes('aria-activedescendant')).toBeUndefined()
    expect(model.value).toEqual(initialDraft)
    expect(wrapper.emitted('submit')).toBeUndefined()

    await wrapper.get('[data-mention-index]').trigger('click')
    await flushPromises()
    expect(editor.attributes('aria-activedescendant')).toBeUndefined()
    await editor.trigger('keydown', { key: 'Enter' })
    expect(model.value).toEqual(initialDraft)
  })

  it('can convert an unresolved mention to plain text when lookup fails', async () => {
    const wrapper = mountInput({
      modelValue: 'Klicks für @Marke[UNKNOWN]',
      mentionOptionProvider: vi.fn().mockResolvedValue([])
    })
    await nextTick()

    await wrapper.get('[data-mention-index]').trigger('click')
    await nextTick()
    const plainTextOption = getMenu()
      .findAll('button')
      .find((button) => button.text() === 'Use as plain text')
    await plainTextOption.trigger('mousedown')
    await plainTextOption.trigger('click')

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

  it('waits for IME composition to commit before detecting mention triggers', async () => {
    const errorHandler = vi.fn()
    const triggerProvider = vi.fn(defaultMentionTriggerProvider)
    const optionProvider = vi.fn().mockResolvedValue([])
    const wrapper = mount(ChatInput, {
      props: {
        modelValue: '@brand ',
        mentionTriggerProvider: triggerProvider,
        mentionOptionProvider: optionProvider
      },
      global: { config: { errorHandler } },
      attachTo: document.body
    })
    wrappers.push(wrapper)
    await nextTick()
    const initialDraft = wrapper.emitted('update:modelValue').at(-1)[0]
    const editor = wrapper.get('[role="combobox"]')
    const mentionEditor = wrapper.findComponent({ name: 'ChatMentionEditor' })
    await editor.trigger('compositionstart')
    const temporaryText = '@brand に'
    editor.element.textContent = temporaryText
    placeCaretAtEnd(editor.element)

    await editor.trigger('input', { isComposing: true })
    await editor.trigger('keyup', { key: 'Process' })
    await editor.trigger('click')

    expect(errorHandler).not.toHaveBeenCalled()
    expect(triggerProvider).not.toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toEqual(initialDraft)
    expect(editor.element.textContent).toBe(temporaryText)

    const committedText = '@brand 日本'
    editor.element.textContent = committedText
    placeCaretAtEnd(editor.element)
    await editor.trigger('compositionend')
    await editor.trigger('input', { isComposing: false })
    await editor.trigger('keyup', { key: 'ArrowRight' })
    await waitForOptions()

    expect(wrapper.emitted('update:modelValue').at(-1)[0].content).toBe(committedText)
    expect(editor.element.textContent).toBe(committedText)
    expect(mentionEditor.emitted('caret-change').at(-1)).toEqual([committedText.length])
    expect(triggerProvider).toHaveBeenLastCalledWith({
      text: committedText,
      cursorIndex: committedText.length
    })
    expect(optionProvider).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'brand', query: '日本' })
    )
    expect(errorHandler).not.toHaveBeenCalled()
  })

  it.each([{ isComposing: true }, { keyCode: IME_PROCESS_KEY_CODE }])(
    'suppresses IME keyup events outside the local composition session (%j)',
    async (eventProperties) => {
      const wrapper = mountInput({ modelValue: '入力中', mentionOptionProvider: vi.fn() })
      await nextTick()
      const editor = wrapper.get('[role="combobox"]')
      placeCaretAtEnd(editor.element)

      await editor.trigger('keyup', { key: 'Process', ...eventProperties })

      expect(
        wrapper.findComponent({ name: 'ChatMentionEditor' }).emitted('caret-change')
      ).toBeUndefined()
    }
  )

  it('allows Enter to submit committed text after confirming an IME composition', async () => {
    const wrapper = mountInput({
      modelValue: '入力中',
      mentionOptionProvider: vi.fn()
    })
    await nextTick()
    const editor = wrapper.get('[contenteditable="true"]')

    await editor.trigger('compositionstart')
    const committedText = '日本'
    editor.element.textContent = committedText
    placeCaretAtEnd(editor.element)
    await editor.trigger('keydown', { key: 'Enter', isComposing: true })

    expect(wrapper.emitted('submit')).toBeUndefined()

    await editor.trigger('compositionend')
    await editor.trigger('keyup', { key: 'Enter', keyCode: IME_PROCESS_KEY_CODE })
    expect(wrapper.emitted('submit')).toBeUndefined()

    await editor.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('submit')).toEqual([[expect.objectContaining({ content: committedText })]])
  })
})
