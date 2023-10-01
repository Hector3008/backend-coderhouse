//hago el handshake (clientSocket)
const socket = io();

  document.getElementById("createBtn").addEventListener("click", async (e) => {

    e.preventDefault();
    
    //tomo los valores del formulario en el html para generar un nuevo objeto:
    const body = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      price: document.getElementById("price").value,
      thumbnail: ["sin imagen"],
      code: document.getElementById("code").value,
      stock: document.getElementById("stock").value,
      category: document.getElementById("category").value,
    };

    //cargo ese objeto con el método POST de mi router productRouter.js

    fetch("/api/products", {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.status === "error") throw alert("error!");
      })
      //aquí capturo la data de mi bdd con un fetch GET que está en mi productRouter:
      .then(() =>  fetch("/api/products"))
        //NOTA: después de cada .json van SIEMPRE unos parentesis... :
      .then((result) => result.json())
      .then((result) => {
        if (result.status === "error") throw alert("error!");

        socket.emit("productList", result.payload);

        alert("El producto se ha agregado con éxito!");

        //limpio el formulario:
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("price").value = "";
        document.getElementById("code").value = "";
        document.getElementById("stock").value = "";
        document.getElementById("category").value = "";

      })
      .catch((err) => alert(`ocurrió un error: (\n ${err}`));
  }
  
  );
;

  //NOTA: no poner NUNCA un async antes del '(data)' de este socket... :
socket.on("updatedProducts", (data) => {
  
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
  
});

const deleteButtons = document.querySelectorAll(".btnDelete");

deleteButtons.forEach((deleteButton) => {
  deleteButton.addEventListener("click", () => {
    const productId = deleteButton.getAttribute("data-product-id");
    deleteProduct(productId);
  });
});

const deleteProduct = async (id) => {
  alert("deleteProduct() iniciado");

  //este fetch DELETE está en productRouter.js:
  fetch(`/api/products/${id}`, {
    method: "delete",
  })
    //y me devuelve la bdd ya sin el artículo eliminado, por lo cual la cargo directo al siguiente paso:
    .then((result) => result.json())
    .then((result) => {
      if (result.value == "error") throw new Error(result.error);

      socket.emit("productList", result.payload);
      alert("producto eliminado!");
    })
    .catch((err) => alert(`error! (\n ${err}`));
};