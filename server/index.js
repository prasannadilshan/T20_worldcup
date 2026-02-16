import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'https://t20-worldcup-dusky.vercel.app/',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Hardcoded stream URL (updated to match frontend original)
const STREAM_URL = 'https://002.fclplayer.net/live/csstream2/playlist.m3u8?id=1002&pk=3bad08820212278e4f2cc060e2dc8858a276d1230c616f85d1ea77ea8738bc70';

// Helper to get base URL
const getBaseUrl = (url) => {
    const parts = url.split('/');
    parts.pop();
    return parts.join('/');
};

app.get('/stream/playlist.m3u8', async (req, res) => {
    console.log('Received request for playlist');
    try {
        console.log(`Fetching from: ${STREAM_URL}`);
        const response = await axios.get(STREAM_URL, {
            responseType: 'text',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        });

        let playlist = response.data;
        const baseUrl = getBaseUrl(STREAM_URL);

        // Rewrite segment URLs to go through our proxy
        // This regex finds lines ending in .ts and prepends our proxy URL
        const lines = playlist.split('\n');
        const modifiedLines = lines.map(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith('#') && (trimmedLine.includes('.ts') || trimmedLine.includes('.aac') || trimmedLine.includes('.m4s'))) {
                // Check if it's already an absolute URL
                if (trimmedLine.startsWith('http')) {
                    return `/stream/proxy?url=${encodeURIComponent(trimmedLine)}`;
                } else {
                    // Resolve relative URL
                    const absoluteUrl = `${baseUrl}/${trimmedLine}`;
                    return `/stream/proxy?url=${encodeURIComponent(absoluteUrl)}`;
                }
            }
            // Handle nested playlists/variant streams if needed (usually .m3u8)
            if (line.trim().endsWith('.m3u8')) {
                if (line.startsWith('http')) {
                    // It's a full URL, but we might want to proxy it too? 
                    // For now, simpler to just proxy the main one. 
                    // Complexity: Recursive proxying. 
                    // Let's assume the main playlist just has TS segments for now or we redirect.
                    // If it's a master playlist, we need to rewrite these correctly too.
                    return `/stream/sub-playlist?url=${encodeURIComponent(line)}`;
                } else {
                    const absoluteUrl = `${baseUrl}/${line}`;
                    return `/stream/sub-playlist?url=${encodeURIComponent(absoluteUrl)}`;
                }
            }
            return line;
        });

        res.set('Content-Type', 'application/vnd.apple.mpegurl');
        res.send(modifiedLines.join('\n'));

    } catch (error) {
        console.error('Error fetching playlist:', error.message);
        res.status(500).send('Error fetching stream');
    }
});

app.get('/stream/sub-playlist', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('Missing url parameter');

    try {
        const response = await axios.get(url, {
            responseType: 'text',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        });

        const baseUrl = getBaseUrl(url);
        let playlist = response.data;

        const lines = playlist.split('\n');
        const modifiedLines = lines.map(line => {
            if (line.trim().endsWith('.ts') || line.trim().endsWith('.aac') || line.trim().endsWith('.m4s')) {
                if (line.startsWith('http')) {
                    return `/stream/proxy?url=${encodeURIComponent(line)}`;
                } else {
                    const absoluteUrl = `${baseUrl}/${line}`;
                    return `/stream/proxy?url=${encodeURIComponent(absoluteUrl)}`;
                }
            }
            if (line.trim().endsWith('.m3u8')) {
                // Nested recursion
                if (line.startsWith('http')) {
                    return `/stream/sub-playlist?url=${encodeURIComponent(line)}`;
                } else {
                    const absoluteUrl = `${baseUrl}/${line}`;
                    return `/stream/sub-playlist?url=${encodeURIComponent(absoluteUrl)}`;
                }
            }
            return line;
        });

        res.set('Content-Type', 'application/vnd.apple.mpegurl');
        res.send(modifiedLines.join('\n'));
    } catch (error) {
        console.error('Error fetching sub-playlist:', error.message);
        res.status(500).send('Error fetching sub-playlist');
    }
});


app.get('/stream/proxy', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('Missing url parameter');

    try {
        // console.log(`Proxying segment: ${url}`); // Verbose log
        const response = await axios.get(url, {
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        });

        // Forward headers like Content-Type
        if (response.headers['content-type']) {
            res.set('Content-Type', response.headers['content-type']);
        }

        response.data.pipe(res);
    } catch (error) {
        console.error('Error fetching segment:', error.message);
        console.error('Failed URL:', url);
        if (!res.headersSent) {
            res.status(500).send('Error fetching segment');
        }
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
