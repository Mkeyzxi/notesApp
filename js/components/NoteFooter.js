class NoteFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                footer {
                    background: #28a745;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    font-size: 1em;
                    width: 97.5vw;
                    display: block;
                }
            </style>
            <footer>
                &copy; 2025 Notes App
            </footer>
        `;
    }
}
customElements.define('note-footer', NoteFooter);
