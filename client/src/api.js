import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5000/api',timeout:15000});
api.interceptors.request.use(c=>{const t=localStorage.getItem('rpms_token');if(t)c.headers.Authorization=`Bearer ${t}`;return c;});
api.interceptors.response.use(r=>r,e=>{if(e.response?.status===401&&!String(e.config?.url||'').includes('/auth/login')){localStorage.removeItem('rpms_token');localStorage.removeItem('rpms_user');window.dispatchEvent(new Event('rpms:logout'));}return Promise.reject(e);});
export default api;
