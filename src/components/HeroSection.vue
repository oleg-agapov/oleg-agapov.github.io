<template>
    <div class="flex flex-col sm:flex-row">
        <div class="p-4 mx-auto">
            <img
                src="/src/assets/avatar.jpg"
                alt="Oleg Agapov avatar"
                class="w-48 h-48 rounded-full border-4 border-purple-500"
            />
        </div>
        <div class="flex-1 flex-grow">
            <div class="flex flex-col text-center sm:text-left pt-2 sm:ml-8">
                <div class="text-5xl text-gray-600 tracking-wide">
                    <p class="font-bold inline">Oleg</p>
                    <p class="ml-2 inline font-light">Agapov</p>
                </div>
                <p class="mt-4 sm:ml-1 text-gray-600">
                    Data Analyst @
                    <a
                        href="https://gog.com"
                        target="_blank"
                        class="text-purple-700 underline"
                        >GOG.com</a
                    >
                    | Warsaw, Poland
                </p>

                <!-- Social links -->
                <!-- <div class="flex mx-auto mt-8 sm:mx-0">
                    <div v-for="item in socialLinks" :key="item.to">
                        <a :href="item.to">
                            <img
                                :src="item.file"
                                :alt="item.name"
                                class="w-8 h-8 mx-1 sm:ml-0 sm:mr-3"
                            />
                        </a>
                    </div>
                </div> -->
                <div class="flex flex-wrap mt-8 flex-col sm:flex-row">
                    <div
                        v-for="item in socialLinks"
                        :key="item.to"
                        class="text-gray-600 my-1 sm:mr-8"
                    >
                        <a
                            :href="item.to"
                            target="_blank"
                            class="hover:text-purple-500"
                        >
                            <img
                                :src="item.file"
                                :alt="item.name"
                                class="inline w-8 h-8 mx-1 sm:ml-0 sm:mr-1"
                            />
                            {{ item.to.substring(8) }}
                        </a>
                    </div>
                </div>
                <!--  -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        socialLinks() {
            return this.$store.state.variables.socialLinks
        },
    },
}
</script>

<style scoped></style>
