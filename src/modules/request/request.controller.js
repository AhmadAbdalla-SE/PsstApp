import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { authentication } from "../../middleware/authentication.middleware.js";
import { acceptOrRejectRequest, createRevealRequest, getRequests } from "./request.service.js";
import * as validators from "./request.validation.js";

import { validation } from "../../middleware/validation.middleware.js";
const router = Router()


router.post("/", authentication(),
 validation(validators.revealRequest),
 async (req, res, next) => {
    const data = await createRevealRequest(req.validate.body, req.user)
        return successResponse({res, status: 201, data})
})

router.get("/", authentication(),
 async (req, res, next)=>{
    const data = await getRequests(req.user)
    return successResponse({res, status:200, data})
})

router.patch("/:requestId", authentication(),
 validation(validators.decideRequest),
async (req, res, next)=>{
    const data = await acceptOrRejectRequest(req.validate.params, req.validate.body, req.user)
    return successResponse({res, data})
})


export default router