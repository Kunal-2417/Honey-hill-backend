import jwt          from'jsonwebtoken';
import express      from'express';
import createError  from "./error.js";
const  app=express();




export const verifytoken = (req) => {

    const token =req.cookies.token ;
    
    if(!token){
        return next(createError(401,"not authenticated"))
    }
    try {
        const user = jwt.verify(token, process.env.JWT);
        // res.send(user);
        return {status:200,user};
    } 
    catch (error) {
        return createError(401, "Invalid token");
        // return 100;
    }
};


export const isAdmin = (req, res, next) => {
    const tokenStatus = verifytoken(req);
    if (tokenStatus.status !== 200) return next(createError(404,"Not an Admin"));
        if (tokenStatus.user.isAdmin) {
            next();
        }
        else {

            return next(createError(401, "not an admin"))
        }
}
export const verifyuser = (req, res, next) => {
    const tokenStatus=verifytoken(req);
    if(tokenStatus.status!==200)return next(createError(tokenStatus.status,tokenStatus.message));
        if (tokenStatus.user.id === req.params.id ||req.user.isAdmin)
        {
            next();
        }
        else{
            return next(createError(401, "not authorized")) 
        }
}
