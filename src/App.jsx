import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import CabDriverDashboard from './CabDriverDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cab-driver-dashboard" element={<CabDriverDashboard />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
