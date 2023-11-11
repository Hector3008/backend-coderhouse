import { productDao, cartDao } from "./persistenceFactory.js";

import {CartRepository, ProductRepository} from "./repository.js";

export const ProductService = new ProductRepository(new productDao());
export const CartService = new CartRepository(new cartDao());

