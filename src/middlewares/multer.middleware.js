import multer from "multer";
import path from 'path'
import fs from 'fs'

let storage = multer.diskStorage({

  destination: function (req, file, cb) {
    let dest
    switch (file.fieldname) {
      case "Comprobante_de_domicilio":
        dest = "documents";
        break;
      case "Identificacion":
        dest = "documents";
        break;
      case "Comprobante_de_estado_de_cuenta":
        dest = "documents";
        break;
      case "products":
        dest = "products";
        break;
      case "profiles":
        dest = "profiles";
        break;
      default:
        dest = "trash";
        break;
    }

     const user = "user";
     const folderPath = path.join("src/public/", user, dest);

    fs.promises
      .mkdir(folderPath, { recursive: true })
      .then(() => {
        cb(null, folderPath);
      })
      .catch((err) => {
        cb(err, null);
      });
  },
  
  filename: function (req, file, cb) {
    const extention = file.originalname.split(".").pop();
    cb(null, file.fieldname + "." + extention);
  },
});

export const uploader = multer({ storage });


