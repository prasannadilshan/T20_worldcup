import https from 'https';

const url = 'https://002.fclplayer.net/live/csstream2/playlist.m3u8?id=1002&pk=3bad08820212278e4f2cc060e2dc8858a276d1230c616f85d1ea77ea8738bc70';

https.get(url, (res) => {
    console.log('StatusCode:', res.statusCode);
    console.log('Headers:', res.headers);

    res.on('data', (d) => {
        // Check if it's a valid m3u8
        console.log('First 100 bytes:', d.toString().substring(0, 100));
        res.destroy();
    });
}).on('error', (e) => {
    console.error(e);
});
