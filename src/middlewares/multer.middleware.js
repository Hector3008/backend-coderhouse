import multer from "multer";

let storage = multer.diskStorage({

  destination: function (req, file, cb) {
    let dest
    switch (file.fieldname) {
      case "Comprobante_de_domicilio ":
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
    cb(null, `src/public/${dest}`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploader = multer({ storage });
