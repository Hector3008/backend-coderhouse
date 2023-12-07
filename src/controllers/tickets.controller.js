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

  let prodsToTicket = []
  let prodsToCart = []

    if (cart === null) {
      return res.status(404).json({ status: "error", error: "Not found" });
    }
      const catalog = await ProductService.getAll();
  let amount = 0;

  for (const cartProd of cart.products) {
    for (const product of catalog) {
      const catProdId = product._id.toString();
      const cartProdId = cartProd.product._id.toString();

      if (catProdId === cartProdId) {

        const prodToUpload = await ProductService.getById(catProdId);

        if (prodToUpload.stock < cartProd.quantity) {
          prodsToCart.push(cartProd);
        } else {
          prodToUpload.stock = prodToUpload.stock - cartProd.quantity;
          await ProductService.updateProd(catProdId, prodToUpload);
          prodsToTicket.push(cartProd);
          amount = cartProd.product.price * cartProd.quantity + amount;
        }
      }
    }
  }
  const cartData = {
    _id: cid,
    products: prodsToCart,
  };
      await CartService.updateCart(cid, cartData);
      const user = users.find(
  (user) => user.cart._id.toString() === cart._id.toString()
);
  if (amount > 0) {
    const Ticketdata = {
      amount: amount,
      products: prodsToTicket,
      purchaser: user.email,
    };
    const ticket = await TicketService.create(Ticketdata);

    res.status(202).json({ status: 202, payload: ticket, prodsToCart: prodsToCart });
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
