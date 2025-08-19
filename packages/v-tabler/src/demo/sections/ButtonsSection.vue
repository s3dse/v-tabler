<template>
    <div class="text-default">
        <heading tag="h1">Buttons</heading>
        <p>Demonstration of various button styles and states.</p>
        <div class="p-4 flex flex-col gap-2">
            <heading tag="h2">Basic Buttons</heading>
            <pre class="text-default text-base">btn-base-(sm|md|lg|default)</pre>
            <div class="flex flex-row gap-8">
                <button class="btn-base-sm">Base SM</button>
                <button class="btn-base-md">Base MD</button>
                <button class="btn-base-lg">Base LG</button>
                <button class="btn-base-default">Base Default</button>
            </div>
            <div class="flex flex-row gap-8 pb-4">
                <button disabled class="btn-base-sm">Base SM</button>
                <button disabled class="btn-base-md">Base MD</button>
                <button disabled class="btn-base-lg">Base LG</button>
                <button disabled class="btn-base-default">Base Default</button>
            </div>
            <heading tag="h2" class="header-2 text-default">Primary Buttons</heading>
            <pre class="text-default text-base">btn-primary-(sm|md|lg|default)</pre>
            <div class="flex flex-row gap-8">
                <button class="btn-primary-sm">Primary SM</button>
                <button class="btn-primary-md">Primary MD</button>
                <button class="btn-primary-lg">Primary LG</button>
                <button class="btn-primary-default">Primary Default</button>
            </div>
            <button class="btn-primary-formfield rounded">Primary FormField</button>
            <div class="flex flex-row gap-8">
                <button class="btn-primary-sm" disabled>Primary SM</button>
                <button class="btn-primary-md" disabled>Primary MD</button>
                <button class="btn-primary-lg" disabled>Primary LG</button>
                <button class="btn-primary-default" disabled>Primary Default</button>
            </div>
            <button class="btn-primary-formfield rounded" disabled>Primary FormField</button>
        </div>
    </div>
</template>
