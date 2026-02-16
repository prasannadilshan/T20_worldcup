import { useRef, useEffect } from 'react';
import videojs from 'video.js';
import VideoPlayer from './components/VideoPlayer';
import { Tv, Info } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { getStreamUrl } from './services/streamService';
import './App.css';

function App() {
  const playerRef = useRef<any>(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    html5: {
      vhs: {
        overrideNative: true,
        enableLowInitialPlaylist: true,
        // Increase timeout for mobile networks
        limitRenditionByPlayerDimensions: false,
        smoothQualityChange: true
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false
    },
    // Add timeouts to prevent premature errors on slow mobile networks
    inactivityTimeout: 0,
    sources: [] // Sources will be set dynamically
  };

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const url = await getStreamUrl();
        if (playerRef.current) {
          playerRef.current.src({
            src: url,
            type: 'application/x-mpegURL'
          });
        }
      } catch (error) {
        console.error('Error setting up stream:', error);
      }
    };

    fetchStream();
  }, []);

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    // Enhanced Error Handling & Retry Logic
    player.on('error', () => {
      const error = player.error();
      console.error('Video Player Error:', error);
      
      // Auto-retry after 3 seconds if it's a network error
      if (error && (error.code === 2 || error.code === 4)) {
        setTimeout(async () => {
          console.log('Attempting to reload stream...');
          try {
            // Re-fetch a FRESH URL on error (this fixes token expiration)
            const newUrl = await getStreamUrl();
            player.src({
              src: newUrl,
              type: 'application/x-mpegURL'
            });
            player.load();
            player.play();
          } catch (e) {
            console.error('Retry failed:', e);
          }
        }, 3000);
      }
    });

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
      <Analytics />
    </div>
  );
}

export default App;
