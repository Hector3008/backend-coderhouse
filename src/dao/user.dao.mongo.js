import userModel from "./user.scheema.js";

    export const getAllUser = async () =>
      await userModel.find().lean().exec();
    export const getUserById = async (id) =>
      await userModel.findById(id).lean().exec();
    export const createUser = async (data) =>
      await userModel.create(data);
    export const updateUser = async (id, data) =>
      await userModel.findByIdAndUpdate(id, data, {
        returnDocument: "after",
      });
    export const deleteUser = async (id) =>
      await userModel.findByIdAndDelete(id);