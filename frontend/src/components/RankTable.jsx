import React from 'react';

const rankLabel = r => r===1?'🥇':r===2?'🥈':r===3?'🥉':`#${r}`;
const rankClass = r => `rank-badge ${r===1?'rank-1':r===2?'rank-2':r===3?'rank-3':'rank-n'}`;

export default function RankTable({ employees, onRowClick }) {
  if (!employees?.length) return <p className="empty">No employees to rank yet.</p>;
  return (
    <div className="rank-table-wrap">
      <table className="rank-table">
        <thead>
          <tr>
            <th>Rank</th><th>Employee</th><th>Department</th>
            <th>Score</th><th>Progress</th><th>Top Skill</th><th>Skills</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => {
            const score = Math.round(emp.skillScore ?? 0);
            const top = emp.skills?.length ? emp.skills.reduce((a,s) => s.proficiency > a.proficiency ? s : a) : null;
            return (
              <tr key={emp.id} onClick={() => onRowClick?.(emp)}>
                <td><span className={rankClass(emp.rank)}>{rankLabel(emp.rank)}</span></td>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div className={`avatar avatar-sm ${emp.avatarColor || 'av-blue'}`}>
                      {emp.avatarInitials || emp.name?.slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{fontWeight:600,fontSize:13.5}}>{emp.name}</div>
                      <div style={{fontSize:11.5,color:'var(--text2)'}}>{emp.role}</div>
                    </div>
                  </div>
                </td>
                <td><span className="emp-dept-badge">{emp.department}</span></td>
                <td>
                  <span style={{fontWeight:700,fontSize:15,background:'linear-gradient(135deg,#4f46e5,#7c3aed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                    {score}%
                  </span>
                </td>
                <td>
                  <div className="mini-bar-wrap">
                    <div className="mini-bar-fill" style={{width:`${score}%`}} />
                  </div>
                </td>
                <td style={{fontSize:12.5,color:'var(--text2)'}}>{top ? `${top.skillName} · ${top.proficiency}%` : '—'}</td>
                <td>
                  <span style={{fontSize:12,fontWeight:600,padding:'3px 8px',borderRadius:20,background:'var(--surface2)',color:'var(--text2)'}}>
                    {emp.skills?.length ?? 0}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
