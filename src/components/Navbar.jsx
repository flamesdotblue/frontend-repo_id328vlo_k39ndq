import React from 'react';
import { Home, Image as ImageIcon, Settings, Shield, User, LogOut } from 'lucide-react';

function Navbar({ onNavigate, current, onOpenAuth, isAuthenticated, user, onLogout }) {
  const navItem = (key, label, Icon) => (
    <button
      key={key}
      onClick={() => onNavigate(key)}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 ${
        current === key ? 'bg-white/15 text-white' : 'text-white/90'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-white shadow">
            <ImageIcon size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/90">Flashcard Generator</p>
            <h1 className="text-lg font-bold leading-none text-white">OCR Study Helper</h1>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItem('workspace', 'Workspace', Home)}
          {navItem('admin', 'Admin', Shield)}
          {navItem('settings', 'Settings', Settings)}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-white">
                <User size={16} />
                <span className="text-sm font-medium">{user?.name || 'User'}</span>
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/25"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow hover:bg-indigo-50"
            >
              <User size={16} /> Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
