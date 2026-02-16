import { useRef } from 'react';
import videojs from 'video.js';
import VideoPlayer from './components/VideoPlayer';
import { Tv, Info } from 'lucide-react';
import './App.css';

function App() {
  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    html5: {
      vhs: {
        // overrideNative: true // Commented out to allow native HLS on mobile
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false
    },
    sources: [{
      src: 'https://002.fclplayer.net/live/csstream2/playlist.m3u8?id=1002&pk=3bad08820212278e4f2cc060e2dc8858a276d1230c616f85d1ea77ea8738bc70',
      type: 'application/x-mpegURL'
    }]
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <Tv className="logo-icon" size={32} />
            <h1 className="app-title">LiveStream<span className="accent">Pro</span></h1>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="player-wrapper">
          <div className="video-container">
            <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
          </div>
          <div className="stream-info">
            <div className="info-header">
              <div className="live-indicator">
                <span className="dot"></span> LIVE
              </div>
              <h2 className="stream-title">CS Stream 2 - Live Event</h2>
            </div>
            <p className="stream-description">
              <Info size={16} className="info-icon" />
              Experiencing the premium live streaming quality.
            </p>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 LiveStreamPro. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
