window.addEventListener("load", () => {
  let cardIn = document.querySelectorAll(".product_img");
  cardIn.forEach((element) => {
    element.addEventListener("click", () => {
      let ele = $(element).attr("cardId");
      window.location.href = ele;
    });
  });

  let writeLike = document.querySelectorAll(".writeLike");
  let clickLike = document.querySelectorAll(".clickLike");
  clickLike.forEach((element, value) => {
    element.addEventListener(
      "click",
      () => {
        let id = $(element).attr("likeId");
        // console.log(id)
        fetch(id, {
          method: "POST",
        })
          .then((data) => data.json())
          .then((data) => {
            writeLike.forEach((elem, val) => {
              if (value == val) {
                elem.innerHTML = data.like;
                console.log(data);
              }
            });
          });
      },
      { once: true }
    );
  });

//   let phoneNumber = document.getElementById("phoneNumber");
//   phoneNumber.addEventListener("click", () => {
//     phoneclick.innerHTML = auth.phone;
//   });
  function change() {
    console.log(phone);
  }
});
