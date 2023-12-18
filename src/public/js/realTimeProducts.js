//este script trabaja con el .handlebars de realTimeProducts
//hago el handshake (clientSocket)
const socket = io();

function setupDeleteButtonListeners() {
  const deleteButtons = document.querySelectorAll(".btnDelete");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      const productId = deleteButton.getAttribute("data-product-id");
      deleteProduct(productId);
    });
  });
}
  document.getElementById("createBtn").addEventListener("click", async (e) => {

    e.preventDefault();

    var emailDiv = document.getElementById("email");
    var emailValue = emailDiv.getAttribute("data-value");
    var roleDiv = document.getElementById("role");
    var roleValue = roleDiv.getAttribute("data-value");
    let owner 
    roleValue==="premium"?owner = emailValue:owner=null

    //tomo los valores del formulario en el html para generar un nuevo objeto:
    const body = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      price: document.getElementById("price").value,
      thumbnail: ["sin imagen"],
      stock: document.getElementById("stock").value,
      category: document.getElementById("category").value,
      owner: owner||"admin"
    };

    fetch("/api/products", {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.error) throw new Error(result.error)
      })
      //aquí capturo la data de mi bdd con un fetch GET que está en mi productRouter:
      .then(() =>  fetch("/api/products"))
        //NOTA: después de cada .json van SIEMPRE unos parentesis... :
      .then((result) => result.json())
      .then((result) => {
        if (result.error) throw new Error(result.error);

        socket.emit("productList", result.payload);

        alert("El producto se ha agregado con éxito!");
        //limpio el formulario:
        document.getElementById("createForm").reset()
      })
      .catch((err) => alert(`ocurrió un error: (\n ${err}`));
  }
  
  );
;

  //NOTA: no poner NUNCA un async antes del '(data)' de este socket... :
socket.on("updatedProducts", (data) => {
  //con este socket pinto la tabla de de productos:
  const tbdodyProducts = document.getElementById("tbdodyProducts");
  tbdodyProducts.innerHTML = `  `;

  for (product of data) {

    let tr = document.createElement("tr");
    tr.innerHTML = `
              <td><button class="btn btn-danger btnDelete" data-product-id="${product._id}" >eliminar</button></td>      
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price}$</td>
      <td>${product.code}</td>
      <td>${product.stock}</td>
      <td>${product.category}</td>
    `;
    tbdodyProducts.appendChild(tr);
  }
  setupDeleteButtonListeners();
});

setupDeleteButtonListeners()

const deleteProduct = async (id) => {

  //este fetch DELETE está en productRouter.js:
  fetch(`/api/products/${id}`, {
    method: "delete",
  })
    //y me devuelve la bdd ya sin el artículo eliminado, por lo cual la cargo directo al siguiente paso:
    .then((result) => result.json())
    .then((result) => {
      console.log("estoy entrando al then");
      if (result.status == "error") {
        console.log("estoy entrando al if result.value");
        alert("product has been not eliminated")
        throw new Error(result.error)};
      socket.emit("productList", result.payload);
    })
    .catch((err) =>{
      console.log("estoy entrando al catch");
     alert(`error! (\n ${err}`)}
     );
};