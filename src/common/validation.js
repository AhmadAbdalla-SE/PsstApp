import {z} from 'zod'
import { GenderEnum } from './enum/user.gender.js'
import { LanguageEnum } from './enum/security.enum.js'
import mongoose from 'mongoose'
import { RequestStatusEnum } from './enum/request.enum.js'

const validationMessages = {
    102: {
        ar: "عفوا لا يمكن ادخال اسم المستدم اقل من حرفين",
        en: "Minimun characters are two."
    }
}
const getValidatationMessages = (lang, code) => {
    return lang == LanguageEnum.AR ? validationMessages[code].ar
         : validationMessages[code].en
}

const matchFields = ({original, copy, data, ctx, lang})=>{
    if (data[original] != data[copy]){
        ctx.addIssue({
            code:"custom",
            path: [copy],
            message: lang == LanguageEnum.AR ? `فشل في تطابق بين ${original} و ${copy}` : `Failed to match between ${original} and ${copy}`
        })
    }
}

export const generalValidationFields = {
    email: (lang)=> z.email({message: "Invlaid email format, please add valid email like example@any.com"}),
    password: (lang)=> z.string().regex(/^(?=.*[a-z])(?=.*\s{0,})(?=.*[A-Z])(?=.*[!@#_$%^&*()]).{8,16}$/).min(8).max(16),
    username: (lang)=> z.string().min(2, {message: getValidatationMessages(lang, 102)}),
    phone: (lang)=> z.e164(),
    gender: (lang)=> z.enum(GenderEnum),
    otp: (lang) => z.string().regex(/^\d{6}$/, {error: "Invalid code"}),
    id: (lang)=> z.string().refine((data)=>{return mongoose.Types.ObjectId.isValid(data)},{message: "Invalid format"}),
    file: (lang)=> z.strictObject({
                fieldname: z.string(),
                originalname: z.string(),
                encoding: z.string(),
                mimetype: z.string(),
                buffer: z.instanceof(Buffer) ,
                size: z.number(),
                path: z.string()
            }),
    status: (lang)=> z.union([
        z.literal(RequestStatusEnum.ACCEPTED),
        z.literal(RequestStatusEnum.REJECTED)
    ]),
    matchFields

}
