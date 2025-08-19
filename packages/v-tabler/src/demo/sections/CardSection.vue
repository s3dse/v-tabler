<template>
    <div class="text-default grid grid-cols-2 gap-8">
        <div>
            <heading tag="h2">Sample Card with header and footer</heading>
            <CardComponent>
                <template #header>
                    <heading tag="h2" class="text-center">Card Header</heading>
                </template>

                <p class="p-4">This is a simple card component.</p>

                <template #footer>
                    <div class="flex justify-end pe-4 pb-4">
                        <button class="btn-primary-md rounded">Action</button>
                    </div>
                </template>
            </CardComponent>
        </div>
        <div>
            <heading tag="h2">Customized via slots</heading>
            <CardComponent class="bg-primary-lt/25 border-primary/50">
                <template #header>
                    <heading tag="h2" class="text-center">Card Header</heading>
                </template>
                <template #header-border>
                    <div class="border-b border-primary/50 border-solid"></div>
                </template>

                <div class="p-4">
                    <p>This is a simple card component.</p>
                </div>

                <template #footer>
                    <div class="flex justify-end pe-4 pb-4">
                        <button class="btn-ghost-md rounded">Action</button>
                    </div>
                </template>
            </CardComponent>
        </div>
        <div>
            <heading tag="h2">Slots visualised</heading>
            <CardComponent class="h-fit" headerBorder>
                <template #header>
                    <div class="bg-amber-500/75 text-gray-900 px-4 py-2">title slot</div>
                </template>
                <template #header-border>
                    <div class="border-b border-border border-solid px-4">header-border slot</div>
                </template>

                <div class="bg-green/75 text-gray-900 px-4 py-4">
                    <p>default slot</p>
                </div>

                <template #footer-border>
                    <div class="border-t border-border border-solid px-4">footer-border slot</div>
                </template>
                <template #footer>
                    <div class="bg-light-blue-500/75 text-gray-900 px-4 py-2">
                        <p>footer slot</p>
                    </div>
                </template>
            </CardComponent>
        </div>
    </div>
</template>
