import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ContributorDashboard from './components/ContributorDashboard';
import ReviewerDashboard from './components/ReviewerDashboard';

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contributor" element={<ContributorDashboard />} />
        <Route path="/reviewer" element={<ReviewerDashboard />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;