import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Users, Trophy, LayoutDashboard, Moon, Sun, Zap } from 'lucide-react';
import EmployeesPage from './pages/EmployeesPage';
import RankingsPage  from './pages/RankingsPage';
import DashboardPage from './pages/DashboardPage';
import './styles/main.css';

function Sidebar({ dark, setDark }) {
  const navigate = useNavigate();
  const location = useLocation();
  const active   = path => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon"><span>RM</span></div>
        <span className="brand-name">Resource Hub</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">Main</div>
        <button className={`nav-item${active('/') ? ' active' : ''}`} onClick={() => navigate('/')}>
          <Users size={16} /><span>Employees</span>
        </button>
        <button className={`nav-item${active('/rankings') ? ' active' : ''}`} onClick={() => navigate('/rankings')}>
          <Trophy size={16} /><span>Rankings</span>
        </button>
        <button className={`nav-item${active('/dashboard') ? ' active' : ''}`} onClick={() => navigate('/dashboard')}>
          <LayoutDashboard size={16} /><span>Dashboard</span>
        </button>
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <button className="dark-toggle" onClick={() => setDark(d => !d)}>
          {dark ? <Sun size={15} /> : <Moon size={15} />}
          <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <div style={{ fontSize: 11, color: 'var(--text3)', padding: '0.75rem 0.5rem 0' }}>
          Resource Management v2.0
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  return (
    <div className={dark ? 'dark-mode' : ''}>
      <BrowserRouter>
        <div className="layout">
          <Sidebar dark={dark} setDark={setDark} />
          <main className="main">
            <Routes>
              <Route path="/"          element={<EmployeesPage />} />
              <Route path="/rankings"  element={<RankingsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </div>
  );
}
