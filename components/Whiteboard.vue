<template>
  <!-- <div class="absolute w-[60vw] min-w-[60vw] hidden min-[1519px]:flex items-center justify-center pointer-events-none">
    <div
      class="py-1 px-2 text-sm bg-[#e0dfff] text-[#1f1c77] font-semibold rounded-b-md shadow-lg shadow-[#e0dfff]/50 border border-t-0 border-[#1f1c77]/20 pointer-events-none">
      👀 &nbsp; Tutorable can see anything you add to the whiteboard</div>
  </div> -->
  <iframe class="flex-1 min-w-[60vw]" ref="whiteboard" id="whiteboard" src="/whiteboard/index.html"></iframe>
</template>

<script setup>
const whiteboard = ref(null);

const refresh = () => {
  ready.value = false;
  whiteboard.value.contentWindow.postMessage("refresh", location.protocol + '//' + location.host + "/whiteboard/index.html")
};

const getImage = () => {
  return new Promise((resolve) => {
    const handleMessage = (event) => {
      if (event.data.type === "imageCaptured") {
        window.removeEventListener("message", handleMessage);
        resolve(event.data.data);
      }
    };

    window.addEventListener("message", handleMessage, false);
    whiteboard.value.contentWindow.postMessage("captureImage", location.protocol + '//' + location.host + "/whiteboard/index.html")
  });
};

defineExpose({
  refresh,
  getImage
});

const ready = ref(false);

const emit = defineEmits(['ready']);

onMounted(() => {
  const handleMessage = (event) => {
    if (event.data.type === "alive" && !ready.value) {
      ready.value = true;
      emit('ready');
      window.focus()
    }
  };

  window.addEventListener("message", handleMessage, false);

  setInterval(() => {
    if (!ready.value) {
      try {
        whiteboard.value.contentWindow.postMessage("alive", location.protocol + '//' + location.host + "/whiteboard/index.html")
      } catch { }
    }
  }, 100);
});
</script>