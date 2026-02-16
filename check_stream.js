import https from 'https';

const url = 'https://001.fclplayer.net/live/csstream2/chunklist.m3u8?vidictid=205002627321&id=1002&pk=f4f02ccfaa3f2d53ac7aaefad38db1d480fc0e026112511a77502adce3250643';

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
