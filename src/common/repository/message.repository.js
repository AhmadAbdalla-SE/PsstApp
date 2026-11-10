import { MessageModel } from '../../DB/model/message.model.js';
import * as base from './base.repository.js'
export const findOne = async ({ 
    filter={}, 
    options = {} 
} = {}) => {
    return await base.findOne({filter, options, model:MessageModel})
};
export const create = async ({ 
    data, 
    options 
}) => {
  return await base.create({model: MessageModel, data, options})
};
export const createOne = async ({
    data = {},
    options = {validateBeforeSave: true}
} = {}) => {
    return await base.createOne({model:MessageModel, data, options})
}
export const findById = async ({ 
    id, 
    options, 
}) => {
  return await base.findById({model:MessageModel, id, options })
};
export const find = async ({ 
    filter, 
    options, 
} = {}) => {
 return await base.find({model:MessageModel, filter, options})
};
export const countDocuments = async ({ 
    filter, 
} = {}) => {
  return await base.countDocuments({model:MessageModel, filter});
};
export const paginate = async ({
  filter = {},
  options = {},
  page = 1,
  limit = 5,
} = {}) => {
    return await base.paginate({model:MessageModel, limit, filter, page, options});
};
export const insertMany = async ({ data }) => {
  return await base.insertMany({model: MessageModel, data})
};
export const updateOne = async ({ 
    filter, 
    update, 
    options, 
} = {}) => {
  return await base.updateOne({model: MessageModel, filter, update, options})
};
export const findOneAndUpdate = async ({
  filter,
  update,
  options,
} = {}) => {
    return await base.findOneAndUpdate({model: MessageModel, filter, update, options})

};
export const findByIdAndUpdate = async ({
  id,
  update,
  options = { new: true },
}) => {
    return await base.findByIdAndUpdate({model: MessageModel, update, options, id})

};
export const deleteOne = async ({ filter }) => {
  return await base.deleteOne({model:MessageModel, filter});
};
export const deleteMany = async ({ filter }) => {
  return await base.deleteMany({model:MessageModel, filter});
};
export const findOneAndDelete = async ({ filter } = {}) => {
  return await base.findOneAndDelete({model:MessageModel, filter});
};
