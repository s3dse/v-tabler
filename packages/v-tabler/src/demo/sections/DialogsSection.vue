<template>
    <div class="text-default">
        <heading tag="h1">Dialogs</heading>
        <p>Examples of dialog components and their usage.</p>
        <dialog-component
            title="Testing Dialog"
            description="A dialog..."
            @cancel="test"
            :pre-confirm="validateAndSubmit"
            :confirm-disabled="true"
        >
            <template #content>
                <div class="flex gap-4 flex-col text-default px-4 pt-3 pb-5">
                    <span>test</span>
                    <span>another test</span>
                    <span>and another test</span>
                </div>
                <select class="custom-select">
                    <option>a</option>
                    <option>b</option>
                </select>
                <list-select
                    class="w-fit"
                    :options="listSelectOptions"
                    :dropdownClasses="`right-0 min-w-50 w-fit`"
                    :multiple="false"
                    :label-fn="e => e.name"
                    v-model="listSelectionSingle"
                    @update:modelValue="e => console.log(e)"
                    :truncate-items="true"
                    :portal="false"
                ></list-select>
            </template>
        </dialog-component>
    </div>
</template>
<script setup>
import { ref } from 'vue'
const listSelectOptions = [...new Array(99999).keys()].map(k => ({
    id: k + 1,
    name: `option ${k + 1}`
}))
listSelectOptions.unshift({
    id: 0,
    name: 'first option is a very long name that should be displayed'
})
const listSelectionSingle = ref([])
const test = () => console.log('test')
const validateAndSubmit = () => {
    const selection = document.querySelector('.custom-select').selectedOptions[0].innerText
    if (selection === 'a') {
        console.log('error')
        return false
    } else {
        console.log('success')
        return true
    }
}
</script>
