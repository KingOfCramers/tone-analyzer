import fs from "fs";
import ToneAnalyzerV3, {
  Response,
  ToneAnalysis,
} from "ibm-watson/tone-analyzer/v3";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

import { JsonFileReader } from "./util";
import { IamAuthenticator } from "ibm-watson/auth";

const toneAnalyzer = new ToneAnalyzerV3({
  version: "2017-09-21",
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY as string,
  }),
  serviceUrl: process.env.URL,
});

interface Interview {
  title: string;
  link: string;
  id: { $oid: string };
  authorBureau: string;
  date: { $date: string };
  kind: "Interview";
  tags: string[];
  text: string;
  pompeoLines: string[];
  interviewerLines: string[];
}

interface InterviewWithSentiment extends Interview {
  sentiment: ToneAnalysis;
}

type SentimentData = {
  data: InterviewWithSentiment[];
};

const reader = new JsonFileReader(path.resolve(__dirname, "data.json"));
reader.read();

const data = reader.data as Interview[];

const analyze = async () => {
  // Setup results object and write to file before looping over all our data.
  const results = JSON.stringify({
    data: [],
  });

  try {
    fs.writeFileSync(path.resolve(__dirname, "result.json"), results, "utf-8");
  } catch (err) {
    console.error(`Could not write initial file.`);
    console.error(err);
    process.exit();
  }

  for (const interview of data) {
    const text = interview.pompeoLines.join(" ");
    //For development, to not exhaust our API calls, only get first four lines
    //for (const [i, text] of lines.entries()) {
    const toneParams = {
      toneInput: { text },
      content_type: "application/json",
    };

    let response: Response<ToneAnalysis>;
    try {
      response = await toneAnalyzer.tone(toneParams);
    } catch (err) {
      console.error(err);
      process.exit();
    }

    if (response.status === 200) {
      const toneAnalysisResult = response.result;
      const document: InterviewWithSentiment = {
        ...interview,
        sentiment: toneAnalysisResult,
      };

      fs.readFile(
        path.resolve(__dirname, "result.json"),
        "utf8",
        function readFileCallback(err, data) {
          if (err) {
            console.log(err);
          } else {
            const obj: SentimentData = JSON.parse(data); // Convert to object.
            obj.data.push(document); //add some data
            const json = JSON.stringify(obj); //convert it back to json
            try {
              fs.writeFileSync(
                path.resolve(__dirname, "result.json"),
                json,
                "utf8"
              );
              console.log("Wrote chunk to file");
            } catch (err) {
              console.error(`Could not write chunk to file.`);
              console.error(err);
            }
          }
        }
      );
    } else {
      console.error(`Failed to fetch with status code ${response.status}`);
      console.error(response.statusText);
    }
  }
};

analyze();
