import ToneAnalyzer from "ibm-watson/tone-analyzer/v3";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

console.log(process.env.API_KEY);
console.log(process.env.URL);

import { IamAuthenticator } from "ibm-watson/auth";

const toneAnalyzer = new ToneAnalyzer({
  version: "2017-09-21",
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY as string,
  }),
  serviceUrl: process.env.URL,
});

const text =
  "Good morning everyone. I see that our quarter four metrics are lower than expected. I know we have had a tough year and moral is down. Can we think of ways to increase our performance next year";

const toneParams = {
  toneInput: { text: text },
  content_type: "application/json",
};

toneAnalyzer
  //@ts-ignore
  .tone(toneParams)
  .then((toneAnalysis) => {
    console.log(JSON.stringify(toneAnalysis, null, 2));
  })
  .catch((err) => {
    console.log("error:", err);
  });
