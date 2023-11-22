// import cfg from "../config/config.js";
import {
  TicketService,
  CartService,
  ProductService,
  UserService
} from "../services/services.js";

export const getTicketsController = async (req, res) => {
  const tickets = await TicketService.getAll();

  res
    .status(202)
    .json({
      status: 202,
      message: "getTicketsController going on!",
      payload: tickets,
    });
};
export const getTicketController = async (req, res) => {
  const tid = req.params.tid;

  const ticket = await TicketService.getById(tid);

  res
    .status(202)
    .json({
      status: 202,
      message: "getTicketController going on!",
      payload: ticket,
    });
};

export const createTicketController = async (req, res) => {
  const cid = req.params.cid;
  const users = await UserService.getAll()
  
  const cart = await CartService.getCartById(cid);

    if (cart === null) {
      return res.status(404).json({ status: "error", error: "Not found" });
    }
      const catalog = await ProductService.getAll();
  let amount = 0;

  for (const i of cart.products) {
    for (const product of catalog) {
      const catProdId = product._id.toString();
      const cartProdId = i.product._id.toString();

      if (catProdId === cartProdId) {

        const prodToUpload = await ProductService.getById(catProdId);

        if (prodToUpload.stock < i.quantity) {
          console.log("your product request exceeds catalog's stock");
        } else {
          prodToUpload.stock = prodToUpload.stock - i.quantity;
          await ProductService.updateProd(catProdId, prodToUpload);
          amount = i.product.price * i.quantity + amount;      
/* trabajo para actualizacion del cart:
        const cartToUpload = await CartService.getCartById(cid);
        //console.log(cartToUpload.products);
        let cartToUpload2 = cartToUpload;
        
        for (const product of cartToUpload2) {
          console.log("test 3", product.product._id.toString())
          console.log("i.product._id: ", i.product._id.toString());
        }
        cartToUpload2.products.map(
          (product) =>
            product.product._id.toString() !== i.product._id.toString()
        );
        await CartService.updateCart(cartToUpload._id, cartToUpload2);
        console.log("cartToUpload2: ", cartToUpload2);*/
        }
      }
    }
  }
  const result = users.find(user=>user.cart._id.toString() === cart._id.toString())

  if (amount > 0) {
    const data = {
      amount: amount,
      products: cart.products,
      purchaser: result.email,
    };
    const ticket = await TicketService.create(data);

    cart.products = []
    CartService.updateCart(cid,cart);


    res.status(202).json({ status: 202, payload: ticket });
  } else {
    console.log("request not possible");
    res.status(500).json({
      status: 500,
      error: "request not possible, because ticket has no amount",
    });
  }
};

export const updateTicketController = async (req, res) => {
  const tid = req.params.tid;
  const data = { code: "5454", amount: 40 };
  const ticket = await TicketService.update(tid, data);
  console.log("ticket: ", ticket);
  res.send(ticket);
};

export const deleteTicketController = async (req, res) => {
  const tid = req.params.tid;

  const ticket = await TicketService.delete(tid);

  res.send(ticket);
};
