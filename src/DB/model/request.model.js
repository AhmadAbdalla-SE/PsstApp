import mongoose from "mongoose";
import { RequestStatusEnum } from "../../common/enum/index.js";

const requestSchema = new mongoose.Schema({
    messageId: {type: mongoose.Types.ObjectId, ref:"Message", required: true},
    senderId:{type: mongoose.Types.ObjectId, ref: "User" },
    receiverId:{type: mongoose.Types.ObjectId, ref: "User", required: true},
    status: {
            type:Number,
            enum:Object.values(RequestStatusEnum),
            default: RequestStatusEnum.PENDING
        }
    
},{
    timestamps: true,
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
    strict: true,
    strictQuery: true,
    autoIndex: true
})
requestSchema.index({ messageId: 1, receiverId: 1 }, { unique: true })
export const RequestModel = mongoose.models.Request || mongoose.model("Request", requestSchema)