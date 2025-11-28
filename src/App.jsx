import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import ScheduleAdmin from './pages/Admin/Schedule';
import DutyAdmin from './pages/Admin/Duty';
import FoodAdmin from './pages/Admin/Food';
import BirthdayAdmin from './pages/Admin/Birthdays';
import SpecificDaysAdmin from './pages/Admin/SpecificDays';
import PublicDisplay from './pages/Public/Display';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="schedule" element={<ScheduleAdmin />} />
          <Route path="duty" element={<DutyAdmin />} />
          <Route path="food" element={<FoodAdmin />} />
          <Route path="birthdays" element={<BirthdayAdmin />} />
          <Route path="specific-days" element={<SpecificDaysAdmin />} />
        </Route>
        <Route path="/display" element={<PublicDisplay />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/display" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
