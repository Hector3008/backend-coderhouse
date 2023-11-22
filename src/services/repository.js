export class ProductRepository {
    
    constructor(dao) {
        this.dao = dao
    }
    getAll = async() => await this.dao.getAllProds()
    getById = async(id) => await this.dao.getProdById(id)
    getAllPaginate = async(req, res) => await this.dao.getAllProdsPaginate(req, res)
    createProd = async(data) => await this.dao.createProd(data)
    updateProd = async(id, data) => await this.dao.updateProd(id, data)
    deleteProd = async(id) => await this.dao.deleteProd(id)
}

export class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getProductsFromCart = async (req, res) =>
    await this.dao.getProductsFromCart(req, res);
  getAllCartsPaginate = async (req, res) =>
    await this.dao.getAllCartsPaginate(req, res);
  getAllCarts = async () => await this.dao.getAllCarts();
  getCartById = async (id) => await this.dao.getCartById(id);
  createCart = async (data) => await this.dao.createCart(data);
  updateCart = async (id, data) => await this.dao.updateCart(id, data);
  deleteCart = async (id) => await this.dao.deleteCart(id);
}

export class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAll = async () => await this.dao.getUsers();
  getById = async (id) => await this.dao.getById(id);
  create = async (data) => await this.dao.create(data);
  update = async (id, data) => await this.dao.update(id, data);
  delete = async (id) => await this.dao.delete(id);
  findOne = async (data) => await this.dao.findOne(data);
}

export class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAll = async () => await this.dao.getAllTickets();
  getById = async (id) => await this.dao.getTicketById(id);
  create = async (data) => await this.dao.createTicket(data);
  update = async (id, data) => await this.dao.updateTicket(id, data);
  delete = async (id) => await this.dao.deleteTicket(id);
}
