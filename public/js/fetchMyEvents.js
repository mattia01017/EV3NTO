var ecard = document.querySelector('.event-card');
var mastercard = document.querySelector('.card-body');

function showError(message) {
    ecard.innerHTML = '';
    let notice = document.createElement('h3');
    notice.classList.add('display-6');
    notice.innerText = message;
    notice.classList.add('position-absolute', 'top-50', 'start-50', 'translate-middle');
    ecard.parentNode.append(notice);
}

function fetchEvents() {
    let path;
    switch (window.location.pathname) {
        case '/profilo/miei':
            path = '/api/myevents';
            fillCards(path);
            break;
        case '/profilo/partecipazioni':
            path = '/api/mypartecip';
            fillCards(path);
            break;
        case '/ricerca':
            let q = document.querySelector('#query').innerText;
            path = '/api/namesearch?q=' + q;
            fillCards(path);
            break;
        case '/ricerca/vicinanze':
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    path = `/api/geosearch?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&dist=15000`;
                    fillCards(path);
                });
            } else {
                showError('Il browser non supporta la geolocalizzazione');
            }
            break;
    }
}

// web worker per caricare e renderizzare le immagini degli eventi
var w = new Worker('/js/workers/imageFetcher.js');

w.addEventListener('message', e => {
    let imgblob = e.data.blob;
    let imgel = document.getElementById('img' + e.data.id);

    let objURL = URL.createObjectURL(imgblob);

    imgel.addEventListener('load', e => {
        URL.revokeObjectURL(objURL);
    })

    imgel.setAttribute('src', objURL);
    imgel.classList.remove('opacity-0');
    imgel.nextElementSibling.remove()
})

// richiede attraverso AJAX gli eventi e li mostra nella pagina
async function fillCards(path) {
    let res = await fetch(`https://${window.location.host}${path}`);
    let data = await res.json();
    console.log(data);
    if (data[0]) {
        document.querySelectorAll('.event-btn').forEach(el => {
            el.removeAttribute('hidden');
        })
        data.forEach(event => {
            let nextcard = ecard.cloneNode(true);
            ecard.removeChild(ecard.querySelector('.d-flex'));

            ecard.querySelector('.event-image').id = 'img' + event.id;
            w.postMessage({
                img: event.img,
                id: event.id,
                host: window.location.host
            });
            ecard.querySelector('.event-title').innerText = event.title;
            ecard.querySelector('.event-date').innerText = event.ddate;
            ecard.querySelector('.event-loc').innerText = event.location_name;
            ecard.querySelector('.event-org').innerText = event.organizer;
            ecard.querySelector('.det-btn').setAttribute('href', '/evento?id=' + event.id);
            ecard.querySelector('.img-spinner').classList.remove('opacity-0');
            let delbtn = ecard.querySelector('.del-btn');
            if (delbtn) {
                delbtn.setAttribute('href', `${window.location.pathname}?delete=${event.id}`);
            }

            let partecip = ecard.querySelector('.event-part');
            partecip.innerText = 'Partecipanti: ' + event.num_part;
            if (event.max_num_part) {
                partecip.innerText += ' / ' + event.max_num_part;
            }

            mastercard.appendChild(ecard);
            ecard = nextcard;
        })
    } else {
        showError('Nessun evento presente');
    }
}

fetchEvents();