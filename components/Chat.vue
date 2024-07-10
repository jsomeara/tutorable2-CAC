<template>
  <div
    :class="'absolute z-[1000] w-screen h-screen top-0 left-0 flex items-center justify-center bg-black/35 transition-all ' + (showMathInputDialog ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')">
    <div
      :class="'bg-white p-8 rounded-xl flex flex-col min-w-[30vw] drop-shadow-2xl mb-[30vh] transition-all ' + (showMathInputDialog ? 'scale-100 opacity-100' : 'scale-90 opacity-0')">
      <div class="flex flex-row items-center w-full border-b pb-4">
        <div class="uppercase text-sm font-semibold opacity-75">{{ editMathSpan === null ? 'Insert Math Input' :
          'Update Math Input' }}</div>
        <button class="ml-auto" @click="showMathInputDialog = false">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 fill-current opacity-60" viewBox="0 0 256 256">
            <path
              d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z">
            </path>
          </svg>
        </button>
      </div>
      <div class="my-8">
        <math-field
          :class="'w-full border text-2xl rounded-md p-2 outline-none drop-shadow-sm cursor-text ' + (showMathInputDialog ? 'scale-100' : 'scale-0')"></math-field>
      </div>
      <div class="flex flex-row">
        <button ref="insertExpressionButton" @click="insertExpressionButtonClicked"
          class="shadow-inner w-full text-sm font-semibold text-orange-600 bg-orange-100 enabled:hover:bg-orange-200 rounded-lg p-2.5 transition-all disabled:opacity-60">{{
            editMathSpan === null ? 'Insert Expression' : 'Update Expression' }}</button>
      </div>
    </div>
  </div>
  <div class="flex-1 flex flex-col">
    <div class="flex-1 flex flex-col overflow-auto relative" ref="chatContainer">
      <Transition name="welcome">
        <Welcome v-if="messages.length === 0" @sendExampleFirstMessage="onSendExampleFirstMessage" />
      </Transition>

      <Message :message="message" :whiteboardVisible="whiteboardVisible" v-if="messages.length > 0"
        v-for="message in messages" />
    </div>
    <div class="min-h-10 shadow-inner flex">
      <div
        :class="'shadow-inner p-3 flex flex-row flex-1 gap-2 transition-all ' + (whiteboardVisible ? 'px-3' : 'px-64 xl:px-96')">
        <div class="flex flex-1 items-end h-full">
          <span
            class="border-2 rounded-lg outline-none p-2 focus:shadow-md transition-all flex-1 min-h-[8rem] max-h-[40vh] overflow-auto message-input"
            role="textbox" contenteditable="true" placeholder="Send a message" ref="inputSpan">
          </span>
        </div>
        <div class="flex flex-col items-end gap-2">
          <button title="Insert math notation" @click="showMathInputDialog = true"
            class="shadow-inner mt-auto flex flex-row gap-2 items-center text-orange-600 bg-orange-100 enabled:hover:bg-orange-200 rounded-lg p-2.5 transition-all disabled:opacity-60">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 scale-125 fill-current" viewBox="0 0 256 256">
              <path
                d="M112,72a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16h64A8,8,0,0,1,112,72Zm-8,104H80V152a8,8,0,0,0-16,0v24H40a8,8,0,0,0,0,16H64v24a8,8,0,0,0,16,0V192h24a8,8,0,0,0,0-16Zm48,0h64a8,8,0,0,0,0-16H152a8,8,0,0,0,0,16Zm64,16H152a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm-61.66-90.34a8,8,0,0,0,11.32,0L184,83.31l18.34,18.35a8,8,0,0,0,11.32-11.32L195.31,72l18.35-18.34a8,8,0,0,0-11.32-11.32L184,60.69,165.66,42.34a8,8,0,0,0-11.32,11.32L172.69,72,154.34,90.34A8,8,0,0,0,154.34,101.66Z">
              </path>
            </svg>
          </button>
          <button ref="sendButton" @click="sendMessage" title="Send message" id="send-message-button"
            class="shadow-inner flex flex-row gap-2 items-center bg-orange-500 text-white rounded-lg p-2.5 enabled:hover:bg-orange-500/80 transition-all disabled:opacity-60"
            :disabled="!sendEnabled">
            <svg xmlns="http://www.w3.org/2000/svg" v-if="sendEnabled" class="w-6 h-6 fill-current"
              viewBox="0 0 256 256">
              <path
                d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z">
              </path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" v-if="!sendEnabled" class="animate-spin h-6 w-6 fill-current"
              viewBox="0 0 256 256">
              <path
                d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z">
              </path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  --keyboard-zindex: 3000;
  overflow: hidden;
}

#mathlive-suggestion-popover {
  z-index: 3000 !important;
}
</style>

<style scoped>
.message,
.message-input {
  word-wrap: break-word;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.welcome-enter-active {
  animation: goIn 0.4s ease-out;
}

.welcome-leave-active {
  animation: goOut 0.2s ease-in;
}

@keyframes goIn {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes goOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(-100%);
  }
}

[contenteditable=true]:empty:before {
  content: attr(placeholder);
  pointer-events: none;
  display: block;
  opacity: 50%;
}
</style>

<script setup>
import 'mathlive';
import 'mathlive/static.css'
import { convertLatexToMarkup } from 'mathlive';
const showMathInputDialog = ref(false)

const insertExpressionButton = ref(null)

const messages = ref([]);
const chatContainer = ref(null);
const inputSpan = ref(null);
const sendButton = ref(null);
const inputMessage = ref('');
const sendEnabled = ref(true);

const props = defineProps(['whiteboard', 'whiteboardVisible'])

const session = useTutorableSession()

const refresh = () => {
  whiteboardConnected.value = false;
  messages.value = [];
  inputSpan.value.innerHTML = "";
  inputMessage.value = '';
  sendEnabled.value = true;
  session.resetMessages()
  lastImage.value = null
};

const whiteboardConnected = ref(false)


const whiteboardReady = () => {
  whiteboardConnected.value = true
};

defineExpose({
  refresh,
  whiteboardReady,
});

const lastImage = ref(null)

const onSendExampleFirstMessage = (firstMessage) => {
  inputMessage.value = firstMessage
  sendMessage()
}

const sendMessage = async () => {
  const image = await props.whiteboard.getImage()
  if (inputMessage.value.trim() !== '' || lastImage.value === null || lastImage.value !== image) {
    lastImage.value = image
    messages.value.push({ content: inputMessage.value, user: true, image: null });
    messages.value.push({ content: "", user: false, pending: true });
    inputSpan.value.innerHTML = '';
    const inputMessageCopy = `${inputMessage.value}`
    inputMessage.value = '';
    sendEnabled.value = false;
    await session.sendMessage(
      inputMessageCopy.trim(),
      image,
      (response) => {
        try {
          const currentMessage = messages.value.find(x => !x.user && x.pending)
          if (response === "!<ERROR>!") {
            currentMessage.error = true
          }
          currentMessage.content = response
        } catch { }
      }
    )
    messages.value.find(x => !x.user && x.pending).pending = false
    sendEnabled.value = true
  }
};

let userScrolled = false;

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const isUserAtBottom = () => {
  if (!chatContainer.value) return false;
  const threshold = 25;
  return chatContainer.value.scrollHeight - chatContainer.value.scrollTop - chatContainer.value.clientHeight < threshold;
};

const onScroll = () => {
  if (chatContainer.value) {
    userScrolled = !isUserAtBottom();
  }
};

const observeChanges = () => {
  const observer = new MutationObserver(() => {
    if (!userScrolled) {
      scrollToBottom();
    }
  });

  if (chatContainer.value) {
    observer.observe(chatContainer.value, { childList: true, subtree: true, characterData: true });
  }

  if (inputSpan.value) {
    observer.observe(inputSpan.value, { childList: true, subtree: true, characterData: true });
  }

  return observer;
};

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function latexReplaceAll(str, mapObj) {
  var re = new RegExp(Object.keys(mapObj).join("|"), "gi");

  return str.replace(re, function (matched) {
    return `$${mapObj[matched]}$`;
  });
}

const editMathSpan = ref(null)

onMounted(() => {
  const chatObserver = observeChanges();
  chatContainer.value.addEventListener('scroll', onScroll);

  scrollToBottom();

  inputSpan.value.addEventListener('paste', (e) => {
    e.preventDefault();
    var text = e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  });

  inputSpan.value.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendButton.value.click();
    }
  });

  const observer = new MutationObserver(function (mutationsList, observer) {
    const cloned = inputSpan.value.cloneNode(true);
    const mathElements = cloned.querySelectorAll("[latex]")
    const idToLatex = {}
    for (const mathElement of mathElements) {
      const id = makeid(10)
      idToLatex[id] = mathElement.getAttribute("latex")
      mathElement.outerHTML = `&nbsp;${id}&nbsp;`
    }
    document.body.append(cloned)
    let result = cloned.innerText.trim()
    cloned.remove()
    if (Object.keys(idToLatex).length !== 0) {
      result = latexReplaceAll(result, idToLatex)
    }

    inputMessage.value = result
  });

  observer.observe(inputSpan.value, { subtree: true, characterData: true, childList: true, attributes: true });

  document.querySelector("math-field").keybindings = document.querySelector("math-field").keybindings.filter((x) => x.key !== '[Escape]')

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const isNotCombinedKey = !(event.ctrlKey || event.altKey || event.shiftKey);
      if (isNotCombinedKey) {
        if (showMathInputDialog.value) {
          showMathInputDialog.value = false
        }
      }
    }
  });

  document.querySelector("math-field").addEventListener('beforeinput', (ev) => {
    if (ev.inputType === 'insertLineBreak') {
      insertExpressionButton.value.click()
    }
  });

  window.editableMathClicked = (elem) => {
    editMathSpan.value = elem
    showMathInputDialog.value = true
  }
});

function setEndOfContenteditable(elem) {
  let sel = window.getSelection();
  sel.selectAllChildren(elem);
  sel.collapseToEnd();
}

function safe(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return text.replace(/[&<>"']/g, c => map[c]);
}

const insertExpressionButtonClicked = () => {
  const mathMl = document.querySelector("math-field").getValue("math-ml")
  const latex = document.querySelector("math-field").getValue("latex-expanded").replaceAll("\\doubleprime", "\\prime\\prime").replaceAll("\\nor", "\\veebar")
  const escapedLatex = safe(latex)
  if (editMathSpan.value === null) {
    inputSpan.value.innerHTML += `<span contenteditable="false" title="Edit: ${escapedLatex}" onclick="editableMathClicked(this);" latex="${escapedLatex}">&nbsp;${convertLatexToMarkup(latex)}&nbsp;</span>`;
  } else {
    editMathSpan.value.setAttribute("title", `Edit: ${escapedLatex}`)
    editMathSpan.value.setAttribute("latex", escapedLatex)
    editMathSpan.value.innerHTML = `&nbsp;${convertLatexToMarkup(latex)}&nbsp;`
  }
  showMathInputDialog.value = false
}

onBeforeUnmount(() => {
  chatObserver.disconnect();
  if (chatContainer.value) {
    chatContainer.value.removeEventListener('scroll', onScroll);
  }
});

watch(showMathInputDialog, () => {
  if (showMathInputDialog.value) {
    document.activeElement.blur();
    if (editMathSpan.value !== null) {
      document.querySelector("math-field").setValue(editMathSpan.value.getAttribute("latex"));
    }
    document.querySelector("math-field").focus()
    document.querySelector("math-field").shadowRoot.querySelector(".ML__content").focus()
  } else {
    document.activeElement.blur();
    editMathSpan.value = null
    document.querySelector("math-field").setValue('');
    setTimeout(() => {
      inputSpan.value.focus();
      setEndOfContenteditable(inputSpan.value)
    }, 1)
  }
})
</script>