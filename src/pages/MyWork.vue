<template>
    <Header></Header>
    <div class="max-w-[960px] mx-auto prose">
        <div class="flex flex-col md:flex-row p-4">
            <div class="flex-1">
                <h1>Data Engineering Book</h1>
                <blockquote>
                    If you want to understand something, write about it.
                </blockquote>
                <p>
                    In November 2020 I started write an open-source book about
                    Data Engineering. I felt that there was a gap between
                    existing materials and newcomers to the profession.
                </p>
                <a
                    href="https://github.com/oleg-agapov/data-engineering-book"
                    target="_blank"
                >
                    Read on GitHub
                </a>
            </div>
            <div class="w-96 flex items-center sm:justify-center">
                <img
                    src="/src/assets/my-work/de-book.png"
                    alt="Data Engineering Book on github.com/oleg-agapov"
                    class="sm:max-h-96"
                />
            </div>
        </div>
        <!-- <div class="flex flex-col p-4">
            <div class="my-4 flex flex-col sm:flex-row">
                <div class="flex-1 text-gray-800">
                    <div
                        class="
                            my-2
                            py-1
                            text-5xl
                            font-extrabold
                            text-transparent
                            bg-clip-text bg-gradient-to-tr
                            from-[#251846]
                            to-[#ac3b45]
                        "
                    >
                        Data Engineering Book
                    </div>
                    <span
                        class="
                            inline-block
                            my-2
                            font-bold
                            p-2
                            bg-gradient-to-tr
                            from-[#251846]
                            to-[#ac3b45]
                            text-white text-xs
                            rounded
                        "
                    >
                        work in progress
                    </span>
                    <div class="border-0 border-l-4 border-red-500">
                        If you want to understand something, write about it.
                    </div>
                    <div class="my-4 sm:my-8">
                        In November 2020 I started write an open-source book
                        about Data Engineering. I felt that there was a gap
                        between existing materials and newcomers to the
                        profession.
                    </div>
                    <div class="my-4 sm:my-8">
                        <a
                            href="https://github.com/oleg-agapov/data-engineering-book"
                            class="underline text-blue-700"
                            target="_blank"
                        >
                            Read on GitHub
                        </a>
                    </div>
                </div>
                <div class="w-96 flex items-center sm:justify-center">
                    <img
                        src="/src/assets/my-work/de-book.png"
                        alt="Data Engineering Book on github.com/oleg-agapov"
                        class="sm:max-h-96"
                    />
                </div>
            </div>

            <div class="my-8 flex flex-col sm:flex-row">
                <div class="flex-1 text-gray-800">
                    <div
                        class="
                            my-2
                            py-1
                            text-5xl
                            font-extrabold
                            text-transparent
                            bg-clip-text bg-gradient-to-tr
                            from-[#251846]
                            to-[#2b3292]
                        "
                    >
                        Articles
                    </div>
                    <div class="my-4 sm:my-8">
                        <p>
                            Sometimes I write articles on medium.com about
                            web-development (Vue.js, Flask) or data/engineering.
                        </p>
                    </div>
                    <div class="my-4 sm:my-8">
                        <a
                            href="https://github.com/oleg-agapov/data-engineering-book"
                            class="underline text-blue-700"
                            target="_blank"
                        >
                            Read on GitHub
                        </a>
                    </div>
                </div>
                <div class="w-96 flex items-center sm:justify-center">
                    <img
                        src="/src/assets/my-work/medium.png"
                        alt="Data Engineering Book on github.com/oleg-agapov"
                        class="sm:max-h-96"
                    />
                </div>
            </div>
            <div>Product manager at NewProLab</div>
        </div> -->
    </div>
</template>

<script setup>
import Header from '/src/components/Header.vue'
</script>
