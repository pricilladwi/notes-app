import './styles/styles.css';
import './components/AppBar.js';
import './components/NoteInput.js';
import './components/NoteItem.js';
import './components/AppFooter.js';
import './components/LoadingIndicator.js';
import {
  fetchNotes,
  fetchArchivedNotes,
  createNoteElement,
  showLoading,
  hideLoading,
} from './components/NoteUtils.js';

window.addEventListener('DOMContentLoaded', async () => {
  const notesContainer = document.querySelector('#notes-container');
  const archivedNotesContainer = document.querySelector(
    '#archived-notes-container'
  );

  try {
    showLoading();

    // Muat catatan aktif
    const activeNotes = await fetchNotes();
    activeNotes.forEach((note) => {
      const noteElement = createNoteElement(note);
      notesContainer.appendChild(noteElement);
    });

    // Muat catatan arsip
    const archivedNotes = await fetchArchivedNotes();
    archivedNotes.forEach((note) => {
      const noteElement = createNoteElement(note);
      archivedNotesContainer.appendChild(noteElement);
    });
  } catch (error) {
    alert(`Gagal memuat catatan: ${error.message}`);
  } finally {
    hideLoading();
  }
});
