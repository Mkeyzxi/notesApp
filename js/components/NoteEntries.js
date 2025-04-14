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
                    padding: 16px;
                    border-radius: 8px;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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
            </style>

            <div>
                <h3>Daftar Catatan</h3>
                <div class="grid" id="entriesGrid"></div>
            </div>
        `;
    }

    set entries(data) {
        const grid = this._shadowRoot.querySelector('#entriesGrid');
        grid.innerHTML = '';
        data.forEach(entry => {
            grid.innerHTML += `
                <div class="entry">
                    <h4>${entry.title}</h4>
                    <p>${entry.body}</p>
                    <small>${new Date(entry.createdAt).toLocaleString()}</small>
                </div>`;
        });
    }

    addEntry(entryData) {
        const grid = this._shadowRoot.querySelector('#entriesGrid');
        const entryHTML = `
            <div class="entry">
                <h4>${entryData.title}</h4>
                <p>${entryData.body}</p>
                <small>${new Date(entryData.createdAt).toLocaleString()}</small>
            </div>`;
        grid.innerHTML += entryHTML;
    }
}

customElements.define('note-entries', NoteEntries);