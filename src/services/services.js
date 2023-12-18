import { productDao, cartDao, userDao, ticketDao, CPSolitudeDao } from "./persistenceFactory.js";

import {CartRepository, ProductRepository, UserRepository, TicketRepository, CPSolitudeRepository} from "./repository.js";

export const ProductService = new ProductRepository(new productDao());
export const CartService = new CartRepository(new cartDao());
export const UserService = new UserRepository(new userDao());
export const TicketService = new TicketRepository(new ticketDao());
export const CPSolitudeService = new CPSolitudeRepository(new CPSolitudeDao());
