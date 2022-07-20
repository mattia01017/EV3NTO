// worker per richiedere le immagini degli eventi
self.addEventListener('message', async e => {
    let res = await fetch(`http://${e.data.host}/api/img/${e.data.img}`);
    let data = await res.blob();

    self.postMessage({
        id: e.data.id,
        blob: data
    });
});