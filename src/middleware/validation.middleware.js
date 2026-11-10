import { LanguageEnum } from "../common/enum/security.enum.js"
import { BadException } from "../common/exceptions/error.exception.js"

// schema => validators.signup => signup

export const validation = (schema)=>{
    return (req,res,next)=>{
        const lang = Number(req.headers['accept-language'] ?? LanguageEnum.EN)
        
        const validationResult = schema(lang).safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
            files: req.files,
            file: req.file
        })
        
            if (!validationResult.success){
                throw BadException("Validation error", validationResult.error.issues)
            }
            req.validate = validationResult.data
            next()
    }   
}