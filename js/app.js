document.addEventListener('note-submitted', (event) => {
    document.querySelector('note-entries').addEntry(event.detail);
});
