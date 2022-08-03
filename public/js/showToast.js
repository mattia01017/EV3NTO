// mostra il messaggio di credenziali errate
let toast = document.getElementById('toast');
if (toast) {
    new bootstrap.Toast(toast).show();
    console.log(toast);
}