import CPSModel from "./CPS.scheema.js";

export default class CPSMongoDao {
  getAllSols = async () => await CPSModel.find().lean().exec();
  getSolById = async (id) => await CPSModel.findById(id).lean().exec();
  createSol = async (data) => await CPSModel.create(data);
  updateSol = async (id, data) =>
    await CPSModel.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    });
  deleteSol = async (id) => await CPSModel.findByIdAndDelete(id);
  findOne = async (data) => await CPSModel.findOne(data).lean().exec();
}