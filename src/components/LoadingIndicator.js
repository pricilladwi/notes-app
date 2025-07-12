import anime from 'animejs';

class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .loading {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .loading.show {
          display: flex;
        }
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #e69db8;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
      <div class="loading">
        <div class="spinner"></div>
      </div>
    `;
  }

  show() {
    const loadingEl = this.shadowRoot.querySelector('.loading');
    loadingEl.classList.add('show');
    anime({
      targets: loadingEl,
      opacity: [0, 1],
      duration: 300,
      easing: 'easeInOutQuad',
    });
  }

  hide() {
    const loadingEl = this.shadowRoot.querySelector('.loading');
    anime({
      targets: loadingEl,
      opacity: [1, 0],
      duration: 300,
      easing: 'easeInOutQuad',
      complete: () => {
        loadingEl.classList.remove('show');
      },
    });
  }
}

customElements.define('loading-indicator', LoadingIndicator);
