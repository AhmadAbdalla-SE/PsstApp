import { RequestStatusEnum } from "../../common/enum/request.enum.js";
import { ConflictException, NotFoundException } from "../../common/exceptions/error.exception.js";
import * as conversationRepository from "../../common/repository/conversation.repository.js";
import * as messageRepository from "../../common/repository/message.repository.js";
import * as requestRepository from "../../common/repository/request.repository.js";
export const createRevealRequest = async ({messageId}, user) => {
    const message = await messageRepository.findOne({
            filter : {
                _id: messageId,
                receiverId: user._id
            }
    })
    if (!message){
        throw NotFoundException("Invalid Message ID")
    }
    const existingRequest = await requestRepository.findOne({
        filter: {
            messageId,
            receiverId : user._id
        }
    })
    if(existingRequest) {
        throw ConflictException("You have already requested to reveal this sender!")
    }

    const request = await requestRepository.create({
        data: {
            messageId,
            receiverId: user._id,
            senderId: message.senderId,
            status: message.senderId ? RequestStatusEnum.PENDING : RequestStatusEnum.REJECTED
        }
    })
    return request
}
export const getRequests = async (user) => {
    const allRequests = await requestRepository.find({
            filter : {
                senderId: user._id
            }
    })
    
    if (allRequests.length == 0){
        return []
    }
    return allRequests
}

export const acceptOrRejectRequest = async ({requestId},{status}, user) => {
    const request = await requestRepository.findOne({
        filter: {
            _id: requestId,
            senderId: user._id,
            status: RequestStatusEnum.PENDING
        }
    })
    if (!request) {
        throw NotFoundException("Invalid request id or already accepted.")
    }
if (status === RequestStatusEnum.REJECTED) {
    request.status = status
    await request.save()
    return request
}

let conversation
try {
    conversation = await conversationRepository.create({
        data: {
            messageId: request.messageId,
            requestId: request._id,
            participants: [request.senderId, request.receiverId]
        }
    })
} catch (error) {
    if (error.code === 11000) {
        // unique index on messageId — a previous attempt already made it
        conversation = await conversationRepository.findOne({
            filter: { messageId: request.messageId }
        })
    } else {
        throw error
    }
}

// only now commit the status
request.status = status
await request.save()

return conversation
    
}
