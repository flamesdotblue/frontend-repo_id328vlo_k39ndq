import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import OCRWorkspace from './components/OCRWorkspace';
import AdminPanel from './components/AdminPanel';

function App() {
  const [current, setCurrent] = useState('workspace');
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  const isAuthenticated = !!user;

  const onNavigate = (key) => {
    if (key === 'admin' && !isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    setCurrent(key);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar
        current={current}
        onNavigate={onNavigate}
        onOpenAuth={() => setAuthOpen(true)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={() => setUser(null)}
      />

      {current === 'workspace' && (
        <>
          <section className="mx-auto max-w-6xl px-4 pt-8">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 p-8 text-white shadow-lg">
              <h2 className="text-2xl font-bold">Turn notes into study-ready flashcards</h2>
              <p className="mt-2 max-w-2xl text-white/90">Upload images of your class notes or paste text, then generate clean flashcards you can export and use anywhere. Smooth, simple, and beautifully organized.</p>
            </div>
          </section>
          <OCRWorkspace />
        </>
      )}

      {current === 'admin' && (
        isAuthenticated ? (
          <AdminPanel />
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-16 text-center">
            <p className="text-lg font-semibold text-slate-800">Please sign in to access the Admin Panel.</p>
            <button
              onClick={() => setAuthOpen(true)}
              className="mt-4 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700"
            >
              Sign in
            </button>
          </div>
        )
      )}

      {current === 'settings' && (
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Settings</h2>
            <p className="mt-2 text-sm text-slate-600">This is a visual template. You can wire actual preferences and OCR backend later.</p>
          </div>
        </div>
      )}

      <footer className="mt-16 border-t bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-600">
          Built for your Flashcard Generator project • Frontend template ready to connect with a Python backend (OCR + auth + admin)
        </div>
      </footer>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={(profile) => {
          setUser(profile);
          setAuthOpen(false);
        }}
      />
    </div>
  );
}

export default App;
