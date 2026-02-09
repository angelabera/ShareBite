document.addEventListener("DOMContentLoaded", function(){

  let index = 0;
  const slides = document.querySelectorAll(".carousel-image");
  const next = document.querySelector(".next");
  const prev = document.querySelector(".prev");

  function showSlide(i){
    slides.forEach(s => s.classList.remove("active"));
    slides[i].classList.add("active");
  }

  function nextSlide(){
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  function prevSlide(){
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  }

  if(next && prev){
    next.addEventListener("click", nextSlide);
    prev.addEventListener("click", prevSlide);
  }

  // auto slide every 3 sec
  setInterval(nextSlide,3000);

});
