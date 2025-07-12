import anime from 'animejs';
import {
  addNoteToAPI,
  createNoteElement,
  showLoading,
  hideLoading,
} from './NoteUtils.js';

class NoteInput extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form id="note-form">
        <input type="text" id="note-title" placeholder="Judul catatan" required>
        <small id="title-error" class="error-message"></small>
        <textarea id="note-body" placeholder="Isi catatan" required></textarea>
        <small id="body-error" class="error-message"></small>
        <button type="submit" disabled>Tambah Catatan</button>
      </form>
    `;

    this.titleInput = this.querySelector('#note-title');
    this.bodyInput = this.querySelector('#note-body');
    this.titleError = this.querySelector('#title-error');
    this.bodyError = this.querySelector('#body-error');
    this.submitButton = this.querySelector('button');

    this.titleInput.addEventListener('input', () => this.validateInput());
    this.bodyInput.addEventListener('input', () => this.validateInput());
    this.querySelector('#note-form').addEventListener(
      'submit',
      this.addNote.bind(this)
    );
  }

  validateInput() {
    const title = this.titleInput.value.trim();
    const body = this.bodyInput.value.trim();
    let isValid = true;

    if (title.length < 3) {
      this.titleError.textContent = 'Judul minimal 3 karakter';
      isValid = false;
    } else {
      this.titleError.textContent = '';
    }

    if (body.length < 5) {
      this.bodyError.textContent = 'Isi catatan minimal 5 karakter';
      isValid = false;
    } else {
      this.bodyError.textContent = '';
    }

    this.submitButton.disabled = !isValid;
  }

  async addNote(event) {
    event.preventDefault();
    const title = this.titleInput.value;
    const body = this.bodyInput.value;

    try {
      showLoading();
      const newNote = await addNoteToAPI(title, body);
      const notesContainer = document.querySelector('#notes-container');
      const noteElement = createNoteElement(newNote);
      notesContainer.prepend(noteElement);

      // Animasi fade-in untuk catatan baru
      anime({
        targets: noteElement,
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 500,
        easing: 'easeInOutQuad',
      });

      this.querySelector('#note-form').reset();
      this.submitButton.disabled = true;
    } catch (error) {
      alert(`Gagal menambahkan catatan: ${error.message}`);
    } finally {
      hideLoading();
    }
  }
}

customElements.define('note-input', NoteInput);
