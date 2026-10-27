const router=require('express').Router(),pool=require('../config/db'),{requireAuth}=require('../middleware/auth');
router.get('/',requireAuth,async(req,res)=>{try{
 const [[totals]]=await pool.query(`SELECT COUNT(*) total,SUM(status='Active') active,SUM(verification_status='Pending') pending,SUM(verification_status='Approved') approved,SUM(sex='Male') male,SUM(sex='Female') female FROM residents WHERE archived_at IS NULL`);
 const [[locations]]=await pool.query(`SELECT SUM(location_type='province') provinces,SUM(location_type='district') districts,SUM(location_type='sector') sectors,SUM(location_type='cell') cells,SUM(location_type='village') villages FROM locations`);
 const [trend]=await pool.query(`SELECT DATE_FORMAT(created_at,'%Y-%m') month,COUNT(*) total FROM residents WHERE archived_at IS NULL AND created_at>=DATE_SUB(CURDATE(),INTERVAL 6 MONTH) GROUP BY DATE_FORMAT(created_at,'%Y-%m') ORDER BY month`);
 res.json({success:true,totals,locations,trend});
 }catch(e){console.error(e.message);res.status(500).json({success:false,message:'Could not load dashboard.'});}});
module.exports=router;
