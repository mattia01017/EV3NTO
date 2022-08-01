function getId() {
    let params = new URLSearchParams(window.location.search);
    return params.get('id');
}

const eId = getId()

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
if (showPartBtn) {
    let partFetched = false;
    showPartBtn.addEventListener('click', async () => {
        if (!partFetched) {
            let res = await fetch(`https://${window.location.host}/api/event/${eId}/partecipants`);
            let data = await res.json();
            document.querySelector('#modal-spinner').remove();
            let partList = document.querySelector('#part-list');
            data.forEach(user => {
                let li = document.createElement('li');
                li.innerText = `${user.username} - ${user.email}`;
                partList.append(li);
            });
            partFetched = true;
        }
    })
}

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
        document.querySelector('#e-invcode').innerText = data.id;
        document.querySelector('#e-desc').innerText = data.descr;
        let delBtn = document.querySelector('#del-ev-btn');
        if (delBtn) {
            delBtn.setAttribute('href', 'profilo/miei?delete=' + eId);
        }
        if (subscrBtn) {
            if (data.ispart) {
                subscrBtn.classList.add('btn-warning');
                subscrBtn.innerText = 'Rimuovi partecipazione';
            } else {
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

async function partBtn() {
    subscrBtn.addEventListener('click', async () => {
        let prev = subscrBtn.innerText;
        subscrBtn.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>';
        if (prev == 'Partecipa') {
            await fetch(
                `https://${window.location.host}/api/event/${eId}`,
                { 
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({add: eId})
                }
            );
        } else {
            await fetch(
                `https://${window.location.host}/api/event/${eId}`,
                { 
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({remove: eId})
                }
            );
        }
        subscrBtn.innerText = prev == 'Partecipa' ? 'Rimuovi partecipazione' : 'Partecipa';
        subscrBtn.classList.toggle('btn-success');
        subscrBtn.classList.toggle('btn-warning');
    });
}

fillCard();

if (subscrBtn) {
    partBtn();
}