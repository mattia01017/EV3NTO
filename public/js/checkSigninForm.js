let form = document.getElementById('signin-form');
var toasttext = document.getElementById('toast-text');
var valid = true;

function stopAndToast(submitEvent, toastMessage) {
    submitEvent.preventDefault();
    submitEvent.stopPropagation();
    toasttext.innerText = toastMessage;
    valid = false;
}

// alla richiesta di invio dei dati nel form, controlla se i dati inseriti sono validi,
// in caso contrario mostra un messaggio di errore e impedisce l'invio
form.addEventListener('submit', (e) => {
    let flag = false;
    let pwd = form.elements['password'];
    let pwd2 = form.elements['password2'];
    let username = form.elements['user'];

    if (!form.checkValidity()) {
        stopAndToast(e, 'Riempire correttamente tutti i campi')
    } else if (pwd.value != pwd2.value) {
        stopAndToast(e, 'Le due password non coincidono');
    } else if (username.value.length <= 3) {
        stopAndToast(e, 'Inserire un username di almeno 4 caratteri');
    } else if (pwd.value.length <= 3) {
        stopAndToast(e, 'Inserire una password di almeno 4 caratteri');
    }
    if (!valid) {
        let toast = document.getElementById('toast2');
        new bootstrap.Toast(toast).show();
        console.log(toast);
    }
});