import React from 'react';
import { Users, TrendingUp, Building2, Layers } from 'lucide-react';

const cards = [
  { key:'totalEmployees',   label:'Total Employees',  sub:'Across all teams',    icon:Users,       color:'#4f46e5' },
  { key:'avgSkillScore',    label:'Avg Skill Score',  sub:'Global average',      icon:TrendingUp,  color:'#0d9488', pct:true },
  { key:'totalDepartments', label:'Departments',      sub:'Active units',        icon:Building2,   color:'#f59e0b' },
  { key:'totalSkills',      label:'Skills Tracked',   sub:'Unique skill types',  icon:Layers,      color:'#8b5cf6' },
];

export default function MetricBar({ stats, loading }) {
  if (loading) return (
    <div className="metrics-grid">
      {[0,1,2,3].map(i => (
        <div key={i} className="metric-card">
          <div className="skeleton" style={{height:12,width:80,marginBottom:10}}/>
          <div className="skeleton" style={{height:30,width:60,marginBottom:8}}/>
          <div className="skeleton" style={{height:10,width:100}}/>
        </div>
      ))}
    </div>
  );

  return (
    <div className="metrics-grid">
      {cards.map(({ key, label, sub, icon: Icon, color, pct }) => (
        <div className="metric-card" key={key}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
            <div className="metric-label">{label}</div>
            <div style={{width:32,height:32,borderRadius:8,background:`${color}18`,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Icon size={16} style={{color}} />
            </div>
          </div>
          <div className="metric-value">{stats[key] != null ? (pct ? `${stats[key]}%` : stats[key]) : '—'}</div>
          <div className="metric-sub">{sub}</div>
        </div>
      ))}
    </div>
  );
}
