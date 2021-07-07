<template>
    <h1>About</h1>
    <p>{{ name }}</p>
    <router-link to="/">Home</router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const name = computed(() => {
    return store.state.user.name
})
</script>
