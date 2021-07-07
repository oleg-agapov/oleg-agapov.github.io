<template>
    <header class="p-8 flex justify-center">
        <div class="flex">
            <div v-for="item in links" :key="item.name">
                <router-link
                    class="mx-4 font-medium text-gray-500 hover:text-gray-700"
                    :to="item.to"
                    >{{ item.name }}</router-link
                >
            </div>
        </div>
    </header>
</template>

<script setup>
const links = [
    { name: 'Home', to: '/' },
    { name: 'My work', to: '/my-work' },
    // { name: 'Links', to: '/links' },
]
</script>

<style scoped>
.router-link-active {
    @apply text-gray-700 underline;
}
</style>
