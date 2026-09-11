const ADMIN_PASSWORD="JF2026";const WHATSAPP_NUMBER="27761747612";
const defaults=[{id:1,name:"JF Signature Hoodie",desc:"A core JF piece built for the beginning.",category:"Hoodies",colors:["Black","Purple","Cream"],sizes:["S","M","L","XL","2XL"],prices:{S:699,M:699,L:699,XL:749,"2XL":799},images:[]},{id:2,name:"JF Core Tee",desc:"Everyday streetwear with the JF identity.",category:"T-Shirts",colors:["Black","White","Purple","Navy"],sizes:["S","M","L","XL","2XL"],prices:{S:399,M:399,L:399,XL:449,"2XL":499},images:[]}];
let products=JSON.parse(localStorage.jf_products||"null")||defaults,cart=JSON.parse(localStorage.jf_cart||"[]"),orders=JSON.parse(localStorage.jf_orders||"[]"),editId=null,state={id:null,color:null,size:null,img:0};
const $=id=>document.getElementById(id),save=()=>{localStorage.jf_products=JSON.stringify(products);localStorage.jf_cart=JSON.stringify(cart);localStorage.jf_orders=JSON.stringify(orders)},esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function hex(c){return({black:"#080808",white:"#f5f5f5",purple:"#7d3cff",violet:"#7d3cff",navy:"#182b55",blue:"#2355a4",red:"#b92b2b",green:"#397447",cream:"#e8d7b1",beige:"#d7c2a0",brown:"#704b35",grey:"#777",gray:"#777",gold:"#d4af37",yellow:"#e3c42b",orange:"#e8752d",pink:"#d66b8f"}[String(c).toLowerCase()]||"#888")}
function img(p,c,i=0){let a=(p.images||[]).filter(x=>x.color===c);return a[i]?.src||`https://placehold.co/900x1000/171717/ffffff?text=${encodeURIComponent(p.name+" — "+c)}`}
function render(){ $("products").innerHTML=products.map(p=>`<article class="product"><div class="cover" onclick="openProduct(${p.id})"><img src="${img(p,p.colors[0])}"></div><div class="info"><h3>${esc(p.name)}</h3><p class="muted">${esc(p.desc)}</p><div class="price">From R${Math.min(...p.sizes.map(s=>+p.prices[s]||0))}</div><div class="swatches">${p.colors.map((c,i)=>`<button class="swatch ${i?'':'active'}" title="${esc(c)}" style="background:${hex(c)}" onclick="preview(event,${p.id},'${esc(c)}',this)"></button>`).join("")}</div></div></article>`).join("");$("productCount").textContent=products.length+" PIECES"}
function preview(e,id,c,b){e.stopPropagation();b.parentElement.querySelectorAll(".swatch").forEach(x=>x.classList.remove("active"));b.classList.add("active");b.closest(".product").querySelector("img").src=img(products.find(p=>p.id===id),c)}
function openProduct(id){let p=products.find(x=>x.id===id);state={id,color:p.colors[0],size:p.sizes[0],img:0};detail();$("productModal").classList.add("show")}
function detail(){let p=products.find(x=>x.id===state.id),a=(p.images||[]).filter(x=>x.color===state.color),pics=a.length?a:[{src:img(p,state.color)}];if(state.img>=pics.length)state.img=0;$("productDetail").innerHTML=`<div class="detail"><div><div class="gallerymain"><img src="${pics[state.img].src}"></div><div class="thumbs">${pics.map((x,i)=>`<button class="${i===state.img?'active':''}" onclick="state.img=${i};detail()"><img src="${x.src}"></button>`).join("")}</div></div><div class="detailcopy"><small>${esc(p.category)}</small><h2>${esc(p.name)}</h2><p class="muted">${esc(p.desc)}</p><div class="bigprice">R${+p.prices[state.size]||0}</div><div class="muted">COLOR</div><div class="options">${p.colors.map(c=>`<button class="option coloroption ${c===state.color?'active':''}" onclick="state.color='${esc(c)}';state.img=0;detail()"><i class="dot" style="background:${hex(c)}"></i>${esc(c)}</button>`).join("")}</div><div class="muted" style="margin-top:18px">SIZE</div><div class="options">${p.sizes.map(s=>`<button class="option ${s===state.size?'active':''}" onclick="state.size='${esc(s)}';detail()">${esc(s)} — R${+p.prices[s]||0}</button>`).join("")}</div><button class="cta" onclick="addCurrent()">ADD TO BAG</button></div></div>`}
function closeProduct(){$("productModal").classList.remove("show")}
function addCurrent(){let p=products.find(x=>x.id===state.id);cart.push({id:Date.now(),name:p.name,color:state.color,size:state.size,price:+p.prices[state.size]||0,qty:1});save();updateCart();closeProduct();openCart()}
function updateCart(){let n=0,t=0;$("cartItems").innerHTML=cart.length?cart.map((c,i)=>{n+=c.qty;t+=c.price*c.qty;return`<div class="cartline"><div><b>${esc(c.name)}</b><small>${esc(c.color)} / ${esc(c.size)} — R${c.price}</small></div><div class="cartactions"><button onclick="qty(${i},-1)">−</button><b>${c.qty}</b><button onclick="qty(${i},1)">+</button><button class="remove" onclick="rem(${i})">×</button></div></div>`}).join(""):"<p class='muted'>Your bag is empty.</p>";$("cartCount").textContent=n;$("cartTotal").textContent="R"+t}
function qty(i,d){cart[i].qty+=d;if(cart[i].qty<1)cart.splice(i,1);save();updateCart()}function rem(i){cart.splice(i,1);save();updateCart()}
function openCart(){$("cartDrawer").classList.add("open");$("scrim").classList.add("show")}function closeCart(){$("cartDrawer").classList.remove("open");if(!$("adminDrawer").classList.contains("open"))$("scrim").classList.remove("show")}function openAdmin(){$("adminDrawer").classList.add("open");$("scrim").classList.add("show")}function closeAdmin(){$("adminDrawer").classList.remove("open");if(!$("cartDrawer").classList.contains("open"))$("scrim").classList.remove("show")}
$("bagOpen").onclick=openCart;$("bagClose").onclick=closeCart;$("adminOpen").onclick=openAdmin;$("adminClose").onclick=closeAdmin;$("scrim").onclick=()=>{closeCart();closeAdmin()};
$("loginAdmin").onclick=()=>{if($("adminPass").value===ADMIN_PASSWORD){$("adminLogin").hidden=true;$("adminPanel").hidden=false;adminList();ordersList()}else alert("Wrong password")};
$("pSizes").oninput=priceEditor;$("resetProduct").onclick=()=>{editId=null;["pName","pDesc","pCategory","pColors","pSizes"].forEach(id=>$(id).value="");$("priceEditor").innerHTML=""};
function priceEditor(){let ss=$("pSizes").value.split(",").map(x=>x.trim()).filter(Boolean),p=editId&&products.find(x=>x.id===editId);$("priceEditor").innerHTML=ss.map(s=>`<div class="priceRow"><input readonly value="${esc(s)}"><input data-price="${esc(s)}" type="number" value="${p?.prices[s]||''}" placeholder="R price"></div>`).join("")}
$("saveProduct").onclick=()=>{let name=$("pName").value.trim(),ss=$("pSizes").value.split(",").map(x=>x.trim()).filter(Boolean),cs=$("pColors").value.split(",").map(x=>x.trim()).filter(Boolean);if(!name||!ss.length||!cs.length)return alert("Add a name, colors and sizes.");let prices={};$("priceEditor").querySelectorAll("[data-price]").forEach(x=>prices[x.dataset.price]=+x.value||0);if(ss.some(s=>!prices[s]))return alert("Give every size a price.");if(editId){let p=products.find(x=>x.id===editId);Object.assign(p,{name,desc:$("pDesc").value,category:$("pCategory").value,colors:cs,sizes:ss,prices})}else products.push({id:Date.now(),name,desc:$("pDesc").value,category:$("pCategory").value||"JF",colors:cs,sizes:ss,prices,images:[]});save();render();adminList();$("resetProduct").click();alert("Product saved.")};
function adminList(){$("adminProducts").innerHTML=products.map(p=>`<div class="adminproduct"><b>${esc(p.name)}</b><br><small>Colors: ${esc(p.colors.join(", "))}</small><br><small>${p.sizes.map(s=>s+": R"+p.prices[s]).join(" · ")}</small><div class="adminactions"><button onclick="edit(${p.id})">EDIT</button><button onclick="photos(${p.id})">ADD PHOTOS</button><button onclick="del(${p.id})">DELETE</button></div></div>`).join("")}
function edit(id){let p=products.find(x=>x.id===id);editId=id;$("pName").value=p.name;$("pDesc").value=p.desc||"";$("pCategory").value=p.category||"";$("pColors").value=p.colors.join(", ");$("pSizes").value=p.sizes.join(", ");priceEditor()}
function del(id){if(confirm("Delete this product?")){products=products.filter(p=>p.id!==id);save();render();adminList()}}
function photos(id){let p=products.find(x=>x.id===id),c=prompt("Color for these photos: "+p.colors.join(", "),p.colors[0]);if(!c||!p.colors.includes(c))return alert("Choose one of the listed colors.");let u=prompt("Paste public image URLs separated by commas. The production upgrade can support direct phone uploads.","");if(!u)return;u.split(",").map(x=>x.trim()).filter(Boolean).forEach(src=>p.images.push({src,color:c}));save();render();alert("Photos added.")}
function ordersList(){$("ordersList").innerHTML=orders.length?orders.map(o=>`<div class="adminproduct"><b>${esc(o.name)}</b> — R${o.total}<br><small>${esc(o.phone)} · ${esc(o.city)} · ${esc(o.date)}</small><br><small>${o.cart.map(c=>esc(c.name)+" ("+esc(c.color)+"/"+esc(c.size)+") x"+c.qty).join("<br>")}</small></div>`).join(""):"<p class='muted'>No orders yet.</p>"}
$("clearOrders").onclick=()=>{if(confirm("Clear all orders?")){orders=[];save();ordersList()}};document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("productsTab").hidden=b.dataset.tab!=="productsTab";$("ordersTab").hidden=b.dataset.tab!=="ordersTab"});
$("placeOrder").onclick=()=>{if(!cart.length)return alert("Your bag is empty.");let name=$("cName").value.trim(),phone=$("cPhone").value.trim(),address=$("cAddress").value.trim(),city=$("cCity").value.trim();if(!name||!phone||!address||!city)return alert("Please fill in all delivery information.");let total=cart.reduce((a,c)=>a+c.price*c.qty,0),o={id:"JF-"+Date.now(),name,phone,address,city,cart:[...cart],total,date:new Date().toLocaleString()};orders.push(o);save();let items=cart.map(c=>`- ${c.name} | ${c.color} | ${c.size} | x${c.qty} | R${c.price*c.qty}`).join("\n"),msg=`NEW JF FORGES ORDER\n${o.id}\nName: ${name}\nWhatsApp: ${phone}\nAddress: ${address}, ${city}\n\nITEMS\n${items}\n\nTOTAL: R${total}`;if(WHATSAPP_NUMBER.includes("X"))alert("Order saved. Replace WHATSAPP_NUMBER in script.js with your real WhatsApp number.");else window.open("https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(msg),"_blank");cart=[];save();updateCart();closeCart()};
render();updateCart();
// MOBILE / BROWSER BACK BUTTON SUPPORT

let productHistoryOpen = false;

function openProduct(id) {

    let p = products.find(x => x.id === id);

    state = {
        id: id,
        color: p.colors[0],
        size: p.sizes[0],
        img: 0
    };

    detail();

    $("productModal").classList.add("show");

    if (!productHistoryOpen) {
        history.pushState(
            { jfProduct: true },
            "",
            "#product-" + id
        );

        productHistoryOpen = true;
    }
}


function closeProduct(fromBack = false) {

    $("productModal").classList.remove("show");

    if (productHistoryOpen && !fromBack) {
        history.back();
    }

    productHistoryOpen = false;
}


window.addEventListener("popstate", function () {

    if ($("productModal").classList.contains("show")) {
        closeProduct(true);
    }

});
