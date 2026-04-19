import React from 'react';
import { X, Mail, Phone, Briefcase, Building2, Award } from 'lucide-react';

const BAR = ['fill-blue','fill-teal','fill-amber','fill-purple','fill-coral','fill-green'];
const STATUS_MAP = { ACTIVE: 'status-active', INACTIVE: 'status-inactive', ON_LEAVE: 'status-leave' };

export default function EmployeeProfileModal({ emp, onClose, onAddSkill }) {
  if (!emp) return null;
  const score = Math.round(emp.skillScore ?? 0);
  const topSkill = emp.skills?.length ? emp.skills.reduce((a,s) => s.proficiency > a.proficiency ? s : a) : null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-wide">
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.25rem'}}>
          <div style={{fontSize:11,fontWeight:600,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'.07em'}}>Employee Profile</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16}/></button>
        </div>

        {/* Profile hero */}
        <div className="profile-header">
          <div className={`profile-avatar avatar ${emp.avatarColor || 'av-blue'}`}>
            {emp.avatarInitials || emp.name?.slice(0,2).toUpperCase()}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:19,fontWeight:700,fontFamily:"'Sora',sans-serif",letterSpacing:'-0.3px'}}>{emp.name}</div>
            <div style={{fontSize:13,color:'var(--text2)',marginTop:2}}>{emp.role}</div>
            <div style={{display:'flex',gap:8,alignItems:'center',marginTop:8,flexWrap:'wrap'}}>
              <span className="emp-dept-badge" style={{display:'inline-flex',alignItems:'center',gap:4}}>
                <Building2 size={10}/>{emp.department}
              </span>
              <span className={`status-badge ${STATUS_MAP[emp.status] || 'status-active'}`}>
                <span style={{width:6,height:6,borderRadius:'50%',background:'currentColor',display:'inline-block'}}/>
                {emp.status?.replace('_',' ')}
              </span>
              {topSkill && (
                <span style={{fontSize:11,color:'var(--text3)',display:'inline-flex',alignItems:'center',gap:3}}>
                  <Award size={10}/> Top: {topSkill.skillName} {topSkill.proficiency}%
                </span>
              )}
            </div>
          </div>
          {/* Score ring */}
          <div style={{textAlign:'center',flexShrink:0}}>
            <div style={{
              width:68,height:68,borderRadius:'50%',
              background:`conic-gradient(#4f46e5 ${score * 3.6}deg, var(--surface3) 0)`,
              display:'flex',alignItems:'center',justifyContent:'center'
            }}>
              <div style={{width:50,height:50,borderRadius:'50%',background:'var(--surface)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
                <span style={{fontSize:14,fontWeight:800,color:'var(--accent)',lineHeight:1}}>{score}%</span>
                <span style={{fontSize:9,color:'var(--text3)'}}>score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        {(emp.email || emp.phone) && (
          <div className="info-grid" style={{gridTemplateColumns:'1fr 1fr'}}>
            {emp.email && (
              <div className="info-item">
                <div className="info-key" style={{display:'flex',alignItems:'center',gap:4}}><Mail size={10}/>Email</div>
                <div className="info-val" style={{fontSize:12,wordBreak:'break-all'}}>{emp.email}</div>
              </div>
            )}
            {emp.phone && (
              <div className="info-item">
                <div className="info-key" style={{display:'flex',alignItems:'center',gap:4}}><Phone size={10}/>Phone</div>
                <div className="info-val" style={{fontSize:12}}>{emp.phone}</div>
              </div>
            )}
          </div>
        )}

        {/* All skills */}
        <div style={{marginBottom:'0.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div className="section-title">All Skills ({emp.skills?.length ?? 0})</div>
          <button className="btn btn-primary btn-sm" onClick={() => { onAddSkill(emp); onClose(); }}>
            + Add Skill
          </button>
        </div>

        {emp.skills?.length > 0 ? (
          <div className="profile-all-skills">
            {[...emp.skills].sort((a,b) => b.proficiency - a.proficiency).map((s,i) => (
              <div key={s.id} style={{display:'flex',flexDirection:'column',gap:5}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <span style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{s.skillName}</span>
                    <span style={{fontSize:11,color:'var(--text3)',marginLeft:6,background:'var(--surface2)',padding:'1px 7px',borderRadius:20}}>{s.category}</span>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>{s.proficiency}%</span>
                </div>
                <div className="bar-track" style={{height:7}}>
                  <div className={`bar-fill ${BAR[i % BAR.length]}`} style={{width:`${s.proficiency}%`}} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{fontSize:13,color:'var(--text3)',textAlign:'center',padding:'1.5rem 0',fontStyle:'italic'}}>No skills assigned yet.</p>
        )}
      </div>
    </div>
  );
}
