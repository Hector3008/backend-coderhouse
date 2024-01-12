import chai from "chai";
import supertest from "supertest";
import { faker } from "@faker-js/faker";

const expect = chai.expect;
const requester = supertest("localhost:8080");

describe("Registro, Login and Current /api/sessions", async () => {
  const mockUser = {
    first_name: "Sebas",
    last_name: "Tian",
    email: faker.internet.email(),
    password: "secret",
    age: 23,
  };
  it("/api/sessions/register [POST] debe registrar un usuario", async () => {
    const result = await requester
      .post("/api/sessions/register")
      .send(mockUser);
    expect(result.status).to.be.equal(302);
    expect(result.headers.location).to.be.equal("/sessions");
  });
  let cookieResult;
  it("/api/sessions/login [POST] Debe loguear un user y devolver una cookie", async () => {
    const result = await requester.post("/api/sessions/login").send({
      email: mockUser.email,
      password: mockUser.password,
    });
    cookieResult = result.headers["set-cookie"][0];

    expect(cookieResult).to.not.be.undefined;
  });

  it("la cookie de login debe permitir acceder a urls protegidas", async () => {
    const result = await requester
      .get("/api/tickets/alltickets")
      .set("Cookie", cookieResult);

    expect(result.status).to.be.eq(202);
  });
  it("el carrito del usuario puede ser eliminado correctamente de la bdd",async()=>{
    const user = await requester.get(`/api/sessions/user/email/${mockUser.email}`)
    
    const cid = user._body.payload.cart
    
    const cdel = await requester.delete(`/api/carts/delete/${cid}`);

    expect(cdel.status).to.not.be.undefined
  })
  it("el usuario registrado se puede eliminar correctamente de la bdd", async ()=> {
    const result = await requester.delete(`/api/sessions/delete/${mockUser.email}`);

    expect(result.status).to.be.eq(200);
    
    
  })
});

describe("test de api/products [GET]", async () => {
  it("el endpoint GET /api/products debe devolver todos los productos (devuelve un array)", async function () {
    const response = await requester.get("/api/products");
    expect(response.status).to.be.equal(200);

    expect(Array.isArray(response._body.payload)).to.be.equal(true);
  });
});

describe("test de /api/carts/ [POST]", async () => {
  it("/api/sessions/carts [POST], debe crear un nuevo carro", async () => {
    const result = await requester.post("/api/carts");
    
    expect(result.status).to.be.eq(202);  

    const cid = result._body.payload._id;
    expect(result._body.payload).to.not.be.undefined;

    const cdel = await requester.delete(`/api/carts/delete/${cid}`);
    expect(cdel.status).to.not.be.undefined;
  });
});


