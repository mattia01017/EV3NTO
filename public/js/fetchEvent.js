function getId() {
    let tk = window.location.href.split('/');
    return tk[tk.length-1];
}

let w = new Worker('/js/workers/imageFetcher.js');

w.addEventListener('message', e => {
    let imgblob = e.data.blob;
    let imgel = document.querySelector('#e-img');
    
    let objURL = URL.createObjectURL(imgblob);
    
    imgel.addEventListener('load', e => {
        URL.revokeObjectURL(objURL);
        document.querySelector('#img-spinner').remove();
    })
    
    imgel.setAttribute('src', objURL);
})



async function fillCard() {
    let res = await fetch(`https://${window.location.host}/api/event/${getId()}`);
    let data = await res.json();
    document.querySelector('#card-content').classList.remove('opacity-0');
    document.querySelector('#spinner').remove();
    w.postMessage({
        host: window.location.host,
        img: data.img
    });
    if (data) {
        document.querySelector('#e-title').innerText = data.title;
        document.querySelector('#e-date').innerText = data.ddate;
        document.querySelector('#e-org').innerText = data.username;
        document.querySelector('#e-loc').innerText = data.location_name;
        let priv = document.querySelector('#e-priv');
        priv.innerText = data.priv ? 'No' : 'Sì';
        document.querySelector('#e-part').innerText = data.num_part;
        document.querySelector('#e-invcode').innerText = data.inv_code;
        document.querySelector('#e-desc').innerText = data.descr;
    }
}

fillCard()