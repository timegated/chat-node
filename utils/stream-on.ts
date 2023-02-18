import { Readable, Transform } from "stream";

export const streamOn = (result: any) => {
    const readable = Readable.from(result);
    const delay = new Transform({
      transform(chunk, enc, cb) {
          console.log(chunk);
        setTimeout(cb, 100, null, chunk)
      },
    });
    return readable.pipe(delay);
  };