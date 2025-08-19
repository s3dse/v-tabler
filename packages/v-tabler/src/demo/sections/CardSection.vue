<template>
    <div class="text-default flex justify-center gap-4">
        <CardComponent class="w-120">
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
        <CardComponent class="w-120 bg-primary-lt border-primary">
            <template #header>
                <heading tag="h2" class="text-center">Card Header</heading>
            </template>
            <template #header-border>
                <div class="border-b border-primary border-solid"></div>
            </template>

            <div class="p-4">
                <p>This is a simple card component.</p>
            </div>

            <template #footer>
                <div class="flex justify-end pe-4 pb-4">
                    <button class="btn-primary-md rounded">Action</button>
                </div>
            </template>
        </CardComponent>
        <CardComponent class="w-120 h-fit" headerBorder>
            <template #header>
                <div class="bg-amber-500 text-gray-900 p-4">title slot</div>
            </template>

            <div class="bg-green text-gray-900">
                <p>The content slot</p>
            </div>

            <template #footer>
                <div class="bg-light-blue-500 text-gray-900">
                    <p>footer slot</p>
                </div>
            </template>
        </CardComponent>
    </div>
</template>
