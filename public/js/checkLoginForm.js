let loginForm = document.querySelector('#login-form');
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
                localStorage.setItem('reload', true);
                history.back();
            } else {
                // mostra il messaggio di credenziali errate
                let toast = document.getElementById('toast');
                new bootstrap.Toast(toast).show();
                document.querySelector('#password').value = '';
            }
        })
    })
})