import { Router } from "express";
import { del } from "../../common/services/cache.service.js";
import { generateLimiter, successResponse } from "../../common/utils/index.js";
import { validation } from "../../middleware/validation.middleware.js";
import { confirmEmail, confirmLogin, login, requestForgotPasswordCode, resendConfirmEmail, resetForgotPassword, signup, signupWithGmail, verifyForgotPasswordCode } from "./authentication.service.js";
import * as validators from "./authentication.validation.js";

const router = Router({caseSensitive:true, strict:true});

router.post("/signup", validation(validators.signup), async (req,res,next) => {
    const data = await signup(req.body)
    return successResponse({res, status:201, data})
    
})
router.patch("/confirm-email", validation(validators.confirmEmailOtp), async (req,res,next) => {
    const data = await confirmEmail(req.body)
    return successResponse({res, status:200, data})
    
})
router.patch("/resend-confirm-email", validation(validators.resendConfirmEmail), async (req,res,next) => {
    const data = await resendConfirmEmail(req.body)
    return successResponse({res, status:200, data})
    
})
router.post("/request-forgot-password-code", validation(validators.resendConfirmEmail), async (req,res,next) => {
    const data = await requestForgotPasswordCode(req.body)
    return successResponse({res, status:201, data})
    
})
router.post("/verify-forgot-password", validation(validators.confirmEmail), async (req,res,next) => {
    const data = await verifyForgotPasswordCode(req.body)
    return successResponse({res, status:200, data})
})
router.patch("/reset-forgot-password", validation(validators.resetForgotPassword), async (req,res,next) => {
    const data = await resetForgotPassword(req.body)
    return successResponse({res, status:200, data})
})
router.post("/signup-with-gmail", async (req,res,next) => {
    const {status, data} = await signupWithGmail(req.body, `${req.protocol}://${req.host}`)
    return successResponse({res, status, data})
    
})

const loginLimiter = generateLimiter({limit:5, ttl: 5, skipSuccessfulRequests: true})
router.post("/login", loginLimiter, validation(validators.login), async (req,res,next) => {
    const data = await login(req.validate.body, `${req.protocol}://${req.host}`)
    await del({key:req.rateLimit.key})
    return successResponse({res, data})
})

router.patch("/confirm-login", validation(validators.confirmEmailOtp), async (req,res,next) => {
    console.log(req.validate);
    const data = await confirmLogin(req.validate.body, `${req.protocol}://${req.host}`)
    return successResponse({res, data})
})




export default router