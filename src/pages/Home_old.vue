<template>
    <div class="container mx-auto">
        <div class="flex flex-col sm:flex-row sm:py-16">
            <div class="flex-1 mx-auto sm:flex sm:justify-end sm:mr-16">
                <img
                    src="/src/assets/avatar.jpg"
                    alt="Oleg Agapov avatar"
                    class="
                        w-64
                        h-64
                        sm:w-72
                        sm:h-72
                        rounded-full
                        mt-8
                        shadow-lg
                    "
                />
            </div>
            <div class="flex-1 flex-grow">
                <div
                    class="
                        flex flex-col
                        text-center
                        sm:text-left
                        pt-8
                        justify-center
                        1sm:py-32
                        h-full
                    "
                >
                    <div
                        class="
                            py-1
                            font-extrabold
                            text-5xl text-gray-900
                            tracking-wide
                        "
                    >
                        Oleg Agapov
                    </div>
                    <p class="mt-4 pl-1 text-xl text-gray-600">
                        Analytics Engineer @ GOG.com
                    </p>

                    <div class="flex mx-auto mt-8 sm:mx-0">
                        <div v-for="item in socialLinks" :key="item.to">
                            <a :href="item.to">
                                <img
                                    :src="item.file"
                                    :alt="item.name"
                                    class="w-8 h-8 mx-1 sm:ml-0 sm:mr-3"
                                />
                            </a>
                        </div>
                    </div>
                    <!--  -->
                </div>
            </div>
        </div>
        <div class="prose max-w-[960px] mx-auto">
            <h3>Hi there!</h3>
            <p>My name is Oleg Agapov</p>
        </div>
    </div>
</template>

<script setup>
const socialLinks = [
    {
        name: 'LinkedIn',
        file: '/src/assets/social/linkedin.png',
        to: 'https://www.linkedin.com/in/oagapov/',
    },
    {
        name: 'facebook',
        file: '/src/assets/social/facebook.png',
        to: 'https://www.facebook.com/oleg.agapov.ua',
    },
    {
        name: 'GitHub',
        file: '/src/assets/social/github.png',
        to: 'https://github.com/oleg-agapov',
    },
    {
        name: 'Telegram',
        file: '/src/assets/social/telegram.png',
        to: 'https://t.me/oleg_agapov',
    },
]
</script>
