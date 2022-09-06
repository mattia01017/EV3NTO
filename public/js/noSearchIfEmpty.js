// impedisce la ricerca degli eventi con una query vuota
let searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', e => {
    if (!searchForm.querySelector('.form-control').value) {
        e.preventDefault();
        e.stopPropagation();
    } 
});