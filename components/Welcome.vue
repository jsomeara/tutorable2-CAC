<script setup>
import examples from '~/assets/examples.json';

const emit = defineEmits(['sendExampleFirstMessage'])

const loading = ref(false)

const loadExample = (exampleId) => {
  if(examples[exampleId] && !loading.value) {
    loading.value = true
    const example = examples[exampleId]
    const handleMessage = (event) => {
      if (event.data.type === "importDone") {
        window.removeEventListener("message", handleMessage);
        window.openWhiteboard()
        setTimeout(() => {
          emit('sendExampleFirstMessage', example.firstMessage)
          loading.value = false
        }, 500)
      }
    };

    window.addEventListener("message", handleMessage, false);
    document.getElementById("whiteboard").contentWindow.postMessage({type: "import", data: example.whiteboard})
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full bg-gray-100 absolute inset-0 z-10">
    <div :class="'absolute top-0 left-0 z-[90] bg-gray-100/70 w-full h-full flex flex-col items-center justify-center transition-all ' + (loading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')">
      <div :class="'p-6 bg-white flex flex-col shadow-lg border rounded-lg transition-all '  + (loading ? 'scale-100 opacity-100' : 'scale-0 opacity-0')">
        <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin h-12 w-12 opacity-30 fill-current mx-auto mb-6"
              viewBox="0 0 256 256">
              <path
                d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z">
              </path>
            </svg>
        <div class="font-semibold text-lg">Loading Example...</div>
      </div>
    </div>
    <div class="max-w-md w-full px-6 py-8 bg-white shadow-md overflow-auto sm:rounded-lg scale-85 xl:scale-95">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-800">Welcome to Tutorable AI</h2>
        <p class="mt-2 text-sm text-gray-600">Your one-on-one learning companion</p>
      </div>
      <div class="mt-6">
        <p class="text-base text-gray-700">
          Our AI-powered tutor is designed to help you learn. It explains concepts step-by-step
          and
          can understand anything you put on the whiteboard.
        </p>
      </div>
      <div class="mt-6 text-center text-sm opacity-50 mb-6 border-b-2 font-semibold pb-2">Try an Example</div>
      <div class="grid grid-cols-2 gap-4 mb-2">
        <button @click="loadExample('math')"
          class="flex flex-col gap-2 p-2 rounded-lg text-sm items-center justify-center text-blue-600 hover:shadow-sm hover:scale-[1.03] active:scale-[0.95] transition-all bg-blue-100 hover:bg-blue-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 fill-blue-600/50" viewBox="0 0 256 256">
            <path
              d="M112,72a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16h64A8,8,0,0,1,112,72Zm-8,104H80V152a8,8,0,0,0-16,0v24H40a8,8,0,0,0,0,16H64v24a8,8,0,0,0,16,0V192h24a8,8,0,0,0,0-16Zm48,0h64a8,8,0,0,0,0-16H152a8,8,0,0,0,0,16Zm64,16H152a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm-61.66-90.34a8,8,0,0,0,11.32,0L184,83.31l18.34,18.35a8,8,0,0,0,11.32-11.32L195.31,72l18.35-18.34a8,8,0,0,0-11.32-11.32L184,60.69,165.66,42.34a8,8,0,0,0-11.32,11.32L172.69,72,154.34,90.34A8,8,0,0,0,154.34,101.66Z">
            </path>
          </svg>
          Math
        </button>
        <button @click="loadExample('chemistry')"
          class="flex flex-col gap-2 p-2 rounded-lg text-sm items-center justify-center text-green-600 hover:shadow-sm hover:scale-[1.03] active:scale-[0.95] transition-all bg-green-100 hover:bg-green-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 fill-green-600/50" fill="#000000"
            viewBox="0 0 256 256">
            <path
              d="M221.69,199.77,160,96.92V40h8a8,8,0,0,0,0-16H88a8,8,0,0,0,0,16h8V96.92L34.31,199.77A16,16,0,0,0,48,224H208a16,16,0,0,0,13.72-24.23ZM110.86,103.25A7.93,7.93,0,0,0,112,99.14V40h32V99.14a7.93,7.93,0,0,0,1.14,4.11L183.36,167c-12,2.37-29.07,1.37-51.75-10.11-15.91-8.05-31.05-12.32-45.22-12.81ZM48,208l28.54-47.58c14.25-1.74,30.31,1.85,47.82,10.72,19,9.61,35,12.88,48,12.88a69.89,69.89,0,0,0,19.55-2.7L208,208Z">
            </path>
          </svg>
          Chemistry
        </button>
        <button @click="loadExample('biology')"
          class="flex flex-col gap-2 p-2 rounded-lg text-sm items-center justify-center text-red-600 hover:shadow-sm hover:scale-[1.03] active:scale-[0.95] transition-all bg-red-100 hover:bg-red-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 fill-red-600/50" viewBox="0 0 256 256">
            <path
              d="M224,208H203.94A88.05,88.05,0,0,0,144,64.37V32a16,16,0,0,0-16-16H80A16,16,0,0,0,64,32V136a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V80.46A72,72,0,0,1,181.25,208H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16Zm-96-72H80V32h48V136ZM72,184a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z">
            </path>
          </svg>
          Biology
        </button>
        <button @click="loadExample('physics')"
          class="flex flex-col gap-2 p-2 rounded-lg text-sm items-center justify-center text-purple-600 hover:shadow-sm hover:scale-[1.03] active:scale-[0.95] transition-all bg-purple-100 hover:bg-purple-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 fill-purple-600/50" viewBox="0 0 256 256">
            <path
              d="M207,50.25A87.46,87.46,0,0,0,144.6,24h-.33A87.48,87.48,0,0,0,82,49.81L20.61,112a16,16,0,0,0,.06,22.56l28.66,28.66a15.92,15.92,0,0,0,11.32,4.69h.09a16,16,0,0,0,11.36-4.82L133,100.69a16.08,16.08,0,0,1,22.41-.21,15.6,15.6,0,0,1,4.73,11.19,16.89,16.89,0,0,1-4.85,12L93,183.88a16,16,0,0,0-.17,22.79l28.66,28.66a16.06,16.06,0,0,0,22.52.12L205.81,175C240.26,140.5,240.79,84.56,207,50.25ZM60.65,151.89,32,123.24,55.8,99.12l28.52,28.52ZM132.79,224l-28.68-28.65,24.38-23.57L157,200.32Zm61.76-60.44-26.11,25.54L140,160.68l26.44-25.57.1-.09a33,33,0,0,0,9.57-23.5A31.44,31.44,0,0,0,166.47,89a32.2,32.2,0,0,0-44.9.5L95.49,116.18,67,87.74,93.35,61.09A71.51,71.51,0,0,1,144.27,40h.27a71.55,71.55,0,0,1,51.05,21.48C223.25,89.55,222.75,135.38,194.55,163.58Z">
            </path>
          </svg>
          Physics
        </button>
      </div>
      <div class="mt-6">
        <p class="text-sm text-gray-500 p-3 border rounded-lg">
          Get started by asking a question below. Feel free to upload question images to the
          whiteboard!
        </p>
      </div>
    </div>
  </div>
</template>