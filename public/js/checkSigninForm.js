let form = document.getElementById('signin-form')

form.addEventListener('submit', (e) => {
    let flag = false
    let toasttext = document.getElementById('toast-text')
    let pwd = form.elements['password']
    let pwd2 = form.elements['password2']

    if (!form.checkValidity()) {
        e.preventDefault()
        e.stopPropagation()
        toasttext.innerText = 'Riempi correttamente tutti i campi'
        flag = true
    } else if (pwd.value != pwd2.value) {
        e.preventDefault()
        e.stopPropagation()
        toasttext.innerText = 'Le due password non coincidono'
        flag = true
    } else if (pwd.value.length <= 3) {
        e.preventDefault()
        e.stopPropagation()
        toasttext.innerText = 'Inserire una password di almeno 4 caratteri'
        flag = true
    }
    if (flag) {
        let toast = document.getElementById('toast')
        new bootstrap.Toast(toast).show()
        console.log(toast)
    }
})