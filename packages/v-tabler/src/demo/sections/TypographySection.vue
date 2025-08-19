<template>
    <div class="p-4 text-default">
        <h2 class="header-2 text-default">Typography</h2>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <h4 class="header-4">on surface</h4>
                <div class="grid grid-cols-2 gap-4 card p-3">
                    <div class="text-default">Default...</div>
                    <pre class="text-default">text-default</pre>
                    <div class="text-muted">Muted...</div>
                    <pre class="text-muted">text-muted</pre>
                    <div class="text-subtle">Subtle...</div>
                    <pre class="text-subtle">text-subtle</pre>
                    <div class="text-disabled">Disabled...</div>
                    <pre class="text-disabled">text-disabled</pre>
                </div>
            </div>
            <div>
                <h4 class="header-4">on background</h4>
                <div class="grid grid-cols-2 gap-4 p-3 card bg-background">
                    <div class="text-default">Default...</div>
                    <pre class="text-default">text-default</pre>
                    <div class="text-muted">Muted...</div>
                    <pre class="text-muted">text-muted</pre>
                    <div class="text-subtle">Subtle...</div>
                    <pre class="text-subtle">text-subtle</pre>
                    <div class="text-disabled">Disabled...</div>
                    <pre class="text-disabled">text-disabled</pre>
                </div>
            </div>
            <h2 class="header-2 text-default">Tinted Text Color</h2>
            <div class="flex flex-col gap-y-4 col-span-2">
                <pre class="text-mix:txt-DEFAULT@80:green-500">
text-mix:txt-DEFAULT@80:green-500
</pre
                >
                <pre class="text-mix:txt-DEFAULT@70:amber-500">
text-mix:txt-DEFAULT@70:amber-500
</pre
                >
                <pre class="text-mix:txt-DEFAULT@50:red-500">text-mix:txt-DEFAULT@50:red-500</pre>
                <pre class="text-mix:txt-DEFAULT@50:primary-DEFAULT">
text-mix:txt-DEFAULT@50:primary-DEFAULT</pre
                >
            </div>
        </div>
        <div class="p-4"></div>
        <div class="flex flex-col gap-2 m-0 p-0 text-default">
            <div class="border border-border rounded-sm p-4">
                <h1 class="header-1">
                    Heading 1: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                    nonumy eirmod
                </h1>
                <p class="leading-7">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                    tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
                    vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
                    no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
                    amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                    labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
                    et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
                    sanctus est Lorem ipsum dolor sit amet.
                </p>
            </div>
            <div class="border border-border rounded-sm p-4">
                <h2 class="header-2">
                    Heading 2: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                    nonumy eirmod
                </h2>
                <p class="leading-7">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                    tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
                    vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
                    no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
                    amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                    labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
                    et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
                    sanctus est Lorem ipsum dolor sit amet.
                </p>
            </div>
            <div class="border border-border rounded-sm p-4">
                <h3 class="header-3">
                    Heading 3: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                    nonumy eirmod
                </h3>
                <p class="leading-7">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                    tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
                    vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
                    no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
                    amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                    labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
                    et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
                    sanctus est Lorem ipsum dolor sit amet.
                </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h4 class="header-4 px-1 py-2">on surface</h4>
                    <div class="card p-4">
                        <h1 class="header-1">Heading 1</h1>
                        <h2 class="header-2">Heading 2</h2>
                        <h3 class="header-3">Heading 3</h3>
                        <h4 class="header-4">Heading 4</h4>
                        <h5 class="header-5">Heading 5</h5>
                        <h6 class="header-6">Heading 6</h6>
                    </div>
                </div>
                <div>
                    <h4 class="header-4 px-1 py-2">on background</h4>
                    <div class="p-4 card bg-background">
                        <h1 class="header-1">Heading 1</h1>
                        <h2 class="header-2">Heading 2</h2>
                        <h3 class="header-3">Heading 3</h3>
                        <h4 class="header-4">Heading 4</h4>
                        <h5 class="header-5">Heading 5</h5>
                        <h6 class="header-6">Heading 6</h6>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// No additional logic required for this section.
</script>
