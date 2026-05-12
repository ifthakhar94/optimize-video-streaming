import './App.css';

// const demoVideo = 'https://www.w3schools.com/html/mov_bbb.mp4';

function App() {
  return (
    <main className="app-shell">
      <section className="player-card">
        <h1>Demo Video Player</h1>
        <p>Play the demo video below with built-in controls.</p>
        <div className="video-frame">
          <video controls width="100%" poster="https://via.placeholder.com/960x540?text=Demo+Video">
            <source src="http://localhost:3000/video" type="video/mp4" />
            Your browser does not support the HTML5 video tag.
          </video>
        </div>
      </section>
    </main>
  );
}

export default App;
