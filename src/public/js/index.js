//este archivo trabaja con el .handlebar de 'realTimeProducts'.

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

    await fetch("/api/products", {
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
      .then(() => fetch("/api/products"))
      .then((result) => result.json)
      .then((result) => {
        if (result.status === "error") throw alert("error!");
        socket.emit("productList", result.payload);

        alert("El producto se ha agregado con éxito!");

        //limpieza del formulario
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("price").value = "";
        document.getElementById("code").value = "";
        document.getElementById("stock").value = "";
        document.getElementById("category").value = "";

        //resuelvo circunstancialmente la vista dinámica con este método para refrescar y actualizar la página desde el http, WebSocket no me corre bien:
        window.location.reload();
      })
      .catch((err) => alert(`ocurrió un error: (\n ${err}`));
  }
  
  );
;

//delete products funciona! Elimina los productos pero no actualiza los productos de la tabla :(
deleteProduct = async (id) => {
  fetch(`/api/products/${id}`, {
    method: "delete",
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.value == "error") throw new Error(result.error);

      socket.emit("productList", result.payload);
      alert("producto eliminado!");

      //resuelvo circunstancialmente la vista dinámica con este método para refrescar y actualizar la página desde el http, WebSocket no me corre bien:
      window.location.reload();
    })
    .catch((err) => alert(`error! (\n ${err}`));
};

//el socket no me está pintando la lista después de eliminar el producto :(
socket.on("updatedProducts", (data) => {
  alert("io.on recibido");
  data = json.stringify(data);
  table.innerHTML = `  `;

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
  }
});
