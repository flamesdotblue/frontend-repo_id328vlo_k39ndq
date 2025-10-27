import React, { useMemo, useRef, useState } from 'react';
import { Upload, Sparkles, Download, Trash2, FileText, Camera } from 'lucide-react';

function download(filename, text) {
  const element = document.createElement('a');
  const file = new Blob([text], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function Flashcard({ card, onDelete }) {
  return (
    <div className="group rounded-xl border bg-white p-4 shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">Question</p>
          <p className="mt-1 text-slate-800">{card.q}</p>
        </div>
        <button
          onClick={onDelete}
          className="hidden rounded-md p-2 text-slate-500 hover:bg-slate-100 group-hover:block"
          aria-label="Delete card"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="mt-3 rounded-lg bg-slate-50 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Answer</p>
        <p className="mt-1 text-slate-700">{card.a}</p>
      </div>
    </div>
  );
}

function OCRWorkspace() {
  const [imagePreview, setImagePreview] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [cards, setCards] = useState([]);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    // In this template we do not run OCR in-browser. Use the textarea to paste or edit text.
  };

  const parseToFlashcards = () => {
    // Simple heuristic: split by newline into facts. If text contains ':' use left as question and right as answer.
    const lines = extractedText
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);

    const generated = lines.map((line, idx) => {
      if (line.includes(':')) {
        const [q, ...rest] = line.split(':');
        return { id: Date.now() + idx, q: q.trim(), a: rest.join(':').trim() };
      }
      // Otherwise create a cloze-style question
      return { id: Date.now() + idx, q: `What is: ${line}?`, a: line };
    });

    setCards((prev) => [...prev, ...generated]);
  };

  const exportJSON = () => {
    download('flashcards.json', JSON.stringify(cards, null, 2));
  };

  const exportCSV = () => {
    const header = 'Question,Answer';
    const rows = cards.map((c) => `"${c.q.replaceAll('"', '""')}","${c.a.replaceAll('"', '""')}"`);
    download('flashcards.csv', [header, ...rows].join('\n'));
  };

  const stats = useMemo(() => ({ count: cards.length }), [cards]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Camera size={18} className="text-indigo-600" /> OCR Input
            </h2>
            <p className="mt-1 text-sm text-slate-600">Upload an image of notes or paste text below. The backend OCR can be wired later — this UI focuses on organizing your study material into flashcards.</p>
            <div className="mt-4 flex items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
              >
                <Upload size={16} /> Upload Image
              </button>
              {imagePreview && (
                <button
                  onClick={() => setImagePreview('')}
                  className="text-sm text-slate-600 underline"
                >
                  Remove image
                </button>
              )}
            </div>
            {imagePreview && (
              <div className="mt-4 overflow-hidden rounded-xl border">
                <img src={imagePreview} alt="Uploaded" className="max-h-72 w-full object-cover" />
              </div>
            )}

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">Text</label>
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder={`Example format:\nTerm: Definition\nPhotosynthesis: Process by which plants convert light into energy`}
                rows={8}
                className="w-full rounded-lg border bg-white p-3 text-sm shadow-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={parseToFlashcards}
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700"
              >
                <Sparkles size={16} /> Generate Flashcards
              </button>
              <button
                onClick={() => {
                  setExtractedText('');
                }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Clear Text
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <FileText size={18} className="text-fuchsia-600" /> Flashcards ({stats.count})
            </h2>
            {cards.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">No flashcards yet. Generate from your text to get started.</p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-3">
                {cards.map((c) => (
                  <Flashcard key={c.id} card={c} onDelete={() => setCards(cards.filter((x) => x.id !== c.id))} />
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={exportJSON}
                disabled={cards.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-900 disabled:opacity-50"
              >
                <Download size={16} /> Export JSON
              </button>
              <button
                onClick={exportCSV}
                disabled={cards.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow hover:bg-slate-300 disabled:opacity-50"
              >
                <Download size={16} /> Export CSV
              </button>
              {cards.length > 0 && (
                <button
                  onClick={() => setCards([])}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 size={16} /> Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OCRWorkspace;
