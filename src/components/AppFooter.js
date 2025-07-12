class AppFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          background-color: #e69db8;
          color: white;
          padding: 16px;
          text-align: center;
          font-size: 20px;
        }
      </style>
      <footer>
        <p>© 2025 Notes App | Pricilla Dwi Permata</p>
      </footer>
    `;
  }
}

customElements.define('app-footer', AppFooter);
