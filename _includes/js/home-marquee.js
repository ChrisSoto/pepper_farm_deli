window.onload = function() {

  
  const sticky = document.getElementById('order-now-sticky');
  const hero = document.getElementById('order-now-hero');
  document.addEventListener('scroll', function() {
    const heroRect = hero.getBoundingClientRect();

    if (heroRect.top <= 0) {
      console.log('above');
      sticky.style.display = 'block';
    } else {
      console.log('below');
      sticky.style.display = 'none';
    }
  });


  const marquee = document.getElementById('marquee');
  const marqueeContainer = document.getElementById('marquee-container');
  let containerWidth = marqueeContainer.offsetWidth;
  let textWidth = marquee.offsetWidth * 2;
  let pos = containerWidth;

  function scrollMarquee() {
    pos = pos - 5;
    if (pos < -textWidth) {
      pos = containerWidth;
    }
    marquee.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(scrollMarquee);
  }
  
  scrollMarquee();
}