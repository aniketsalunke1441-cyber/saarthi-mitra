import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import CabDriverDashboard from './CabDriverDashboard';
import PassengerDashboard from './PassengerDashboard';
import MechanicDashboard from './MechanicDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cab-driver-dashboard" element={<CabDriverDashboard />} />
      <Route path="/passenger-dashboard" element={<PassengerDashboard />} />
      <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
