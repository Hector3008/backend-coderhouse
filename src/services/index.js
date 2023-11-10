import { productDao } from "./persistenceFactory.js";

import {CartRepository, ProductRepository} from "./repository.js";

export const ProductService = new ProductRepository(new productDao());

