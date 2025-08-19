<template>
    <div class="app-container">
        <nav class="navigation">
            <ul>
                <li @click="currentSection = 'buttons'">Buttons</li>
                <li @click="currentSection = 'dialogs'">Dialogs</li>
                <li @click="currentSection = 'dropdowns'">Dropdowns</li>
                <li @click="currentSection = 'loading'">Loading Indicators</li>
                <li @click="currentSection = 'tables'">Tables</li>
                <li @click="currentSection = 'typography'">Typography</li>
                <li @click="currentSection = 'checkbox'">Checkboxes</li>
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
</script>

<style>
.app-container {
    --at-apply: 'flex flex-col h-100vh';
    /* display: flex; */
    /* flex-direction: column; */
    /* height: 100vh; */
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
}

.content {
    --at-apply: 'flex-1 p-4';
}
</style>
