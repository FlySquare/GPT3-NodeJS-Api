import express, { Express, Request, Response } from 'express';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import {Api} from "./Services/api";
dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/getAnswer', (req: Request, res: Response) => {
    if(typeof req.body.query === "undefined" || req.body.query === ""){
        Api.showResult(true, res, "No query");
        return;
    }
    Api.getAnswer(req, res)
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});