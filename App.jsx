import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Fetch data
  useEffect(() => {
    fetch(`${API_URL}?_limit=5`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  // Add or Update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (editingId) {
      // Edit
      fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, title: input }),
      }).then(() => {
        setItems(items.map(item =>
          item.id === editingId ? { ...item, title: input } : item
        ));
        setEditingId(null);
        setInput('');
      });
    } else {
      // Add
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input }),
      })
        .then(res => res.json())
        .then(newItem => {
          setItems([...items, newItem]);
          setInput('');
        });
    }
  };

  // Delete
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' }).then(() => {
      setItems(items.filter(item => item.id !== id));
    });
  };

  // Edit
  const handleEdit = (item) => {
    setInput(item.title);
    setEditingId(item.id);
  };

  return (
    <div className="App">
      <h2>React CRUD App</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter item"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;