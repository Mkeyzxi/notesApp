// class NoteForm extends HTMLElement {
//     constructor() {
//         super();
//         this._shadowRoot = this.attachShadow({ mode: 'open' });
//         this._shadowRoot.innerHTML = `
//             <style>
//                 form {
//                     display: grid;
//                     gap: 10px;
//                     background: white;
//                     padding: 20px;
//                     border-radius: 8px;
//                     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//                     max-width: 100%;
//                 }
//                 label {
//                     font-weight: bold;
//                 }
//                 input, textarea {
//                     width: 100%;
//                     padding: 8px;
//                     border: 1px solid #ccc;
//                     border-radius: 4px;
//                 }
//                 .validation-message {
//                     color: red;
//                     font-size: 12px;
//                     margin-top: 4px;
//                 }
//                 button {
//                     background-color: #28a745;
//                     color: white;
//                     padding: 10px;
//                     border: none;
//                     border-radius: 4px;
//                     cursor: pointer;
//                 }
//                 button:hover {
//                     background-color: #218838;
//                 }
//             </style>
//             <form id="noteForm" novalidate>
//                 <label for="tanggal">Tanggal & Waktu:</label>
//                 <input type="datetime-local" id="tanggal" name="tanggal" required>
//                 <p class="validation-message" id="tanggalValidation"></p>

//                 <label for="deskripsi">Deskripsi Aktivitas:</label>
//                 <textarea id="deskripsi" name="deskripsi" rows="3" required></textarea>
//                 <p class="validation-message" id="deskripsiValidation"></p>

//                 <label for="durasi">Durasi Kegiatan (menit):</label>
//                 <input type="number" id="durasi" name="durasi" required min="1">
//                 <p class="validation-message" id="durasiValidation"></p>

//                 <label for="hasil">Hasil atau Output:</label>
//                 <textarea id="hasil" name="hasil" rows="3" required></textarea>
//                 <p class="validation-message" id="hasilValidation"></p>

//                 <label for="catatan">Catatan Tambahan:</label>
//                 <textarea id="catatan" name="catatan" rows="3"></textarea>
//                 <button type="submit">Simpan</button>
//             </form>
//         `;
//         this._addEventListeners();
//     }

//     _addEventListeners() {
//         const form = this._shadowRoot.querySelector('#noteForm');
//         form.addEventListener('input', (event) => this._validateField(event.target));
//         form.addEventListener('submit', (event) => {
//             event.preventDefault();
//             let isValid = true;

//             const fields = ['tanggal', 'deskripsi', 'durasi', 'hasil'];
//             fields.forEach(field => {
//                 const input = form[field];
//                 if (!this._validateField(input)) {
//                     isValid = false;
//                 }
//             });

//             if (isValid) {
//                 this.dispatchEvent(new CustomEvent('note-submitted', {
//                     detail: {
//                         tanggal: form.tanggal.value.trim(),
//                         deskripsi: form.deskripsi.value.trim(),
//                         durasi: form.durasi.value.trim(),
//                         hasil: form.hasil.value.trim(),
//                         catatan: form.catatan.value.trim()
//                     },
//                     bubbles: true,
//                     composed: true
//                 }));
//                 form.reset();
//             }
//         });
//     }

//     _validateField(input) {
//         const id = `${input.id}Validation`;
//         let message = '';
//         if (!input.value.trim()) {
//             message = `${input.name} harus diisi`;
//         } else if (input.type === 'number' && parseInt(input.value) < 1) {
//             message = 'Durasi harus lebih dari 0';
//         }
//         this._shadowRoot.querySelector(`#${id}`).textContent = message;
//         return message === '';
//     }
// }
// customElements.define('note-form', NoteForm);

class NoteForm extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.innerHTML = `
            <style>
                form {
                    display: grid;
                    gap: 10px;
                    background: white;
                    padding: 20px;
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
                }
                button:hover {
                    background-color: #218838;
                }
            </style>
            <form id="noteForm" novalidate>
                <label for="title">Judul Catatan:</label>
                <input type="text" id="title" name="title" required>
                <p class="validation-message" id="titleValidation"></p>

                <label for="body">Isi Catatan:</label>
                <textarea id="body" name="body" rows="4" required></textarea>
                <p class="validation-message" id="bodyValidation"></p>

                <button type="submit">Simpan</button>
            </form>
        `;
        this._addEventListeners();
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
                this.dispatchEvent(new CustomEvent('note-submitted', {
                    detail: {
                        id: `note-${Date.now()}`,
                        title: form.title.value.trim(),
                        body: form.body.value.trim(),
                        createdAt: new Date().toISOString(),
                        archived: false
                    },
                    bubbles: true,
                    composed: true
                }));
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
}
customElements.define('note-form', NoteForm);
