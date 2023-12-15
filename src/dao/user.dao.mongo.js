import userModel from "./user.scheema.js";

export default class UserMongoDao {
  getUsers = async () => await userModel.find().lean().exec();
  getById = async (id) => await userModel.findById(id).lean().exec();
  create = async (data) => await userModel.create(data);
  update = async (id, data) =>
    await userModel.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    });
  delete = async (id) => await userModel.findByIdAndDelete(id);
  findOne = async (data) => await userModel.findOne(data);
}