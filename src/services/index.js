import { productDao } from "./persistenceFactory.js";

import {ProductRepository} from "./repository.js";

export const ProductService = new ProductRepository(new productDao());
