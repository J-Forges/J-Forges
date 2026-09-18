const cfg=window.JF_SUPABASE||{};
let db=null;
if(window.supabase&&cfg.url&&cfg.anonKey) db=window.supabase.createClient(cfg.url,cfg.anonKey);

const DEFAULT_PRODUCTS=[{"id": "jf-tee", "name": "JF Signature Tee", "price": 499, "category": "T-Shirts", "badge": "CORE", "desc": "The everyday JF piece. Clean streetwear energy with the J-FORGES mark.", "colors": ["Black"], "sizes": ["S", "M", "L", "XL", "2XL"], "prices": {"S": 499, "M": 499, "L": 499, "XL": 549, "2XL": 599}, "images": [{"src": "assets/black-tee.jpg", "color": "Black"}, {"src": "assets/black-tee-alt.jpg", "color": "Black"}]}, {"id": "jf-hoodie", "name": "JF Signature Hoodie", "price": 899, "category": "Hoodies", "badge": "CORE", "desc": "A clean JF hoodie with the signature mark across the chest and sleeves.", "colors": ["White"], "sizes": ["S", "M", "L", "XL", "2XL"], "prices": {"S": 899, "M": 899, "L": 899, "XL": 949, "2XL": 999}, "images": [{"src": "assets/white-hoodie.jpg", "color": "White"}, {"src": "assets/white-hoodie-alt.jpg", "color": "White"}]}, {"id": "jf-black-hoodie", "name": "JF Black Hoodie", "price": 899, "category": "Hoodies", "badge": "DROP", "desc": "The black JF hoodie with the forged mark across the chest and sleeves.", "colors": ["Black"], "sizes": ["S", "M", "L", "XL", "2XL"], "prices": {"S": 899, "M": 899, "L": 899, "XL": 949, "2XL": 999}, "images": [{"src": "assets/f7dba205-97d9-498d-b7bc-35da53e72261.png", "color": "Black"}, {"src": "assets/8a370447-8ea5-4831-8681-395703150a20.png", "color": "Black"}]}, {"id": "jf-crewneck", "name": "JF Forged Crewneck", "price": 799, "category": "Sweatshirts", "badge": "NEW", "desc": "Minimal from a distance. Distinctive up close. Built around the JF FORGES identity.", "colors": ["Black"], "sizes": ["S", "M", "L", "XL", "2XL"], "prices": {"S": 799, "M": 799, "L": 799, "XL": 849, "2XL": 899}, "images": [{"src": "assets/black-crewneck-front.jpg", "color": "Black"}, {"src": "assets/black-crewneck-alt.jpg", "color": "Black"}]}, {"id": "jf-varsity", "name": "JF Varsity Jacket", "price": 1299, "category": "Outerwear", "badge": "STATEMENT", "desc": "The statement layer of the collection. Black-and-white varsity styling with JF graphics.", "colors": ["Black / White"], "sizes": ["S", "M", "L", "XL", "2XL"], "prices": {"S": 1299, "M": 1299, "L": 1299, "XL": 1399, "2XL": 1499}, "images": [{"src": "assets/varsity-front.jpg", "color": "Black / White"}, {"src": "assets/varsity-back.jpg", "color": "Black / White"}]}, {"id": "jf-beanie", "name": "JF Forged Beanie", "price": 399, "category": "Accessories", "badge": "ESSENTIAL", "desc": "Ribbed black beanie finished with the JF FORGES mark.", "colors": ["Black"], "sizes": ["One Size"], "prices": {"One Size": 399}, "images": [{"src": "assets/black-beanie-front.png", "color": "Black"}, {"src": "assets/black-beanie-back.png", "color": "Black"}]}, {"id": "jf-tote", "name": "JF Everyday Tote", "price": 349, "category": "Accessories", "badge": "ESSENTIAL", "desc": "A simple everyday carry with the JF FORGES graphic.", "colors": ["White / White Handle", "White / Black Handle"], "sizes": ["One Size"], "prices": {"One Size": 349}, "images": [{"src": "assets/white-tote-white-handles.png", "color": "White / White Handle"}, {"src": "assets/white-tote-black-handles.png", "color": "White / Black Handle"}]}];
let products=JSON.parse(localStorage.getItem("jf_products_v3")||"null")||DEFAULT_PRODUCTS;
let cart=JSON.parse(localStorage.getItem("jf_cart_v3")||"[]");
let settings=JSON.parse(localStorage.getItem("jf_settings_v3")||"null")||{title:"JF ESSENTIALS",wa:"",email:""};
let activeCategory="ALL",selectedProduct=null,selectedColor=null,selectedSize=null,currentImage=0;

const $=id=>document.getElementById(id);
const money=n=>"R"+Number(n||0).toLocaleString("en-ZA");
const toast=m=>{const e=$("toast");if(!e)return;e.textContent=m;e.classList.add("show");clearTimeout(window._toast);window._toast=setTimeout(()=>e.classList.remove("show"),2200)};
const saveLocal=()=>{localStorage.setItem("jf_products_v3",JSON.stringify(products));localStorage.setItem("jf_cart_v3",JSON.stringify(cart));localStorage.setItem("jf_settings_v3",JSON.stringify(settings))};

async function loadCloud(){
  if(!db)return;
  try{
    const r=await db.from("products").select("*").order("sort_order",{ascending:true});
    if(!r.error&&r.data&&r.data.length){
      products=r.data.map(p=>({...p,images:Array.isArray(p.images)?p.images:[],colors:Array.isArray(p.colors)?p.colors:[],sizes:Array.isArray(p.sizes)?p.sizes:[],prices:p.prices||{}}));
      saveLocal();
    }
    const s=await db.from("store_settings").select("key,value");
    if(!s.error)s.data.forEach(x=>settings[x.key]=x.value);
    saveLocal();
  }catch(e){console.warn(e)}
}

function openOverlay(){$("overlay").classList.add("show")}
function closeAll(){closeCart();closeCheckout();closeProduct()}
function openCart(){renderCart();$("cart").classList.add("open");openOverlay()}
function closeCart(){$("cart").classList.remove("open");if(!$("checkout").classList.contains("open")&&!$("productModal").classList.contains("open"))$("overlay").classList.remove("show")}
function openCheckout(){if(!cart.length)return toast("Your bag is empty.");closeCart();$("checkout").classList.add("open");$("checkoutTotal").textContent=money(cartTotal());openOverlay();syncOrderButton()}
function closeCheckout(){$("checkout").classList.remove("open");if(!$("cart").classList.contains("open")&&!$("productModal").classList.contains("open"))$("overlay").classList.remove("show")}

function imageList(p,color){
  return (p.images||[]).filter(x=>typeof x==="string"||x.color===color).map(x=>typeof x==="string"?x:x.src);
}
function openProduct(id){
  selectedProduct=products.find(p=>String(p.id)===String(id));if(!selectedProduct)return;
  selectedColor=(selectedProduct.colors||["Default"])[0];
  selectedSize=(selectedProduct.sizes||["One Size"])[0];currentImage=0;
  renderModal();$("productModal").classList.add("open");openOverlay();
  history.pushState({product:id},"",location.pathname+location.search+"#product-"+encodeURIComponent(id));
}
function closeProduct(){
  if(!$("productModal").classList.contains("open"))return;
  $("productModal").classList.remove("open");
  if(location.hash.startsWith("#product-"))history.back();
  else if(!$("cart").classList.contains("open")&&!$("checkout").classList.contains("open"))$("overlay").classList.remove("show");
}
window.addEventListener("popstate",()=>{$("productModal").classList.remove("open");if(!$("cart").classList.contains("open")&&!$("checkout").classList.contains("open"))$("overlay").classList.remove("show")});

function renderModal(){
  const pics=imageList(selectedProduct,selectedColor);
  const list=pics.length?pics:["assets/black-tee.jpg"];
  if(currentImage>=list.length)currentImage=0;
  $("mImg").src=list[currentImage];
  $("mPrice").textContent=money(selectedProduct.prices?.[selectedSize]??selectedProduct.price);
  $("mThumbs").innerHTML=list.map((src,i)=>`<button class="thumb ${i===currentImage?"active":""}" onclick="currentImage=${i};renderModal()"><img src="${src}"></button>`).join("");
  $("mColors").innerHTML=(selectedProduct.colors||[]).map(c=>`<button class="choice ${c===selectedColor?"selected":""}" onclick='selectColor(${JSON.stringify(c)})'>${c}</button>`).join("");
  $("mSizes").innerHTML=(selectedProduct.sizes||[]).map(s=>`<button class="choice ${s===selectedSize?"selected":""}" onclick='selectSize(${JSON.stringify(s)})'>${s} — ${money(selectedProduct.prices?.[s]??selectedProduct.price)}</button>`).join("");
}
function selectColor(c){selectedColor=c;currentImage=0;renderModal()}
function selectSize(s){selectedSize=s;renderModal()}
function addSelected(){
  const price=Number(selectedProduct.prices?.[selectedSize]??selectedProduct.price??0);
  const existing=cart.find(x=>x.productId===selectedProduct.id&&x.color===selectedColor&&x.size===selectedSize);
  if(existing)existing.qty++;else cart.push({productId:selectedProduct.id,name:selectedProduct.name,price,color:selectedColor,size:selectedSize,qty:1,image:imageList(selectedProduct,selectedColor)[0]||"assets/black-tee.jpg"});
  saveLocal();updateBag();closeProduct();toast("Added to your bag.");
}

function cartTotal(){return cart.reduce((s,x)=>s+Number(x.price||0)*Number(x.qty||0),0)}
function updateBag(){$("bagCount").textContent=cart.reduce((s,x)=>s+Number(x.qty||0),0)}
function renderCart(){
  const box=$("cartItems");
  if(!cart.length){box.innerHTML='<p class="hint">Your bag is empty. Start with the first JF drop.</p>';$("cartTotal").textContent="R0";return}
  box.innerHTML=cart.map((x,i)=>`<div class="cart-item"><img src="${x.image}"><div><h4>${x.name}</h4><small>${x.color} · ${x.size}</small><div class="qty"><button onclick="changeQty(${i},-1)">−</button><b>${x.qty}</b><button onclick="changeQty(${i},1)">+</button></div></div><div><b class="price">${money(x.price*x.qty)}</b><br><button class="remove" onclick="removeItem(${i})">REMOVE</button></div></div>`).join("");
  $("cartTotal").textContent=money(cartTotal());
}
function changeQty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);saveLocal();updateBag();renderCart()}
function removeItem(i){cart.splice(i,1);saveLocal();updateBag();renderCart()}

function categories(){
  const cats=["ALL",...new Set(products.map(p=>p.category||"JF"))];
  $("filters").innerHTML=cats.map(c=>`<button class="filter ${activeCategory===c?"active":""}" onclick='activeCategory=${JSON.stringify(c)};renderProducts()'>${c}</button>`).join("");
}
function renderProducts(){
  categories();
  const list=activeCategory==="ALL"?products:products.filter(p=>(p.category||"JF")===activeCategory);
  $("productCount").textContent=list.length+" PIECES";
  $("products").innerHTML=list.map(p=>{
    const first=imageList(p,(p.colors||["Default"])[0])[0]||"assets/black-tee.jpg";
    const from=p.sizes?.length?Math.min(...p.sizes.map(s=>Number(p.prices?.[s]??p.price??0))):Number(p.price||0);
    return `<article class="product"><div class="product-img"><span class="badge">${p.badge||"JF"}</span><img src="${first}" alt="${p.name}" loading="lazy"></div><div class="product-info"><div class="meta"><div><h3>${p.name}</h3><div class="price">From ${money(from)}</div></div></div><p>${p.desc||""}</p><button class="product-btn" onclick='openProduct(${JSON.stringify(p.id)})'>VIEW PIECE →</button></div></article>`;
  }).join("");
}

function syncOrderButton(){$("placeOrderButton").textContent=$("orderMethod").value==="email"?"PLACE ORDER → EMAIL →":"PLACE ORDER → WHATSAPP →"}
async function placeOrder(e){
  e.preventDefault();if(!cart.length)return toast("Your bag is empty.");
  const method=$("orderMethod").value,name=$("name").value.trim(),email=$("email").value.trim(),phone=$("phone").value.trim(),address=$("address").value.trim(),city=$("city").value.trim(),province=$("province").value.trim(),country=$("country").value.trim(),note=$("note").value.trim();
  if(!name||!email||!address||!city||!province||!country)return toast("Please complete your details.");
  if(method==="whatsapp"&&!phone)return toast("Add your WhatsApp number for WhatsApp orders.");
  const o={id:"JF-"+Date.now(),date:new Date().toLocaleString("en-ZA"),name,email,phone,address,city,province,country,note,total:cartTotal(),items:JSON.parse(JSON.stringify(cart)),method};
  if(db){const r=await db.from("orders").insert({id:o.id,name:o.name,email:o.email,phone:o.phone,address:o.address,city:o.city,province:o.province,country:o.country,note:o.note,total:o.total,items:o.items,method:o.method});if(r.error)console.warn(r.error)}
  let items=o.items.map(x=>`${x.qty}x ${x.name} — ${x.color} — ${x.size} — ${money(x.price*x.qty)}`).join("\n");
  let msg=`JF FORGES ORDER\n\nOrder: ${o.id}\nName: ${name}\nWhatsApp: ${phone||"Not provided"}\nEmail: ${email}\nAddress: ${address}, ${city}, ${province}, ${country}\n\nITEMS\n${items}\n\nSubtotal: ${money(o.total)}\nNote: ${note||"None"}`;
  cart=[];saveLocal();updateBag();closeCheckout();
  if(method==="whatsapp"){const n=(settings.wa||"").replace(/\D/g,"");if(!n)return toast("Set the JF WhatsApp number in Admin.");window.open("https://wa.me/"+n+"?text="+encodeURIComponent(msg),"_blank")}
  else {if(!settings.email)return toast("Set the JF order email in Admin.");location.href="mailto:"+settings.email+"?subject="+encodeURIComponent("JF FORGES Order "+o.id)+"&body="+encodeURIComponent(msg)}
  toast("Order saved.");
}

(async()=>{await loadCloud();$("storeTitle").textContent=settings.title||"JF ESSENTIALS";renderProducts();updateBag();})();
