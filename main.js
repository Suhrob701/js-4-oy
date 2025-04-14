const container = document.getElementById('pizza-container');
const cartTotal = document.getElementById('cart-total'); // Savat umumiy narxi
const cartCount = document.getElementById('cart-count'); // Savatdagi mahsulotlar soni
const goToCartButton = document.getElementById('go-to-cart'); // Savatga o'tish tugmasi

let allPizzas = []; // Barcha pizzalar
let cart = []; // Savat

// JSON fayl manzilingiz
const API_URL = "https://run.mocky.io/v3/f5975f42-d772-46cf-aeb8-f3a77d82b112";

// Barcha pizzalarni olish
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    allPizzas = data.pizzas;
    renderPizzas(allPizzas);
  })
  .catch(err => console.error(err));

  function renderPizzas(pizzas) {
    container.innerHTML = ''; // Bosh sahifa oldindan mavjud bo'lsa, uni tozalash
    pizzas.forEach(pizza => {
      const pizzaCard = document.createElement('div');
      pizzaCard.className = 'pizza-card';
      pizzaCard.innerHTML = `
        <img src="${pizza.imageUrl}" alt="${pizza.title}" width="200" />
        <h3>${pizza.title}</h3>
        <p>от ${pizza.price} ₽</p>
        <div class="types">
          ${pizza.types.map(type => `<button>${type}</button>`).join('')}
        </div>
        <div class="sizes">
          ${pizza.sizes.map(size => `<button>${size} см.</button>`).join('')}
        </div>
        <button class="add-btn" data-id="${pizza.id}" data-price="${pizza.price}" data-title="${pizza.title}">+ Добавить</button>
      `;
      container.appendChild(pizzaCard);
    });
  
    // Har bir "add-btn" tugmasi uchun hodisa qo'shish
    document.querySelectorAll('.add-btn').forEach(button => {
      button.addEventListener('click', addToCart);
    });
  }
  

// Kategoriyalar bo'yicha filtrlash
document.querySelectorAll('.filters button').forEach(button => {
  button.addEventListener('click', (e) => {
    const category = e.target.textContent.toLowerCase();
    let filteredPizzas = allPizzas;

    if (category !== "все") {
      filteredPizzas = allPizzas.filter(pizza => {
        // Filter pizzas based on category
        if (category === "мясные" && pizza.category === 0) return true;
        if (category === "вегетарианская" && pizza.category === 1) return true;
        if (category === "гриль" && pizza.category === 2) return true;
        if (category === "острые" && pizza.category === 3) return true;
        if (category === "закрытые" && pizza.category === 4) return true;
        return false;
      });
    }

    // Show filtered pizzas
    renderPizzas(filteredPizzas);

    // Update active class for filters
    document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
  });
});

// Sarlavhani tanlash bo'yicha tartib
document.querySelector('.sort select').addEventListener('change', (e) => {
  const sortOption = e.target.value;
  let sortedPizzas = [...allPizzas];

  if (sortOption === "по цене") {
    sortedPizzas.sort((a, b) => a.price - b.price);
  } else if (sortOption === "по алфавиту") {
    sortedPizzas.sort((a, b) => a.title.localeCompare(b.title));
  }

  renderPizzas(sortedPizzas);
});

// Savatga pizza qo'shish
function addToCart(event) {
  const pizzaId = event.target.getAttribute('data-id');
  const pizzaPrice = parseInt(event.target.getAttribute('data-price'));
  const pizzaTitle = event.target.getAttribute('data-title');

  // Savatga yangi pizza qo'shish
  const pizzaIndex = cart.findIndex(item => item.id === pizzaId);
  if (pizzaIndex === -1) {
    cart.push({ id: pizzaId, price: pizzaPrice, title: pizzaTitle, quantity: 1 });
  } else {
    cart[pizzaIndex].quantity += 1;
  }

  // Savatni yangilash
  updateCart();
}

// Savatni yangilash
function updateCart() {
  let total = 0;
  let count = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    count += item.quantity;
  });

  cartTotal.innerText = `${total} ₽`;
  cartCount.innerText = `${count} 🛒`;

  // Savatni localStorage'ga saqlash
  localStorage.setItem('cart', JSON.stringify(cart));
}


// "Go to cart" tugmasi uchun hodisa
goToCartButton.addEventListener('click', () => {
  // Ikkinchi sahifaga o'tish
  window.location.href = 'cart.html'; // 'cart.html' sahifasiga o'tadi (sahifa nomini o'zgartirishingiz mumkin)
});


