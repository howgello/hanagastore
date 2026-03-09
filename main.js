let cart=[];
const rates={usd:1,rub:90,kgs:89};

function showSection(id){
  document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  toggleMenu(false);
}

function toggleMenu(force){
  const nav=document.getElementById("nav");
  if(force===false){nav.style.display="none"; return;}
  nav.style.display = nav.style.display==="flex"?"none":"flex";
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("active");
}

function addToCart(btn){
  const p=btn.parentElement;
  if(p.dataset.stock==="soon") return alert("Скоро поступят");

  const name=p.dataset.name;
  const price=p.dataset.price;
  const size=p.querySelector(".size")?p.querySelector(".size").value:"-";

  cart.push({name,price,size});
  updateCart();
}

function updateCart(){
  const items=document.getElementById("cart-items");
  items.innerHTML="";
  let total=0;
  cart.forEach((item,i)=>{
    total+=item.price*rates.usd;
    const div=document.createElement("div");
    div.innerHTML=`${item.name} (${item.size}) <button onclick="removeItem(${i})">X</button>`;
    items.appendChild(div);
  });
  document.getElementById("cart-total").innerText=total;
  document.getElementById("cart-count").innerText=cart.length;
}

function removeItem(i){
  cart.splice(i,1);
  updateCart();
}

// Инициализация цен и наличия
document.querySelectorAll(".product").forEach(p=>{
  const price=p.dataset.price;
  p.querySelector(".price").innerText="$"+price+" | ₽"+(price*90)+" | "+(price*89)+" сом";
  const stockText=p.dataset.stock==="in"?"В наличии":"Скоро поступят";
  const stockEl=p.querySelector(".stock");
  stockEl.innerText=stockText;
  stockEl.style.color=p.dataset.stock==="in"?"#4caf50":"#ff4fa3";
});

// --- Звёздный рейтинг с одним голосом на пользователя ---
document.querySelectorAll(".stars").forEach(starContainer => {
  const ratingNumber = document.createElement("span");
  ratingNumber.className = "rating-number";
  ratingNumber.innerText = "(0)";
  starContainer.appendChild(ratingNumber);

  // Список голосов {name: "Имя", rating: 3}
  starContainer.dataset.votes = JSON.stringify([]);

  for(let i=1;i<=5;i++){
    const star=document.createElement("span");
    star.className="star";
    star.dataset.value=i;
    star.innerText="☆";
    starContainer.insertBefore(star,ratingNumber);

    star.addEventListener("mouseover", ()=> {
      starContainer.querySelectorAll(".star").forEach(s=>{
        s.classList.toggle("hover", parseInt(s.dataset.value)<=i);
      });
    });

    star.addEventListener("mouseout", ()=> {
      starContainer.querySelectorAll(".star").forEach(s=>{
        s.classList.remove("hover");
      });
    });

    star.addEventListener("click", ()=> {
      const userName = prompt("Введите ваше имя для рейтинга:").trim();
      if(!userName) return alert("Имя обязательно");

      let votes = JSON.parse(starContainer.dataset.votes);

      // Проверка: пользователь уже голосовал
      if(votes.some(v=>v.name===userName)){
        return alert("Вы уже голосовали за этот товар!");
      }

      const value = parseInt(star.dataset.value);
      votes.push({name:userName, rating:value});
      starContainer.dataset.votes = JSON.stringify(votes);

      // Обновляем средний рейтинг
      let total = votes.reduce((sum,v)=>sum+v.rating,0);
      let avg = total / votes.length;

      starContainer.dataset.rating = avg.toFixed(1);
      starContainer.dataset.count = votes.length;

      // Обновляем звёзды
      starContainer.querySelectorAll(".star").forEach(s=>{
        s.classList.toggle("selected", parseInt(s.dataset.value)<=Math.round(avg));
      });

      ratingNumber.innerText = `(${avg.toFixed(1)})`;

      // Показать кто голосовал
      const votedList = document.createElement("div");
      votedList.className="voted-list";
      votedList.style.fontSize="12px";
      votedList.style.color="#eee";
      votedList.innerText = "Голосовали: " + votes.map(v=>`${v.name} (${v.rating})`).join(", ");
      
      // Удаляем старый список, если есть
      const oldList = starContainer.querySelector(".voted-list");
      if(oldList) oldList.remove();
      starContainer.appendChild(votedList);
    });
  }
});

// --- Отзывы с аватаркой и временем ---
const reviewBtn=document.getElementById("add-review-btn");
reviewBtn.addEventListener("click", ()=>{
  const nameInput=document.getElementById("review-name");
  const textInput=document.getElementById("review-text");
  const avatarInput=document.getElementById("avatar-upload");
  const list=document.getElementById("review-list");
  if(!nameInput.value.trim()||!textInput.value.trim()) return;

  const now=new Date();
  const date=now.toLocaleDateString();
  const time=now.toLocaleTimeString();

  let avatarURL="";
  if(avatarInput.files && avatarInput.files[0]){
    const file=avatarInput.files[0];
    if(!file.type.startsWith("image/")){alert("Можно загружать только изображения!"); return;}
    if(file.size>2*1024*1024){alert("Файл слишком большой!"); return;}
    avatarURL=URL.createObjectURL(file);
  }

  const reviewDiv=document.createElement("div");
  reviewDiv.className="review-item";
  reviewDiv.innerHTML=`
    ${avatarURL?`<img src="${avatarURL}" class="review-avatar" title="Нажмите, чтобы удалить аватар">`:""}
    <div class="review-content">
      <div class="review-header">${nameInput.value}</div>
      <div class="review-time">${date} ${time}</div>
      <div class="review-text">${textInput.value.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
    </div>
    <button class="delete-btn">Удалить</button>
  `;

  if(avatarURL) reviewDiv.querySelector(".review-avatar").addEventListener("click", e=>e.target.remove());
  reviewDiv.querySelector(".delete-btn").addEventListener("click", ()=>reviewDiv.remove());

  list.prepend(reviewDiv);

  nameInput.value="";
  textInput.value="";
  avatarInput.value="";
});

// --- Музыкальный плеер ---
const songs=[
  {name:"Sakura Breeze", src:"music1.mp3"},
  {name:"Cherry Blossom", src:"music2.mp3"},
  {name:"Hanami Night", src:"music3.mp3"}
];

const player=document.getElementById("player");
const trackName=document.getElementById("track-name");
const progress=document.getElementById("progress");
let currentSong=0;

function loadSong(index){player.src=songs[index].src; trackName.innerText=songs[index].name;}
function playSong(){player.play();}
function pauseSong(){player.pause();}
function nextSong(){currentSong=(currentSong+1)%songs.length; loadSong(currentSong); playSong();}
function prevSong(){currentSong=(currentSong-1+songs.length)%songs.length; loadSong(currentSong); playSong();}

player.addEventListener("ended", nextSong);
document.getElementById("play").addEventListener("click", playSong);
document.getElementById("pause").addEventListener("click", pauseSong);
document.getElementById("next").addEventListener("click", nextSong);
document.getElementById("prev").addEventListener("click", prevSong);

player.addEventListener("timeupdate", ()=>{
  const percent=(player.currentTime/player.duration)*100;
  progress.style.width=percent+"%";
});

document.querySelector(".progress-container").addEventListener("click", e=>{
  player.currentTime=(e.offsetX/e.currentTarget.clientWidth)*player.duration;
});
loadSong(currentSong);

// --- Сакура ---
for(let i=0;i<30;i++){
  let petal=document.createElement("div");
  petal.className="petal";
  petal.innerText="🌸";
  petal.style.left=Math.random()*100+"vw";
  petal.style.animationDuration=(5+Math.random()*5)+"s";
  petal.style.fontSize=(15+Math.random()*10)+"px";
  document.body.appendChild(petal);
}

// --- Блокировка правой кнопки ---
document.addEventListener("contextmenu", e=>e.preventDefault());

// --- Блокировка горячих клавиш ---
document.addEventListener("keydown", e=>{
  if(e.key==="F12" || (e.ctrlKey && e.shiftKey && ["I","J"].includes(e.key)) || (e.ctrlKey && ["u","s"].includes(e.key))){e.preventDefault();}
});
function showSection(id){

document.querySelectorAll(".section").forEach(section=>{
section.classList.remove("active")
})

document.getElementById(id).classList.add("active")

}
