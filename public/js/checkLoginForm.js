let loginForm = document.querySelector('#login-form');
var toast = new bootstrap.Toast(document.getElementById('toast'));

// effettua una richiesta POST con le credenziali utente e attende una risposta del
// server. Se il server risponde positivamente, torna alla pagina referrer, se esiste, altrimenti
// alla homepage del sito
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    e.stopPropagation();
    let {user, password} = loginForm.elements;
    let data = {
        'user': user.value,
        'password': password.value
    };
    
    // invia le credenziali in POST
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
            // se il server risponde positivamente alle credenziali
            if (data.ok) {
                // torna alla pagina precedente
                let referrer = sessionStorage.getItem('referrer');
                sessionStorage.removeItem('referrer')
                document.location.replace(referrer);
            } else {
                // mostra il messaggio di credenziali errate
                toast.show();
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