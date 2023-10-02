alert('addProductToCart.js script leído')

let addProductToCart = (pid) => {
  
  alert("addProductToCart() ejecutado!");
  
  fetch(`/api/carts`, {
    method: "post",
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
      return result.payload._id;
    })
    .then((cid) =>
      fetch(`/api/carts/${cid}/product/${pid}`, {
        method: "post",
      })
    )
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
      alert(
        `Ok. Todo salió bien! :)\nEl producto se agregó al carrito con id=${result.payload._id}!`
      );
    })
    .catch((err) => alert(`Ocurrió un error :(\n${err}`));
};
