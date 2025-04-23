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
                    width: 100vw;
                    display: block;
                    margin-top:20px;
                    position: relative;
                    left:-50px;
                    bottom:0;
                    rignt: 0;
                    z-index:99;
                    
                }
                    @media screen and (max-width: 768px) {
                    footer {
                    left:0;} }
            </style>
            <footer>
                &copy; 2025 Notes App
            </footer>
        `;
    }
}
if (!customElements.get('note-footer')) {
    customElements.define('note-footer', NoteFooter);
}

