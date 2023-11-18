import { productDao, cartDao, userDao, ticketDao } from "./persistenceFactory.js";

import {CartRepository, ProductRepository, UserRepository, TicketRepository} from "./repository.js";

export const ProductService = new ProductRepository(new productDao());
export const CartService = new CartRepository(new cartDao());
export const UserService = new UserRepository(new userDao());
export const TicketService = new TicketRepository(new ticketDao());
