class NoteHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    position: fixed;
                    top: -1px;
                    left: 0;
                    right: 0;
                    background: #28a745;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    font-size: 1.5em;
                }
            </style>
            <header>
                Notes App 
            </header>
        `;
    }
}
if (!customElements.get('note-header')) {
    customElements.define('note-header', NoteHeader);
}
