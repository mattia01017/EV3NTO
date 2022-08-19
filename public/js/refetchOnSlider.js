let rangeform = document.querySelector('#rangeform');
let range = document.querySelector('#dist');
let rangeLabel = document.querySelector('#dist-val')
distParam = new URLSearchParams(window.location.search).get('dist');
if (distParam) {
    dist = distParam;
}
range.value = dist
rangeLabel.innerText = dist + 'km';
rangeform.addEventListener('change', e => {
    rangeform.submit();
})

range.addEventListener('input', e => {
    rangeLabel.innerText = range.value + 'km';
})