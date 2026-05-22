/* main.js */
(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  let theme = localStorage.getItem('atb-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-theme', theme);

  const setIcon = () => {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  };
  setIcon();

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      localStorage.setItem('atb-theme', theme);
      setIcon();
    });
  }

  const header = document.querySelector('.site-header');
  if (header) {
    addEventListener('scroll', () => {
      header.classList.toggle('scrolled', scrollY > 10);
    }, { passive: true });
  }

  const current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === current) a.setAttribute('aria-current', 'page');
  });

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });

  document.querySelectorAll('.reveal, .step').forEach(el => observer.observe(el));

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#f-name')?.value || '';
      const school = form.querySelector('#f-school')?.value || '';
      const email = form.querySelector('#f-email')?.value || '';
      const message = form.querySelector('#f-message')?.value || '';
      const subject = encodeURIComponent(`School inquiry from ${name} - ${school}`);
      const body = encodeURIComponent(`Name: ${name}\nSchool: ${school}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:assistivetechbridge@gmail.com?subject=${subject}&body=${body}`;
    });
  }
})();