let form = document.getElementById('signin-form');
var toastText = document.getElementById('toast-text');
var valid = true;

function stopAndToast(toastMessage) {
    valid = false;
    toastText.innerText = toastMessage;
    let toast = document.getElementById('toast');
    new bootstrap.Toast(toast).show();
}

// alla richiesta di invio dei dati nel form, controlla se i dati inseriti sono validi,
// in caso contrario mostra un messaggio di errore e impedisce l'invio
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    let email = form.elements['email'];
    let pwd = form.elements['password'];
    let pwd2 = form.elements['password2'];
    let username = form.elements['user'];

    if (!form.checkValidity()) {
        stopAndToast('Riempire correttamente tutti i campi')
    } else if (pwd.value != pwd2.value) {
        stopAndToast('Le due password non coincidono');
    } else if (username.value.length <= 3) {
        stopAndToast('Inserire un username di almeno 4 caratteri');
    } else if (pwd.value.length <= 3) {
        stopAndToast('Inserire una password di almeno 4 caratteri');
    } else {
        let res = await fetch(
            `https://${window.location.host}/account/signin`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    email: email.value,
                    user: username.value,
                    password: pwd.value
                })
            }
        );
        let data = await res.json();
        if (!data.ok) {
            stopAndToast('Esiste già un account con questa email');
        }
    }
    if (valid) {
        document.location.replace('/profilo/miei');
    }
    valid = true;
});