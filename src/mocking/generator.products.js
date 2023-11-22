import { fakerES as faker } from "@faker-js/faker";

export const generateProducts = () => {
    const products = [];
    for (let index = 0; index < 100; index++) {
         const product = {
           title: faker.commerce.product(),
           price: faker.commerce.price(),
         };
      products.push(product);
    }
    return products;
};

