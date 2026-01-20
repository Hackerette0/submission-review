import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/submissions';

function ReviewerDashboard() {
  const [subs, setSubs] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubs(res.data);
    } catch (err) {
      alert('Error loading submissions');
    }
  };

  const review = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/${id}/review`, { status, reviewComment: comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComment('');
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div>
      <h1>Reviewer Dashboard</h1>
      <ul>
        {subs.map(s => (
          <li key={s._id} style={{ margin: '20px 0', borderBottom: '1px solid #ccc' }}>
            <strong>{s.title}</strong> (v{s.version}) by {s.contributor?.username}
            <p>{s.description}</p>
            {s.fileUrl && <a href={s.fileUrl}>File</a>}
            <p>Status: <b>{s.status}</b></p>
            {s.status === 'PENDING' && (
              <div>
                <textarea 
                  value={comment} 
                  onChange={e=>setComment(e.target.value)} 
                  placeholder="Review comment (optional)" 
                />
                <button onClick={() => review(s._id, 'APPROVED')}>Approve</button>
                <button onClick={() => review(s._id, 'REJECTED')}>Reject</button>
              </div>
            )}
            {s.reviewComment && <p><i>Comment: {s.reviewComment}</i></p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReviewerDashboard;