import { z } from "zod";
import { generalValidationFields } from "../../common/validation.js";

export const loginSchema = (lang) => {
    return z.strictObject({
    email: generalValidationFields.email(lang),
    password: generalValidationFields.password(lang)
})
}


export const login = (lang)=>{
    return z.object({
    body: loginSchema(lang)
})
}



export const signup = (lang) => {
    return z.object({
    body: loginSchema(lang).safeExtend({
    username: generalValidationFields.username(lang),
    phone: generalValidationFields.phone(lang),
    gender: generalValidationFields.gender(lang),
    confirmPassword: generalValidationFields.password(lang),
    // gender: z.union([
        //     z.literal(GenderEnum.MALE),
        //     z.literal(GenderEnum.FEMALE)
        // ])
    }).superRefine((data, ctx)=>{
    generalValidationFields.matchFields({original: "password", copy: "confirmPassword", data, ctx , lang})

    if (!data.username.includes(" ")){
        ctx.addIssue({
            code:"custom",
            path: ['username'],
            message: "Username must include a first name and last name"
        })
    }
    
})
})
}

export const confirmEmailOtp = (lang)=>{
    return z.object({
    body: z.strictObject({
        email: generalValidationFields.email(lang),
        otp: generalValidationFields.otp(lang)
    })
})
}
export const resendConfirmEmail = (lang)=>{
    return z.object({
    body: z.strictObject({
        email: generalValidationFields.email(lang),
    })
})
}

export const resetForgotPassword = (lang)=>{
    return z.object({
    body: z.strictObject({
        email: generalValidationFields.email(lang),
        otp: generalValidationFields.otp(lang),
        password: generalValidationFields.password(lang),
        confirmPassword: generalValidationFields.password(lang),
    }).superRefine((data, ctx)=>{
    generalValidationFields.matchFields({original: "password", copy: "confirmPassword", data, ctx , lang})
    })
})
}
