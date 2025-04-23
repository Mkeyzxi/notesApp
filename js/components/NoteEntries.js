class NoteEntries extends HTMLElement {
	constructor() {
		super();
		this._shadowRoot = this.attachShadow({ mode: 'open' });
		this._shadowRoot.innerHTML = `
		<style>
		  .grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 16px;
		  }
		  .entry {
			background: #f0f8ff;
			padding: 10px;
			border-radius: 8px;
			box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
			overflow-y: auto;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			box-sizing: border-box;
		  }
		  .entry h4 {
			margin: 0 0 6px;
			color: #1c5d99;
		  }
		  .entry p {
			margin: 8px 0;
		  }
		  .entry small {
			color: #555;
			font-style: italic;
		  }
		  button {
			background-color: #dc3545;
			color: white;
			padding: 5px;
			border: none;
			border-radius: 4px;
			cursor: pointer;
		  }
		  button:hover {
			background-color: #c82333;
		  }
		  .archive-button {
			background-color: #007bff;
			margin-left: 6px;
		  }
		  .archive-button:hover {
			background-color: #0056b3;
		  }
		  h3 {
			margin-top: 24px;
			color: #333;
		  }
		  .search-container {
			display: flex;
			gap: 8px;
			flex-wrap: wrap;
			margin-bottom: 12px;
		  }
		  #searchInput {
			flex-grow: 1;
			padding: 13px;
			border: 1px solid #ccc;
			border-radius: 4px;
			margin-top: 50px;
		  }
		  #searchBtn {
			padding: 8px 12px;
			border: none;
			background-color: #28a745;
			color: white;
			border-radius: 4px;
			cursor: pointer;
			margin-top: 50px;
		  }
		  #searchBtn:hover {
			background-color: #218838;
		  }
		  .no-data {
			text-align: center;
			color: #888;
			font-style: italic;
			grid-column: 1 / -1;
		  }
		  .button-container {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		  }
		  #buttonArchive {
			width: 200px;
			padding: 5px;
			height: 40px;
			background-color: #28a745;
			border: none;
			border-radius: 4px;
			cursor: pointer;
			color: white;
			margin: 20px 0;
		  }
		  @media screen and (max-width: 600px) {
			#buttonArchive {
			  width: 100% !important;
			}
		  }
		  #loading {
			text-align: center;
			padding: 16px;
			color: #1c5d99;
			font-weight: bold;
		  }
		</style>
		<div>
		<div class="search-container">
		<input type="text" id="searchInput" placeholder="Cari catatan..." />
		<button id="searchBtn">Cari</button>
		</div>
		<h3>Catatan Aktif</h3>
		<div id="loading" style="display: none;">Loading...</div>
		  <div class="grid" id="activeGrid"></div>
		  <div class="button-container"><button id="buttonArchive">Tampilkan Arsip</button></div>
		  <h3 id="archivedTitle" style="display: none;">Catatan Arsip</h3>
		  <div class="grid" id="archivedGrid" style="display: none;"></div>
		</div>
		`;

		this._allActiveEntries = [];
	}

	connectedCallback() {
		this._setupToggleArchiveButton();
		this._setupSearchFeature();
	}

	showLoading(isLoading) {
		this._shadowRoot.querySelector('#loading').style.display = isLoading ? 'block' : 'none';
	}

	_setupToggleArchiveButton() {
		const root = this._shadowRoot;
		const toggleButton = root.querySelector('#buttonArchive');
		const archiveTitle = root.querySelector('#archivedTitle');
		const archiveGrid = root.querySelector('#archivedGrid');

		toggleButton.addEventListener('click', () => {
			const isHidden = archiveGrid.style.display === 'none';
			archiveTitle.style.display = isHidden ? 'block' : 'none';
			archiveGrid.style.display = isHidden ? 'grid' : 'none';
			toggleButton.textContent = isHidden ? 'Sembunyikan Arsip' : 'Tampilkan Arsip';
		});
	}

	_setupSearchFeature() {
		const input = this._shadowRoot.querySelector('#searchInput');
		const button = this._shadowRoot.querySelector('#searchBtn');

		const performSearch = () => {
			const keyword = input.value.toLowerCase();
			const filtered = this._allActiveEntries.filter(entry =>
				entry.title.toLowerCase().includes(keyword) || entry.body.toLowerCase().includes(keyword)
			);
			this._renderEntries(filtered, 'activeGrid', false);
		};

		input.addEventListener('input', performSearch);
		button.addEventListener('click', performSearch);
		input.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') performSearch();
		});
	}

	set activeEntries(data) {
		this._allActiveEntries = data;
		this._renderEntries(data, 'activeGrid', false);
	}

	set archivedEntries(data) {
		this._renderEntries(data, 'archivedGrid', true);
	}

	_renderEntries(data, containerId, isArchived) {
		const container = this._shadowRoot.querySelector(`#${containerId}`);
		container.innerHTML = '';

		if (data.length === 0) {
			container.innerHTML = `<div class="no-data">Data tidak tersedia</div>`;
			return;
		}

		data.forEach(entry => {
			const div = document.createElement('div');
			div.classList.add('entry');
			div.setAttribute('data-id', entry.id);
			div.setAttribute('data-archived', entry.archived);
			div.innerHTML = `
				<div class="content">
					<h4>${entry.title}</h4>
					<p>${entry.body}</p>
					<small>${new Date(entry.createdAt).toLocaleString()}</small>
				</div>
				<div class="button-notes">
					<button class="delete-button">Delete</button>
					<button class="archive-button">${isArchived ? 'Unarchive' : 'Archive'}</button>
				</div>
			`;

			container.appendChild(div);

			gsap.from(div, { duration: 0.2, opacity: 0, y: 30, ease: 'power2.out' });
		});

		this._addEventListeners();
	}

	_addEventListeners() {
		const root = this._shadowRoot;

		root.querySelectorAll('.delete-button').forEach(button =>
			button.addEventListener('click', (e) => this._handleDelete(e))
		);

		root.querySelectorAll('.archive-button').forEach(button =>
			button.addEventListener('click', (e) => this._handleArchive(e))
		);
	}

	async _handleDelete(event) {
		const entry = event.target.closest('.entry');
		const id = entry.getAttribute('data-id');

		Swal.fire({
			title: 'Yakin ingin menghapus?',
			text: "Catatan ini akan dihapus permanen!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Ya, hapus!'
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}`, {
						method: 'DELETE',
					});
					const result = await response.json();
					if (result.status === 'success') {
						gsap.to(entry, {
							duration: 0.3,
							opacity: 0,
							y: -20,
							onComplete: () => entry.remove()
						});
						Swal.fire('Dihapus!', 'Catatan berhasil dihapus.', 'success');
					} else {
						Swal.fire('Gagal!', result.message, 'error');
					}
				} catch (error) {
					Swal.fire('Error!', 'Terjadi kesalahan saat menghapus.', 'error');
				}
			}
		});
	}

	async _handleArchive(event) {
		const entry = event.target.closest('.entry');
		const id = entry.getAttribute('data-id');
		const isArchived = entry.getAttribute('data-archived') === 'true';
		const endpoint = isArchived ? 'unarchive' : 'archive';

		try {
			const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}/${endpoint}`, {
				method: 'POST',
			});
			const result = await response.json();
			if (result.status === 'success') {
				this.dispatchEvent(new CustomEvent('note-updated', {
					bubbles: true,
					composed: true,
				}));
			} else {
				Swal.fire('Gagal!', result.message, 'error');
			}
		} catch (error) {
			Swal.fire('Error!', 'Terjadi kesalahan saat melakukan arsip.', 'error');
		}
	}
}

if (!customElements.get('note-entries')) {
	customElements.define('note-entries', NoteEntries);
}
