var ecard = document.querySelector('.event-card');
var mastercard = document.querySelector('.card-body');
var cleanMastercard = mastercard.cloneNode(true);
var delbtn = document.querySelector('#del-btn');
var dist = 15;

// Mostra un messaggio di errore all'interno della card al posto della
// lista eventi
function showError(message) {
    ecard.innerHTML = '';
    let notice = document.createElement('h3');
    notice.classList.add('display-6');
    notice.innerText = message;
    notice.classList.add('position-absolute', 'top-50', 'start-50', 'translate-middle');
    ecard.parentNode.append(notice);
}

// web worker per scaricare e renderizzare le immagini degli eventi
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
    if (data[0]) {
        document.querySelectorAll('.event-btn').forEach(el => {
            el.removeAttribute('hidden');
        });
        let today = new Date();
        let oldEvents = document.querySelector('#old-events');
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
            let d = new Date(event.ddate);
            ecard.querySelector('.event-date').innerText = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
            ecard.querySelector('.event-loc').innerText = event.location_name;
            ecard.querySelector('.event-org').innerText = event.organizer;
            ecard.querySelector('.det-btn').setAttribute('href', '/evento?id=' + event.id);
            ecard.querySelector('.img-spinner').classList.remove('opacity-0');

            if (delbtn) {
                let modalShowBtn = ecard.querySelector('.del-modal-trig');
                modalShowBtn.setAttribute('data-event-id', event.id);
                modalShowBtn.addEventListener('click', () => {
                    delbtn.setAttribute(
                        'href', 
                        '/profilo/miei?delete=' + modalShowBtn.getAttribute('data-event-id')
                    );
                });
            }

            let partecip = ecard.querySelector('.event-part');
            partecip.innerText = 'Partecipanti: ' + event.num_part;
            if (event.max_num_part) {
                partecip.innerText += ' / ' + event.max_num_part;
            }
            if (d < today) {
                oldEvents.appendChild(ecard)
            } else {
                mastercard.appendChild(ecard);
            }
            ecard = nextcard;
        });
        if (oldEvents.firstChild) {
            document.querySelector('#toggle-old').removeAttribute('hidden');
        }
    } else {
        showError('Nessun evento presente');
    }
}

// stabilisce la chiamata AJAX da effettuare in base agli eventi da richiedere (eventi nelle vicinanze, 
// eventi dell'utente,...) e richiama la funzione di scaricamento e visualizzazione a schermo degli eventi
// richiesti
var path;
switch (window.location.pathname) {
    // lista degli eventi di cui l'utente è proprietario
    case '/profilo/miei':
        path = '/api/myevents';
        fillCards(path);
        break;
    // lista delle partecipazioni
    case '/profilo/partecipazioni':
        path = '/api/mypartecip';
        fillCards(path);
        break;
    // ricerca testuale
    case '/ricerca':
        let q = document.querySelector('#query').innerText;
        path = '/api/namesearch?q=' + q;
        fillCards(path);
        break;
    // ricerca nelle vicinanze
    case '/ricerca/vicinanze':
        if (navigator.geolocation) {
            // la geolocalizzazione viene salvata in sessionStorage per evitare di richiederla a ogni ricaricamento
            // il valore salvato scade in un minuto
            let cachedGeoloc = sessionStorage.getItem('geoloc');
            let pos = cachedGeoloc? JSON.parse(cachedGeoloc) : null;
            if (!pos || pos.expires <= new Date().getTime()) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        sessionStorage.setItem(
                            'geoloc', 
                            JSON.stringify({
                                latitude: pos.coords.latitude,
                                longitude: pos.coords.longitude,
                                expires: new Date().getTime() + 60000
                            })
                        );
                        let params = new URLSearchParams(window.location.search);
                        let distParam = params.get('dist');
                        if (distParam) {
                            dist = distParam;
                        }
                        path = `/api/geosearch?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&dist=${dist * 1000}`;
                        fillCards(path);
                    },
                    (err) => {
                        console.error(err);
                        showError('Impossibile accedere alla posizione');
                    }
                );
            } else {
                path = `/api/geosearch?lat=${pos.latitude}&lon=${pos.longitude}&dist=${dist * 1000}`;
                fillCards(path);
            }
        } else {
            showError('Il browser non supporta la geolocalizzazione');
        }
        break;
}