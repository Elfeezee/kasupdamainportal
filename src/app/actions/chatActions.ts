'use server';

import { chat } from '@/ai/flows/chat';

export async function submitChatMessage(history: { role: 'user' | 'model', content: string }[], question: string) {
    return await chat({ history, question });
}
