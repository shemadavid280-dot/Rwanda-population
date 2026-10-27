const pool=require('../config/db');
module.exports=async function audit(userId,action,entityType,entityId,details=''){
 try{await pool.execute('INSERT INTO audit_logs(user_id,action,entity_type,entity_id,details) VALUES(?,?,?,?,?)',[userId||null,action,entityType||null,entityId==null?null:String(entityId),details]);}
 catch(e){console.error('Audit log failed:',e.message);}
};
