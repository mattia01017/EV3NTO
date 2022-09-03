let rangeform = document.querySelector('#rangeform');
let range = document.querySelector('#dist');
let rangeLabel = document.querySelector('#dist-val');
distParam = new URLSearchParams(window.location.search).get('dist');

// posiziona lo slider rispetto al parametro GET
var dist = distParam? distParam : '15';
range.value = dist
rangeLabel.innerText = dist + 'km';

// invia una richiesta GET una volta spostato lo slider
rangeform.addEventListener('change', e => {
    rangeform.submit();
})

// aggiorna il valore mostrato durante lo spostamento dello slider
range.addEventListener('input', e => {
    rangeLabel.innerText = range.value + 'km';
})