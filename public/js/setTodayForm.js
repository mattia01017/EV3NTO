// impedisce l'inserimento di data e ora precedenti a questo istante. Si aggiorna automaticamente ogni 30 secodni
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
setInterval(setToday, 30000);