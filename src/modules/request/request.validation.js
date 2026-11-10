import z from "zod"
import { generalValidationFields } from "../../common/validation.js"

export const revealRequest = (lang) =>{
    return z.object({
        body: z.strictObject({
            messageId: generalValidationFields.id(lang),
        }),
    })
}
export const decideRequest = (lang) =>{
    return z.object({
        params: z.strictObject({
            requestId: generalValidationFields.id(lang),
        }),
        body: z.strictObject({
            status: generalValidationFields.status(lang)
        })
    })
}