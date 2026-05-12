import 'reflect-metadata';
import express, { Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = 3000;

let totalBytesSent = 0;

app.use((req, res, next) => {
  let bytesSent = 0;

  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);

  res.write = function (chunk: any, encoding?: any, callback?: any) {
    if (chunk) {
      bytesSent += Buffer.byteLength(chunk, encoding || 'utf8');
    }
    return originalWrite(chunk, encoding, callback);
  } as any;

  res.end = function (chunk?: any, encoding?: any, callback?: any) {
    if (chunk) {
      bytesSent += Buffer.byteLength(chunk, encoding || 'utf8');
    }
    totalBytesSent += bytesSent;
    console.log(`Bytes sent for this request: ${bytesSent}`);
    console.log(`Total bytes sent: ${totalBytesSent}`);
    return originalEnd(chunk, encoding, callback);
  } as any;
  next();
});

app.get('/video', (req, res) => {
  // const videoPath = path.join(__dirname, '/videos/Masha-and-the-Bear.mp4');
  const videoPath = path.join(process.cwd(), 'public/videos/Masha-and-the-Bear.mp4');
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    if (start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
      return;
    }
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
