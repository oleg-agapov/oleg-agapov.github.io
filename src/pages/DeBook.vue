<template>
    <div class="max-w-[960px] mx-auto bg-gray-2001">
        <HeroSection class="pt-8" />
        <AboutSection class="mt-8" />
    </div>
    <!-- <p v-for="link in socialLinks" :key="link.name">{{ link.name }}</p> -->
</template>

<script>
import HeroSection from '/src/components/HeroSection.vue'
import AboutSection from '/src/components/AboutSection.vue'

export default {
    components: {
        HeroSection,
        AboutSection,
    },
}
</script>
