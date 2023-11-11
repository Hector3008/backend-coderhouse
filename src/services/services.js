import { productDao, cartDao, userDao } from "./persistenceFactory.js";

import {CartRepository, ProductRepository, UserRepository} from "./repository.js";

export const ProductService = new ProductRepository(new productDao());
export const CartService = new CartRepository(new cartDao());
export const UserService = new UserRepository(new userDao())
