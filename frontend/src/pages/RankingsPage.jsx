import React, { useEffect, useState } from 'react';
import { getRankedEmployees, getDashboard } from '../services/api';
import RankTable from '../components/RankTable';
import MetricBar from '../components/MetricBar';
import EmployeeProfileModal from '../components/EmployeeProfileModal';

const BAR = ['fill-blue','fill-teal','fill-amber','fill-purple','fill-coral'];

export default function RankingsPage() {
  const [employees, setEmployees]       = useState([]);
  const [stats, setStats]               = useState({});
  const [topSkills, setTopSkills]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filterDept, setFilterDept]     = useState('All');
  const [depts, setDepts]               = useState([]);
  const [profileEmp, setProfileEmp]     = useState(null);

  useEffect(() => {
    Promise.all([getRankedEmployees(), getDashboard()])
      .then(([ranked, dash]) => {
        setEmployees(ranked); setStats(dash); setTopSkills(dash.topSkills || []);
        setDepts([...new Set(ranked.map(e => e.department))].sort());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterDept === 'All' ? employees : employees.filter(e => e.department === filterDept);
  const reranked = filtered.map((e, i) => ({...e, rank: i + 1}));

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Rankings</div>
          <div className="page-sub">Ranked by overall skill score · click any row to view profile</div>
        </div>
      </div>

      <MetricBar stats={stats} loading={loading} />

      {/* Top Skills Chart */}
      {topSkills.length > 0 && (
        <div className="chart-card" style={{marginBottom:'1.5rem'}}>
          <div className="chart-title">Top Skills by Average Proficiency</div>
          <div className="chart-sub">Across all employees</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {topSkills.map((s, i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:`var(--${['blue','teal','amber','purple','coral'][i]})`,flexShrink:0}}/>
                <span style={{fontSize:13,fontWeight:500,color:'var(--text)',width:160,flexShrink:0}}>{s.skill}</span>
                <div className="bar-track" style={{flex:1,height:8}}>
                  <div className={`bar-fill ${BAR[i]}`} style={{width:`${s.avgProficiency}%`}} />
                </div>
                <span style={{fontSize:13,fontWeight:700,width:42,textAlign:'right',color:'var(--text)'}}>{Math.round(s.avgProficiency)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dept filter */}
      <div className="dept-pills" style={{marginBottom:'1.25rem'}}>
        {['All', ...depts].map(d => (
          <button key={d} className={`dept-pill${filterDept === d ? ' active' : ''}`} onClick={() => setFilterDept(d)}>{d}</button>
        ))}
      </div>

      {loading ? <div className="loading">Loading rankings…</div>
        : <RankTable employees={reranked} onRowClick={setProfileEmp} />}

      {profileEmp && <EmployeeProfileModal emp={profileEmp} onClose={() => setProfileEmp(null)} onAddSkill={() => {}} />}
    </>
  );
}
