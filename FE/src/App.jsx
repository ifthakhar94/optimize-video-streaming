import './App.css';
import { useEffect, useRef } from 'react';
import dashjs from 'dashjs';

const DASH_MANIFEST_URL = 'http://localhost:3000/dash/video.mpd';

function App() {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = dashjs.MediaPlayer().create();
    if (videoRef.current) {
      player.initialize(videoRef.current, DASH_MANIFEST_URL, true);
    }
    return () => {
      player.reset();
    };
  }, []);

  return (
    <main className="app-shell">
      <section className="player-card">
        <h1>Demo Video Player</h1>
        <p>Play the demo video below with built-in controls.</p>
        <div className="video-frame">
          <video
            ref={videoRef}
            controls
            width="100%"
            crossOrigin="anonymous"
            poster="https://via.placeholder.com/960x540?text=Demo+Video"
          >
            Your browser does not support the HTML5 video tag.
          </video>
        </div>
      </section>
    </main>
  );
}

export default App;
