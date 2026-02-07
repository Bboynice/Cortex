'use server';

import { openai } from '@/src/lib/ai-client';

export async function generateCodingChallenge() {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: `You are a coding mentor. Provide a short, one-sentence coding challenge for a React developer.` }],
        });

        return {
            success: true,
            challenge: response.choices[0].message.content,
        };
    } catch (error) {
        console.error('Error generating coding challenge:', error);
        return {
            success: false,
            error: 'Failed to fetch coding challenge',
        };
    }
}