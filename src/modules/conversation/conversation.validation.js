import { z } from 'zod';
import { generalValidationFields } from '../../common/validation.js';

export const getConversations = (lang) =>{
    return z.object({
        query: z.strictObject({
            page: z.coerce.number().default(1),
            limit: z.coerce.number().default(5),
        }),
    })
}
export const sendMessage = (lang) =>{
    return z.object({
        params: z.strictObject({
            conversationId: generalValidationFields.id(lang)
        }),
        body: z.strictObject({
            content: z.string().min(2).max(50000).optional(),
        }),
        files: z.array(generalValidationFields.file(lang)).max(3).optional()
    }).superRefine((data, ctx)=>{
        if (!data.body.content && !data.files?.length) {
            ctx.addIssue({
                code: "custom",
                path: ['content'],
                message: "Missing message content"
            })

        }
        
    })
}
export const getMessages = (lang) =>{
    return z.object({
        params: z.strictObject({
            conversationId: generalValidationFields.id(lang)
        }),
    })
}
