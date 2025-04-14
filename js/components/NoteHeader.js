class NoteHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #28a745;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    font-size: 1.5em;
                    width: 100%;
                }
            </style>
            <header>
                Notes App 
            </header>
        `;
    }
}
customElements.define('note-header', NoteHeader);
