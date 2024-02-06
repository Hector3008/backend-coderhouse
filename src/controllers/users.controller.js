import { UserService } from "../services/services.js";
import UserDTO from "../dto/users.dto.js";
import moment from "moment";
import mailer from "../config/mailer.config.js";

export const getUsersController = async (req, res) => {
  const result = await UserService.getAll();

  const mapResult = result.map((e) => new UserDTO(e));

  res.status(202).json({
    status: "success",
    message: "users request successfully",
    payload: mapResult,
  });
};
export const getUsersViewController = async (req, res) => {
  /*
  Crear una vista para poder visualizar, modificar el rol y eliminar un usuario. Esta vista únicamente será
accesible para el administrador del ecommerce */
  const users = await UserService.getAll();
  const mapResult = users.map((e) => new UserDTO(e));

  res.render("users.handlebars", { users: mapResult });
};
export const formToDocumentsController = async (req, res) => {
  res.render("formToDocuments.handlebars");
};
export const deleteUsersController = async (req, res) => {
  const currentDate = moment();
  const users = await UserService.getAll();

  let usersOff = [];
  let usersOn = [];

  users.forEach(async (user) => {
    const lastConnectionDate = moment(user.last_connection);
    const diffDays = currentDate.diff(lastConnectionDate, "days");

    if (diffDays > 2) {
      usersOff.push(user);
      const body = {
        intro: "tu cuenta ha sido eliminada!",
        table: {
          data: [
            {
              user,
            },
          ],
        },
        outro:
          "si crees que ha sido un error de nuestra parte por favor comunicate con nosotros",
      };
      mailer(
        user.email,
        body,
        "<E-commerce message!>",
        "your product has beed deleted by our staff"
      );
      await UserService.delete(user._id);
    } else {
      usersOn.push(user);
    }
  });

  res.status(202).json({
    status: "success",
    message: "users deleted successfully",
    payload: {
      "users deleted": deletedUsers,
      "users still on database": survivers,
    },
  });
};
export const deleteUserController = async (req, res) => {
  const uid = req.params.uid;
  if (!uid)
    return res
      .status(404)
      .json({
        status: "error",
        message: `user with ID=${uid} deleted successfully`,
      });
  if(req.session.user._id===uid)return res.status(400).json({ status: "error", message: `user can not delete his own account using this method` });  
  const deletedUser = await UserService.delete(uid);
  res.status(200).json({
    status: "success",
    message: `user with ID=${uid} deleted successfully`,
    payload: deletedUser,
  });
};
export const userDocumentsController = async (req, res) => {
  const id = req.params.uid;
  const documents = await UserService.getDocuments(id);
  return res.status(200).json({
    status: "success",
    message: "documents request successfully",
    payload: documents,
  });
};
export const createDocumentsController = async (req, res) => {
  console.log("req.files: ", req.files);
  const user = await UserService.findOne({ email: "hhosep@gmail.com" });

  let document;
  req.files.forEach((element) => {
    document = { name: element.fieldname, reference: element.path };
    console.log(" user.documents:  ", user.documents);

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
  const user = await UserService.getById(req.params.uid);

  if (!user)
    return res.status(404).json({
      status: "error",
      message: `user with Id= ${req.params.uid} does not found`,
    });

  try {
    let updatedUser;
    /*
this switch dinamic if for admins. which means, it DOES NOT require the documents validation:  ↓↓↓
 */
    if (req.session.user.role === "admin") {
      switch (user.role) {
        case "premium":
          user.role = "user";
          updatedUser = await UserService.update(req.params.uid, user);
          break;
        case "user":
          user.role = "premium";
          updatedUser = await UserService.update(req.params.uid, user);
          break;
        case "admin":
          throw new Error("you cant change an admin role as this way");
        default:
          break;
      }
    } else {
      /*
this switch dinamic if for users. which means, it requires the documents validation:  ↓↓↓
*/
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
        case "admin":
          throw new Error("you cant change an admin role as this way");
        default:
          break;
      }
    }

    res.json({
      status: "success",
      message: "Se ha actualizado el rol del usuario",
      payload: updatedUser,
    });
  } catch (err) {
    res.json({ status: "error", error: err.message });
  }
};
