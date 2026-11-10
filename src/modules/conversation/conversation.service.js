import { NotFoundException } from "../../common/exceptions/error.exception.js";
import * as conversationMessageRepository from "../../common/repository/conversation.message.repository.js";
import * as conversationRepository from "../../common/repository/conversation.repository.js";

export const getConversations = async ({page, limit}, user) => {
    const data = await conversationRepository.paginate({
            filter : {
                participants: user._id
            },
            page,
            limit,
            options: {
                sort: {createdAt: -1},
                populate: [{path:"participants", select: "username email image"}]
            }
    })
    return data
}

export const sendMessage = async ({conversationId}, {content}, files = [], user) => {
    const conversation = await conversationRepository.findOne({
        filter: {
            _id: conversationId,
            participants: user._id
        }
    })
    if (!conversation) {
        throw NotFoundException("Invalid conversation id")
    }
    const message = await conversationMessageRepository.create({
        data: {
            conversationId,
            senderId: user._id,
            content,
            attachments: files.map(file => file.path)
        }
    })
    return message
}

export const getMessages = async ({conversationId}, user) => {
    const conversation = await conversationRepository.findOne({
        filter: {
            _id: conversationId,
            participants: user._id
        }
    })
    if (!conversation) {
        throw NotFoundException("Invalid conversation id")
    }
    const messages = await conversationMessageRepository.find({
        filter: {
            conversationId,
        }
    })
    return messages
}