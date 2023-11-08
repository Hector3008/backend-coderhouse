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
