import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { NotesAPI } from './api';

// PUBLIC_INTERFACE
function App() {
  /**
   * Notes app with Ocean Professional theme.
   * Features:
   * - List notes
   * - View single note
   * - Create & Edit (title, content)
   * - Delete
   * - Loading & Error states
   * - Theme toggle
   */
  const [theme, setTheme] = useState('light');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formDraft, setFormDraft] = useState({ title: '', content: '' });
  const selectedNote = useMemo(() => notes.find(n => n.id === selectedId) || null, [notes, selectedId]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    setLoading(true);
    setError('');
    try {
      const data = await NotesAPI.list();
      setNotes(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load notes.');
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setFormDraft({ title: '', content: '' });
    setSelectedId(null);
    setShowForm(true);
  }

  function startEdit(note) {
    setFormDraft({ title: note.title || '', content: note.content || '' });
    setSelectedId(note.id);
    setShowForm(true);
  }

  async function handleDelete(note) {
    if (!window.confirm('Delete this note?')) return;
    setLoadingAction(true);
    setError('');
    try {
      await NotesAPI.remove(note.id);
      await loadNotes();
      if (selectedId === note.id) {
        setSelectedId(null);
      }
    } catch (e) {
      setError(e.message || 'Failed to delete note.');
    } finally {
      setLoadingAction(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      title: formDraft.title?.trim(),
      content: formDraft.content?.trim(),
    };
    if (!payload.title) {
      setError('Title is required.');
      return;
    }
    setLoadingAction(true);
    setError('');
    try {
      if (selectedId) {
        await NotesAPI.update(selectedId, payload);
      } else {
        await NotesAPI.create(payload);
      }
      setShowForm(false);
      setFormDraft({ title: '', content: '' });
      await loadNotes();
    } catch (e) {
      setError(e.message || 'Failed to save note.');
    } finally {
      setLoadingAction(false);
    }
  }

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="brand">
          <div className="brand-dot" />
          <h1 className="brand-title">Ocean Notes</h1>
        </div>
        <div className="header-actions">
          <button className="btn secondary" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button className="btn primary" onClick={startCreate}>＋ New Note</button>
        </div>
      </header>

      <main className="container">
        {error && <div className="alert error" role="alert">{error}</div>}

        <section className="content">
          <div className="notes-list">
            <div className="section-header">
              <h2>Notes</h2>
              <button className="btn link" onClick={loadNotes} disabled={loading}>↻ Refresh</button>
            </div>
            {loading ? (
              <div className="skeleton-list">
                <div className="skeleton-card" />
                <div className="skeleton-card" />
                <div className="skeleton-card" />
              </div>
            ) : notes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p>No notes yet. Create your first note.</p>
              </div>
            ) : (
              <ul className="card-list" aria-live="polite">
                {notes.map(note => (
                  <li key={note.id} className={`card ${selectedId === note.id ? 'selected' : ''}`}>
                    <button className="card-main" onClick={() => setSelectedId(note.id)}>
                      <h3 className="card-title">{note.title || 'Untitled'}</h3>
                      <p className="card-snippet">{(note.content || '').slice(0, 120) || 'No content'}</p>
                    </button>
                    <div className="card-actions">
                      <button className="btn tiny" onClick={() => startEdit(note)} title="Edit">✎</button>
                      <button className="btn tiny danger" onClick={() => handleDelete(note)} disabled={loadingAction} title="Delete">🗑</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="note-detail">
            {showForm ? (
              <div className="panel">
                <div className="section-header">
                  <h2>{selectedId ? 'Edit Note' : 'New Note'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="form">
                  <label className="label">
                    Title
                    <input
                      className="input"
                      type="text"
                      value={formDraft.title}
                      onChange={(e) => setFormDraft(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter a title"
                      required
                    />
                  </label>
                  <label className="label">
                    Content
                    <textarea
                      className="textarea"
                      rows="10"
                      value={formDraft.content}
                      onChange={(e) => setFormDraft(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your note..."
                    />
                  </label>
                  <div className="form-actions">
                    <button type="button" className="btn" onClick={() => { setShowForm(false); setFormDraft({ title: '', content: '' }); }}>Cancel</button>
                    <button type="submit" className="btn primary" disabled={loadingAction}>{selectedId ? 'Save Changes' : 'Create Note'}</button>
                  </div>
                </form>
              </div>
            ) : selectedNote ? (
              <div className="panel">
                <div className="section-header">
                  <h2>{selectedNote.title || 'Untitled'}</h2>
                  <div className="header-actions">
                    <button className="btn" onClick={() => startEdit(selectedNote)}>Edit</button>
                    <button className="btn danger" onClick={() => handleDelete(selectedNote)} disabled={loadingAction}>Delete</button>
                  </div>
                </div>
                <article className="note-content">
                  {selectedNote.content ? (
                    <pre className="note-pre">{selectedNote.content}</pre>
                  ) : (
                    <p className="muted">No content.</p>
                  )}
                </article>
              </div>
            ) : (
              <div className="panel placeholder">
                <p>Select a note to view, or create a new one.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p className="muted">API: {process.env.REACT_APP_API_BASE || 'http://localhost:3001'}</p>
      </footer>
    </div>
  );
}

export default App;
