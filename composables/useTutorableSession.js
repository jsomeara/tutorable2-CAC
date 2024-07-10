import { ref } from 'vue'

const messages = ref([])
const lastWhiteboardContents = ref(null)

// This function is necessary to remove the white padding around the whiteboard images by cropping it. This significantly improves LLM performance.
function removeImageBlanks(URI) {
    return new Promise(function (resolve, reject) {
        if (URI == null) return reject();
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            image = new Image();
        image.addEventListener('load', function () {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            var imageData = context.getImageData(0, 0, canvas.width, canvas.height),
                data = imageData.data,
                getRBG = function (x, y) {
                    var offset = image.width * y + x;
                    return {
                        red: data[offset * 4],
                        green: data[offset * 4 + 1],
                        blue: data[offset * 4 + 2],
                        opacity: data[offset * 4 + 3]
                    };
                },
                isWhite = function (rgb) {
                    // many images contain noise, as the white is not a pure #fff white
                    return rgb.red > 200 && rgb.green > 200 && rgb.blue > 200;
                },
                scanY = function (fromTop) {
                    var offset = fromTop ? 1 : -1;

                    // loop through each row
                    for (var y = fromTop ? 0 : image.height - 1; fromTop ? (y < image.height) : (y > -1); y += offset) {

                        // loop through each column
                        for (var x = 0; x < image.width; x++) {
                            var rgb = getRBG(x, y);
                            if (!isWhite(rgb)) {
                                if (fromTop) {
                                    return y;
                                } else {
                                    return Math.min(y + 1, image.height);
                                }
                            }
                        }
                    }
                    return resolve(null); // all image is white
                },
                scanX = function (fromLeft) {
                    var offset = fromLeft ? 1 : -1;

                    // loop through each column
                    for (var x = fromLeft ? 0 : image.width - 1; fromLeft ? (x < image.width) : (x > -1); x += offset) {

                        // loop through each row
                        for (var y = 0; y < image.height; y++) {
                            var rgb = getRBG(x, y);
                            if (!isWhite(rgb)) {
                                if (fromLeft) {
                                    return x;
                                } else {
                                    return Math.min(x + 1, image.width);
                                }
                            }
                        }
                    }
                    return resolve(null); // all image is white
                };

            var cropTop = scanY(true) - 50,
                cropBottom = scanY(false) + 50,
                cropLeft = scanX(true) - 50,
                cropRight = scanX(false) + 50,
                cropWidth = cropRight - cropLeft,
                cropHeight = cropBottom - cropTop;

            canvas.setAttribute("width", cropWidth);
            canvas.setAttribute("height", cropHeight);
            canvas.getContext("2d").drawImage(image,
                cropLeft, cropTop, cropWidth, cropHeight,
                0, 0, cropWidth, cropHeight);

            resolve(canvas.toDataURL("image/webp"));
        }, false);
        image.src = URI;
    });
}

const sendMessage = async (textMessage, whiteboardContents, setResponseCallback) => {
    window.debugSeeMessages = () => messages.value;
    const changeInWhiteboardContents = whiteboardContents !== lastWhiteboardContents.value
    lastWhiteboardContents.value = whiteboardContents
    let cleanedImage = null
    let whiteboardBlank = false
    if (changeInWhiteboardContents) {
        cleanedImage = await removeImageBlanks(whiteboardContents)
        if (cleanedImage === null) {
            whiteboardBlank = true
            cleanedImage = whiteboardContents
        }
    }
    const data = {
        role: "user",
        parts: [
            { text: textMessage },
            { text: changeInWhiteboardContents ? "<internal>\nImage of current whiteboard state is attatched." + (whiteboardBlank ? " There is currently nothing on the whiteboard yet." : "") + "\n</internal>" : "<internal>\nNo image of current whiteboard state is attatched because there was no change in the whiteboard state from the last message. Student did not draw or add anything to the whiteboard. Is this expected?\n</internal>" },
            ...(whiteboardContents && changeInWhiteboardContents ? [{ inline_data: { mime_type: 'image/webp', data: cleanedImage.replace("data:image/webp;base64,", "") } }] : []),
        ]
    }
    messages.value.push(data)

    const pendingResponse = {
        role: "model",
        parts: [
            { text: "" },
        ]
    }

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: messages.value
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
        let streamedResponse = ''

        while (true) {
            const { value, done } = await reader.read()
            if (done) break

            const lines = value.trim().split("\n")

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const message = line.slice(6)

                    if (message === "!<ERROR>!") {
                        throw new Error("Got !<ERROR>!")
                    }

                    let newText = JSON.parse(message)
                    streamedResponse += newText
                    const split = streamedResponse.split("</scratchpad>")
                    if(split.length === 2) {
                        setResponseCallback(split[1].trim())
                    }
                }
            }
        }

        pendingResponse.parts[0].text = streamedResponse.trim()
        messages.value.push(pendingResponse)
    } catch (error) {
        console.error('Error in request:', error)
        setResponseCallback("!<ERROR>!")
        messages.value.pop()
    }
}

const resetMessages = () => {
    messages.value.length = 0
    lastWhiteboardContents.value = null
}

export const useTutorableSession = () => {
    return { sendMessage, resetMessages, messages }
}