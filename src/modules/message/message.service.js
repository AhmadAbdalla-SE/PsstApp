import { NotFoundException } from "../../common/exceptions/index.js";
import * as messageRepository from "../../common/repository/message.repository.js";
import * as userRepository from "../../common/repository/user.repository.js";

export const createMessage = async ({content, receiverId }={}, files = [], user = undefined)=>{
    const checkReceiverExist = await userRepository.findById({
        id: receiverId
    })
    
    if (!checkReceiverExist) {
        throw NotFoundException("Invalid receiver Id")
    }
    const message = await messageRepository.create({
        data: {
            receiverId,
            content,
            attachments: files.map(ele => ele.path),
            ...(user ? { senderId: user._id } : {})
        }
    })
    return message;
}
export const getAllMessages = async ({type, page , limit} = {} ,user = undefined)=>{
    let filter = {};
    if (type == "0") {
        filter = {receiverId: user._id}
    }
    else if (type == "1"){ 
        filter = {senderId: user._id}
    }
    else {
        filter = {
            $or: [
                {senderId: user._id},
                {receiverId: user._id}
            ]
        }
    }
    const data = await messageRepository.paginate({
        filter, 
        page,
        limit,
        options:{
            sort: {createdAt: -1}
        }
    })
    
    return data
}

export const getMessage = async ({messageId},user)=>{
    const data = await messageRepository.findOne({
        filter:{
            receiverId: user._id, 
            _id: messageId
        }
    })
    if (!data) {
        throw NotFoundException("Invalid Message Id")
    }
    return data
}
export const deleteMessage = async ({messageId},user)=>{
    const data = await messageRepository.deleteOne({
        filter:{
            receiverId: user._id, 
            _id: messageId
        }
    })
    if (!data.deletedCount) {
        throw NotFoundException("Invalid Message Id")
    }
    return data
}