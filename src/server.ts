import express, { Express, Request, Response } from 'express';
import bodyParser from "body-parser";
import * as fs from "fs";
import * as https from "https";
import dotenv from 'dotenv';
import {Api} from "./Services/api";
dotenv.config();
const cors = require('cors');
const app: Express = express();
const port = process.env.PORT || 5152;
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));
const privateKey = fs.readFileSync( 'privkey.pem' );
const certificate = fs.readFileSync( 'cert.pem' );
app.post('/api/getAnswer', (req: Request, res: Response) => {
    if(typeof req.body.query === "undefined" || req.body.query === ""){
        Api.showResult('null',0, res, ["null", 0]);
        return;
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    Api.getAnswer(req, res)
});

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});