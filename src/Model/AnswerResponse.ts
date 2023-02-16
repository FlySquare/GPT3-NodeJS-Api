export class AnswerResponse {
    id: string;
    object: string;
    created: number;
    model: string;

    choices: {
        text: string;
        index: number;
        logprobs: any;
        finish_reason: string
    }
    usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number }

    prepare(input ?: any) {
        Object.assign(this, input);
        if (input.choices) {
            this.choices = input.choices[0];
        }
        return this;
    }
}