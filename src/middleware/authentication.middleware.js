import { TokenTypeEnum } from "../common/enum/security.enum.js"
import { ForbiddenException, UnauthorizedException } from "../common/exceptions/error.exception.js"
import { basicAuthentication, decodeToken } from "../common/security/token.security.js"

export const bearerAuth = async({req, tokenType = TokenTypeEnum.ACCESS} = {})=>{
    const [key, credendtial ] = req.headers["authorization"]?.split(" ") || [];
    const {user, payload} = await decodeToken({authorization: credendtial, tokenType}); 
    req.user = user;
    req.payload = payload;
}


export const authentication = (tokenType=TokenTypeEnum.ACCESS)=>{
    return async (req, res, next)=>{
    const {authorization} = req.headers
    if(!authorization){
        throw UnauthorizedException("Unauthorized account access")
    }
    
    const [key, credendtial] = authorization.split(" ") || []


    switch (key) {
        case "Basic":
            const [email, password] = Buffer.from(credendtial, 'base64').toString()?.split(":");
            req.user = await basicAuthentication({email, password})
            break;
    
        case "Bearer":
            await bearerAuth({req, tokenType})
            break;
        default:
            next(new Error("Invalid authentication schema", {cause: {status:400}}))
            break;
    }

    next()
}
}

export const authorization = (accessRole)=>{
    return async (req, res, next)=>{

    if(req.user.role < accessRole){
        throw ForbiddenException("Forbidden account access")
    }
    next()
}
}