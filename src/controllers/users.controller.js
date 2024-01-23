import { UserService } from "../services/services.js";

export const getUsersController = (req, res) => {
  console.log("getUsersController initiallized");
  res.send("getUsersController initiallized");
};
export const userDocumentsController = async (req, res) => {
  console.log("userDocumentsController initialized");
  const id = req.params.uid;
  const documents = await UserService.getDocuments(id);
  return res.status(200).json({
    status: "success",
    message: "documents request successfully",
    payload: documents,
  });
};
export const createDocumentsController = async (req, res) => {
  //let user = req.session.user
  const user = await UserService.findOne({ email: "hhosep@gmail.com" });

  user.documents;
  let document;
  req.files.forEach((element) => {
    document = { name: element.fieldname, reference: element.path };
    user.documents.push(document);
  });

  const updatedUser = await UserService.update(user._id, user);

  res.json({
    status: "success",
    message: "documents updated successfully on user",
    payload: updatedUser,
  });
};

export const updateToPremiumController = async (req, res) => {
  try {
    const user = await UserService.getById(req.params.uid);

    let updatedUser;

    switch (user.role) {
      case "user":
        const documents = user.documents;
        var documentosBuscados = [
          "Comprobante_de_domicilio",
          "Identificacion",
          "Comprobante_de_estado_de_cuenta",
        ];
        var encontrados = 0;

        for (var i = 0; i < documents.length; i++) {
          if (documentosBuscados.includes(documents[i].name)) {
            encontrados++;
          }
        }
        if (encontrados < documentosBuscados.length)
          return res.status(400).json({
            status: "error",
            message: "require documents does not found",
          });
        user.role = "premium";
        updatedUser = await UserService.update(req.params.uid, user);
        break;
      case "premium":
        user.role = "user";
        updatedUser = await UserService.update(req.params.uid, user);
        break;
      default:
        break;
    }
    res.json({
      status: "success",
      message: "Se ha actualizado el rol del usuario",
      payload: updatedUser,
    });
  } catch (err) {
    console.log("catch initialized");
    res.json({ status: "error", error: err.message });
  }
};
