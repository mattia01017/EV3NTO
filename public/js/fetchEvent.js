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

var button = document.querySelector('#part-btn');

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
        if (button) {
            if (data.ispart) {
                button.classList.add('btn-warning');
                button.innerText = 'Rimuovi partecipazione';
            } else {
                button.classList.add('btn-success');
                button.innerText = 'Partecipa';
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
    button.addEventListener('click', async () => {
        let prev = button.innerText;
        button.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>';
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
        button.innerText = prev == 'Partecipa' ? 'Rimuovi partecipazione' : 'Partecipa';
        button.classList.toggle('btn-success');
        button.classList.toggle('btn-warning');
    });
}

fillCard();

if (button) {
    partBtn();
}