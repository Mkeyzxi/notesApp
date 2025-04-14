import './js/components/NoteHeader.js'
import './js/components/NoteForm.js'
import './js/components/NoteFooter.js'
import './js/components/NoteEntries.js';
import notesData from './js/notes-data.js';

document.addEventListener('DOMContentLoaded', () => {
    const noteEntries = document.querySelector('note-entries');
    noteEntries.entries = notesData;
});