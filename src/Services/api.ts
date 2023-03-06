import * as dotenv from 'dotenv'
import * as fs from "fs";
import {Request, Response} from "express";
const { performance } = require('perf_hooks');
dotenv.config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY || ''
});
const openai = new OpenAIApi(configuration);
export class Api {
    public static getAnswer(req: Request, res: Response): any {
        speakWithAI(req.body.query).then(r =>{
            this.showResult(req.body.query,1, res, r)
        });
    }

    public static showResult(askedQuery = '', status: number,res: Response, answerAndTime: any): void {
        res.status(status === 0 ? 500 : 200).json({
            data:{
                status: status,
                requestTime: answerAndTime[1],
                askedQuery,
                content: answerAndTime[0],
                date: new Date().getTime(),
            }
        });
    }
}


function saveAnswerToJsonFile(question = '', answer = '', responseTime = 0) {
    const filePath = 'logs/response.json';
    let data = [];
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        data = JSON.parse(fileContent ? fileContent : '[]');
    }
    data[data.length] = {
        "question": question,
        "answer": answer,
        "responseTime": responseTime
    };
    fs.writeFileSync(filePath, JSON.stringify(data));
}

async function speakWithAI(this: any, query: string){
    const startTime = performance.now()
    const completion = await openai.createCompletion({
        model: "text-davinci-001",
        prompt: query,
        temperature: 0.9,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6
    });
    const endTime = performance.now()
    await saveAnswerToJsonFile(query, completion.data.choices[0].text, endTime - startTime);
    return [completion.data.choices[0].text, endTime - startTime];
}