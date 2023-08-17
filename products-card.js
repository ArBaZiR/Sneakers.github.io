//====//

//====//

Products.forEach(({ id, title, price, img }) => {
  const CardItem = `
    <div class="card" data-id="${id}">
    <img src="${img}" alt="" />
    <p class="card__title">${title}</p>
    <div>
      <div>
        <p>ЦЕНА:</p>
        <div class="price__block">
          <div class="card__price">${price}</div>
          <p class="currency">руб.</p>
        </div>
      </div>
      <button class="add-to-cart bckg-image" ></button>
    </div>
  </div>
`;
  document.querySelector(".card__block").innerHTML += CardItem;
  //
});

//====//

class BasketProducts {
  constructor() {
    // document.querySelectorAll(".add-to-cart").forEach((el) => {
    //   el.onclick = () => {
    //     let id = el.closest("div").closest(".card").dataset.id;
    //     let img = el.closest("div").closest(".card").children[0].src;
    //     let title = el.closest("div").closest(".card").children[1].innerText;
    //     let price =
    //       el.closest("div").children[0].children[1].children[0].innerText;
    //     ///
    //     if (StorageLocal.getProducts().indexOf(id) === -1) {
    //       this.AddToBasket(id, img, title, price);
    //       shoppIng.parse();
    //     } else {
    //       document.querySelectorAll(".card").forEach((el) => {
    //         StorageLocal.getProducts().forEach(() => {
    //           if (id == el.dataset.id) {
    //             el.classList.remove("active");
    //           }
    //         });
    //       });
    //       //
    //       document.querySelectorAll(".inBasket").forEach((el) => {
    //         if (id === el.dataset.id) {
    //           el.remove();
    //           let costNum = Number(price.replace(/\s/g, ""));
    //           document.querySelector(".cart-price").innerText -= costNum;
    //           this.BasketContent();
    //           //
    //         }
    //       });
    //       //
    //       StorageLocal.addProducts(id);
    //     }
    //   };
    // });

    document.querySelectorAll(".card").forEach((el) => {
      el.onclick = () => {
        let id = el.dataset.id;
        let img = el.children[0].src;
        let title = el.children[1].innerText;
        let price =
          el.children[2].children[0].children[1].children[0].innerText;
        ///
        if (StorageLocal.getProducts().indexOf(id) === -1) {
          this.AddToBasket(id, img, title, price);
          shoppIng.parse();
        } else {
          document.querySelectorAll(".card").forEach((el) => {
            StorageLocal.getProducts().forEach(() => {
              if (id == el.dataset.id) {
                el.classList.remove("active");
              }
            });
          });
          //
          document.querySelectorAll(".inBasket").forEach((el) => {
            if (id === el.dataset.id) {
              el.remove();
              let costNum = Number(price.replace(/\s/g, ""));
              document.querySelector(".cart-price").innerText -= costNum;
              this.BasketContent();
              //
            }
          });
          //
          StorageLocal.addProducts(id);
        }
      };
    });

    document.querySelector(".cart").onclick = () => {
      document.querySelector(".basket__block").classList.add("active");
      document.querySelector(".opacity").classList.add("active");
    };

    document.querySelector(".go-back-btn").onclick = () => {
      this.Opacity();
    };

    document.querySelector(".opacity").onclick = () => {
      this.Opacity();
    };
  }

  ///
  AddToBasket(id, img, title, price) {
    const NewCard = `
   <div class="card inBasket" data-id="${id}">
    <div> 
      <img src="${img}" alt="" />
      <div> 
        <p class="card__title">${title}</p>
        <div class="price__block">
          <div class="card__price">${price}</div>
          <p class="currency">руб.</p>
          </div>
        </div>
        <button class="delete-card-btn bckg-image"></button>
      </div>
    </div>
  </div>
  `;
    ///

    StorageLocal.addProducts(id);
    this.CartPriceAdd(price);
    document.querySelector(".basket__products").innerHTML += NewCard;
    this.DeleteCard();
    this.BasketContent();
  }

  DeleteCard() {
    document.querySelectorAll(".delete-card-btn").forEach((el) => {
      el.onclick = () => {
        el.closest("div").closest("div").closest(".card").remove();
        this.BasketContent();
        let cost =
          el.closest("div").children[1].children[1].children[0].innerText;
        this.CartPriceDel(cost);
        let id = el.closest("div").closest("div").closest(".card").dataset.id;
        const productsInStore = StorageLocal.getProducts();
        const index = productsInStore.indexOf(id);
        document.querySelectorAll(".card").forEach((el) => {
          StorageLocal.getProducts().forEach(() => {
            if (id == el.dataset.id) {
              el.classList.remove("active");
            }
          });
        });
        localStorage.removeItem(productsInStore.splice(index, 1));
        localStorage.setItem("products", JSON.stringify(productsInStore));
        ///
      };
    });
  }

  CartPriceAdd(price) {
    let cartNum = Number(document.querySelector(".cart-price").innerText);
    let cartNumAll = (document.querySelector(".cart-price").innerText =
      cartNum + Number(price.replace(/\s/g, "")));
    //
    document.querySelector(".cost").innerText = cartNumAll;
    //
    document.querySelector(".tax").innerText = cartNumAll * 0.05 + cartNumAll;
  }

  CartPriceDel(cost) {
    document.querySelector(".cart-price").innerText -= cost.replace(/\s/g, "");
    document.querySelector(".cost").innerText -= cost.replace(/\s/g, "");
    //
    document.querySelector(".tax").innerText -=
      0.05 * cost.replace(/\s/g, "") + Number(cost.replace(/\s/g, ""));
  }

  BasketContent() {
    if (document.querySelector(".basket__products").innerHTML == 0) {
      document.querySelector(".basket-empty").classList.remove("active");
      document.querySelector(".basket__products").classList.remove("active");
      document.querySelector(".basket__prise").classList.remove("active");
    } else {
      document.querySelector(".basket-empty").classList.add("active");
      document.querySelector(".basket__products").classList.add("active");
      document.querySelector(".basket__prise").classList.add("active");
    }
  }

  Opacity() {
    document.querySelector(".basket__block").classList.remove("active");
    document.querySelector(".opacity").classList.remove("active");
  }
}

let newBasketProducts = new BasketProducts();

class LocalStorageUtil {
  constructor() {
    this.keyName = "products";
  }

  getProducts() {
    const productsLocalStorage = localStorage.getItem(this.keyName);
    if (productsLocalStorage !== null) {
      return JSON.parse(productsLocalStorage);
    }
    return [];
  }

  addProducts(id) {
    let products = this.getProducts();
    let pushProduct = false;
    let index = products.indexOf(id);

    if (index === -1) {
      products.push(id);
      pushProduct = true;
    } else {
      products.splice(index, 1);
    }

    localStorage.setItem(this.keyName, JSON.stringify(products));
    return {
      pushProduct,
      products,
    };
  }
}

let StorageLocal = new LocalStorageUtil();

//
class Shopping {
  render() {
    const productsInStore = StorageLocal.getProducts();
    //
    Products.forEach(({ id, title, price, img }) => {
      if (productsInStore.indexOf(id) !== -1) {
        document.querySelector(".basket__products").innerHTML += `
        <div class="card inBasket" data-id="${id}">
         <div> 
           <img src="${img}" alt="" />
           <div> 
             <p class="card__title">${title}</p>
             <div class="price__block">
               <div class="card__price">${price}</div>
               <p class="currency">руб.</p>
               </div>
             </div>
             <button class="delete-card-btn bckg-image"></button>
           </div>
         </div>
       </div>
       `;
        newBasketProducts.DeleteCard();
        newBasketProducts.CartPriceAdd(price);
      }
    });
  }
  //Проверка на всё окно
  parse() {
    let card = document.querySelectorAll(".card");
    for (let i = 0; i < card.length; i++) {
      const elem = card[i];
      ///
      StorageLocal.getProducts().forEach((el) => {
        if (el === elem.dataset.id) {
          elem.classList.add("active");
        }
      });
    }
    document.querySelectorAll(".card").forEach((elem) => {
      StorageLocal.getProducts().forEach((el) => {
        if (el == elem.dataset.id) {
          elem.classList.add("active");
        }
      });
    });
  }
}
let shoppIng = new Shopping();
shoppIng.render();
shoppIng.parse();

window.addEventListener("DOMContentLoaded", () =>
  newBasketProducts.BasketContent()
);
