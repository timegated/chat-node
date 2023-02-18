import express from "express";
import {
  promptResponse,
  promptResponseStream,
} from "./openai";
import { Readable, Transform, finished } from "stream";

const app = express();
const PORT = 3002;

// util move out
const streamOn = (result: any) => {
  const readable = Readable.from(result);
  const delay = new Transform({
    transform(chunk, enc, cb) {
        console.log(chunk);
      setTimeout(cb, 100, null, chunk)
    },
  });
  return readable.pipe(delay);
};

app.get("/answer", async (req: express.Request, res: express.Response) => {
  try {
    const { prompt, prefixChoice, modelChoice } = req.query;
    if (!prompt) {
      res.status(400).send("Prompt is required for request");
    }
    console.log(prompt);
    const promptText = prompt ? String(prompt) : "";
    const prefix = prefixChoice ? Number(prefixChoice) : 0;
    const model = modelChoice ? String(modelChoice) : "text-davinci-002";

    const result = await promptResponse(promptText, prefix, model);

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send("Bad Request");
    throw error;
  }
});

app.get(
  "/stream",
  async (req: express.Request, res: express.Response, next) => {
    try {
      const { prompt, prefixChoice, modelChoice } = req.query;
      console.log(prompt, prefixChoice);
      if (!prompt) {
        res.status(400).send("Prompt is required for request");
        return;
      }
      const promptText = prompt ? String(prompt) : "";
      const prefix = prefixChoice ? Number(prefixChoice) : 0;
      const model = modelChoice ? String(modelChoice) : "text-davinci-002";
      const result = await promptResponseStream(promptText, prefix, model);
      const stream = streamOn(result);
      stream.pipe(res, { end: false });
      finished(stream, (err) => {
        if (err) {
          next(err);
          return;
        }
        res.end();
      });
    } catch (error) {
      // Logging at some point
      res.status(400).send("Bad Request");
      throw error;
    }
  }
);

app.listen(PORT, () => {
  console.log(`Openai experiment running on port: ${PORT}`);
});
