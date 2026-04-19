import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createEmployee } from '../services/api';

const COLORS = ['av-blue','av-teal','av-coral','av-purple','av-amber','av-pink'];
const DEPTS  = ['Engineering','Analytics','Infrastructure','Product','Design','HR','Finance','Operations'];

export default function AddEmployeeModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name:'',role:'',department:DEPTS[0],email:'',phone:'',avatarColor:COLORS[0],status:'ACTIVE' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  async function handleCreate() {
    if (!form.name.trim()) return setError('Name is required.');
    if (!form.role.trim()) return setError('Role is required.');
    setError(''); setLoading(true);
    try { onCreated(await createEmployee(form)); }
    catch (e) { setError(e.message || 'Failed to create.'); }
    finally { setLoading(false); }
  }

  const previewInitials = form.name ? form.name.trim().split(' ').map(p=>p[0]?.toUpperCase()||'').slice(0,2).join('') : 'AB';

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
          <div><div className="modal-title">Add Employee</div><div className="modal-sub" style={{marginBottom:0}}>Create a new team member</div></div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={15}/></button>
        </div>

        {/* Avatar preview */}
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.25rem',padding:'1rem',background:'var(--surface2)',borderRadius:'var(--r-lg)'}}>
          <div className={`avatar ${form.avatarColor}`} style={{width:52,height:52,fontSize:16,borderRadius:14}}>
            {previewInitials}
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif"}}>{form.name || 'New Employee'}</div>
            <div style={{fontSize:12,color:'var(--text2)',marginTop:2}}>{form.role || 'Role'} · {form.department}</div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" placeholder="Anjali Sharma" value={form.name} onChange={e => set('name', e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Role *</label><input className="form-input" placeholder="Senior Developer" value={form.role} onChange={e => set('role', e.target.value)}/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Department</label><select className="form-input" value={form.department} onChange={e => set('department', e.target.value)}>{DEPTS.map(d => <option key={d}>{d}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Status</label><select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>{['ACTIVE','INACTIVE','ON_LEAVE'].map(s => <option key={s}>{s}</option>)}</select></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="anjali@company.com" value={form.email} onChange={e => set('email', e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)}/></div>
        </div>

        <div className="form-group">
          <label className="form-label">Avatar Color</label>
          <div style={{display:'flex',gap:8,marginTop:4}}>
            {COLORS.map(c => (
              <div key={c} className={`avatar ${c}`}
                style={{width:32,height:32,fontSize:11,cursor:'pointer',borderRadius:10,outline:form.avatarColor===c?'2.5px solid var(--accent)':'none',outlineOffset:2,transition:'transform .15s'}}
                onClick={() => set('avatarColor', c)}>
                {previewInitials}
              </div>
            ))}
          </div>
        </div>

        {error && <p style={{fontSize:12.5,color:'var(--coral-text)',background:'var(--coral-bg)',padding:'8px 10px',borderRadius:'var(--r-sm)',marginBottom:8}}>{error}</p>}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>{loading ? 'Creating…' : '✓ Create Employee'}</button>
        </div>
      </div>
    </div>
  );
}
