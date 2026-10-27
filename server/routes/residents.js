const router=require('express').Router(),crypto=require('crypto'),pool=require('../config/db'),{requireAuth,allowRoles}=require('../middleware/auth'),audit=require('../utils/audit');
router.use(requireAuth);
router.get('/',async(req,res)=>{try{
 const s=String(req.query.search||'').trim(),v=String(req.query.verification_status||''),limit=Math.min(Math.max(Number(req.query.limit)||100,1),500);
 const w=['r.archived_at IS NULL'],a=[];
 if(s){w.push('(r.first_name LIKE ? OR r.last_name LIKE ? OR r.resident_code LIKE ?)');a.push(`%${s}%`,`%${s}%`,`%${s}%`);}
 if(['Draft','Pending','Approved','Rejected'].includes(v)){w.push('r.verification_status=?');a.push(v);}
 a.push(limit);
 const [residents]=await pool.execute(`SELECT r.id,r.resident_code,r.first_name,r.last_name,r.sex,r.date_of_birth,r.phone,r.status,r.verification_status,r.created_at,l.name village_name FROM residents r LEFT JOIN locations l ON l.id=r.village_id WHERE ${w.join(' AND ')} ORDER BY r.created_at DESC LIMIT ?`,a);
 res.json({success:true,residents});
 }catch(e){console.error(e.message);res.status(500).json({success:false,message:'Could not load residents.'});}});
router.post('/',allowRoles('admin','national_admin','local_admin','data_entry'),async(req,res)=>{
 const first=String(req.body.first_name||'').trim(),last=String(req.body.last_name||'').trim(),sex=String(req.body.sex||'');
 if(!first||!last||!['Male','Female','Other'].includes(sex))return res.status(400).json({success:false,message:'First name, last name and valid sex are required.'});
 const code='RPMS-'+Date.now().toString(36).toUpperCase()+'-'+crypto.randomBytes(2).toString('hex').toUpperCase();
 try{const [r]=await pool.execute(`INSERT INTO residents(resident_code,first_name,last_name,sex,date_of_birth,phone,marital_status,village_id,status,verification_status,created_by) VALUES(?,?,?,?,?,?,?,?, 'Active','Pending',?)`,
 [code,first,last,sex,req.body.date_of_birth||null,String(req.body.phone||'').trim()||null,String(req.body.marital_status||'').trim()||null,req.body.village_id?Number(req.body.village_id):null,req.user.id]);
 await audit(req.user.id,'CREATE','resident',r.insertId,`Created ${code}`);res.status(201).json({success:true,id:r.insertId,resident_code:code});
 }catch(e){console.error(e.message);res.status(500).json({success:false,message:'Could not create resident. Check date and village values.'});}});
router.put('/:id',allowRoles('admin','national_admin','local_admin','data_entry','verifier'),async(req,res)=>{
 const id=Number(req.params.id),first=String(req.body.first_name||'').trim(),last=String(req.body.last_name||'').trim(),sex=String(req.body.sex||''),verification=String(req.body.verification_status||'Pending'),status=String(req.body.status||'Active');
 if(!id||!first||!last||!['Male','Female','Other'].includes(sex))return res.status(400).json({success:false,message:'Valid resident ID, names and sex are required.'});
 if(!['Draft','Pending','Approved','Rejected'].includes(verification)||!['Active','Moved','Deceased'].includes(status))return res.status(400).json({success:false,message:'Invalid status.'});
 try{const [r]=await pool.execute(`UPDATE residents SET first_name=?,last_name=?,sex=?,date_of_birth=?,phone=?,marital_status=?,village_id=?,status=?,verification_status=? WHERE id=? AND archived_at IS NULL`,
 [first,last,sex,req.body.date_of_birth||null,String(req.body.phone||'').trim()||null,String(req.body.marital_status||'').trim()||null,req.body.village_id?Number(req.body.village_id):null,status,verification,id]);
 if(!r.affectedRows)return res.status(404).json({success:false,message:'Resident not found.'});
 await audit(req.user.id,'UPDATE','resident',id,'Updated resident');res.json({success:true,message:'Resident updated.'});
 }catch(e){console.error(e.message);res.status(500).json({success:false,message:'Could not update resident.'});}});
router.delete('/:id',allowRoles('admin','national_admin','local_admin'),async(req,res)=>{try{
 const [r]=await pool.execute('UPDATE residents SET archived_at=CURRENT_TIMESTAMP WHERE id=? AND archived_at IS NULL',[Number(req.params.id)]);
 if(!r.affectedRows)return res.status(404).json({success:false,message:'Resident not found.'});
 await audit(req.user.id,'ARCHIVE','resident',req.params.id,'Archived resident');res.json({success:true,message:'Resident archived.'});
 }catch{res.status(500).json({success:false,message:'Could not archive resident.'});}});
module.exports=router;
