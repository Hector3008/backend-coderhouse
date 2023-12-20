import {
  productDao,
  cartDao,
  userDao,
  ticketDao,
  CPSDao,
} from "./persistenceFactory.js";

import {
  CartRepository,
  ProductRepository,
  UserRepository,
  TicketRepository,
  CPSRepository,
} from "./repository.js";

export const ProductService = new ProductRepository(new productDao());
export const CartService = new CartRepository(new cartDao());
export const UserService = new UserRepository(new userDao());
export const TicketService = new TicketRepository(new ticketDao());
export const CPSService = new CPSRepository(new CPSDao());
