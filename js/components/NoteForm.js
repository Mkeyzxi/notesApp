class NoteForm extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._noteData = null;
        this._shadowRoot.innerHTML = `
            <style>
                  form {
                    display: grid;
                    gap: 10px;
                    background: white;
                    padding: 10px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    max-width: 100%;
                }
                label {
                    font-weight: bold;
                }
                input, textarea {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                .validation-message {
                    color: red;
                    font-size: 12px;
                    margin-top: 4px;
                }
                button {
                    background-color: #28a745;
                    color: white;
                    padding: 10px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    width: 200px;
                }
                button:hover {
                    background-color: #218838;
                }
                    .button-container {
				width:100%;
				display: flex;
				justify-content:center;
				align-items: center;
			}

                
			@media screen and (max-width: 600px) {
			button {
		width: 100% !important;
	}}
            </style>
            <form id="noteForm" novalidate>
                <label for="title">Judul Catatan:</label>
                <input type="text" id="title" name="title" required>
                <p class="validation-message" id="titleValidation"></p>

                <label for="body">Isi Catatan:</label>
                <textarea id="body" name="body" rows="4" required></textarea>
                <p class="validation-message" id="bodyValidation"></p>

                <div class="button-container">
                <button type="submit">Simpan</button>
                </div>
            </form>
        `;
        this._addEventListeners();
    }

    set noteData(data) {
        this._noteData = data;
        const form = this._shadowRoot.querySelector('#noteForm');
        form.title.value = data.title;
        form.body.value = data.body;
    }

    _addEventListeners() {
        const form = this._shadowRoot.querySelector('#noteForm');
        form.addEventListener('input', (event) => this._validateField(event.target));
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            let isValid = true;

            const fields = ['title', 'body'];
            fields.forEach(field => {
                const input = form[field];
                if (!this._validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                const noteData = {
                    title: form.title.value.trim(),
                    body: form.body.value.trim(),
                };

                this._createNoteAPI(noteData);
                form.reset();
            }
        });
    }

    _validateField(input) {
        const id = `${input.id}Validation`;
        let message = '';
        if (!input.value.trim()) {
            message = `${input.name} harus diisi`;
        }
        this._shadowRoot.querySelector(`#${id}`).textContent = message;
        return message === '';
    }

    async _createNoteAPI(noteData) {
        try {
            const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(noteData),
            });

            const result = await response.json();
            if (result.status === 'success') {
                this.dispatchEvent(new CustomEvent('note-submitted', {
                    detail: result.data,
                    bubbles: true,
                    composed: true
                }));
            } else {
                console.error('Gagal membuat catatan:', result.message);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat mengirim catatan:', error);
        }
    }
}

if (!customElements.get('note-form')) {
    customElements.define('note-form', NoteForm);
}
