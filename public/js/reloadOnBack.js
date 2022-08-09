if (performance.getEntriesByType('navigation')[0].type == 'back_forward' && localStorage.getItem('reload')) {
    location.reload(true);
}
localStorage.clear('reload');