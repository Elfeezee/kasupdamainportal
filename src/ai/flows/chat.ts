
'use server';
/**
 * @fileoverview A chatbot flow for answering questions about KASUPDA.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { knowledgeBase } from '@/lib/knowledge-base';

const ChatHistory = z.object({
    role: z.enum(['user', 'model']), 
    content: z.string()
});

const ChatInputSchema = z.object({
  history: z.array(ChatHistory),
  question: z.string(),
});

export const chat = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const {history, question} = input;

    const knowledgeContext = knowledgeBase.map(item => `Section: ${item.source}\nContent: ${item.content}`).join('\n\n---\n\n');

    const prompt = `You are a helpful and expert AI assistant for KASUPDA, the Kaduna State Urban Planning and Development Authority. Your role is to answer user questions based on the provided knowledge base about the KASUPDA digital portal and its regulations. Be friendly, concise, and professional.

Your knowledge base contains information from various sections of the website including: About Us, Permit Guidelines, Development Guidelines, FAQs, and more.

When answering, use the information from the knowledge base. If the user's question is directly answered, provide the answer. If the question is related but not directly answered, use the information to formulate a helpful response.

If the question is completely unrelated to KASUPDA, its services, or the provided information, you must politely state that you can only answer questions about KASUPDA. Do not attempt to answer off-topic questions.

Here is the knowledge base:
---
${knowledgeContext}
---

Now, please answer the following question based on the knowledge provided: ${question}
`;

    const response = await ai.generate({
      history: history.map(msg => ({ role: msg.role, content: [{ text: msg.content }] })),
      prompt: prompt,
    });
    
    return response.text;
  }
);
