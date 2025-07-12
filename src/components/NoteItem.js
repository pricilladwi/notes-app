import anime from 'animejs';
import {
  deleteNoteFromAPI,
  archiveNote,
  unarchiveNote,
  showLoading,
  hideLoading,
} from './NoteUtils.js';

class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['id', 'title', 'body', 'created-at', 'archived'];
  }

  attributeChangedCallback() {
    this.render();
  }

  set noteData(data) {
    this.setAttribute('id', data.id);
    this.setAttribute('title', data.title);
    this.setAttribute('body', data.body);
    this.setAttribute('created-at', data.createdAt);
    this.setAttribute('archived', data.archived.toString());
  }

  render() {
    const isArchived = this.getAttribute('archived') === 'true';
    this.shadowRoot.innerHTML = `
      <style>
        .note {
          background: #fffece;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
          text-align: left;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 200px;
        }
        .note-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .note-body {
          flex-grow: 1;
          font-size: 15px;
          margin-bottom: 10px;
        }
        .note-date {
          font-size: 15px;
          color: gray;
        }
        .delete-note, .archive-note {
          border: none;
          padding: 5px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          margin-top: 10px;
        }
        .delete-note {
          background: #f38c79;
          color: black;
        }
        .delete-note:hover {
          background: #ffc1b4;
        }
        .archive-note {
          background: #4caf50;
          color: white;
          margin-left: 10px;
        }
        .archive-note:hover {
          background: #45a049;
        }
      </style>
      <div class="note">
        <h3 class="note-title">${this.getAttribute('title') || 'Untitled'}</h3>
        <p class="note-body">${this.getAttribute('body') || 'No content'}</p>
        <span class="note-date">${this.getAttribute('created-at') ? new Date(this.getAttribute('created-at')).toLocaleDateString() : 'Unknown date'}</span>
        <button class="delete-note">Hapus</button>
        <button class="archive-note">${isArchived ? 'Batal Arsip' : 'Arsip'}</button>
      </div>
    `;

    this.shadowRoot
      .querySelector('.delete-note')
      .addEventListener('click', async () => {
        try {
          showLoading();
          // Animasi fade-out sebelum menghapus
          await anime({
            targets: this,
            opacity: [1, 0],
            translateY: [0, 20],
            duration: 500,
            easing: 'easeInOutQuad',
          }).finished;
          await deleteNoteFromAPI(this.getAttribute('id'));
          this.remove();
        } catch (error) {
          alert(`Gagal menghapus catatan: ${error.message}`);
        } finally {
          hideLoading();
        }
      });

    this.shadowRoot
      .querySelector('.archive-note')
      .addEventListener('click', async () => {
        try {
          showLoading();
          const isArchived = this.getAttribute('archived') === 'true';
          // Animasi slide-out sebelum pindah
          await anime({
            targets: this,
            opacity: [1, 0],
            translateX: [0, isArchived ? -50 : 50],
            duration: 500,
            easing: 'easeInOutQuad',
          }).finished;

          if (isArchived) {
            await unarchiveNote(this.getAttribute('id'));
            this.remove();
            const notesContainer = document.querySelector('#notes-container');
            const noteElement = document.createElement('note-item');
            noteElement.noteData = {
              id: this.getAttribute('id'),
              title: this.getAttribute('title'),
              body: this.getAttribute('body'),
              createdAt: this.getAttribute('created-at'),
              archived: false,
            };
            notesContainer.prepend(noteElement);
            // Animasi fade-in untuk catatan yang baru dipindah
            anime({
              targets: noteElement,
              opacity: [0, 1],
              translateY: [-20, 0],
              duration: 500,
              easing: 'easeInOutQuad',
            });
          } else {
            await archiveNote(this.getAttribute('id'));
            this.remove();
            const archivedNotesContainer = document.querySelector(
              '#archived-notes-container'
            );
            const noteElement = document.createElement('note-item');
            noteElement.noteData = {
              id: this.getAttribute('id'),
              title: this.getAttribute('title'),
              body: this.getAttribute('body'),
              createdAt: this.getAttribute('created-at'),
              archived: true,
            };
            archivedNotesContainer.prepend(noteElement);
            // Animasi fade-in untuk catatan yang baru dipindah
            anime({
              targets: noteElement,
              opacity: [0, 1],
              translateY: [-20, 0],
              duration: 500,
              easing: 'easeInOutQuad',
            });
          }
        } catch (error) {
          alert(
            `Gagal ${isArchived ? 'membatalkan arsip' : 'mengarsipkan'} catatan: ${error.message}`
          );
        } finally {
          hideLoading();
        }
      });
  }
}

customElements.define('note-item', NoteItem);
