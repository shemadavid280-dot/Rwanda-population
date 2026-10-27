const router=require('express').Router(),pool=require('../config/db'),{requireAuth,allowRoles}=require('../middleware/auth'),audit=require('../utils/audit');
router.use(requireAuth);
router.get('/',async(req,res)=>{try{const [locations]=await pool.query(`SELECT c.id,c.name,c.location_type,c.parent_id,p.name parent_name FROM locations c LEFT JOIN locations p ON p.id=c.parent_id ORDER BY FIELD(c.location_type,'province','district','sector','cell','village'),c.name`);res.json({success:true,locations});}catch{res.status(500).json({success:false,message:'Could not load locations.'});}});
router.post('/',allowRoles('admin','national_admin','local_admin'),async(req,res)=>{
 const name=String(req.body.name||'').trim(),type=String(req.body.location_type||''),parent=req.body.parent_id?Number(req.body.parent_id):null;
 if(!name||!['province','district','sector','cell','village'].includes(type))return res.status(400).json({success:false,message:'Name and valid location type are required.'});
 if(type!=='province'&&!parent)return res.status(400).json({success:false,message:'Choose a parent location.'});
 try{const [r]=await pool.execute('INSERT INTO locations(parent_id,name,location_type) VALUES(?,?,?)',[parent,name,type]);await audit(req.user.id,'CREATE','location',r.insertId,`Created ${type}: ${name}`);res.status(201).json({success:true,id:r.insertId});}
 catch(e){res.status(e.code==='ER_DUP_ENTRY'?409:500).json({success:false,message:e.code==='ER_DUP_ENTRY'?'That location already exists under this parent.':'Could not create location.'});}
});
module.exports=router;
