import React, { useEffect, useState, useCallback } from 'react';
import { Search, UserPlus, RefreshCw } from 'lucide-react';
import { getRankedEmployees, getDashboard, deleteEmployee, getDepartments } from '../services/api';
import MetricBar from '../components/MetricBar';
import EmployeeCard from '../components/EmployeeCard';
import AssignSkillModal from '../components/AssignSkillModal';
import AddEmployeeModal from '../components/AddEmployeeModal';
import EmployeeProfileModal from '../components/EmployeeProfileModal';

function Toast({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type === 'error' ? 'toast-error' : t.type === 'success' ? 'toast-success' : ''}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="emp-grid">
      {[0,1,2,3,4,5].map(i => (
        <div key={i} className="skeleton-card">
          <div style={{display:'flex',gap:12,marginBottom:16}}>
            <div className="skeleton" style={{width:46,height:46,borderRadius:14,flexShrink:0}}/>
            <div style={{flex:1}}>
              <div className="skeleton" style={{height:14,width:'60%',marginBottom:7}}/>
              <div className="skeleton" style={{height:11,width:'40%',marginBottom:7}}/>
              <div className="skeleton" style={{height:18,width:'30%',borderRadius:20}}/>
            </div>
          </div>
          {[0,1,2,3].map(j => (
            <div key={j} style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                <div className="skeleton" style={{height:10,width:'40%'}}/>
                <div className="skeleton" style={{height:10,width:'15%'}}/>
              </div>
              <div className="skeleton" style={{height:6,width:'100%',borderRadius:99}}/>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function EmployeesPage() {
  const [employees, setEmployees]       = useState([]);
  const [stats, setStats]               = useState({});
  const [departments, setDepartments]   = useState([]);
  const [activeDept, setActiveDept]     = useState('All');
  const [search, setSearch]             = useState('');
  const [sort, setSort]                 = useState('rank');
  const [loading, setLoading]           = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [skillTarget, setSkillTarget]   = useState(null);
  const [profileEmp, setProfileEmp]     = useState(null);
  const [showAdd, setShowAdd]           = useState(false);
  const [toasts, setToasts]             = useState([]);

  const addToast = (msg, type = '') => {
    const id = Date.now();
    setToasts(t => [...t, {id, msg, type}]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true); setMetricsLoading(true);
    try {
      const [ranked, dash, depts] = await Promise.all([getRankedEmployees(), getDashboard(), getDepartments()]);
      setEmployees(ranked); setStats(dash); setDepartments(depts);
    } catch (e) { addToast('Failed to load data', 'error'); }
    finally { setLoading(false); setMetricsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this employee?')) return;
    try { await deleteEmployee(id); addToast('Employee deleted.', ''); load(); }
    catch { addToast('Failed to delete.', 'error'); }
  }

  function handleSkillSaved(updated) {
    setEmployees(prev => prev.map(e => e.id === updated.id ? {...e, ...updated} : e));
    setSkillTarget(t => t ? {...t, ...updated} : null);
    addToast('Skill saved! ✓', 'success');
    load();
  }

  let list = employees.filter(e => {
    if (activeDept !== 'All' && e.department !== activeDept) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return e.name?.toLowerCase().includes(q) || e.role?.toLowerCase().includes(q) ||
           e.department?.toLowerCase().includes(q) || e.skills?.some(s => s.skillName?.toLowerCase().includes(q));
  });
  if (sort === 'name') list = [...list].sort((a,b) => a.name.localeCompare(b.name));
  else if (sort === 'dept') list = [...list].sort((a,b) => a.department.localeCompare(b.department));

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Employees</div>
          <div className="page-sub">{employees.length} team members · click any card to view full profile</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-secondary" onClick={load} title="Refresh"><RefreshCw size={14}/></button>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}><UserPlus size={14}/> Add Employee</button>
        </div>
      </div>

      <MetricBar stats={stats} loading={metricsLoading} />

      <div className="dept-pills">
        {['All', ...departments].map(d => (
          <button key={d} className={`dept-pill${activeDept === d ? ' active' : ''}`} onClick={() => setActiveDept(d)}>{d}</button>
        ))}
      </div>

      <div className="filters-row">
        <div className="search-wrap">
          <Search size={14} className="search-icon" />
          <input className="search-input" placeholder="Search by name, role, department, skill…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="rank">Sort by Rank</option>
          <option value="name">Sort by Name</option>
          <option value="dept">Sort by Department</option>
        </select>
      </div>

      {loading ? <SkeletonGrid /> :
        list.length === 0 ? <div className="empty">No employees found matching your filters.</div> :
        <div className="emp-grid">
          {list.map(emp => (
            <EmployeeCard key={emp.id} emp={emp}
              onAddSkill={setSkillTarget}
              onDelete={handleDelete}
              onClick={setProfileEmp} />
          ))}
        </div>
      }

      {profileEmp && (
        <EmployeeProfileModal emp={profileEmp} onClose={() => setProfileEmp(null)}
          onAddSkill={emp => { setProfileEmp(null); setSkillTarget(emp); }} />
      )}
      {skillTarget && (
        <AssignSkillModal employee={skillTarget} onClose={() => setSkillTarget(null)} onSaved={handleSkillSaved} />
      )}
      {showAdd && (
        <AddEmployeeModal onClose={() => setShowAdd(false)}
          onCreated={() => { setShowAdd(false); addToast('Employee created! ✓', 'success'); load(); }} />
      )}
      <Toast toasts={toasts} />
    </>
  );
}
