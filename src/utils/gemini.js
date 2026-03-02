import { GoogleGenAI } from '@google/genai';

let aiInstance = null;

function getAI() {
    if (!aiInstance) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey || apiKey === 'your_api_key_here') {
            throw new Error('Please set your VITE_GEMINI_API_KEY in the .env file');
        }
        aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
}

const SYSTEM_PROMPT = `You are a code concept visualizer for beginners. Explain concepts so simply that even a 10-year-old could understand. Use real-world analogies and everyday language. When given a topic, respond with a JSON object containing:

1. "title": A concise title for the concept
2. "description": A one-line beginner-friendly description
3. "mermaid": A Mermaid.js flowchart (graph TD) with 8-15 nodes that breaks down every part of the concept. Use emoji and simple labels. Apply these node styles:
   style NodeId fill:#1e3a5f,stroke:#4f8cff,color:#fff (primary)
   style NodeId fill:#3b1f5e,stroke:#a855f7,color:#fff (secondary)
   style NodeId fill:#1f3b2f,stroke:#34d399,color:#fff (success)
   style NodeId fill:#3b2f1f,stroke:#fb923c,color:#fff (warning)
4. "steps": An array of 8-15 step objects covering EVERY important detail. Each step must have:
   - "node": the Mermaid node ID this step maps to
   - "title": short step title
   - "explanation": 3-5 sentences using simple language, real-world analogies, and no jargon without explaining it first
   - "code": a small code example showing this specific part
   - "language": programming language (javascript, python, bash, text, etc.)
   - "memory": An object showing the INTERNAL STATE at this step. It must have:
     - "stack": array of stack frames, each with "name" (function/context name) and "vars" (array of {name, value} pairs). Include "refTo" (integer index into heap array) if a variable references a heap object.
     - "heap": array of heap objects. Each has "address" (like "0x3e8"), "type" ("Array"|"Object"|"String"|"Function"), and "isNew" (true if created at this step). For Array type include "values" (array of {v: value, highlight: true/false}). For Object type include "props" (array of {k, v}). For String type include "value".
     - "output": array of strings representing console output so far at this step
   - "v8Engine": (Optional, but mandatory for JavaScript concepts) An object showing the INTERNAL V8 ENGINE PIPELINE STATUS. Include "stage" ("Parser", "AST", "Ignition", "Bytecode", "TurboFan", "MachineCode", "Execution"), "active": boolean, "details": string explaining what that stage is doing right now.

IMPORTANT RULES:
- Do NOT limit yourself to 3-5 steps. Use 8-15 steps to explain thoroughly.
- Each step should explain ONE small piece, building understanding gradually.
- Start from the very basics ("What is it?", "Why does it exist?") before diving into how it works.
- Use analogies in every step (restaurants, libraries, traffic, schools, etc.)
- EVERY step MUST include "memory" showing the internal state (call stack, heap, output).
- EVERY step analyzing Javascript MUST include "v8Engine" to show what Chrome's V8 engine is doing under the hood (Parser -> AST -> Ignition -> TurboFan).
- Show how variables are created on the stack, how objects/arrays are allocated on the heap.
- Show function call frames being pushed/popped from the stack.
- Highlight new or modified values in heap arrays with highlight:true.
- Include practical code examples showing each piece.
- End with a "putting it all together" summary step.

Respond ONLY with valid JSON, no markdown wrapping, no backticks around the JSON.`;

export async function explainConcept(topic) {
    const ai = getAI();

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: `Explain this concept with a flowchart, step-by-step breakdown, and internal memory visualization showing call stack, heap memory, and execution flow: "${topic}"`,
        config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.7,
        },
    });

    const text = response.text.trim();

    // Try to parse the JSON, handling possible markdown wrapping
    let jsonStr = text;
    if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    try {
        const parsed = JSON.parse(jsonStr);
        return {
            id: 'ai-' + Date.now(),
            title: parsed.title,
            description: parsed.description,
            category: 'ai',
            icon: '🤖',
            difficulty: 'ai-generated',
            mermaid: parsed.mermaid,
            steps: parsed.steps,
        };
    } catch (err) {
        console.error('Failed to parse AI response:', err, '\nRaw:', text);
        throw new Error('The AI response could not be parsed. Please try again.');
    }
}
