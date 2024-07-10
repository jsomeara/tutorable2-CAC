<template>
  <div class="p-3 border-b shadow-inner flex flex-row items-center">
    <NuxtLink to="/"><img src="~/assets/images/logo.svg" class="h-10 drop-shadow-sm"></NuxtLink>
    <button @click="newChat" id="reset-button"
            class="ml-auto flex flex-row gap-2 items-center bg-orange-500 text-white rounded-lg py-2 px-4 hover:scale-[1.03] transition-all active:scale-[0.95]">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 fill-current" viewBox="0 0 256 256">
        <path
            d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Zm-32-80a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z">
        </path>
      </svg>
      <div class="uppercase font-semibold text-sm -mb-0.5">New Session</div>
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['reset'])

function newChat() {
  emit('reset')
}
</script>