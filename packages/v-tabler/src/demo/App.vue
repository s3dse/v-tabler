<template>
    <div class="app-container">
        <nav class="navigation">
            <ul>
                <li
                    v-for="section in sections"
                    :key="section.id"
                    @click="currentSection = section.id"
                    :data-active="currentSection === section.id"
                >
                    {{ section.label }}
                </li>
            </ul>
        </nav>

        <main class="content">
            <ButtonsSection v-if="currentSection === 'buttons'" />
            <DialogsSection v-if="currentSection === 'dialogs'" />
            <DropdownsSection v-if="currentSection === 'dropdowns'" />
            <LoadingSection v-if="currentSection === 'loading'" />
            <TablesSection v-if="currentSection === 'tables'" />
            <TypographySection v-if="currentSection === 'typography'" />
            <CheckboxSection v-if="currentSection === 'checkbox'" />
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ButtonsSection from './sections/ButtonsSection.vue'
import DialogsSection from './sections/DialogsSection.vue'
import DropdownsSection from './sections/DropdownsSection.vue'
import LoadingSection from './sections/LoadingSection.vue'
import TablesSection from './sections/TablesSection.vue'
import TypographySection from './sections/TypographySection.vue'
import CheckboxSection from './sections/CheckboxSection.vue'

const currentSection = ref('buttons')

const sections = [
    { id: 'buttons', label: 'Buttons' },
    { id: 'dialogs', label: 'Dialogs' },
    { id: 'dropdowns', label: 'Dropdowns' },
    { id: 'loading', label: 'Loading Indicators' },
    { id: 'tables', label: 'Tables' },
    { id: 'typography', label: 'Typography' },
    { id: 'checkbox', label: 'Checkboxes' }
]
</script>

<style>
.app-container {
    --at-apply: 'flex flex-col h-100vh';
}

.navigation {
    --at-apply: 'bg-surface p-1 rounded-sm';
}

.navigation ul {
    --at-apply: 'flex gap-4 list-none p-0 m-0 text-default font-semibold tracking-wide';
}

.navigation li {
    --at-apply: 'cursor-pointer p-2 rounded transition-colors duration-200';
    --at-apply: 'hover:bg-surface-hover';
    --at-apply: 'border border-2 border-transparent';
    --at-apply: 'data-[active=true]:(border border-2 border-primary) ';
}

.content {
    --at-apply: 'flex-1 p-4';
}
</style>
