/* Use the carousel distributed with the Academic Project Page Template. */
for (const element of document.querySelectorAll('.results-carousel')) {
  const [carousel] = bulmaCarousel.attach(element, {
    slidesToScroll: 1,
    slidesToShow: 1,
    loop: true,
    infinite: false,
    autoplay: false,
    navigationSwipe: true,
    breakpoints: [],
    duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 300
  });

  // Keep native video gestures from initiating carousel swipes.
  for (const video of element.querySelectorAll("video")) {
    for (const type of ["touchstart", "touchmove", "touchend", "mousedown"]) {
      video.addEventListener(type, event => event.stopPropagation(), { passive: true });
    }
  }

  function syncSlides() {
    for (const slide of carousel.slides) {
      const active = Number(slide.dataset.sliderIndex) === Number(carousel.state.next);
      slide.inert = !active;
      slide.setAttribute('aria-hidden', String(!active));
      if (!active) slide.querySelectorAll('video').forEach(video => video.pause());
    }
    for (const dot of element.querySelectorAll('.slider-page')) {
      const active = Number(dot.dataset.index) === Number(carousel.state.next);
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', String(active));
    }
    element.dispatchEvent(new CustomEvent('carousel:change', { bubbles: true }));
  }
  carousel.on('before:show', syncSlides);
  syncSlides();

  // The template generates div controls; make them keyboard-accessible.
  const controls = element.querySelectorAll('.slider-navigation-previous, .slider-navigation-next, .slider-page');
  for (const control of controls) {
    control.setAttribute('role', 'button');
    control.tabIndex = 0;
    const label = control.classList.contains('slider-page')
      ? `Show item ${Number(control.dataset.index) + 1}`
      : control.classList.contains('slider-navigation-next') ? 'Next item' : 'Previous item';
    control.setAttribute('aria-label', label);
    control.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        control.click();
      }
    });
  }
}
