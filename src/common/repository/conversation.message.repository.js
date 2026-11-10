import { ConversationMessageModel } from '../../DB/model/index.js';
import * as base from './base.repository.js';
export const findOne = async ({ 
    filter={}, 
    options = {} 
} = {}) => {
    return await base.findOne({filter, options, model:ConversationMessageModel})
};
export const create = async ({ 
    data, 
    options 
}) => {
  return await base.create({model: ConversationMessageModel, data, options})
};
export const createOne = async ({
    data = {},
    options = {validateBeforeSave: true}
} = {}) => {
    return await base.createOne({model:ConversationMessageModel, data, options})
}
export const findById = async ({ 
    id, 
    options, 
}) => {
  return await base.findById({model:ConversationMessageModel, id, options })
};
export const find = async ({ 
    filter, 
    options, 
} = {}) => {
 return await base.find({model:ConversationMessageModel, filter, options})
};
export const countDocuments = async ({ 
    filter, 
} = {}) => {
  return await base.countDocuments({model:ConversationMessageModel, filter});
};
export const paginate = async ({
  filter = {},
  options = {},
  page = 1,
  limit = 5,
} = {}) => {
    return await base.paginate({model:ConversationMessageModel, limit, filter, page, options});
};
export const insertMany = async ({ data }) => {
  return await base.insertMany({model: ConversationMessageModel, data})
};
export const updateOne = async ({ 
    filter, 
    update, 
    options, 
} = {}) => {
  return await base.updateOne({model: ConversationMessageModel, filter, update, options})
};
export const findOneAndUpdate = async ({
  filter,
  update,
  options,
} = {}) => {
    return await base.findOneAndUpdate({model: ConversationMessageModel, filter, update, options})

};
export const findByIdAndUpdate = async ({
  id,
  update,
  options = { new: true },
}) => {
    return await base.findByIdAndUpdate({model: ConversationMessageModel, update, options, id})

};
export const deleteOne = async ({ filter }) => {
  return await base.deleteOne({model:ConversationMessageModel, filter});
};
export const deleteMany = async ({ filter }) => {
  return await base.deleteMany({model:ConversationMessageModel, filter});
};
export const findOneAndDelete = async ({ filter } = {}) => {
  return await base.findOneAndDelete({model:ConversationMessageModel, filter});
};
