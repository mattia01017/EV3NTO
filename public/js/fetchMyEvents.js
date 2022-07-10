var ecard = document.querySelector('.event-card')
var mastercard = document.querySelector('.card-body')

async function fillCards() {
    let path
    if (window.location.pathname == '/profilo/miei') {
        path = '/api/myevents'
    } else {
        path = '/api/mypartecip'
    }
    let res = await fetch(`http://${window.location.host}${path}`)
    let data = await res.json(res)
    if (data[0]) {
        document.querySelectorAll('.event-btn').forEach(el => {
            el.removeAttribute('hidden')
        })
        data.forEach(event => {
            let nextcard = ecard.cloneNode(true)
            ecard.removeChild(ecard.querySelector('.d-flex'))
    
            ecard.querySelector('.event-title').innerText = event.title
            ecard.querySelector('.event-desc').innerText = event.descr
            ecard.querySelector('.event-date').innerText = event.ddate
            ecard.querySelector('.event-loc').innerText = event.location_name
            ecard.querySelector('.event-org').innerText = event.organizer
            ecard.querySelector('.det-btn').setAttribute('href', '/evento/' + event.id)
            let delbtn = ecard.querySelector('.del-btn')
            console.log(delbtn)
            if (delbtn) {
                delbtn.setAttribute('href', `${window.location.pathname}?delete=${event.id}`)
            }
            
            let partecip = ecard.querySelector('.event-part')
            partecip.innerText = 'Partecipanti: ' +  event.num_part
            if (event.max_num_part) {
                partecip.innerText += ' / ' + event.max_num_part
            }
    
    
            mastercard.appendChild(ecard)
            ecard = nextcard    
        })
    } else {
        while (ecard.childNodes.length > 1) {
            ecard.removeChild(ecard.firstChild)
        }
        let notice = document.createElement('h3')
        notice.classList.add('display-6','mt-3','mb-3')
        notice.innerText = 'Nessun evento presente'
        ecard.appendChild(notice)
    }
}

fillCards()
