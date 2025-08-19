<template>
    <div class="app-container">
        <nav class="navigation">
            <ul>
                <li
                    v-for="(section, id) in sections"
                    :key="id"
                    @click="currentSection = id"
                    :data-active="currentSection === id"
                >
                    {{ section.label }}
                </li>
            </ul>
        </nav>

        <main class="content">
            <component :is="sections[currentSection].component" />
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { sections } from './sections'

const currentSection = ref('buttons')
</script>

<style>
.app-container {
    --at-apply: 'flex flex-col h-100vh';
}

.navigation {
    --at-apply: 'bg-surface p-1 rounded-sm';
}

.navigation ul {
    --at-apply: 'flex justify-center gap-4 list-none p-0 m-0 text-default font-semibold tracking-wide';
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
