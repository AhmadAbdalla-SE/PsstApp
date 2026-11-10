import mongoose from "mongoose";

const conversationMessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Types.ObjectId, 
        ref: "Conversation",
        required: true,

    },
    senderId:{
        type: mongoose.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    content:{
        type: String, 
        required: function (){return this.attachments?.length > 0 ? false : true},
    },
    attachments: [String],
    
},{
    timestamps: true,
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
    strict: true,
    strictQuery: true,
    autoIndex: true
})
conversationMessageSchema.index({conversationId: 1, createdAt: -1})

export const ConversationMessageModel = mongoose.models.ConversationMessage || mongoose.model("ConversationMessage", conversationMessageSchema)