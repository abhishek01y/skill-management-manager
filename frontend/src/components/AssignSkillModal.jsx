import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { assignSkill, removeSkill, getSkillNames, getCategories } from '../services/api';

const SKILL_SUGGESTIONS = {
  'Java': ['Spring Boot','Microservices','Hibernate','Maven','Docker'],
  'Python': ['FastAPI','Django','Machine Learning','Pandas','TensorFlow'],
  'React': ['TypeScript','Redux','Next.js','GraphQL','Tailwind'],
  'DevOps': ['Kubernetes','Terraform','CI/CD','AWS','Docker'],
  'Design': ['Figma','User Research','Prototyping','Sketch','Adobe XD'],
  'default': ['Git','Agile','REST APIs','SQL','Docker'],
};

export default function AssignSkillModal({ employee, onClose, onSaved }) {
  const [skillName, setSkillName]       = useState('');
  const [category, setCategory]         = useState('Backend');
  const [proficiency, setProficiency]   = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [allSkills, setAllSkills]       = useState([]);
  const [allCats, setAllCats]           = useState(['Backend','Frontend','DevOps','Data','Design','Management','Other']);
  const [suggestions, setSuggestions]   = useState([]);

  useEffect(() => {
    getSkillNames().then(setAllSkills).catch(() => {});
    getCategories().then(d => { if (d.length) setAllCats(d); }).catch(() => {});
    // Auto-suggest based on existing skills
    if (employee.skills?.length) {
      const top = employee.skills[0]?.skillName || 'default';
      const sugg = SKILL_SUGGESTIONS[top] || SKILL_SUGGESTIONS['default'];
      const existing = new Set(employee.skills.map(s => s.skillName.toLowerCase()));
      setSuggestions(sugg.filter(s => !existing.has(s.toLowerCase())).slice(0, 4));
    }
  }, [employee]);

  async function handleSave() {
    if (!skillName.trim()) return setError('Skill name is required.');
    const pct = parseInt(proficiency);
    if (isNaN(pct) || pct < 1 || pct > 100) return setError('Proficiency must be 1–100.');
    setError(''); setLoading(true);
    try {
      const updated = await assignSkill(employee.id, { skillName: skillName.trim(), category, proficiency: pct });
      onSaved(updated);
      setSkillName(''); setProficiency('');
    } catch (e) { setError(e.message || 'Failed to save.'); }
    finally { setLoading(false); }
  }

  async function handleRemove(skillId) {
    try { const updated = await removeSkill(employee.id, skillId); onSaved(updated); }
    catch { setError('Failed to remove skill.'); }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
          <div>
            <div className="modal-title">Assign Skill</div>
            <div className="modal-sub" style={{marginBottom:0}}>For <strong>{employee.name}</strong></div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={15}/></button>
        </div>

        {/* Current skills */}
        {employee.skills?.length > 0 && (
          <div style={{marginBottom:'1rem'}}>
            <div className="current-skills-label">Current Skills</div>
            <div className="current-skills">
              {employee.skills.map(s => (
                <span className="skill-chip" key={s.id}>
                  {s.skillName} {s.proficiency}%
                  <span className="chip-x" onClick={() => handleRemove(s.id)}><X size={10}/></span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div style={{marginBottom:'1rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,fontWeight:600,color:'var(--accent)',marginBottom:7,textTransform:'uppercase',letterSpacing:'.06em'}}>
              <Sparkles size={11}/> AI Suggestions
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {suggestions.map(s => (
                <span key={s} className="ai-chip" onClick={() => setSkillName(s)}>{s}</span>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Skill Name</label>
          <input className="form-input" list="skill-dl" placeholder="e.g. Java, React, Kubernetes…"
            value={skillName} onChange={e => setSkillName(e.target.value)} />
          <datalist id="skill-dl">{allSkills.map(s => <option key={s} value={s} />)}</datalist>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
              {allCats.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Proficiency %</label>
            <input className="form-input" type="number" min="1" max="100" placeholder="1–100"
              value={proficiency} onChange={e => setProficiency(e.target.value)} />
          </div>
        </div>

        {/* Live preview bar */}
        {proficiency && !isNaN(parseInt(proficiency)) && (
          <div style={{marginBottom:'0.75rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text3)',marginBottom:4}}>
              <span>{skillName || 'Skill'}</span><span>{proficiency}%</span>
            </div>
            <div className="bar-track" style={{height:7}}>
              <div className="bar-fill fill-blue" style={{width:`${Math.min(parseInt(proficiency)||0,100)}%`,transition:'width .3s'}} />
            </div>
          </div>
        )}

        {error && <p style={{fontSize:12.5,color:'var(--coral-text)',marginBottom:8,background:'var(--coral-bg)',padding:'8px 10px',borderRadius:'var(--r-sm)'}}>{error}</p>}

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving…' : '✓ Save Skill'}
          </button>
        </div>
      </div>
    </div>
  );
}
