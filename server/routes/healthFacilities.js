const router=require('express').Router(),pool=require('../config/db'),{requireAuth}=require('../middleware/auth');
router.get('/',requireAuth,async(req,res)=>{try{const [facilities]=await pool.query('SELECT h.id,h.name,h.facility_type,h.phone,l.name district_name FROM health_facilities h LEFT JOIN locations l ON l.id=h.district_id ORDER BY h.name LIMIT 500');res.json({success:true,facilities});}catch{res.status(500).json({success:false,message:'Could not load facilities.'});}});
module.exports=router;
