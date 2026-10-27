require('dotenv').config();
const express=require('express'),cors=require('cors'),helmet=require('helmet'),rateLimit=require('express-rate-limit'),pool=require('./config/db');
const app=express();app.disable('x-powered-by');app.use(helmet());app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173'}));app.use(express.json({limit:'1mb'}));app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:100}));
app.get('/api/health',async(req,res)=>{try{await pool.query('SELECT 1');res.json({success:true,message:'RPMS API is running',database:'connected'});}catch(e){console.error(e.message);res.status(503).json({success:false,message:'API running, database connection failed'});}});
app.use('/api/auth',require('./routes/auth'));app.use('/api/dashboard',require('./routes/dashboard'));app.use('/api/residents',require('./routes/residents'));app.use('/api/locations',require('./routes/locations'));app.use('/api/health-facilities',require('./routes/healthFacilities'));app.use('/api/reports',require('./routes/reports'));
app.use((err,req,res,next)=>{console.error(err.message);res.status(500).json({success:false,message:'Unexpected server error.'});});
app.use((req,res)=>res.status(404).json({success:false,message:'API endpoint not found.'}));
const port=Number(process.env.PORT||5000);app.listen(port,()=>console.log(`RPMS API running at http://localhost:${port}`));
