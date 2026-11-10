import { Router } from "express"
import { fileValidation, localFileUpload } from "../../common/utils/index.js"
import { successResponse } from "../../common/utils/success.response.js"
import { authentication } from "../../middleware/authentication.middleware.js"
import { uploadMiddleware } from "../../middleware/multer.middleware.js"
import { validation } from "../../middleware/validation.middleware.js"
import { getConversations, getMessages, sendMessage } from "./conversation.service.js"
import * as validators from "./conversation.validation.js"
const router = Router()


router.get("/", authentication(),
 validation(validators.getConversations),
async (req, res, next) => {
    const data = await getConversations(req.validate.query, req.user)
        return successResponse({res, status: 200, data})
})


router.post("/:conversationId/message",
    authentication(),
    uploadMiddleware({
        multerMiddleware: localFileUpload().any("attachments", 3),
        validation: fileValidation.image,
        customPath: "conversations",
        isRequired: false
    }),
    validation(validators.sendMessage),
    async (req, res, next) => {
        const data = await sendMessage(req.validate.params, req.validate.body, req.validate.files, req.user)
        return successResponse({res, status: 201, data})
})
router.get("/:conversationId/message",
    authentication(),
    validation(validators.getMessages),
    async (req, res, next) => {
        const data = await getMessages(req.validate.params, req.user)
        return successResponse({res, status: 200, data})
})
export default router