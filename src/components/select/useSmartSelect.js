import { computed } from 'vue'

/**
 * A composable for managing a smart multi-select component.
 * It allows for selecting multiple options, including a default option,
 * and handles the logic for adding and removing options based on user interaction.
 *
 * @param {Object} params - The parameters for the smart multi-select.
 * @param {Ref<Array>} params.modelValue - The reactive array of selected options.
 * @param {Ref<Array>} params.options - The reactive array of all available options.
 * @param {Function} [params.isDefaultOption] - A function to determine if an option is the default option. Defaults to returning false for all options and thereby allows for an empty selection.
 * @param {Function} [params.getId] - A function to get the unique identifier of an option. Defaults to using the `id` property of the option.
 * @returns {Object} An object containing methods and computed properties for managing the multi-select.
 */
export function useSmartMultiSelect({
    modelValue,
    options,
    isDefaultOption = x => false,
    getId = x => x.id,
    multiple
}) {
    const equals = (a, b) => {
        const idA = getId(a) 
        const idB = getId(b)
        return idA === idB
    }

    const defaultOption = computed(() => options.value.find(isDefaultOption))

    const selectedIds = computed(() => new Set(modelValue.value.map(getId)))

    if (!multiple && defaultOption.value && modelValue.value.length === 0) {
        modelValue.value = [defaultOption.value]
    }

    function isSelected(option) {
        return selectedIds.value.has(getId(option))
    }

    function remove(option, selected) {
        if (selected.length === 1 && equals(selected[0], option)) {
            return
        }

        const updated = selected.filter(o => !equals(o, option))
        modelValue.value = updated
    }

    function add(option, selected) {
        const filtered = selected.filter(o => !isDefaultOption(o))
        const updated = [...filtered, option]

        const nonDefaultOptionsCount = defaultOption.value ? options.value.length - 1 : options.value.length
        const allSelected = updated.length === nonDefaultOptionsCount

        modelValue.value = allSelected && defaultOption.value ? [defaultOption.value] : updated
    }

    function toggleSelect(option) {
        const selected = [...modelValue.value]

        if (isDefaultOption(option)) {
            modelValue.value = defaultOption.value ? [defaultOption.value] : []
            return
        }

        isSelected(option) ? remove(option, selected) : add(option, selected)
    }

    return {
        isSelected,
        toggleSelect,
        selectedIds,
        selectedOptions: computed(() => modelValue.value)
    }
}