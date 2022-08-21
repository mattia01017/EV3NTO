let loginForm = document.querySelector('#login-form');

// effettua una richiesta POST con le credenziali utente e attende una risposta del
// server. Se il server risponde positivamente, torna alla pagina referrer, se esiste, altrimenti
// alla homepage del sito
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    e.stopPropagation();
    let data = {}

    let formElems = [...loginForm.elements];
    formElems.forEach(element => {
        data[element.name] = element.value;
    });

    fetch(
        `https://${window.location.host}/account/login`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        }
    )
    .then((res) => {
        res.json()
        .then((data) => {
            if (data.ok) {
                let referrer = sessionStorage.getItem('referrer');
                sessionStorage.removeItem('referrer')
                document.location.replace(referrer);
            } else {
                // mostra il messaggio di credenziali errate
                let toast = document.getElementById('toast');
                new bootstrap.Toast(toast).show();
                document.querySelector('#password').value = '';
            }
        });
    });
});

// salva referrer per ritornare alla pagina precedente al login, in particolare
// per non perderlo in caso di selezione del link di registrazione dalla pagina di login e viceversa
if (!sessionStorage.getItem('referrer') || document.referrer != 'https://' + window.location.host + '/account/signin') {
    sessionStorage.setItem('referrer', document.referrer);
}