import React, { useMemo, useRef, useState } from 'react';
import { Upload, Sparkles, Download, Trash2, FileText, Camera, AlertCircle } from 'lucide-react';

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
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  const [dataUrl, setDataUrl] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setImagePreview(result);
      setDataUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const processWithOCR = async () => {
    setError('');
    const input = fileRef.current;
    const file = input?.files?.[0];
    if (!file || !dataUrl) {
      setError('Please upload an image first.');
      return;
    }
    if (!backendUrl) {
      setError('Backend URL is not configured. Please set VITE_BACKEND_URL.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/ocr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: dataUrl }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Request failed with ${res.status}`);
      }
      const data = await res.json();
      const generated = (data.cards || []).map((c, idx) => ({ id: Date.now() + idx, q: c.q, a: c.a }));
      setCards((prev) => [...generated, ...prev]);
    } catch (e) {
      setError(e.message || 'OCR failed.');
    } finally {
      setLoading(false);
    }
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
              <Camera size={18} className="text-indigo-600" /> OCR from Image
            </h2>
            <p className="mt-1 text-sm text-slate-600">Upload an image of your notes. We will run OCR on the server and convert detected lines into Q&A flashcards.</p>
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
                  onClick={() => { setImagePreview(''); setDataUrl(''); if (fileRef.current) fileRef.current.value=''; }}
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

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={processWithOCR}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700 disabled:opacity-60"
              >
                {loading ? 'Processing…' : (<><Sparkles size={16} /> Generate Flashcards</>)}
              </button>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-rose-700">
                <AlertCircle size={18} />
                <div className="text-sm">
                  {error}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <FileText size={18} className="text-fuchsia-600" /> Flashcards ({stats.count})
            </h2>
            {cards.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">No flashcards yet. Upload an image and click Generate Flashcards.</p>
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
