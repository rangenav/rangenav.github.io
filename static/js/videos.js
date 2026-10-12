/* Start muted demos only while visible; keep the narrated YouTube overview manual. */
(() => {
  if (!('IntersectionObserver' in window)) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const states = new Map();

  function eligible(video, state) {
    return state.visible && !video.closest('[inert]') && !document.hidden && !reducedMotion.matches;
  }

  function update(video, state) {
    if (!eligible(video, state)) {
      if (!video.paused) video.pause();
    } else if (!state.userPaused && video.paused) {
      // Browser autoplay restrictions may still require a click; retain the controls.
      video.play().catch(() => {});
    }
  }

  function updateAll() {
    states.forEach((state, video) => update(video, state));
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const state = states.get(entry.target);
      state.visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      update(entry.target, state);
    }
  }, { threshold: [0, 0.35] });

  for (const video of document.querySelectorAll('video')) {
    const state = { visible: false, userPaused: false };
    states.set(video, state);
    video.muted = true;
    video.addEventListener('pause', () => {
      if (eligible(video, state)) state.userPaused = true;
    });
    video.addEventListener('play', () => { state.userPaused = false; });
    observer.observe(video);
  }

  document.addEventListener('carousel:change', updateAll);
  document.addEventListener('visibilitychange', updateAll);
  reducedMotion.addEventListener('change', updateAll);
})();
