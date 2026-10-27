require('dotenv').config();
const bcrypt=require('bcryptjs'),pool=require('../config/db');
(async()=>{try{
 const [rows]=await pool.execute('SELECT id FROM users WHERE username=? LIMIT 1',['admin']);
 if(rows.length){console.log('Admin already exists; password not changed.');return;}
 const password=process.env.SEED_ADMIN_PASSWORD||'ChangeMe123!';
 const hash=await bcrypt.hash(password,12);
 await pool.execute('INSERT INTO users(full_name,username,password_hash,role) VALUES(?,?,?,?)',['System Administrator','admin',hash,'admin']);
 console.log('Created admin. Username: admin');console.log('Development password:',password);console.log('Change it before using real data.');
 }catch(e){console.error('Seed failed. Import schema.sql and check .env:',e.message);process.exitCode=1;}finally{await pool.end();}})();
