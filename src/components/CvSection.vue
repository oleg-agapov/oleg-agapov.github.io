<template>
    <div class="prose prose-green p-8 max-w-none">
        <!-- Content -->
        <MarkdownDocument />
    </div>
</template>

<script>
import MarkdownDocument from './cv.md'

export default {
    components: {
        MarkdownDocument,
    },
}
</script>

<style>
@media print {
    li {
        list-style-type: disc;
        margin-left: 1rem;
    }
    li:before {
        display: none;
    }
    .prose {
        line-height: 1;
    }
}
@page {
    size: A4;
}
</style>
