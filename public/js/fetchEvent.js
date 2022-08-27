var isPart;
var maxNumPart;

// restituisce l'id dell'evento, specificato come parametro get
function getId() {
    let params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function createMap(lat, lon) {
    let map = L.map('map', {
        center: [lat,lon],
        zoom: 15
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([lat,lon]).addTo(map);
}

const eId = getId()

// worker per scaricare e renderizzare l'immagine dell'evento
const w = new Worker('/js/workers/imageFetcher.js');
w.addEventListener('message', e => {
    let imgblob = e.data.blob;
    let imgel = document.querySelector('#e-img');

    let objURL = URL.createObjectURL(imgblob);

    imgel.addEventListener('load', e => {
        URL.revokeObjectURL(objURL);
        document.querySelector('#img-spinner').remove();
        imgel.classList.remove('opacity-0');
    });

    imgel.setAttribute('src', objURL);
})

var subscrBtn = document.querySelector('#part-btn');
var showPartBtn = document.querySelector('#show-part-btn');

// Aggiunge un event listener per il pulsante di visualizzazione partecipanti,
// se presente (utente loggato è proprietario dell'evento), per visualizzare un popup con
// i partecipanti
if (showPartBtn) {
    let partFetched = false;
    showPartBtn.addEventListener('click', async () => {
        // Il caricamento dei partecipanti viene effettuato solamente una volta premuto il pulsante
        if (!partFetched) {
            let res = await fetch(`https://${window.location.host}/api/event/${eId}/partecipants`);
            let data = await res.json();
            document.querySelector('#modal-spinner').remove();
            let partList = document.querySelector('#part-list');
            if (data.length > 0) {
                data.forEach(user => {
                    let li = document.createElement('li');
                    li.innerText = `${user.username} - ${user.email}`;
                    partList.append(li);
                });
            } else {
                let notice = document.createElement('p');
                notice.innerText = 'Nessun partecipante';
                notice.classList.add('text-center');
                partList.insertAdjacentElement("afterend", notice);
            }
            partFetched = true;
        }
    })
}

// funzione di caricamento e visualizzazione a schermo delle informazioni evento
async function fillCard() {
    let res = await fetch(`https://${window.location.host}/api/event/${eId}`);
    let data = await res.json();
    document.querySelector('#spinner').remove();
    if (!data.Errore) {
        w.postMessage({
            host: window.location.host,
            img: data.img
        });
        createMap(data.loc_lat, data.loc_lon);
        document.querySelector('#card-content').classList.remove('opacity-0');
        document.querySelector('#e-title').innerText = data.title;
        let d = new Date(data.ddate);
        document.querySelector('#e-date').innerText = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
        document.querySelector('#e-org').innerText = data.username;
        document.querySelector('#e-loc').innerText = data.location_name;
        let priv = document.querySelector('#e-priv');
        priv.innerText = data.priv ? 'No' : 'Sì';
        let npart = document.querySelector('#e-part');
        npart.innerText = data.num_part;
        if (data.max_num_part) {
            maxNumPart = data.max_num_part;
            npart.innerText += ' / ' + data.max_num_part;
        }
        document.querySelector('#e-invcode').innerText = data.id;
        document.querySelector('#e-desc').innerText = data.descr == ''? 'nessuna descrizione fornita' : data.descr;
        let delBtn = document.querySelector('#del-ev-btn');
        if (delBtn) {
            delBtn.setAttribute('href', 'profilo/miei?delete=' + eId);
        }
        if (subscrBtn) {
            if (data.ispart) {
                isPart = true;
                subscrBtn.classList.add('btn-warning');
                subscrBtn.innerText = 'Rimuovi partecipazione';
            } else {
                isPart = false;
                subscrBtn.classList.add('btn-success');
                subscrBtn.innerText = 'Partecipa';
            }
            if ((data.num_part == data.max_num_part && !isPart) || new Date() > d) {
                document.querySelector('#part-btn').setAttribute('disabled', '');
            }
        }
    } else {
        let warning = document.createElement('h3');
        warning.innerText = 'L\'evento non esiste o è stato cancellato';
        warning.classList.add('display-4', 'position-absolute', 'top-50', 'start-50', 'translate-middle', 'text-center');

        let card = document.querySelector('.card');
        card.append(warning);
    }
}

// Aggiunge un event listener per il pulsante di partecipazione, se esiste (utente loggato e non proprietario
// dell'evento), per effettuare delle richieste POST asincrone al server e registrare la partecipazione o rimuoverla.
// Inoltre aggiorna la visualizzazione del pulsante in base allo stato di partecipante o non partecipante dell'utente.
async function partBtn() {
    subscrBtn.addEventListener('click', async () => {
        subscrBtn.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>';

        let body = {};
        body[(isPart ? 'remove' : 'add')] = eId;
        let res = await fetch(
            `https://${window.location.host}/api/event/${eId}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(body)
            }
        );
        let data = await res.json();

        // gestisce il caso in cui un altro utente prende l'ultimo posto, prima di un ricaricamento
        // della pagina. Mostra un toast di errore e disattiva il pulsante
        if (data.error) {
            document.querySelector('#toast-text').innerText = 'Impossibile partecipare. Evento al completo';
            let t = document.querySelector('#toast');
            new bootstrap.Toast(t).show();  
            document.querySelector('#part-btn').setAttribute('disabled', '');
        } else {
            isPart = !isPart;
            subscrBtn.classList.toggle('btn-success');
            subscrBtn.classList.toggle('btn-warning');
        }
        document.querySelector('#e-part').innerText = data.numPart + ' / ' + maxNumPart;
        subscrBtn.innerText = isPart ? 'Rimuovi partecipazione' : 'Partecipa';
        if (data.num_part == maxNumPart && !isPart) {
            document.querySelector('#part-btn').setAttribute('disabled', '');
        }
    });
}

fillCard();

if (subscrBtn) {
    partBtn();
}

document.querySelector('#copy-btn').addEventListener('click', () => {
    let invcode = document.querySelector('#e-invcode').innerText;
    navigator.clipboard.writeText(invcode);
    document.querySelector('#toast-text').innerText = 'Codice di invito copiato';
    let t = document.querySelector('#toast');
    new bootstrap.Toast(t).show(); 
})