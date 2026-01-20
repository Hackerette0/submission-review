import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/submissions';

function ContributorDashboard() {
  const [subs, setSubs] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [resubmitId, setResubmitId] = useState('');

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubs(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = { title, description: desc, fileUrl };
      if (resubmitId) payload.submissionId = resubmitId;

      await axios.post(API, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTitle(''); setDesc(''); setFileUrl(''); setResubmitId('');
      fetchSubs();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div>
      <h1>Contributor Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <h2>{resubmitId ? 'Resubmit' : 'New Submission'}</h2>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" required />
        <input value={fileUrl} onChange={e=>setFileUrl(e.target.value)} placeholder="File URL (optional)" />
        <button type="submit">Submit</button>
      </form>

      <h2>My Submissions</h2>
      <ul>
        {subs.map(s => (
          <li key={s._id}>
            <strong>{s.title}</strong> — v{s.version} — {s.status}
            {s.status === 'REJECTED' && s.version < 3 && (
              <button onClick={() => setResubmitId(s._id)}>Resubmit</button>
            )}
            {s.reviewComment && <p>Comment: {s.reviewComment}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContributorDashboard;