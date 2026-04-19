import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line, CartesianGrid } from 'recharts';
import { getDashboard, getRankedEmployees } from '../services/api';
import MetricBar from '../components/MetricBar';
import { Users, Zap, Target, Award } from 'lucide-react';

const COLORS = ['#4f46e5','#0d9488','#f59e0b','#8b5cf6','#ef4444','#10b981','#ec4899','#3b82f6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:10,padding:'10px 14px',boxShadow:'var(--shadow-md)',fontSize:13}}>
      <p style={{fontWeight:600,marginBottom:4,color:'var(--text)'}}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{color:p.color}}>{p.name}: <strong>{typeof p.value === 'number' ? Math.round(p.value) + (p.name?.includes('Score') ? '%' : '') : p.value}</strong></p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [stats, setStats]         = useState({});
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([getDashboard(), getRankedEmployees()])
      .then(([dash, ranked]) => { setStats(dash); setEmployees(ranked); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const deptData = (stats.deptBreakdown || []).map(d => ({
    name: d.department, employees: d.employeeCount, avgScore: Math.round(d.avgScore)
  }));

  const topSkillData = (stats.topSkills || []).map(s => ({
    name: s.skill, score: Math.round(s.avgProficiency)
  }));

  const top5 = employees.slice(0, 5);

  const scoreDistribution = [
    { range: '90–100%', count: employees.filter(e => e.skillScore >= 90).length },
    { range: '75–89%',  count: employees.filter(e => e.skillScore >= 75 && e.skillScore < 90).length },
    { range: '60–74%',  count: employees.filter(e => e.skillScore >= 60 && e.skillScore < 75).length },
    { range: '0–59%',   count: employees.filter(e => e.skillScore < 60).length },
  ].filter(d => d.count > 0);

  const radarData = topSkillData.slice(0, 6).map(s => ({ subject: s.name, score: s.score, fullMark: 100 }));

  if (loading) return (
    <>
      <div className="page-header"><div><div className="page-title">Dashboard</div><div className="page-sub">Loading analytics…</div></div></div>
      <MetricBar stats={{}} loading={true} />
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {[0,1,2,3].map(i => <div key={i} className="skeleton" style={{height:280,borderRadius:18}}/>)}
      </div>
    </>
  );

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Analytics overview · {employees.length} employees · {stats.totalDepartments} departments</div>
        </div>
      </div>

      <MetricBar stats={stats} />

      <div className="charts-grid">

        {/* Department Bar Chart */}
        <div className="chart-card">
          <div className="chart-title">Avg Skill Score by Department</div>
          <div className="chart-sub">Higher is better</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize:11,fill:'var(--text3)'}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{fontSize:11,fill:'var(--text3)'}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>} />
              <Bar dataKey="avgScore" name="Avg Score" radius={[6,6,0,0]}>
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Distribution Pie */}
        <div className="chart-card">
          <div className="chart-title">Score Distribution</div>
          <div className="chart-sub">Employees by skill score range</div>
          <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={scoreDistribution} dataKey="count" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {scoreDistribution.map((_, i) => <Cell key={i} fill={COLORS[i]} strokeWidth={0}/>)}
                </Pie>
                <Tooltip content={<CustomTooltip/>} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{flex:1}}>
              {scoreDistribution.map((d, i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <div style={{width:10,height:10,borderRadius:3,background:COLORS[i],flexShrink:0}}/>
                  <span style={{fontSize:12,color:'var(--text2)',flex:1}}>{d.range}</span>
                  <span style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Radar */}
        {radarData.length >= 3 && (
          <div className="chart-card">
            <div className="chart-title">Top Skills Radar</div>
            <div className="chart-sub">Average proficiency by skill</div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{fontSize:11,fill:'var(--text2)'}} />
                <Radar name="Score" dataKey="score" fill="#4f46e5" fillOpacity={0.25} stroke="#4f46e5" strokeWidth={2} />
                <Tooltip content={<CustomTooltip/>} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top 5 Employees */}
        <div className="chart-card">
          <div className="chart-title">Top 5 Employees</div>
          <div className="chart-sub">By skill score ranking</div>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:4}}>
            {top5.map((emp, i) => (
              <div key={emp.id} style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:12,fontWeight:700,color:'var(--text3)',width:20,textAlign:'right'}}>{i+1}</span>
                <div className={`avatar avatar-sm ${emp.avatarColor || 'av-blue'}`} style={{borderRadius:10}}>
                  {emp.avatarInitials}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:'var(--text)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{emp.name}</div>
                  <div className="bar-track" style={{height:5,marginTop:4}}>
                    <div className="bar-fill fill-blue" style={{width:`${Math.round(emp.skillScore)}%`}} />
                  </div>
                </div>
                <span style={{fontSize:13,fontWeight:700,color:'var(--accent)',flexShrink:0}}>{Math.round(emp.skillScore)}%</span>
              </div>
            ))}
            {top5.length === 0 && <p style={{fontSize:13,color:'var(--text3)',textAlign:'center',padding:'1rem'}}>No employees yet.</p>}
          </div>
        </div>

      </div>

      {/* Department employees count */}
      {deptData.length > 0 && (
        <div className="chart-card">
          <div className="chart-title">Team Size by Department</div>
          <div className="chart-sub">Number of employees per department</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={deptData} barSize={32} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{fontSize:11,fill:'var(--text3)'}} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{fontSize:11,fill:'var(--text2)'}} axisLine={false} tickLine={false} width={110}/>
              <Tooltip content={<CustomTooltip/>} />
              <Bar dataKey="employees" name="Employees" radius={[0,6,6,0]}>
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
