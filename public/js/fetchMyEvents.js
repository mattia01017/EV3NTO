var ecard = document.querySelector('.event-card')
var mastercard = document.querySelector('.card-body')

async function fillCards() {
    let res = await fetch(`http://${window.location.host}/api/myevents`)
    let data = await res.json(res)
    data.forEach(event => {
        let nextcard = ecard.cloneNode(true)
        ecard.removeChild(ecard.querySelector('.d-flex'))

        ecard.querySelector('.event-title').innerText = event.title
        ecard.querySelector('.event-desc').innerText = event.descr
        ecard.querySelector('.event-date').innerText = event.ddate
        ecard.querySelector('.event-loc').innerText = event.location_name
        
        let partecip = ecard.querySelector('.event-part')
        partecip.innerText = event.num_part
        if (event.max_num_part) {
            partecip.innerText += ' / ' + event.max_num_part
        }


        mastercard.appendChild(ecard)
        ecard = nextcard    
    })
}

fillCards()