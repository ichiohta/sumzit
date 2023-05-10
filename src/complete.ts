import { Configuration, OpenAIApi } from "openai";

export type TCompleteConfig = {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
};

export const createComplete = ({ apiKey, model, maxTokens, temperature }: TCompleteConfig) => {
    const config = new Configuration({
        apiKey,
    });

    const api = new OpenAIApi(config);

    return async (prompt: string): Promise<string> => {
        const completion = await api.createCompletion({
            model,
            prompt,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            max_tokens: maxTokens,
            temperature,
        });

        return completion.data.choices[0].text ?? '';
    };
};
