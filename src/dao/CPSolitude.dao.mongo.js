import CPSolitudeModel from "./CPSolitude.scheema.js";

export default class CPSolitudeMongoDAO {
  getAllSols = async () => await CPSolitudeModel.find().lean().exec();
  getSolById = async (id) => await CPSolitudeModel.findById(id).lean().exec();
  createSol = async (data) => await CPSolitudeModel.create(data);
  updateSol = async (id, data) =>
    await CPSolitudeModel.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    });
  deleteSol = async (id) => await CPSolitudeModel.findByIdAndDelete(id);
  findOne = async (data) => await CPSolitudeModel.findOne(data).lean().exec();
}