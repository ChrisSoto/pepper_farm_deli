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
}