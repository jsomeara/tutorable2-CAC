<template>
  <div class="prose text-slate-600 min-w-full" v-html="markdown.render(source)" />
</template>

<script setup lang="ts">
import 'katex/dist/katex.min.css'

import MarkdownIt from "markdown-it";
import MarkdownItHighlightjs from "markdown-it-highlightjs";
import MarkdownItTexmath from "markdown-it-texmath";
import katex from 'katex';

const markdown = new MarkdownIt()
    .use(MarkdownItHighlightjs)
    .use(MarkdownItTexmath, {
      engine: katex,
      delimiters: ['dollars', 'beg_end'],
      katexOptions: { macros: { "\\RR": "\\mathbb{R}" }, output: "html" }
    });

defineProps({
  source: {
    type: String,
    default: ""
  }
});
</script>