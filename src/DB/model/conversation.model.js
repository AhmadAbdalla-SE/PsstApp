import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    messageId: {
        type: mongoose.Types.ObjectId, 
        ref:"Message", 
        required: true,
        unique: true
    },
    requestId:{type: mongoose.Types.ObjectId, ref: "Request", required: true },
    participants:{
        type: [{type: mongoose.Types.ObjectId, ref: "User"}], 
        required: true,
        immutable: true,
        index: true,
        validate: {
            validator: function (value) {
                return value.length == 2 && new Set(value.map(String)).size === 2
            },
            message: "A conversation must have exactly 2 participants"
        }
    },
    
    
},{
    timestamps: true,
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
    strict: true,
    strictQuery: true,
    autoIndex: true
})

export const ConversationModel = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema)