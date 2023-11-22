
import twilio from "twilio";
import cfg from "../config/config.js";

export const sendSMS = (req, res) => {
  const accountSid = cfg.TWILIO_ACCOUNT_SID;
  const authToken = cfg.TWILIO_AUTH_TOKEN;

  const client = twilio(accountSid, authToken);

  client.messages
    .create({
      body: "This is the ship that made the Kessel Run in fourteen parsecs?",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+51942270712",
    })
    .then((message) => res.send(message));
};

export const checkoutCartController = async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cartToPurchase = await CartService.getCartById(cartId);
    console.log("cartToPurchase", cartToPurchase);

    if (!cartToPurchase) {
      return res
        .status(404)
        .json({ error: `Cart with id ${cartId} not found!` });
    }

    const successfulPurchases = [];
    const failedPurchases = [];

    let totalAmount = 0;

    for (const cartProduct of cartToPurchase.products) {
      const { productId, quantity } = cartProduct;

      console.log("product in for const of", productId);
      console.log("quantity", quantity);

      const productToPurchase = await ProductService.getById(productId._id);
      console.log("productToPurchase", productToPurchase);

      if (!productToPurchase) {
        failedPurchases.push({
          productId: productId._id,
          quantity: quantity,
          error: `Product with id=${productId._id} does not exist. Cannot purchase this product.`,
        });
        continue; // Move to the next iteration
      }

      if (quantity <= productToPurchase.stock) {
        // Update product stock
        productToPurchase.stock -= quantity;

        await ProductService.update(productToPurchase._id, {
          stock: productToPurchase.stock,
        });

        // Calculate total amount
        totalAmount += productToPurchase.price * quantity;

        // Add product details to successfulPurchases
        successfulPurchases.push({
          product: productToPurchase._id, // Assuming you want to store the product ID
          price: productToPurchase.price,
          quantity: quantity,
        });
      } else {
        // If the product stock is less than the quantity, add to failedPurchases
        failedPurchases.push({
          productId: productId._id,
          quantity: quantity,
          error: `Product with id=${productId._id} and title ${productId.title} does not have enough stock. Cannot purchase this product. Stock: ${productToPurchase.stock}`,
        });
      }
    }

    const data = {
      _id: cartToPurchase._id,
      products: failedPurchases,
    };
    // Update cart with products that were successfully purchased
    await CartService.updateCart(data);
    console.log("successfulPurchases", successfulPurchases);
    console.log("failedPurchases", failedPurchases);

    // Create ticket
    const ticketCode = shortid.generate();
    const purchaserEmail = req.user.user.email;

    const ticketResult = await TicketService.create({
      purchaseCode: ticketCode,
      products: successfulPurchases,
      totalAmount,
      buyerEmail: purchaserEmail,
    });

    return res.status(201).json({
      status: "success",
      payload: ticketResult,
      message: `Successfully purchased products. Ticket code: ${ticketCode}`,
      failedPurchases: failedPurchases,
    });
  } catch (error) {
    console.error(chalk.red(`Error checking out cart: ${error.message}`));
    return res.status(500).json({ status: "error", error: error.message });
  }
};