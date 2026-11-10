import { Router } from "express";
import { TokenTypeEnum } from "../../common/enum/security.enum.js";
import { RoleEnum } from "../../common/enum/user.gender.js";
import { fileValidation, localFileUpload, successResponse } from "../../common/utils/index.js";
import { authentication, authorization } from "../../middleware/authentication.middleware.js";
import { uploadMiddleware } from "../../middleware/index.js";
import { confirmTwoFactorAuthorization, logout, profile, requestTwoFactorAuthorization, rotateToken, update } from "./user.service.js";
const router = Router({ mergeParams:true })
router.get("/data/:x", async (req,res,next)=>{
    
    return successResponse({res})
})
router.patch("/profile-image",
    authentication(),
    uploadMiddleware({
        isRequired: false,
        multerMiddleware: localFileUpload({maxFileSize: 3 }).single("attachment"),
        // .fields([{name:"attachment", maxCount:1}, {name:"cover", maxCount: 2}])
        // .array("attachment", 2)
        customPath: "users",
        validation: fileValidation.image
    }),
    async (req,res,next)=>{
    console.log({after: req.body})
    req.user.image = req.file.finalPath
    await req.user.save()
    return successResponse({res, data:{user: req.user}})
})

router.get("/", authentication(), async (req,res,next)=>{
    const data = await profile(req.user)
    return successResponse({res, data})
})

router.patch("/", authentication(), authorization(RoleEnum.USER),  async (req,res,next)=>{
    const data = await update(req.user, req.body)
    return successResponse({res, data})
})

router.post("/rotate-token", authentication(TokenTypeEnum.REFRESH), async (req,res,next)=>{
    const data = await rotateToken(req.payload, req.user, `${req.protocol}://${req.host}`)
    return successResponse({res, data})
})
router.post("/logout", authentication(TokenTypeEnum.ACCESS), async (req,res,next)=>{
    const data = await logout(req.payload, req.user, req.body)
    return successResponse({res, data})
})
router.patch("/request-2fa", authentication(TokenTypeEnum.ACCESS), async (req,res,next) => {
    const data = await requestTwoFactorAuthorization(req.body)
    return successResponse({res, data})
})
router.patch("/verify-2fa", authentication(TokenTypeEnum.ACCESS), async (req,res,next) => {
    const data = await confirmTwoFactorAuthorization(req.body)
    return successResponse({res, data})
})

export default router