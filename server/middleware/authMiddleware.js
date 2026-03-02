import jwt from 'jsonwebtoken'

const protect = async (req,res,next)=>{
    const token=req.headers.authorization;
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }
    try{
        const authToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded=jwt.verify(authToken, process.env.SECRET_KEY)
        req.userId=decoded.id;
        next();
    } catch(error){
        return res.status(401).json({message:'Unauthorized'});
    }
}

export default protect