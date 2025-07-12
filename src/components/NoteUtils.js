const BASE_URL = 'https://notes-api.dicoding.dev/v2';

async function handleResponse(response) {
  const result = await response.json();
  if (!result.error) {
    return result.data ?? result;
  }
  throw new Error(result.message);
}

export async function fetchNotes() {
  try {
    const response = await fetch(`${BASE_URL}/notes`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
}

export async function fetchArchivedNotes() {
  try {
    const response = await fetch(`${BASE_URL}/notes/archived`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching archived notes:', error);
    throw error;
  }
}

export async function addNoteToAPI(title, body) {
  try {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
}

export async function deleteNoteFromAPI(id) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}

export async function archiveNote(id) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: 'POST',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error archiving note:', error);
    throw error;
  }
}

export async function unarchiveNote(id) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: 'POST',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error unarchiving note:', error);
    throw error;
  }
}

export function createNoteElement(note) {
  const noteElement = document.createElement('note-item');
  noteElement.noteData = note;
  return noteElement;
}

export function showLoading() {
  const loader = document.querySelector('loading-indicator');
  if (loader) loader.show();
}

export function hideLoading() {
  const loader = document.querySelector('loading-indicator');
  if (loader) loader.hide();
}
