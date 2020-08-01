const contact = document.querySelector('.contact-main');
const about = document.querySelector('.contact-about');
const top1 = document.querySelector('.arr');


contact.addEventListener('click',()=>{
    scrollTo(0,5500); 
    
})

about.addEventListener('click',()=>{
    scrollTo(0,1500);
})

top1.addEventListener('click',()=>{
    scrollTo(0,0);
})