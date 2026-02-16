import https from 'https';

const url = 'https://001.fclplayer.net/live/csstream2/chunklist.m3u8?vidictid=205002627321&id=1002&pk=f4f02ccfaa3f2d53ac7aaefad38db1d480fc0e026112511a77502adce3250643';

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
