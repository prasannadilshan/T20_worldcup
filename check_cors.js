import https from 'https';

const url = 'https://002.fclplayer.net/live/csstream2/playlist.m3u8?id=1002&pk=3bad08820212278e4f2cc060e2dc8858a276d1230c616f85d1ea77ea8738bc70';

https.get(url, (res) => {
    console.log('StatusCode:', res.statusCode);
    console.log('Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
    console.log('Access-Control-Allow-Methods:', res.headers['access-control-allow-methods']);
    // Print all headers for debugging
    console.log('All Headers:', JSON.stringify(res.headers, null, 2));

    res.on('data', () => { });
}).on('error', (e) => {
    console.error(e);
});
