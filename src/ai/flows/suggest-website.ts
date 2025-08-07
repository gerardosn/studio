'use server';
/**
 * @fileOverview An AI agent that suggests relevant websites to add based on user browsing habits or interests.
 *
 * - suggestWebsite - A function that suggests relevant websites.
 * - SuggestWebsiteInput - The input type for the suggestWebsite function.
 * - SuggestWebsiteOutput - The return type for the suggestWebsite function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestWebsiteInputSchema = z.object({
  userInterests: z
    .string()
    .describe(
      'A description of the users interests to be used to make website suggestions.'
    ),
});
export type SuggestWebsiteInput = z.infer<typeof SuggestWebsiteInputSchema>;

const SuggestWebsiteOutputSchema = z.object({
  suggestedWebsites: z
    .array(z.string())
    .describe('An array of suggested websites based on the user interests.'),
});
export type SuggestWebsiteOutput = z.infer<typeof SuggestWebsiteOutputSchema>;

export async function suggestWebsite(input: SuggestWebsiteInput): Promise<SuggestWebsiteOutput> {
  return suggestWebsiteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWebsitePrompt',
  input: {schema: SuggestWebsiteInputSchema},
  output: {schema: SuggestWebsiteOutputSchema},
  prompt: `You are a website suggestion expert. You will suggest websites based on the users interests.

  User Interests: {{{userInterests}}}

  Suggest websites that the user would be interested in. Return them as a JSON array of strings.`,
});

const suggestWebsiteFlow = ai.defineFlow(
  {
    name: 'suggestWebsiteFlow',
    inputSchema: SuggestWebsiteInputSchema,
    outputSchema: SuggestWebsiteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
