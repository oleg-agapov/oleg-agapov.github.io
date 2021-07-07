<template>
    <div class="max-w-[960px] mx-auto my-2">
        <router-link to="/" class="underline">Home</router-link>
    </div>
    <div class="max-w-[960px] mx-auto bg-gray-100">
        <h1 class="text-3xl font-thin text-center py-8 text-gray-700" id="cv">
            Curriculum vitae
        </h1>
        <HeroSection class="pt-4" />
        <CvSection class="mt-4" />
    </div>
    <!-- <p v-for="link in socialLinks" :key="link.name">{{ link.name }}</p> -->
</template>

<script>
import HeroSection from '/src/components/HeroSection.vue'
import CvSection from '/src/components/CvSection.vue'

export default {
    components: {
        HeroSection,
        CvSection,
    },
}
</script>

<style>
@media print {
    #cv {
        display: none;
    }
}
</style>
