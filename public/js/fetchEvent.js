var isPart;

// restituisce l'id dell'evento, specificato come parametro get
function getId() {
    let params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// disattiva il pulsante di partecipazione se l'evento è al completo
async function disablePartBtn() {
    let part = document.querySelector('#e-part').innerText;
    let maxPart = document.querySelector('#e-part-max').innerText;
    if (part == maxPart && !isPart) {
        document.querySelector('#part-btn').setAttribute('disabled', '');
    }
}

const eId = getId()

// worker per scaricare e renderizzare l'immagine dell'evento
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

var subscrBtn = document.querySelector('#part-btn');
var showPartBtn = document.querySelector('#show-part-btn');

// Aggiunge un event listener per il pulsante di visualizzazione partecipanti,
// se presente (utente loggato è proprietario dell'evento), per visualizzare un popup con
// i partecipanti
if (showPartBtn) {
    let partFetched = false;
    showPartBtn.addEventListener('click', async () => {
        // Lo scaricamento viene effettuato solamente quando il pulsante viene premuto
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
                partFetched = true;
            } else {
                let notice = document.createElement('p');
                notice.innerText = 'Nessun partecipante';
                notice.classList.add('text-center');
                partList.insertAdjacentElement("afterend", notice);
            }
        }
    })
}

// funzione di scaricamento e visualizzazione informazioni evento
async function fillCard() {
    let res = await fetch(`https://${window.location.host}/api/event/${eId}`);
    let data = await res.json();
    document.querySelector('#spinner').remove();
    if (!data.Errore) {
        w.postMessage({
            host: window.location.host,
            img: data.img
        });
        document.querySelector('#card-content').classList.remove('opacity-0');
        document.querySelector('#e-title').innerText = data.title;
        document.querySelector('#e-date').innerText = data.ddate;
        document.querySelector('#e-org').innerText = data.username;
        document.querySelector('#e-loc').innerText = data.location_name;
        let priv = document.querySelector('#e-priv');
        priv.innerText = data.priv ? 'No' : 'Sì';
        document.querySelector('#e-part').innerText = data.num_part;
        document.querySelector('#e-part-max').innerText = data.max_num_part;
        document.querySelector('#e-invcode').innerText = data.id;
        document.querySelector('#e-desc').innerText = data.descr;
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
        console.log(data);
        if (data.error) {
            let t = document.querySelector('#toast');
            new bootstrap.Toast(t).show();
        } else {
            isPart = !isPart;
            subscrBtn.classList.toggle('btn-success');
            subscrBtn.classList.toggle('btn-warning');
        }
        document.querySelector('#e-part').innerText = data.numPart;
        subscrBtn.innerText = isPart ? 'Rimuovi partecipazione' : 'Partecipa';
        disablePartBtn();
    });
}


fillCard().then(() => {
    if (subscrBtn) {
        disablePartBtn();
    }
});

if (subscrBtn) {
    partBtn()
}