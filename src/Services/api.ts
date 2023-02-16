import * as dotenv from 'dotenv'
import {Request, Response} from "express";
dotenv.config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export class Api {
    public static getAnswer(req: Request, res: Response): any {
        speakWithAI(req.body.query).then(r =>{
            this.showResult(false, res, r)
        });
    }

    public static showResult(error: boolean,res: Response, text: string): void {
        res.status(error ? 500 : 200).json({
            data:{
                status: error,
                time: new Date().getTime(),
                content: text
            }
        });
    }
}

async function speakWithAI(query: string){
    const completion = await openai.createCompletion({
        model: "text-davinci-001",
        prompt: query,
        temperature: 0.9,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6
    });
    return completion.data.choices[0].text;
}