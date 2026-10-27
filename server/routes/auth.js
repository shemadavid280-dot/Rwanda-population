const router=require('express').Router(),bcrypt=require('bcryptjs'),jwt=require('jsonwebtoken'),pool=require('../config/db'),audit=require('../utils/audit'),{requireAuth}=require('../middleware/auth');
router.post('/login',async(req,res)=>{
 const username=String(req.body.username||'').trim(),password=String(req.body.password||'');
 if(!username||!password)return res.status(400).json({success:false,message:'Enter username and password.'});
 try{
  const [rows]=await pool.execute('SELECT id,full_name,username,password_hash,role,location_id,is_active FROM users WHERE username=? LIMIT 1',[username]);
  const u=rows[0];
  if(!u||!u.is_active||!(await bcrypt.compare(password,u.password_hash)))return res.status(401).json({success:false,message:'Invalid username or password.'});
  const token=jwt.sign({id:u.id,username:u.username,role:u.role,location_id:u.location_id},process.env.JWT_SECRET||'development_only_change_me',{expiresIn:'8h'});
  await audit(u.id,'LOGIN','user',u.id,'User signed in');
  res.json({success:true,token,user:{id:u.id,full_name:u.full_name,username:u.username,role:u.role,location_id:u.location_id}});
 }catch(e){console.error(e.message);res.status(500).json({success:false,message:'Login failed. Check database settings.'});}
});
router.get('/me',requireAuth,async(req,res)=>{
 try{const [r]=await pool.execute('SELECT id,full_name,username,role,location_id FROM users WHERE id=? AND is_active=1',[req.user.id]);if(!r[0])return res.status(401).json({success:false,message:'Account unavailable.'});res.json({success:true,user:r[0]});}
 catch{res.status(500).json({success:false,message:'Could not load user.'});}
});
module.exports=router;
