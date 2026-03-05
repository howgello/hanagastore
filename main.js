let cart=[];
let currency="usd";
const rates={usd:1,rub:90,kgs:89};

function showSection(id){
document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
document.getElementById(id).classList.add("active");
toggleMenu(false);
}

function toggleMenu(force){
let nav=document.getElementById("nav");
if(force===false){nav.style.display="none";return;}
nav.style.display=nav.style.display==="flex"?"none":"flex";
}

function toggleCart(){
document.getElementById("cart").classList.toggle("active");
}

function addToCart(btn){
let p=btn.parentElement;
if(p.dataset.stock==="soon") return alert("Скоро поступят");

let name=p.dataset.name;
let price=p.dataset.price;
let size=p.querySelector(".size")?p.querySelector(".size").value:"-";

cart.push({name,price,size});
updateCart();
}

function updateCart(){
let items=document.getElementById("cart-items");
items.innerHTML="";
let total=0;

cart.forEach((item,i)=>{
total+=item.price*rates[currency];
let div=document.createElement("div");
div.innerHTML=`${item.name} (${item.size}) 
<button onclick="removeItem(${i})">X</button>`;
items.appendChild(div);
});

document.getElementById("cart-total").innerText=total;
document.getElementById("cart-count").innerText=cart.length;
}

function removeItem(i){
cart.splice(i,1);
updateCart();
}

function addReview(){
let text=document.getElementById("review-text").value;
if(!text)return;
let div=document.createElement("div");
div.innerText=text;
document.getElementById("review-list").appendChild(div);
document.getElementById("review-text").value="";
}

document.querySelectorAll(".product").forEach(p=>{
let price=p.dataset.price;
p.querySelector(".price").innerText="$"+price+" | ₽"+(price*90)+" | "+(price*89)+" сом";

let stockText=p.dataset.stock==="in"?"В наличии":"Скоро поступят";
let stockEl=p.querySelector(".stock");
stockEl.innerText=stockText;
stockEl.style.color=p.dataset.stock==="in"?"#4caf50":"#ff4fa3";
});

/* Звезды */
document.querySelectorAll(".stars").forEach(container=>{
for(let i=1;i<=5;i++){
let star=document.createElement("span");
star.innerText="☆";
star.onclick=()=>{
container.innerHTML="";
for(let j=1;j<=5;j++){
container.innerHTML+=j<=i?"★":"☆";
}
};
container.appendChild(star);
}
});

/* Сакура */
for(let i=0;i<20;i++){
let petal=document.createElement("div");
petal.className="petal";
petal.innerText="🌸";
petal.style.left=Math.random()*100+"vw";
petal.style.animationDuration=(5+Math.random()*5)+"s";
petal.style.fontSize=(15+Math.random()*10)+"px";
document.body.appendChild(petal);
}
createProducts("tshirt-list","t");document.addEventListener("contextmenu", e=>{
e.preventDefault();
});
/* Блокировка правой кнопки */
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
});

/* Блокировка горячих клавиш */
document.addEventListener("keydown", function(e){

    // F12
    if(e.key === "F12"){
        e.preventDefault();
    }

    // Ctrl+Shift+I
    if(e.ctrlKey && e.shiftKey && e.key === "I"){
        e.preventDefault();
    }

    // Ctrl+Shift+J
    if(e.ctrlKey && e.shiftKey && e.key === "J"){
        e.preventDefault();
    }

    // Ctrl+U
    if(e.ctrlKey && e.key === "u"){
        e.preventDefault();
    }

    // Ctrl+S
    if(e.ctrlKey && e.key === "s"){
        e.preventDefault();
    }

});