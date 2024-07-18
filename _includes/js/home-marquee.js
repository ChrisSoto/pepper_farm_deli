window.onload = function() {
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