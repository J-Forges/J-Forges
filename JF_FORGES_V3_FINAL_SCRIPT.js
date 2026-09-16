const ADMIN_PASSWORD="JF2026";
const WHATSAPP_NUMBER="277XXXXXXXXX"; // Replace with your JF WhatsApp number, no + or spaces.
const ORDER_EMAIL="YOUR-EMAIL@example.com"; // Replace with the email that should receive orders.

const defaults=[
  {id:1,name:"JF Signature Hoodie",desc:"A core JF piece built for the beginning.",category:"Hoodies",colors:["Black","Purple","Cream"],sizes:["S","M","L","XL","2XL"],prices:{S:699,M:699,L:699,XL:749,"2XL":799},images:[]},
  {id:2,name:"JF Core Tee",desc:"Everyday streetwear with the JF identity.",category:"T-Shirts",colors:["Black","White","Purple","Navy"],sizes:["S","M","L","XL","2XL"],prices:{S:399,M:399,L:399,XL:449,"2XL":499},images:[]}
];

let products=JSON.parse(localStorage.jf_products||"null")||defaults;
let cart=JSON.parse(localStorage.jf_cart||"[]");
let orders=JSON.parse(localStorage.jf_orders||"[]");
let editId=null;
let photoEditId=null;
let photoColor=null;
let photoDraft=[];
let state={id:null,color:null,size:null,img:0};
let modalHistory=false;

const $=id=>document.getElementById(id);
const save=()=>{
  localStorage.jf_products=JSON.stringify(products);
  localStorage.jf_cart=JSON.stringify(cart);
  localStorage.jf_orders=JSON.stringify(orders);
};
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const hex=c=>({black:"#080808",white:"#f5f5f5",purple:"#7d3cff",violet:"#7d3cff",navy:"#182b55",blue:"#2355a4",red:"#b92b2b",green:"#397447",cream:"#e8d7b1",beige:"#d7c2a0",brown:"#704b35",grey:"#777",gray:"#777",gold:"#d4af37",yellow:"#e3c42b",orange:"#e8752d",pink:"#d66b8f"}[String(c).toLowerCase()]||"#888");
const img=(p,c,i=0)=>{
  const a=(p.images||[]).filter(x=>x.color===c);
  return a[i]?.src||`https://placehold.co/900x1000/171717/ffffff?text=${encodeURIComponent(p.name+" — "+c)}`;
};

function render(){
  $("products").innerHTML=products.map(p=>`<article class="product">
    <div class="cover" onclick="openProduct(${p.id})"><img src="${img(p,p.colors[0])}" alt="${esc(p.name)}"></div>
    <div class="info"><h3>${esc(p.name)}</h3><p class="muted">${esc(p.desc)}</p>
      <div class="price">From R${Math.min(...p.sizes.map(s=>+p.prices[s]||0))}</div>
      <div class="swatches">${p.colors.map((c,i)=>`<button class="swatch ${i?'':'active'}" title="${esc(c)}" style="background:${hex(c)}" onclick="preview(event,${p.id},'${esc(c)}',this)"></button>`).join("")}</div>
    </div></article>`).join("");
  $("productCount").textContent=products.length+" PIECES";
}

function preview(e,id,c,b){
  e.stopPropagation();
  b.parentElement.querySelectorAll(".swatch").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  b.closest(".product").querySelector("img").src=img(products.find(p=>p.id===id),c);
}

function openProduct(id){
  const p=products.find(x=>x.id===id);
  if(!p)return;
  state={id,color:p.colors[0],size:p.sizes[0],img:0};
  detail();
  $("productModal").classList.add("show");
  if(!modalHistory){history.pushState({jfProduct:true},"");modalHistory=true;}
}

function detail(){
  const p=products.find(x=>x.id===state.id);
  if(!p)return;
  const a=(p.images||[]).filter(x=>x.color===state.color);
  const pics=a.length?a:[{src:img(p,state.color)}];
  if(state.img>=pics.length)state.img=0;
  $("productDetail").innerHTML=`<div class="detail">
    <div><button type="button" class="back-home" onclick="backToStore()">← BACK TO STORE HOME</button>
      <div class="gallerymain"><img src="${pics[state.img].src}" alt="${esc(p.name)}"></div>
      <div class="thumbs">${pics.map((x,i)=>`<button class="${i===state.img?'active':''}" onclick="state.img=${i};detail()"><img src="${x.src}" alt="Photo ${i+1}"></button>`).join("")}</div>
    </div>
    <div class="detailcopy"><small>${esc(p.category)}</small><h2>${esc(p.name)}</h2><p class="muted">${esc(p.desc)}</p>
      <div class="bigprice">R${+p.prices[state.size]||0}</div>
      <div class="muted">COLOR</div><div class="options">${p.colors.map(c=>`<button class="option coloroption ${c===state.color?'active':''}" onclick="state.color='${esc(c)}';state.img=0;detail()"><i class="dot" style="background:${hex(c)}"></i>${esc(c)}</button>`).join("")}</div>
      <div class="muted" style="margin-top:18px">SIZE</div><div class="options">${p.sizes.map(s=>`<button class="option ${s===state.size?'active':''}" onclick="state.size='${esc(s)}';detail()">${esc(s)} — R${+p.prices[s]||0}</button>`).join("")}</div>
      <button class="cta" onclick="addCurrent()">ADD TO BAG</button>
    </div></div>`;
}

function closeProduct(useHistory=true){
  $("productModal").classList.remove("show");
  if(useHistory&&modalHistory){modalHistory=false;history.back();}
}
function backToStore(){closeProduct(true);window.scrollTo({top:0,behavior:"smooth"});}
window.addEventListener("popstate",()=>{
  if($("productModal")?.classList.contains("show")){modalHistory=false;$("productModal").classList.remove("show");}
});

function addCurrent(){
  const p=products.find(x=>x.id===state.id);
  if(!p)return;
  cart.push({id:Date.now(),name:p.name,color:state.color,size:state.size,price:+p.prices[state.size]||0,qty:1});
  save();updateCart();closeProduct();openCart();
}

function updateCart(){
  let n=0,t=0;
  $("cartItems").innerHTML=cart.length?cart.map((c,i)=>{n+=c.qty;t+=c.price*c.qty;return `<div class="cartline"><div><b>${esc(c.name)}</b><small>${esc(c.color)} / ${esc(c.size)} — R${c.price}</small></div><div class="cartactions"><button onclick="qty(${i},-1)">−</button><b>${c.qty}</b><button onclick="qty(${i},1)">+</button><button class="remove" onclick="rem(${i})">×</button></div></div>`}).join(""):"<p class='muted'>Your bag is empty.</p>";
  $("cartCount").textContent=n;
  $("cartTotal").textContent="R"+t;
}
function qty(i,d){cart[i].qty+=d;if(cart[i].qty<1)cart.splice(i,1);save();updateCart();}
function rem(i){cart.splice(i,1);save();updateCart();}
function openCart(){$("cartDrawer").classList.add("open");$("scrim").classList.add("show");}
function closeCart(){$("cartDrawer").classList.remove("open");if(!$('adminDrawer').classList.contains("open"))$("scrim").classList.remove("show");}
function openAdmin(){$("adminDrawer").classList.add("open");$("scrim").classList.add("show");}
function closeAdmin(){$("adminDrawer").classList.remove("open");if(!$('cartDrawer').classList.contains("open"))$("scrim").classList.remove("show");}

$("bagOpen").onclick=openCart;
$("bagClose").onclick=closeCart;
$("adminOpen").onclick=openAdmin;
$("adminClose").onclick=closeAdmin;
$("scrim").onclick=()=>{closeCart();closeAdmin();};

$("loginAdmin").onclick=()=>{
  if($("adminPass").value===ADMIN_PASSWORD){$("adminLogin").hidden=true;$("adminPanel").hidden=false;adminList();ordersList();}
  else alert("Wrong password");
};

$("pSizes").oninput=priceEditor;
$("resetProduct").onclick=()=>{editId=null;["pName","pDesc","pCategory","pColors","pSizes"].forEach(id=>$(id).value="");$("priceEditor").innerHTML="";};

function priceEditor(){
  const ss=$("pSizes").value.split(",").map(x=>x.trim()).filter(Boolean),p=editId&&products.find(x=>x.id===editId);
  $("priceEditor").innerHTML=ss.map(s=>`<div class="priceRow"><input readonly value="${esc(s)}"><input data-price="${esc(s)}" type="number" value="${p?.prices[s]||''}" placeholder="R price"></div>`).join("");
}

$("saveProduct").onclick=()=>{
  const name=$("pName").value.trim(),ss=$("pSizes").value.split(",").map(x=>x.trim()).filter(Boolean),cs=$("pColors").value.split(",").map(x=>x.trim()).filter(Boolean);
  if(!name||!ss.length||!cs.length)return alert("Add a name, colors and sizes.");
  const prices={};
  $("priceEditor").querySelectorAll("[data-price]").forEach(x=>prices[x.dataset.price]=+x.value||0);
  if(ss.some(s=>!prices[s]))return alert("Give every size a price.");
  if(editId){
    const p=products.find(x=>x.id===editId);
    Object.assign(p,{name,desc:$("pDesc").value,category:$("pCategory").value,colors:cs,sizes:ss,prices});
  }else products.push({id:Date.now(),name,desc:$("pDesc").value,category:$("pCategory").value||"JF",colors:cs,sizes:ss,prices,images:[]});
  save();render();adminList();$("resetProduct").click();alert("Product saved.");
};

function adminList(){
  $("adminProducts").innerHTML=products.map((p,i)=>`<div class="adminproduct" draggable="true" data-id="${p.id}" ondragstart="dragProductStart(event,${p.id})" ondragover="event.preventDefault()" ondrop="dropProduct(event,${p.id})">
    <b>☰ ${esc(p.name)}</b><br><small>Colors: ${esc(p.colors.join(", "))}</small><br><small>${p.sizes.map(s=>s+": R"+p.prices[s]).join(" · ")}</small>
    <div class="adminactions"><button onclick="edit(${p.id})">EDIT</button><button onclick="photos(${p.id})">ADD PHOTOS</button><button onclick="del(${p.id})">DELETE</button></div>
  </div>`).join("");
  if(!products.length)$("adminProducts").innerHTML="<p class='muted'>No products yet.</p>";
}
let draggedProductId=null;
function dragProductStart(e,id){draggedProductId=id;e.dataTransfer.effectAllowed="move";}
function dropProduct(e,targetId){
  e.preventDefault();
  if(draggedProductId===null||draggedProductId===targetId)return;
  const from=products.findIndex(p=>p.id===draggedProductId),to=products.findIndex(p=>p.id===targetId);
  if(from<0||to<0)return;
  const [item]=products.splice(from,1);products.splice(to,0,item);draggedProductId=null;save();render();adminList();
}

function edit(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  editId=id;$("pName").value=p.name;$("pDesc").value=p.desc||"";$("pCategory").value=p.category||"";$("pColors").value=p.colors.join(", ");$("pSizes").value=p.sizes.join(", ");priceEditor();
}
function del(id){if(confirm("Delete this product?")){products=products.filter(p=>p.id!==id);save();render();adminList();}}

/* PHOTO MANAGER: add photos from the phone, preview them, remove mistakes, reorder, then save. */
function photos(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  photoEditId=id;photoColor=p.colors[0];
  photoDraft=(p.images||[]).filter(x=>x.color===photoColor).map(x=>({...x}));
  showPhotoManager();
}
function ensurePhotoModal(){
  if($("photoManager"))return;
  const d=document.createElement("div");d.id="photoManager";d.innerHTML=`<div id="photoManagerBox"><div id="photoManagerContent"></div></div>`;
  d.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:99999;display:none;overflow:auto;padding:18px;box-sizing:border-box;";
  d.querySelector("#photoManagerBox").style.cssText="max-width:900px;margin:30px auto;background:#111;color:#fff;border:1px solid #333;border-radius:18px;padding:20px;box-sizing:border-box;";
  document.body.appendChild(d);
}
function showPhotoManager(){
  ensurePhotoModal();
  const p=products.find(x=>x.id===photoEditId);if(!p)return;
  const c=photoColor;
  $("photoManagerContent").innerHTML=`<h2 style="margin-top:0">ADD PRODUCT PHOTOS</h2>
    <p style="opacity:.75">${esc(p.name)} — choose a colour, add photos, remove mistakes, and drag photos into your preferred order.</p>
    <label>COLOUR</label><select id="photoColourSelect" style="display:block;width:100%;padding:12px;margin:8px 0 16px;box-sizing:border-box">${p.colors.map(x=>`<option ${x===c?'selected':''}>${esc(x)}</option>`).join("")}</select>
    <input id="photoFiles" type="file" accept="image/*" multiple style="display:none">
    <button type="button" onclick="$('photoFiles').click()" style="padding:12px 16px;margin-bottom:16px">+ UPLOAD PHOTOS</button>
    <div id="photoGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px"></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px"><button type="button" onclick="savePhotoManager()">SAVE PHOTOS</button><button type="button" onclick="cancelPhotoManager()">CANCEL</button></div>`;
  $("photoManager").style.display="block";
  $("photoColourSelect").onchange=e=>{photoColor=e.target.value;photoDraft=(p.images||[]).filter(x=>x.color===photoColor).map(x=>({...x}));showPhotoManager();};
  $("photoFiles").onchange=e=>{Array.from(e.target.files||[]).forEach(file=>{const r=new FileReader();r.onload=ev=>{photoDraft.push({src:ev.target.result,color:photoColor});showPhotoManager();};r.readAsDataURL(file);});};
  renderPhotoGrid();
}
function renderPhotoGrid(){
  const g=$("photoGrid");if(!g)return;
  g.innerHTML=photoDraft.length?photoDraft.map((x,i)=>`<div draggable="true" data-photo-index="${i}" ondragstart="dragPhotoStart(event,${i})" ondragover="event.preventDefault()" ondrop="dropPhoto(event,${i})" style="border:1px solid #333;border-radius:12px;padding:7px;background:#181818;position:relative">
    <img src="${x.src}" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:8px;display:block"><button type="button" onclick="removePhoto(${i})" style="width:100%;margin-top:7px">REMOVE / CANCEL PHOTO</button></div>`).join(""):"<p style='opacity:.6'>No photos for this colour yet.</p>";
}
function dragPhotoStart(e,i){e.dataTransfer.setData("text/plain",String(i));}
function dropPhoto(e,to){e.preventDefault();const from=Number(e.dataTransfer.getData("text/plain"));if(!Number.isInteger(from)||from===to)return;const [x]=photoDraft.splice(from,1);photoDraft.splice(to,0,x);renderPhotoGrid();}
function removePhoto(i){photoDraft.splice(i,1);renderPhotoGrid();}
function savePhotoManager(){
  const p=products.find(x=>x.id===photoEditId);if(!p)return;
  p.images=(p.images||[]).filter(x=>x.color!==photoColor).concat(photoDraft.map(x=>({src:x.src,color:photoColor})));
  save();render();adminList();$("photoManager").style.display="none";alert("Photos saved.");
}
function cancelPhotoManager(){$("photoManager").style.display="none";photoDraft=[];photoEditId=null;}

function ordersList(){
  $("ordersList").innerHTML=orders.length?orders.map(o=>`<div class="adminproduct"><b>${esc(o.name)}</b> — R${o.total}<br><small>${esc(o.phone||"No phone")} · ${esc(o.city)} · ${esc(o.date)}</small><br><small>${o.cart.map(c=>esc(c.name)+" ("+esc(c.color)+"/"+esc(c.size)+") x"+c.qty).join("<br>")}</small></div>`).join(""):"<p class='muted'>No orders yet.</p>";
}
$("clearOrders").onclick=()=>{if(confirm("Clear all orders?")){orders=[];save();ordersList();}};
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("productsTab").hidden=b.dataset.tab!=="productsTab";$("ordersTab").hidden=b.dataset.tab!=="ordersTab";});

$("orderMethod").onchange=()=>{$("placeOrder").textContent=$("orderMethod").value==="email"?"PLACE ORDER → EMAIL":"PLACE ORDER → WHATSAPP";};

function buildOrderMessage(o){
  const items=o.cart.map(c=>`- ${c.name} | ${c.color} | ${c.size} | x${c.qty} | R${c.price*c.qty}`).join("\n");
  return `NEW JF FORGES ORDER\n${o.id}\nName: ${o.name}\nEmail: ${o.email}\nPhone/WhatsApp: ${o.phone||"Not provided"}\nAddress: ${o.address}, ${o.city}\n\nITEMS\n${items}\n\nTOTAL: R${o.total}`;
}

$("placeOrder").onclick=()=>{
  if(!cart.length)return alert("Your bag is empty.");
  const name=$("cName").value.trim(),email=$("cEmail").value.trim(),phone=$("cPhone").value.trim(),address=$("cAddress").value.trim(),city=$("cCity").value.trim(),method=$("orderMethod").value;
  if(!name||!email||!address||!city)return alert("Please enter your name, email, address and city.");
  if(method==="whatsapp"&&!phone)return alert("Please enter your WhatsApp / phone number, or choose Email instead.");
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return alert("Please enter a valid email address.");
  const total=cart.reduce((a,c)=>a+c.price*c.qty,0),o={id:"JF-"+Date.now(),name,email,phone,address,city,method,cart:[...cart],total,date:new Date().toLocaleString()};
  orders.push(o);save();
  const msg=buildOrderMessage(o);
  if(method==="whatsapp"){
    if(WHATSAPP_NUMBER.includes("X"))alert("Order saved. Replace WHATSAPP_NUMBER at the top of script.js with your real WhatsApp number.");
    else window.open("https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(msg),"_blank");
  }else{
    if(ORDER_EMAIL.includes("YOUR-EMAIL"))alert("Order saved. Replace ORDER_EMAIL at the top of script.js with your real JF email address.");
    else{const subject=encodeURIComponent("JF FORGES Order "+o.id),body=encodeURIComponent(msg);window.location.href="mailto:"+encodeURIComponent(ORDER_EMAIL)+"?subject="+subject+"&body="+body;}
  }
  cart=[];save();updateCart();closeCart();
};

render();updateCart();
