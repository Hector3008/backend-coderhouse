import cfg from "../config/config.js";
import Stripe from "stripe";
import {
  CartService,
  TicketService,
  ProductService,
  UserService,
} from "../services/services.js";
import mailer from "../config/mailer.config.js";

const stripe = new Stripe(cfg.STRIPE_SECRET_KEY);

export const createStripeSession = async (req, res) => {
  const cart = await CartService.getCartById(req.session.user.cart);
  let items = [];

  let prodsToTicket = [];
  let prodsToCart = [];

  const catalog = await ProductService.getAll();

  let amount = 0;
  let ticket;
  
  for (const cartProd of cart.products) {
    for (const catProd of catalog) {
      const catProdId = catProd._id.toString();
      const cartProdId = cartProd.product._id.toString();

      if (catProdId === cartProdId) {
        if (catProd.stock < cartProd.quantity) {
          prodsToCart.push(cartProd);
        } else {
          prodsToTicket.push(cartProd);
          amount = cartProd.product.price * cartProd.quantity + amount;
        }
      }
    }
  }
  if (amount > 0) {
    const Ticketdata = {
      amount: amount,
      products: prodsToTicket,
      purchaser: req.session.user.email,
    };
    ticket = await TicketService.create(Ticketdata);
  }

  cart.products.forEach((prod) => {
    const item = {
      price_data: {
        product_data: {
          name: prod.product.title,
          description: prod.product.description,
        },
        currency: "usd",
        unit_amount: parseInt(prod.product.price * 100),
      },
      quantity: prod.quantity,
    };
    items.push(item);
  });

  const session = await stripe.checkout.sessions.create({
    line_items: items,
    mode: "payment",
    success_url: `http://localhost:8080/api/checkout/success/${ticket._id}`,
    cancel_url: `http://localhost:8080/api/checkout/cancel/${ticket._id}`,
  });
  return res.json(session);
};

export const successController = async (req, res) => {
  /*step 1:
  declaración de variables */
  const oid = req.params.oid;

  const ticket = await TicketService.getById(oid);
  const user = await UserService.findOne({ email: ticket.purchaser });
  const cart = await CartService.getCartById(user.cart);
  const catalog = await ProductService.getAll();

  let cartUpdated;
  /*step 2: 
  recorro el carrito y el catalogo para tomar sus items y actualizarlos según el descuento que corresponde a la operación.*/

  for (const ticketProd of ticket.products) {
    const cartProdFind = cart.products.find(
      (cartProd) =>
        cartProd.product._id.toString() === ticketProd.product._id.toString()
    );
    if (cartProdFind) {
      cartProdFind.quantity -= ticketProd.quantity;
      if (cartProdFind.quantity <= 0) {
        cartUpdated = cart.products.filter((cartUpdatedProd) => {
          cartUpdatedProd.product._id.toString() !==
            cartProdFind.product._id.toString();
        });
      } else {
        cartUpdated.push(cartProdFind);
      }
    }
  }
  for (const ticketProd of ticket.products) {
    const catProdFind = catalog.find(
      (catProd) => catProd._id.toString() === ticketProd.product._id.toString()
    );
    if (catProdFind) {
      catProdFind.stock -= ticketProd.quantity;
      await ProductService.updateProd(catProdFind._id, catProdFind);
    }
  }
  /*step 3: 
  actualizo los objetos: */
  cart.products = cartUpdated;
  await CartService.updateCart(cart._id, cart);
  ticket.status = "paid";
  const ticketUpdater = await TicketService.update(ticket._id, ticket);
  const ticketMailer = await TicketService.getById(ticketUpdater._id);
  /*step 4:
   envío el correo al usuario: */
  let mailerBody = {
    intro: "su pedido de compra se ha procesado exitosamente",
    table: {
      data: [],
    },
    outro: "Gracias por su compra",
  };
  ticketMailer.products.forEach((e) => {
    //console.log("p: ", e.product.title, "q: ", e.quantity);
    const item = {
      title: e.product.title,
      "price by unity": e.product.price,
      quantity: e.quantity,
      "amount by row": e.quantity * e.product.price,
    };
    mailerBody.table.data.push(item);
  });
  mailer(user.email, mailerBody, "<e-commerce>", "payment ticket");
  /*
  step 5: envío el redirect. (stripe no me dejó cargar render ni props)*/
  res.redirect(`/tickets/${ticketUpdater._id}`);
};
export const cancelController = async (req, res) => {
  const oid = req.params.oid
  await TicketService.delete(oid);
  res.redirect("/tickets/faillure");
};

export const viewController = async (req, res) => {};
