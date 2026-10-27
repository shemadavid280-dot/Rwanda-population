const jwt=require('jsonwebtoken');
function requireAuth(req,res,next){
 const h=req.headers.authorization||'', token=h.startsWith('Bearer ')?h.slice(7):null;
 if(!token)return res.status(401).json({success:false,message:'Please sign in.'});
 try{req.user=jwt.verify(token,process.env.JWT_SECRET||'development_only_change_me');next();}
 catch{return res.status(401).json({success:false,message:'Session expired. Please sign in again.'});}
}
function allowRoles(...roles){return(req,res,next)=>req.user&&roles.includes(req.user.role)?next():res.status(403).json({success:false,message:'Permission denied.'});}
module.exports={requireAuth,allowRoles};
