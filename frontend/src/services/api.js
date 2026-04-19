const BASE = '/api';
const headers = { 'Content-Type': 'application/json' };

async function request(url, options = {}) {
  const res = await fetch(BASE + url, { headers, ...options });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}

export const getAllEmployees     = ()          => request('/employees');
export const getEmployeeById    = (id)        => request(`/employees/${id}`);
export const createEmployee     = (data)      => request('/employees', { method: 'POST', body: JSON.stringify(data) });
export const updateEmployee     = (id, data)  => request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteEmployee     = (id)        => request(`/employees/${id}`, { method: 'DELETE' });
export const getRankedEmployees = ()          => request('/employees/ranked');
export const getTopEmployees    = (n = 5)     => request(`/employees/top?n=${n}`);
export const assignSkill  = (empId, data)     => request(`/employees/${empId}/skills`, { method: 'POST', body: JSON.stringify(data) });
export const removeSkill  = (empId, skillId)  => request(`/employees/${empId}/skills/${skillId}`, { method: 'DELETE' });
export const getByDepartment = (dept)         => request(`/employees/department/${dept}`);
export const searchEmployees = (q)            => request(`/employees/search?q=${encodeURIComponent(q)}`);
export const getBySkill      = (name)         => request(`/employees/by-skill?name=${encodeURIComponent(name)}`);
export const getDepartments  = ()             => request('/meta/departments');
export const getSkillNames   = ()             => request('/meta/skills');
export const getCategories   = ()             => request('/meta/categories');
export const getDashboard    = ()             => request('/dashboard');
