document.addEventListener('DOMContentLoaded', () => {
	const noteEntries = document.querySelector('note-entries');
	const noteForm = document.querySelector('note-form');

	async function fetchNotes() {
		noteEntries.showLoading(true); 

		try {
			const [activeNotesRes, archivedNotesRes] = await Promise.all([
				fetch('https://notes-api.dicoding.dev/v2/notes'),
				fetch('https://notes-api.dicoding.dev/v2/notes/archived')
			]);

			const [activeNotes, archivedNotes] = await Promise.all([
				activeNotesRes.json(),
				archivedNotesRes.json()
			]);

			noteEntries.activeEntries = activeNotes.data;
			noteEntries.archivedEntries = archivedNotes.data;
		} catch (error) {
			console.error('Gagal mengambil data:', error);
		} finally {
			noteEntries.showLoading(false); 
		}
	}

	fetchNotes();
	setInterval(fetchNotes, 10000);

	noteEntries.addEventListener('edit-note', (event) => {
		noteForm.noteData = event.detail;
	});

	document.addEventListener('note-submitted', () => {
		fetchNotes();
	});

	noteEntries.addEventListener('note-updated', () => {
		fetchNotes();
	});
});
