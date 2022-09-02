// impedisce l'inserimento di data e ora precedenti a questo istante
function setToday() {
    let d = new Date()
    document.getElementById('date')
        .setAttribute(
            'min', 
            d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + 
            String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
        );
}

setToday();

// aggiorna l'istante attuale ogni 30 secondi
setInterval(setToday, 30000);