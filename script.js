const DEFAULT_PRODUCTS = [
  {
    "id": "jf-tee",
    "name": "JF Signature Tee",
    "price": 499,
    "category": "T-Shirts",
    "badge": "CORE",
    "desc": "The everyday JF piece. Clean, heavyweight-inspired streetwear energy with the J-FORGES mark.",
    "colors": [
      "Black"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL"
    ],
    "images": [
      "assets/black-tee.jpg",
      "assets/black-tee-alt.jpg"
    ]
  },
  {
    "id": "jf-hoodie",
    "name": "JF Signature Hoodie",
    "price": 899,
    "category": "Hoodies",
    "badge": "CORE",
    "desc": "A clean JF hoodie with the signature mark across the chest and sleeves.",
    "colors": [
      "White"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL"
    ],
    "images": [
      "assets/white-hoodie.jpg",
      "assets/white-hoodie-alt.jpg"
    ]
  },
  {
    "id": "jf-crewneck",
    "name": "JF Forged Crewneck",
    "price": 799,
    "category": "Sweatshirts",
    "badge": "NEW",
    "desc": "Minimal from a distance. Distinctive up close. Built around the JF FORGES identity.",
    "colors": [
      "Black"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL"
    ],
    "images": [
      "assets/black-crewneck-front.jpg",
      "assets/black-crewneck-alt.jpg"
    ]
  },
  {
    "id": "jf-varsity",
    "name": "JF Varsity Jacket",
    "price": 1299,
    "category": "Outerwear",
    "badge": "STATEMENT",
    "desc": "The statement layer of the collection. Black-and-white varsity styling with JF graphics.",
    "colors": [
      "Black / White"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "2XL"
    ],
    "images": [
      "assets/varsity-front.jpg",
      "assets/varsity-back.jpg"
    ]
  },
  {
    "id": "jf-beanie",
    "name": "JF Forged Beanie",
    "price": 399,
    "category": "Accessories",
    "badge": "ESSENTIAL",
    "desc": "Ribbed black beanie finished with the JF FORGES mark.",
    "colors": [
      "Black"
    ],
    "sizes": [
      "One Size"
    ],
    "images": [
      "assets/black-beanie-front.png",
      "assets/black-beanie-back.png"
    ]
  },
  {
    "id": "jf-tote",
    "name": "JF Everyday Tote",
    "price": 349,
    "category": "Accessories",
    "badge": "ESSENTIAL",
    "desc": "A simple everyday carry with the JF FORGES graphic. Choose white or black handles.",
    "colors": [
      "White / White Handle",
      "White / Black Handle"
    ],
    "sizes": [
      "One Size"
    ],
    "images": [
      "assets/white-tote-white-handles.png",
      "assets/white-tote-black-handles.png"
    ]
  }
];
const ADMIN_PASSWORD = "JF2026";

let products = JSON.parse(localStorage.getItem("jf_products_v3") || "null") || DEFAULT_PRODUCTS;
let cart = JSON.parse(localStorage.getItem("jf_cart_v3") || "[]");
let orders = JSON.parse(localStorage.getItem("jf_orders_v3") || "[]");
let settings = JSON.parse(localStorage.getItem("jf_settings_v3") || "null") || {
  title:"JF ESSENTIALS",
  wa:"27700000000"
};
let activeCategory = "ALL";
let selectedProduct = null;
let selectedColor = null;
let selectedSize = null;
let currentImage = 0;

function money(n){ return "R" + Number(n).toLocaleString("en-ZA"); }
function saveAll(){
  localStorage.setItem("jf_products_v3", JSON.stringify(products));
  localStorage.setItem("jf_cart_v3", JSON.stringify(cart));
  localStorage.setItem("jf_orders_v3", JSON.stringify(orders));
  localStorage.setItem("jf_settings_v3", JSON.stringify(settings));
}
function toast(msg){
  const el=document.getElementById("toast"); el.textContent=msg; el.classList.add("show");
  clearTimeout(window._toast); window._toast=setTimeout(()=>el.classList.remove("show"),2200);
}
function openOverlay(){document.getElementById("overlay").classList.add("show")}
function closeAll(){closeCart();closeCheckout();closeAdmin();closeProduct()}
function openCart(){renderCart();document.getElementById("cart").classList.add("open");openOverlay()}
function closeCart(){document.getElementById("cart").classList.remove("open")}
function openCheckout(){
  if(!cart.length) return toast("Your bag is empty.");
  closeCart(); document.getElementById("checkout").classList.add("open");
  document.getElementById("checkoutTotal").textContent=money(cartTotal()); openOverlay();
}
function closeCheckout(){document.getElementById("checkout").classList.remove("open")}
function openAdmin(){document.getElementById("admin").classList.add("open");openOverlay()}
function closeAdmin(){document.getElementById("admin").classList.remove("open")}
function openProduct(id){
  selectedProduct=products.find(p=>p.id===id); if(!selectedProduct) return;
  selectedColor=selectedProduct.colors[0]; selectedSize=selectedProduct.sizes[0]; currentImage=0;
  document.getElementById("mName").textContent=selectedProduct.name;
  document.getElementById("mPrice").textContent=money(selectedProduct.price);
  document.getElementById("mDesc").textContent=selectedProduct.desc;
  renderModal();
  document.getElementById("productModal").classList.add("open");
}
function closeProduct(){document.getElementById("productModal").classList.remove("open")}
function renderModal(){
  const img=document.getElementById("mImg"); img.src=selectedProduct.images[currentImage];
  const thumbs=document.getElementById("mThumbs"); thumbs.innerHTML="";
  selectedProduct.images.forEach((src,i)=>{const x=document.createElement("img");x.src=src;x.className=i===currentImage?"active":"";x.onclick=()=>{currentImage=i;renderModal()};thumbs.appendChild(x)});
  renderChoices("mColors",selectedProduct.colors,selectedColor,v=>{selectedColor=v;renderModal()});
  renderChoices("mSizes",selectedProduct.sizes,selectedSize,v=>{selectedSize=v;renderModal()});
}
function renderChoices(id,arr,selected,onClick){
  const box=document.getElementById(id);box.innerHTML="";
  arr.forEach(v=>{const b=document.createElement("button");b.className="choice"+(v===selected?" selected":"");b.textContent=v;b.onclick=()=>onClick(v);box.appendChild(b)});
}
function addSelected(){
  if(!selectedProduct) return;
  const existing=cart.find(x=>x.productId===selectedProduct.id&&x.color===selectedColor&&x.size===selectedSize);
  if(existing) existing.qty++;
  else cart.push({productId:selectedProduct.id,name:selectedProduct.name,price:selectedProduct.price,color:selectedColor,size:selectedSize,qty:1,image:selectedProduct.images[0]});
  saveAll();updateBag();closeProduct();toast("Added to your bag.");
}
function cartTotal(){return cart.reduce((s,x)=>s+x.price*x.qty,0)}
function updateBag(){document.getElementById("bagCount").textContent=cart.reduce((s,x)=>s+x.qty,0)}
function renderCart(){
  const box=document.getElementById("cartItems");box.innerHTML="";
  if(!cart.length){box.innerHTML='<p class="hint">Your bag is empty. Start with the first JF drop.</p>';document.getElementById("cartTotal").textContent="R0";return}
  cart.forEach((x,i)=>{
    const d=document.createElement("div");d.className="cart-item";
    d.innerHTML=`<img src="${x.image}"><div><h4>${x.name}</h4><small>${x.color} · ${x.size}</small><div class="qty"><button onclick="changeQty(${i},-1)">−</button><b>${x.qty}</b><button onclick="changeQty(${i},1)">+</button></div></div><div><b class="price">${money(x.price*x.qty)}</b><br><button class="remove" onclick="removeItem(${i})">REMOVE</button></div>`;
    box.appendChild(d);
  });
  document.getElementById("cartTotal").textContent=money(cartTotal());
}
function changeQty(i,delta){cart[i].qty+=delta;if(cart[i].qty<=0)cart.splice(i,1);saveAll();updateBag();renderCart()}
function removeItem(i){cart.splice(i,1);saveAll();updateBag();renderCart()}
function categories(){
  const cats=["ALL",...new Set(products.map(p=>p.category))];
  const box=document.getElementById("filters");box.innerHTML="";
  cats.forEach(c=>{const b=document.createElement("button");b.className="filter"+(activeCategory===c?" active":"");b.textContent=c;b.onclick=()=>{activeCategory=c;renderProducts()};box.appendChild(b)});
}
function renderProducts(){
  categories();
  const list=activeCategory==="ALL"?products:products.filter(p=>p.category===activeCategory);
  document.getElementById("productCount").textContent=list.length+" PIECES";
  const box=document.getElementById("products");box.innerHTML="";
  list.forEach(p=>{
    const d=document.createElement("article");d.className="product";
    d.innerHTML=`<div class="product-img"><span class="badge">${p.badge||"JF"}</span><img src="${p.images[0]}" alt="${p.name}"></div><div class="product-info"><div class="meta"><div><h3>${p.name}</h3><div class="price">${money(p.price)}</div></div></div><p>${p.desc}</p><button class="product-btn" onclick="openProduct('${p.id}')">VIEW PIECE →</button></div>`;
    box.appendChild(d);
  });
}
function login(){
  if(document.getElementById("password").value!==ADMIN_PASSWORD) return toast("Wrong password.");
  document.getElementById("login").classList.add("hidden");document.getElementById("adminApp").classList.remove("hidden");
  renderAdmin();document.getElementById("password").value="";
}
function tab(id){
  ["productsTab","ordersTab","storeTab"].forEach(x=>document.getElementById(x).classList.toggle("hidden",x!==id));
}
function renderAdmin(){
  renderAdminProducts();renderAdminOrders();
  document.getElementById("titleSetting").value=settings.title;
  document.getElementById("waSetting").value=settings.wa;
}
function renderAdminProducts(){
  const box=document.getElementById("adminProducts");box.innerHTML="";
  products.forEach((p,i)=>{
    const d=document.createElement("div");d.className="admin-card";
    d.innerHTML=`<h4>${p.name}</h4>
      <div class="admin-image-grid">${(p.images||[]).map((src,j)=>`<div class="admin-image"><img src="${src}" alt="${p.name} photo ${j+1}"><button type="button" class="remove-image" onclick="removeProductImage(${i},${j})">×</button></div>`).join("")}</div>
      <label class="upload-label">ADD PRODUCT PHOTOS<input type="file" accept="image/*" multiple onchange="uploadProductImages(${i},this.files)"><small class="hint">Choose one or several photos from your phone.</small></label>
      <label>Name<input value="${p.name}" onchange="editProduct(${i},'name',this.value)"></label>
      <div class="row"><input type="number" value="${p.price}" onchange="editProduct(${i},'price',Number(this.value))"><button class="danger" onclick="deleteProduct(${i})">Delete</button></div>
      <label>Description<textarea onchange="editProduct(${i},'desc',this.value)">${p.desc}</textarea></label>`;
    box.appendChild(d);
  });
}

function uploadProductImages(i, files){
  if(!files || !files.length) return;
  const list=Array.from(files);
  let done=0;
  list.forEach(file=>{
    if(!file.type.startsWith('image/')) { done++; return; }
    const reader=new FileReader();
    reader.onload=()=>{
      products[i].images=products[i].images||[];
      products[i].images.push(reader.result);
      done++;
      if(done===list.length){ saveAll(); renderProducts(); renderAdminProducts(); toast('Product photo(s) added.'); }
    };
    reader.readAsDataURL(file);
  });
}
function removeProductImage(i,j){
  if(!products[i].images || products[i].images.length<=1) return toast('Keep at least one product photo.');
  products[i].images.splice(j,1);
  saveAll(); renderProducts(); renderAdminProducts(); toast('Photo removed.');
}
function editProduct(i,key,val){products[i][key]=val;saveAll();renderProducts();toast("Product updated.")}
function deleteProduct(i){if(!confirm("Delete this product?"))return;products.splice(i,1);saveAll();renderProducts();renderAdminProducts();toast("Product deleted.")}
function addProduct(){
  const id="jf-"+Date.now();
  products.unshift({id,name:"New JF Product",price:500,category:"New",badge:"NEW",desc:"Describe this JF piece.",colors:["Black"],sizes:["S","M","L","XL","2XL"],images:[products[0]?.images[0]||"assets/black-tee.jpg"]});
  saveAll();renderProducts();renderAdminProducts();toast("New product added. Edit its details below.");
}
function renderAdminOrders(){
  const box=document.getElementById("adminOrders");box.innerHTML="";
  if(!orders.length){box.innerHTML='<p class="hint">No orders saved yet.</p>';return}
  orders.slice().reverse().forEach(o=>{
    const d=document.createElement("div");d.className="order-card";
    d.innerHTML=`<h4>${o.name} — ${money(o.total)}</h4><div class="hint">${o.date}<br>${o.phone} · ${o.email}<br>${o.address}, ${o.city}, ${o.province}, ${o.country}</div><p>${o.items.map(x=>`${x.qty}× ${x.name} (${x.color}, ${x.size})`).join("<br>")}</p>`;
    box.appendChild(d);
  });
}
function clearOrders(){if(confirm("Clear all saved orders?")){orders=[];saveAll();renderAdminOrders();}}
function saveStore(){
  settings.title=document.getElementById("titleSetting").value.trim()||"JF ESSENTIALS";
  settings.wa=document.getElementById("waSetting").value.replace(/\D/g,"");
  saveAll();document.getElementById("storeTitle").textContent=settings.title;toast("Store settings saved.");
}
function placeOrder(e){
  e.preventDefault();if(!cart.length)return toast("Your bag is empty.");
  const o={
    id:"JF-"+Date.now(),
    date:new Date().toLocaleString("en-ZA"),
    name:document.getElementById("name").value,email:document.getElementById("email").value,
    phone:document.getElementById("phone").value,address:document.getElementById("address").value,
    city:document.getElementById("city").value,province:document.getElementById("province").value,
    country:document.getElementById("country").value,note:document.getElementById("note").value,
    total:cartTotal(),items:JSON.parse(JSON.stringify(cart))
  };
  orders.push(o);saveAll();
  let msg=`JF FORGES ORDER %0A%0AOrder: ${o.id}%0AName: ${o.name}%0AWhatsApp: ${o.phone}%0AEmail: ${o.email}%0AAddress: ${o.address}, ${o.city}, ${o.province}, ${o.country}%0A%0AITEMS%0A`;
  o.items.forEach(x=>msg+=`${x.qty}x ${x.name} — ${x.color} — ${x.size} — ${money(x.price*x.qty)}%0A`);
  msg+=`%0ASubtotal: ${money(o.total)}%0ANote: ${o.note||"None"}`;
  cart=[];saveAll();updateBag();closeCheckout();
  window.open("https://wa.me/"+(settings.wa||"27700000000")+"?text="+msg,"_blank");
  toast("Order saved. Opening WhatsApp.");
}
document.getElementById("storeTitle").textContent=settings.title;
renderProducts();updateBag();
