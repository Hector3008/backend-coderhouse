//hago el handshake (clientSocket)
const socket = io();

  const table = document.getElementById("realProductsTable");

  document.getElementById("createBtn").addEventListener("click", async (e) => {

    e.preventDefault();
    
    alert("boton activado");
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
      .then(() =>  fetch("/api/products"))
      .then((result) => result.json())
      .then((result) => {
        if (result.status === "error") throw alert("error!");

        socket.emit("productList", result.payload);

        alert("El producto se ha agregado con éxito!");

        //limpieza del formulario:
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("price").value = "";
        document.getElementById("code").value = "";
        document.getElementById("stock").value = "";
        document.getElementById("category").value = "";

        //este alert no se reproduce, no sé por qué:
        alert("se han limpiado los values del formulario");


      })
      .catch((err) => alert(`ocurrió un error: (\n ${err}`));
  }
  
  );
;

deleteProduct = async (id) => {

  await fetch(`/api/products/${id}`, {
    method: "delete",
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.value == "error") throw new Error(result.error);

      socket.emit("productList", result.payload);
      alert("producto eliminado!");

    })
    .catch((err) => alert(`error! (\n ${err}`));
};


  //NOTA: no poner ningún async antes del '(data)' de este socket... :
socket.on("updatedProducts", (data) => {
  //alert("io.on recibido");
  const tbdodyProducts = document.getElementById("tbdodyProducts");
  tbdodyProducts.innerHTML = `  `;

  for (product of data) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td><button class="btn btn-danger" onclick="deleteProduct(${product.id})">eliminar</button></td>
      
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price}</td>
      <td>${product.code}</td>
      <td>${product.stock}</td>
      <td>${product.category}</td>
    `;
    tbdodyProducts.appendChild(tr);
  }
});
