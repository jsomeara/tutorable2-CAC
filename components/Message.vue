<template>
  <div
    :class="'p-6 shadow-inner message border-b transition-all ' + (message.user ? '' : 'bg-gray-50 ') + (whiteboardVisible ? 'px-6 py-6' : 'px-64 xl:px-96 py-9')">
    <div class="opacity-60 font-bold uppercase text-xs mb-2" v-if="message.user">You</div>
    <div class="opacity-60 font-bold uppercase text-xs mb-2" v-if="!message.user">Tutorable AI</div>
    <div v-if="message.pending === true && message.content.length === 0">
      <div role="status" class="w-full animate-pulse mt-6">
        <div class="h-3 bg-gray-300 rounded-full w-[98%] mb-3"></div>
        <div class="h-3 bg-gray-300 rounded-full w-[93%] mb-3"></div>
        <div class="h-3 bg-gray-300 rounded-full w-[96%] mb-3"></div>
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-if="message.user && message.content.trim().length === 0"
      class="p-3 bg-gray-100 shadow-inner rounded-md font-semibold text-sm max-w-sm my-4 text-slate-600 flex flex-row items-center gap-3 border">
      <svg xmlns="http://www.w3.org/2000/svg" class="fill-current w-6 h-6" viewBox="0 0 256 256">
        <path
          d="M240,192h-8V56a16,16,0,0,0-16-16H40A16,16,0,0,0,24,56V192H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM40,56H216V192H200V168a8,8,0,0,0-8-8H120a8,8,0,0,0-8,8v24H72V88H184v48a8,8,0,0,0,16,0V80a8,8,0,0,0-8-8H64a8,8,0,0,0-8,8V192H40ZM184,192H128V176h56Z">
        </path>
      </svg>
      Whiteboard Update
    </div>
    <MarkdownRenderer v-if="message.error !== true" :source="message.content" />
    <div v-if="message.error === true"
      class="bg-red-200/50 text-red-500 p-2 rounded-lg mt-4 mb-2 font-semibold text-sm">An error occurred while
      generating this response.</div>
  </div>
</template>

<style scoped>
.message,
.message-input {
  word-wrap: break-word;
  overflow-wrap: anywhere;
  word-break: break-word;
}
</style>

<script setup>
const props = defineProps(['message', 'whiteboardVisible'])
</script>