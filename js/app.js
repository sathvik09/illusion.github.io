const hamburger = document.querySelector('.hamburger');
const nav= document.querySelector('.landing');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');
const cur = document.querySelector('.section-head');
const torch = document.getElementById('torch');
const login_sub = document.querySelector('.submit');
const data = document.querySelectorAll('.validate');

hamburger.addEventListener('click',()=>{
    navLinks.classList.toggle("open");
    links.forEach(l=>{
        l.classList.toggle('fade')
    })
})

const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', e => {
    cursor.setAttribute("style", "top: "+(e.pageY - 10)+"px; left: "+(e.pageX - 10)+"px;background: none;")

})

document.addEventListener('click', () => {
    cursor.classList.add("expand");

    setTimeout(() => {
        cursor.classList.remove("expand");
    }, 500)
})

let a = {};

let x = (user,pass)=>{
  let a = fetch("data.json")
  .then(response => response.json())
  .then(json =>{
      json.user.forEach((e,i)=>{
          if(e == user && json.pass[i] == pass){
            alert("done");
          }
          else{
            window.location.assign("./index.html");
          }
          
      })
  });
}

login_sub.addEventListener('click',()=>{
    let user = data[0].value;
    let pass = data[1].value;
    x(user,pass);
    data.forEach(e=>{
        e.value = '';
    })
})



