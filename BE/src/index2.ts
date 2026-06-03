import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Serve DASH assets from the `video` folder under /video
app.use('/video', express.static(path.join(process.cwd(), 'video')));

app.get('/video.mpd', (req: express.Request, res: express.Response) => {
  const filePath = path.join(process.cwd(), 'video', 'video.mpd');
  res.sendFile(filePath);
});

// Serve the Dash segmentation files
app.get('/video/:segment', (req: express.Request, res: express.Response) => {
  const segmentName = req.params.segment as string;
  const filePath = path.join(process.cwd(), 'video', segmentName);
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
