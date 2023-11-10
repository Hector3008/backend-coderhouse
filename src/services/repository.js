export class ProductRepository {
    
    constructor(dao) {
        this.dao = dao
    }
    getAll = async() => await this.dao.getAllProds()
    getById = async(id) => await this.dao.getProdById(id)
    getAllPaginate = async(req, PORT) => await this.dao.getAllProdsPaginate(req, PORT)
    createProd = async(data) => await this.dao.createProd(data)
    updateProd = async(id, data) => await this.dao.updateProd(id, data)
    deleteProd = async(id) => await this.dao.deleteProd(id)
}

export class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getProductsFromCart = async () => await this.dao.getProductsFromCart();
  getAllCartsPaginate = async () => await this.dao.getAllCartsPaginate();
  getAllCarts = async () => await this.dao.getAllCarts()
  getCartById = async () => await this.dao.getCartById()
  createCart = async () => await this.dao.createCart()
  updateCart = async () => await this.dao.updateCart()
  deleteCart = async () => await this.dao.deleteCart()
}