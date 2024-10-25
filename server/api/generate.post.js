import prompts from '~/assets/prompts.json';
import { neon } from "@neondatabase/serverless";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();

        const send = (messageFunc) => {
            writer.write(new TextEncoder().encode(`data: ${messageFunc()}\n`))
        }

        if (!Array.isArray(body.contents)) {
            send(() => ("!<ERROR>!"))
            throw new Error('Invalid input: contents must be an array');
        }

        event.respondWith(new Response(readable, {
            headers: {
                "Content-Type": "text/event-stream",
                Connection: "keep-alive",
                "Cache-Control": "no-cache"
            }
        }))

        const messages = body.contents.map((message) => {
            message.role = message.role === "model" ? "assistant" : "user"
            Object.defineProperty(message, "content", Object.getOwnPropertyDescriptor(message, "parts"));
            delete message["parts"];
            message.content = message.content.map((part) => {
                if (part.text) {
                    return { type: "text", text: part.text }
                }
                if (part.inline_data) {
                    return {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: part.inline_data.mime_type,
                            data: part.inline_data.data
                        }
                    }
                }
            }).filter(function (element) {
                return element !== undefined;
            });
            return message
        })

        const data = JSON.stringify({
            model: process.env.ANTHROPIC_MODEL,
            messages,
            max_tokens: 1024,
            stream: true,
            system: prompts.system,
            temperature: 0.65
        });

        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: data
        })

        if (!response.ok) {
            send(() => ("!<ERROR>!"))
            throw new Error(`HTTP error! status: ${response.status} - ${await (async () => {
                try {
                    return await response.text()
                } catch {
                    return ""
                }
            })()}`)
        }

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();


        while (true) {
            const { value, done } = await reader.read()
            if (done) break

            const lines = value.trim().split("\n")

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const message = line.slice(6)
                    let parsedData = JSON.parse(message)
                    if (parsedData.type === "content_block_delta") {
                        send(() => (JSON.stringify(parsedData.delta.text)))
                    }
                }
            }
        }

        await writer.close();
    } catch(error) {
        const sql = neon(process.env.DATABASE_URL);
        await sql`
        CREATE TABLE IF NOT EXISTS error_logs (
            id SERIAL PRIMARY KEY,
            error_message TEXT NOT NULL,
            timestamp TIMESTAMPTZ DEFAULT NOW()
        )
        `;

        await sql`
        INSERT INTO error_logs (error_message) 
        VALUES (${error.message})
        `; // Not vulnerable to SQL Injection because of neon's template tag sanitization
    }
})