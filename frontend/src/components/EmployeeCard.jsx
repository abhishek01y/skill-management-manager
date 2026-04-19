import React from 'react';
import { Plus, X, ChevronRight } from 'lucide-react';

const BAR = ['fill-blue','fill-teal','fill-amber','fill-purple','fill-coral','fill-green'];
const rankLabel = r => r===1?'🥇 1st':r===2?'🥈 2nd':r===3?'🥉 3rd':`#${r}`;
const rankClass = r => `rank-badge ${r===1?'rank-1':r===2?'rank-2':r===3?'rank-3':'rank-n'}`;

export default function EmployeeCard({ emp, onAddSkill, onDelete, onClick }) {
  const score = Math.round(emp.skillScore ?? 0);

  return (
    <div className="emp-card" onClick={() => onClick(emp)}>
      <div className="emp-card-head">
        <div className={`avatar ${emp.avatarColor || 'av-blue'}`}>
          {emp.avatarInitials || emp.name?.slice(0,2).toUpperCase()}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div className="emp-name">{emp.name}</div>
          <div className="emp-role">{emp.role}</div>
          <span className="emp-dept-badge">{emp.department}</span>
        </div>
        {emp.rank != null && <span className={rankClass(emp.rank)}>{rankLabel(emp.rank)}</span>}
      </div>

      <div className="score-row">
        <span className="score-label">Skill Score</span>
        <span className="score-value">{score}%</span>
      </div>

      <div className="skills-list">
        {(emp.skills || []).slice(0,4).map((s,i) => (
          <div className="skill-row" key={s.id}>
            <div className="skill-top">
              <span className="skill-name">{s.skillName}</span>
              <span className="skill-pct">{s.proficiency}%</span>
            </div>
            <div className="bar-track">
              <div className={`bar-fill ${BAR[i % BAR.length]}`} style={{width:`${s.proficiency}%`}} />
            </div>
          </div>
        ))}
        {!emp.skills?.length && (
          <p style={{fontSize:12,color:'var(--text3)',fontStyle:'italic'}}>No skills assigned yet — click to add.</p>
        )}
        {emp.skills?.length > 4 && (
          <p style={{fontSize:11.5,color:'var(--text3)',textAlign:'right'}}>+{emp.skills.length - 4} more</p>
        )}
      </div>

      <div className="emp-card-footer">
        <span className="skill-count">{emp.skills?.length ?? 0} skill{emp.skills?.length !== 1 ? 's' : ''}</span>
        <div style={{display:'flex',gap:6}} onClick={e => e.stopPropagation()}>
          <button className="btn btn-ghost btn-sm" onClick={() => onAddSkill(emp)} title="Add Skill">
            <Plus size={13} /> Skill
          </button>
          <button className="btn btn-danger btn-icon" onClick={() => onDelete(emp.id)} title="Delete">
            <X size={13} />
          </button>
        </div>
      </div>

      <div style={{position:'absolute',bottom:14,right:56,opacity:0.25,transition:'opacity .2s'}} className="card-hint">
        <ChevronRight size={14} />
      </div>
    </div>
  );
}
