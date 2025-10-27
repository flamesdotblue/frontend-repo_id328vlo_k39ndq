import React, { useMemo, useState } from 'react';
import { Shield, Search, UserPlus, Trash2 } from 'lucide-react';

const seedUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'student' },
  { id: 3, name: 'Carlos Diaz', email: 'carlos@example.com', role: 'student' },
];

function AdminPanel() {
  const [users, setUsers] = useState(seedUsers);
  const [query, setQuery] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student' });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }, [users, query]);

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers((prev) => [{ id: Date.now(), ...newUser }, ...prev]);
    setNewUser({ name: '', email: '', role: 'student' });
  };

  const removeUser = (id) => setUsers(users.filter((u) => u.id !== id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <Shield size={18} className="text-rose-600" /> Admin Panel
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border bg-white px-3 py-2 shadow-sm focus-within:border-indigo-500">
              <Search size={16} className="text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users"
                className="ml-2 w-64 bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Total Users</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{users.length}</p>
          </div>
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Admins</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{users.filter(u => u.role === 'admin').length}</p>
          </div>
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Students</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{users.filter(u => u.role === 'student').length}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Create user</h3>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500"
              placeholder="Name"
            />
            <input
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500"
              placeholder="Email"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={addUser}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-black"
            >
              <UserPlus size={16} /> Add
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Email</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Role</th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2 text-sm text-slate-800">{u.name}</td>
                  <td className="px-4 py-2 text-sm text-slate-600">{u.email}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${u.role === 'admin' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end">
                      <button
                        onClick={() => removeUser(u.id)}
                        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
