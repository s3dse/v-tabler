import { defineComponent, nextTick, ref } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SortableRoot, SortableItem, SortableHandle } from '..'
import { CardComponent } from '../../card'
import VTabler from '@/install'
import * as sourceExports from '@/index'

enableAutoUnmount(afterEach)

const createTransfer = () => {
    const data = new Map()
    return {
        get types() { return [...data.keys()] },
        setData: vi.fn((type, value) => data.set(type, value)),
        getData: vi.fn(type => data.get(type) ?? ''),
        setDragImage: vi.fn()
    }
}

const fireDrag = async (element, type, transfer, options = {}) => {
    const event = new Event(type, { bubbles: true, cancelable: true })
    Object.defineProperties(event, {
        dataTransfer: { value: transfer },
        clientX: { value: 10 },
        clientY: { value: options.clientY ?? 10 },
        relatedTarget: { value: options.relatedTarget ?? null }
    })
    element.dispatchEvent(event)
    await nextTick()
    return event
}

const mountList = ({ ids = ['a', 'b', 'c'], disabled = false } = {}) => mount(defineComponent({
    components: { SortableRoot, SortableItem, SortableHandle },
    setup: () => ({ order: ref(ids), disabled: ref(disabled) }),
    template: `
        <SortableRoot v-model="order" :disabled="disabled" data-root>
            <SortableItem v-for="id in order" :key="id" :value="id" :data-item="id"
                v-slot="{ canMoveUp, canMoveDown, moveUp, moveDown }">
                <SortableHandle data-handle>Drag {{ id }}</SortableHandle>
                <button data-up :disabled="!canMoveUp" @click="moveUp">Move {{ id }} up</button>
                <button data-down :disabled="!canMoveDown" @click="moveDown">Move {{ id }} down</button>
            </SortableItem>
        </SortableRoot>`
}), { attachTo: document.body })

const item = (wrapper, value) => wrapper.get(`[data-item="${value}"]`)
const startDrag = async (wrapper, value, transfer = createTransfer()) => {
    await fireDrag(item(wrapper, value).get('[data-handle]').element, 'dragstart', transfer)
    return transfer
}
const hover = async (wrapper, value, position, transfer) => {
    const target = item(wrapper, value).element
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({ top: 100, height: 100 })
    return fireDrag(target, 'dragover', transfer, { clientY: position === 'before' ? 110 : 190 })
}

describe('Sortable', () => {
    it('moves by buttons without mutating the input and reports final indices', async () => {
        const initialIds = Object.freeze(['a', 'b', 'c'])
        const wrapper = mountList({ ids: initialIds })
        await item(wrapper, 'b').get('[data-up]').trigger('click')
        expect(wrapper.vm.order).toEqual(['b', 'a', 'c'])
        await item(wrapper, 'b').get('[data-down]').trigger('click')
        expect(wrapper.vm.order).toEqual(initialIds)
        expect(initialIds).toEqual(['a', 'b', 'c'])
        expect(wrapper.getComponent(SortableRoot).emitted('reorder')).toEqual([
            [{ value: 'b', fromIndex: 1, toIndex: 0 }],
            [{ value: 'b', fromIndex: 0, toIndex: 1 }]
        ])
    })

    it.each([
        ['c', 'a', 'before', ['c', 'a', 'b'], 2, 0],
        ['c', 'a', 'after', ['a', 'c', 'b'], 2, 1],
        ['a', 'c', 'before', ['b', 'a', 'c'], 0, 1],
        ['a', 'c', 'after', ['b', 'c', 'a'], 0, 2]
    ])('drops %s %s/%s once with an insertion marker', async (source, target, position, expected, fromIndex, toIndex) => {
        const wrapper = mountList()
        const transfer = await startDrag(wrapper, source)
        const event = await hover(wrapper, target, position, transfer)
        const root = wrapper.getComponent(SortableRoot)

        expect(wrapper.vm.order).toEqual(['a', 'b', 'c'])
        expect(root.emitted('update:modelValue')).toBeUndefined()
        expect(item(wrapper, source).attributes()).toHaveProperty('data-dragging')
        expect(item(wrapper, target).attributes('data-drop-position')).toBe(position)
        expect(event.defaultPrevented).toBe(true)
        expect(transfer.effectAllowed).toBe('move')
        expect(transfer.dropEffect).toBe('move')
        expect(transfer.setDragImage).toHaveBeenCalledWith(item(wrapper, source).element, 10, 10)

        await fireDrag(item(wrapper, target).element, 'drop', transfer)
        await fireDrag(wrapper.get('[data-root]').element, 'drop', transfer)
        expect(wrapper.vm.order).toEqual(expected)
        expect(root.emitted('update:modelValue')).toEqual([[expected]])
        expect(root.emitted('reorder')).toEqual([[{ value: source, fromIndex, toIndex }]])
        expect(wrapper.find('[data-dragging]').exists()).toBe(false)
        expect(wrapper.find('[data-drop-position]').exists()).toBe(false)
    })

    it('keeps an indicated insertion point droppable across a list gap', async () => {
        const wrapper = mountList()
        const transfer = await startDrag(wrapper, 'c')
        await hover(wrapper, 'a', 'before', transfer)
        const root = wrapper.get('[data-root]').element
        expect((await fireDrag(root, 'dragover', transfer)).defaultPrevented).toBe(true)
        await fireDrag(root, 'drop', transfer)
        expect(wrapper.vm.order).toEqual(['c', 'a', 'b'])
    })

    it.each([['a', 'a', 'after'], ['a', 'b', 'before'], ['b', 'a', 'after']])(
        'suppresses unchanged drops from %s to %s/%s', async (source, target, position) => {
            const wrapper = mountList()
            const transfer = await startDrag(wrapper, source)
            await hover(wrapper, target, position, transfer)
            expect(wrapper.find('[data-drop-position]').exists()).toBe(false)
            await fireDrag(item(wrapper, target).element, 'drop', transfer)
            expect(wrapper.getComponent(SortableRoot).emitted('update:modelValue')).toBeUndefined()
        }
    )

    it('preserves ID types', async () => {
        const wrapper = mountList({ ids: [1, '1', 2] })
        await wrapper.findAll('[data-up]')[1].trigger('click')
        expect(wrapper.vm.order).toEqual(['1', 1, 2])
    })

    it.each([[[]], [['a']]])('supports an empty or singleton list (%j)', async ids => {
        const wrapper = mountList({ ids })
        expect(wrapper.findAll('[data-item]')).toHaveLength(ids.length)
        for (const button of wrapper.findAll('button')) expect(button.element.disabled).toBe(true)
        expect(wrapper.getComponent(SortableRoot).emitted('update:modelValue')).toBeUndefined()
    })

    it('makes boundary movement callbacks no-ops', async () => {
        const wrapper = mountList()
        item(wrapper, 'a').get('[data-up]').element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        item(wrapper, 'c').get('[data-down]').element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await nextTick()
        expect(wrapper.vm.order).toEqual(['a', 'b', 'c'])
        expect(wrapper.getComponent(SortableRoot).emitted('reorder')).toBeUndefined()
    })

    it('disables handles and movement callbacks', async () => {
        const wrapper = mountList({ disabled: true })
        expect(item(wrapper, 'a').get('[data-handle]').attributes('draggable')).toBe('false')
        expect((await fireDrag(item(wrapper, 'a').get('[data-handle]').element, 'dragstart', createTransfer())).defaultPrevented).toBe(true)
        item(wrapper, 'b').get('[data-down]').element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await nextTick()
        expect(wrapper.find('[data-dragging]').exists()).toBe(false)
        expect(wrapper.getComponent(SortableRoot).emitted('reorder')).toBeUndefined()
    })

    it('ignores external and cross-list drops', async () => {
        const first = mountList()
        const second = mountList()
        const external = createTransfer()
        external.setData('text/plain', 'a')
        expect((await hover(first, 'c', 'after', external)).defaultPrevented).toBe(false)
        await fireDrag(item(first, 'c').element, 'drop', external)

        const transfer = await startDrag(first, 'a')
        expect((await hover(second, 'c', 'after', transfer)).defaultPrevented).toBe(false)
        await fireDrag(item(second, 'c').element, 'drop', transfer)
        expect(first.vm.order).toEqual(['a', 'b', 'c'])
        expect(second.vm.order).toEqual(['a', 'b', 'c'])
        expect(first.getComponent(SortableRoot).emitted('reorder')).toBeUndefined()
        expect(second.getComponent(SortableRoot).emitted('reorder')).toBeUndefined()
    })

    it('rejects a foreign drag payload even when another local drag is active', async () => {
        const first = mountList()
        const second = mountList()
        await startDrag(first, 'a')
        const transfer = await startDrag(second, 'a')
        await hover(first, 'c', 'after', transfer)
        await fireDrag(item(first, 'c').element, 'drop', transfer)
        expect(first.getComponent(SortableRoot).emitted('reorder')).toBeUndefined()
        expect(first.find('[data-dragging]').exists()).toBe(false)
    })

    it('clears the marker on leaving and accepts re-entry during the same drag', async () => {
        const wrapper = mountList()
        const transfer = await startDrag(wrapper, 'c')
        await hover(wrapper, 'a', 'before', transfer)
        await fireDrag(item(wrapper, 'a').element, 'dragleave', transfer, { relatedTarget: item(wrapper, 'b').element })
        expect(wrapper.find('[data-drop-position]').exists()).toBe(true)
        await fireDrag(wrapper.get('[data-root]').element, 'dragleave', transfer)
        expect(wrapper.find('[data-drop-position]').exists()).toBe(false)
        await hover(wrapper, 'b', 'before', transfer)
        await fireDrag(item(wrapper, 'b').element, 'drop', transfer)
        expect(wrapper.vm.order).toEqual(['a', 'c', 'b'])
    })

    it.each(['dragend', 'disabled', 'order'])('cancels drag state after %s', async reason => {
        const wrapper = mountList()
        const transfer = await startDrag(wrapper, 'a')
        await hover(wrapper, 'c', 'after', transfer)
        if (reason === 'dragend') await fireDrag(item(wrapper, 'a').get('[data-handle]').element, 'dragend', transfer)
        if (reason === 'disabled') wrapper.vm.disabled = true
        if (reason === 'order') wrapper.vm.order = ['c', 'b', 'a']
        await nextTick()
        expect(wrapper.find('[data-dragging]').exists()).toBe(false)
        expect(wrapper.find('[data-drop-position]').exists()).toBe(false)
        await fireDrag(wrapper.get('[data-root]').element, 'drop', transfer)
        expect(wrapper.getComponent(SortableRoot).emitted('reorder')).toBeUndefined()
    })

    it('accepts external membership changes without stale item-validation errors', async () => {
        const wrapper = mountList()
        await startDrag(wrapper, 'a')
        wrapper.vm.order = ['b', 'c']
        await nextTick()
        expect(wrapper.findAll('[data-item]')).toHaveLength(2)
        expect(wrapper.find('[data-dragging]').exists()).toBe(false)
    })

    it('cancels a drag when the parent mutates the model in place', async () => {
        const wrapper = mountList()
        const transfer = await startDrag(wrapper, 'a')
        await hover(wrapper, 'c', 'after', transfer)
        wrapper.vm.order.reverse()
        await nextTick()

        expect(wrapper.find('[data-dragging]').exists()).toBe(false)
        expect(wrapper.find('[data-drop-position]').exists()).toBe(false)
        await fireDrag(wrapper.get('[data-root]').element, 'drop', transfer)
        expect(wrapper.vm.order).toEqual(['c', 'b', 'a'])
        expect(wrapper.getComponent(SortableRoot).emitted('reorder')).toBeUndefined()
    })

    it('cancels when an item unmounts independently of the model', async () => {
        const wrapper = mount(defineComponent({
            components: { SortableRoot, SortableItem, SortableHandle },
            setup: () => ({ visible: ref(true), order: ref(['a', 'b']) }),
            template: `<SortableRoot v-model="order" data-root>
                <SortableItem v-if="visible" value="a" data-item="a"><SortableHandle data-handle>Drag</SortableHandle></SortableItem>
                <SortableItem value="b" data-item="b"><SortableHandle data-handle>Drag</SortableHandle></SortableItem>
            </SortableRoot>`
        }))
        const transfer = await startDrag(wrapper, 'a')
        await hover(wrapper, 'b', 'after', transfer)
        wrapper.vm.visible = false
        await nextTick()
        expect(wrapper.find('[data-drop-position]').exists()).toBe(false)
        await fireDrag(item(wrapper, 'b').element, 'drop', transfer)
        expect(wrapper.getComponent(SortableRoot).emitted('reorder')).toBeUndefined()

    })

    it('restores focus to the move button, falling back to the item at a boundary', async () => {
        const wrapper = mountList({ ids: ['a', 'b', 'c', 'd'] })
        const button = item(wrapper, 'b').get('[data-down]')
        button.element.focus()
        await button.trigger('click')
        expect(document.activeElement).toBe(button.element)
        await button.trigger('click')
        expect(button.element.disabled).toBe(true)
        expect(document.activeElement).toBe(item(wrapper, 'b').element)
    })

    it('composes all primitives with asChild and preserves native attributes and handlers', async () => {
        const onRootOver = vi.fn()
        const onItemOver = vi.fn()
        const onHandleStart = vi.fn()
        const wrapper = mount(defineComponent({
            components: { SortableRoot, SortableItem, SortableHandle, CardComponent },
            setup: () => ({ order: ref(['a', 'b']), onRootOver, onItemOver, onHandleStart }),
            template: `<SortableRoot v-model="order" as-child>
                <section data-root aria-label="Sortable cards" @dragover="onRootOver">
                    <SortableItem v-for="id in order" :key="id" :value="id" as-child :data-item="id">
                        <CardComponent class="consumer-card" @dragover="onItemOver">
                            <SortableHandle as-child>
                                <span data-handle title="Drag card" @dragstart="onHandleStart">Drag</span>
                            </SortableHandle>
                        </CardComponent>
                    </SortableItem>
                </section>
            </SortableRoot>`
        }), { attachTo: document.body })
        expect(wrapper.element.tagName).toBe('SECTION')
        expect(wrapper.attributes('aria-label')).toBe('Sortable cards')
        expect(wrapper.element.children).toHaveLength(2)
        expect(item(wrapper, 'a').classes()).toContain('consumer-card')
        expect(item(wrapper, 'a').get('[data-handle]').attributes('title')).toBe('Drag card')
        const transfer = await startDrag(wrapper, 'a')
        await hover(wrapper, 'b', 'after', transfer)
        await fireDrag(item(wrapper, 'b').element, 'drop', transfer)
        expect(onHandleStart).toHaveBeenCalledOnce()
        expect(onItemOver).toHaveBeenCalledOnce()
        expect(onRootOver).toHaveBeenCalledOnce()
        expect(wrapper.vm.order).toEqual(['b', 'a'])
    })

    it('respects a consumer cancelling dragstart through asChild', async () => {
        const wrapper = mount(defineComponent({
            components: { SortableRoot, SortableItem, SortableHandle },
            template: `<SortableRoot :model-value="['a']"><SortableItem value="a" data-item="a">
                <SortableHandle as-child><span data-handle @dragstart.prevent>Drag</span></SortableHandle>
            </SortableItem></SortableRoot>`
        }))
        await startDrag(wrapper, 'a')
        expect(wrapper.find('[data-dragging]').exists()).toBe(false)
    })

    it.each([[['a', 'a'], /unique IDs/], [[NaN], /finite-number IDs/], [[''], /non-empty string/], [[{}], /finite-number IDs/]])(
        'fails clearly for invalid IDs (%j)', (ids, message) => {
            expect(() => mount(SortableRoot, { props: { modelValue: ids } })).toThrow(message)
        }
    )

    it('fails clearly for missing contexts and unknown item IDs', () => {
        expect(() => mount(SortableItem, { props: { value: 'a' } })).toThrow(/inside SortableRoot/)
        expect(() => mount(SortableHandle)).toThrow(/inside SortableItem/)
        expect(() => mount(defineComponent({
            components: { SortableRoot, SortableItem },
            template: '<SortableRoot :model-value="[]"><SortableItem value="unknown" /></SortableRoot>'
        }))).toThrow(/present in SortableRoot/)
    })

    it('exports and registers all three primitives through the package plugin', () => {
        const app = { component: vi.fn(), directive: vi.fn() }
        VTabler.install(app)
        for (const [name, component] of Object.entries({ SortableRoot, SortableItem, SortableHandle })) {
            expect(sourceExports[name]).toBe(component)
            expect(app.component).toHaveBeenCalledWith(name, component)
        }
    })
})
