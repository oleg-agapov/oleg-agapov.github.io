<template>
    <div>Home</div>
    <p>Name: {{ name }}</p>
    <p>New name: {{ newName.value }}</p>
    <input v-model="newName" type="text" class="p-1 border border-blue-600" />
    <button
        @click="saveName"
        class="ml-2 p-1 border border-blue-800 bg-blue-300"
    >
        Submit
    </button>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const name = computed(() => {
    return store.state.user.name
})

const newName = ref('')

function saveName() {
    store.dispatch('saveName', newName.value)
    newName.value = ''
    router.push('/about')
}
</script>
