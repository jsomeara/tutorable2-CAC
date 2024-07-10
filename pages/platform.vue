<template>
  <div class="min-[1216px]:hidden flex flex-col w-screen h-screen text-center">
    <div class="p-3 border-b shadow-inner flex flex-row items-center">
      <NuxtLink to="/"><img src="~/assets/images/logo.svg" class="h-10 drop-shadow-sm"></NuxtLink>
    </div>
    <div class="flex flex-col flex-1 items-center justify-center p-9 gap-5">
      <svg xmlns="http://www.w3.org/2000/svg" class="fill-current opacity-50 w-32 h-32" viewBox="0 0 256 256">
        <path
          d="M200,80v32a8,8,0,0,1-16,0V88H160a8,8,0,0,1,0-16h32A8,8,0,0,1,200,80ZM96,168H72V144a8,8,0,0,0-16,0v32a8,8,0,0,0,8,8H96a8,8,0,0,0,0-16ZM232,56V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Z">
        </path>
      </svg>
      <div>Your viewport is not large enough to use Tutorable. Try using a desktop or tablet <em>in landscape mode</em>.
      </div>
    </div>
  </div>
  <div class="hidden min-[1216px]:flex flex-col w-screen h-screen">
    <NavBar @reset="onReset" />
    <div class="flex-1 flex flex-row min-h-0 min-w-0">
      <div
        :class="'border-r shadow-inner flex relative transition-all overflow-hidden ' + (whiteboardVisible ? 'w-3/5 scale-100 opacity-100' : 'w-0 opacity-0 scale-90')">
        <Whiteboard ref="whiteboard" @ready="onWhiteboardReady" />
      </div>
      <div :class="'relative max-w-0 flex items-center ' + (whiteboardVisible ? 'rotate-180' : '')">
        <button
          class="bg-gray-50 bg-[radial-gradient(#d4d5d6_1px,transparent_1px)] [background-size:10px_10px] shadow-inner absolute z-[99] flex items-center justify-center rounded-r-full border-2 border-l py-9 pl-0.5 pr-1.5 hover:scale-y-110 transition-all"
          @click="toggleWhiteboardVisibility" title="Toggle whiteboard">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 fill-current opacity-70 rotate-180" stroke="black"
            stroke-width="10" viewBox="0 0 256 256">
            <path
              d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z">
            </path>
          </svg>
        </button>
      </div>
      <div class="flex-1 shadow-inner flex min-h-0 min-w-0 transition-all">
        <Chat ref="chat" :whiteboard="whiteboard" :whiteboardVisible="whiteboardVisible" />
      </div>
    </div>
  </div>
</template>

<style>
.v-toast__item {
  border-radius: 1em !important;
  filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.15));
}
</style>

<script setup>
const headers = useRequestHeaders(['host'])

useSeoMeta({
  title: 'Platform - Tutorable AI',
  ogTitle: 'Platform - Tutorable AI',
  description: 'Amazing AI-powered tutor for high school subjects! Tutorable provides unmatched step-by-step explanations. Draw questions or upload images to our interactive whiteboard for instant help. Covers math, science, and more.',
  ogDescription: 'Amazing AI-powered tutor for high school subjects! Tutorable provides unmatched step-by-step explanations. Draw questions or upload images to our interactive whiteboard for instant help. Covers math, science, and more.',
  ogImage: `https://${headers.host}/banner.png`,
  twitterCard: 'summary_large_image',
})

const whiteboardVisible = ref(true)

const whiteboard = ref(null)
const chat = ref(null)

const onWhiteboardReady = () => {
  chat.value.whiteboardReady()
}

const toggleWhiteboardVisibility = () => {
  whiteboardVisible.value = !whiteboardVisible.value
}

onMounted(() => {
  window.openWhiteboard = () => {
    whiteboardVisible.value = true
  }

  window.onbeforeunload = function () {
    return true;
  };
})

const onReset = () => {
  whiteboard.value.refresh()
  chat.value.refresh()
  whiteboardVisible.value = true
}
</script>