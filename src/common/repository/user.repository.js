import { UserModel } from '../../DB/model/user.model.js';
import * as base from './base.repository.js'
export const findOne = async ({ 
    filter={}, 
    options = {} 
} = {}) => {
    return await base.findOne({filter, options, model:UserModel})
};
export const create = async ({ 
    data, 
    options 
}) => {
  return await base.create({model: UserModel, data, options})
};
export const createOne = async ({
    data = {},
    options = {validateBeforeSave: true}
} = {}) => {
    return await base.createOne({model:UserModel, data, options})
}
export const findById = async ({ 
    id, 
    options, 
}) => {
  return await base.findById({model:UserModel, id, options })
};
export const find = async ({ 
    filter, 
    options, 
} = {}) => {
 return await base.find({model:UserModel, filter, options})
};
export const countDocuments = async ({ 
    filter, 
} = {}) => {
  return await base.countDocuments({model:UserModel, filter});
};
export const paginate = async ({
  filter = {},
  options = {},
  page = 1,
  limit = 5,
} = {}) => {
    return await base.paginate({model:UserModel, limit, filter, page, options});
};
export const insertMany = async ({ data }) => {
  return await base.insertMany({model: UserModel, data})
};
export const updateOne = async ({ 
    filter, 
    update, 
    options, 
} = {}) => {
  return await base.updateOne({model: UserModel, filter, update, options})
};
export const findOneAndUpdate = async ({
  filter,
  update,
  options,
} = {}) => {
    return await base.findOneAndUpdate({model: UserModel, filter, update, options})

};
export const findByIdAndUpdate = async ({
  id,
  update,
  options = { new: true },
}) => {
    return await base.findByIdAndUpdate({model: UserModel, update, options, id})

};
export const deleteOne = async ({ filter }) => {
  return await base.deleteOne({model:UserModel, filter});
};
export const deleteMany = async ({ filter }) => {
  return await base.deleteMany({model:UserModel, filter});
};
export const findOneAndDelete = async ({ filter } = {}) => {
  return await base.findOneAndDelete({model:UserModel, filter});
};
