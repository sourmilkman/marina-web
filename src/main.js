const works = Array.from({ length: 8 }, (_, i) => ({ src: `/art/work-${i + 1}.svg`, alt: `Abstract painting, artwork ${String(i + 1).padStart(2, '0')}` }));
const installations = Array.from({ length: 5 }, (_, i) => ({ src: `/art/installation-${i + 1}.svg`, alt: `Installation view ${String(i + 1).padStart(2, '0')}: painting displayed in a restrained concrete interior` }));
const main = document.querySelector('#main');
const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu');
const nav = document.querySelector('#site-nav');

const image = (item, cls = '') => `<img class="${cls}" src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async">`;
const pageHead = (index, kicker, title) => `<header class="page-head"><span>${index}</span><p>${kicker}</p><h1>${title}</h1></header>`;

const pages = {
  '/': () => `<section class="hero">
    <div class="hero-type"><p>Paintings</p><h1>Marina<br><span>Mulliner</span></h1></div>
    <figure class="hero-art"><img src="${works[0].src}" alt="${works[0].alt}" fetchpriority="high"></figure>
    <p class="hero-index">Selected work<br>01 / 08</p>
    <p class="scroll-cue">Scroll to enter</p>
  </section>
  <section class="home-install reveal"><div class="section-label"><span>01</span><p>In situ</p></div>${image(installations[0])}</section>
  <section class="statement reveal"><p>Paintings concerned with atmosphere, landscape, memory and the uncertain boundary between abstraction and place.</p><a href="#/work">View the work <span>↗</span></a></section>
  <section class="home-pair reveal">${image(works[3])}${image(works[5])}<p>Marina Mulliner<br>Selected paintings</p></section>`,
  '/work': () => `${pageHead('01', 'Selected works', 'Work')}<section class="work-grid">${works.map((w, i) => `<button class="work-item item-${i + 1} reveal" data-index="${i}" aria-label="Open artwork ${i + 1}">${image(w)}<span>${String(i + 1).padStart(2, '0')}</span></button>`).join('')}</section>`,
  '/installations': () => `${pageHead('02', 'Paintings in space', 'Installations')}<p class="installation-intro">Studies in scale, light and architectural quiet.</p><section class="installation-list">${installations.map((x, i) => `<figure class="reveal">${image(x)}<figcaption><span>${String(i + 1).padStart(2, '0')}</span> Installation study</figcaption></figure>`).join('')}</section>`,
  '/about': () => `${pageHead('03', 'Artist', 'Marina<br>Mulliner')}<section class="about-grid"><div class="about-copy reveal"><p class="role">Artist</p><p class="bio-placeholder">Biography forthcoming.</p><p class="editable">This area is reserved for Marina Mulliner’s biography and can be updated when approved text is available.</p></div><figure class="about-image reveal">${image(installations[3])}</figure></section>`,
  '/contact': () => `${pageHead('04', 'Studio enquiries', 'Contact')}<section class="contact-grid"><div class="contact-details reveal"><p>For artwork, exhibition and studio enquiries.</p><a href="mailto:studio@marinamulliner.com">studio@marinamulliner.com</a><a class="optional" href="#">Instagram — forthcoming</a></div><form class="reveal"><label>Name<input name="name" autocomplete="name" required></label><label>Email<input type="email" name="email" autocomplete="email" required></label><label>Message<textarea name="message" rows="5" required></textarea></label><button type="submit">Send enquiry <span>↗</span></button><p class="form-status" aria-live="polite"></p></form></section>`
};

function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
function render() {
  const path = location.hash.slice(1) || '/';
  main.classList.add('leaving');
  setTimeout(() => {
    main.innerHTML = (pages[path] || pages['/'])();
    document.body.dataset.page = path;
    document.querySelectorAll('nav a').forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === `#${path}`));
    main.classList.remove('leaving'); main.classList.add('entering'); setTimeout(() => main.classList.remove('entering'), 500);
    window.scrollTo(0, 0); reveal(); bindPage();
  }, 160);
  nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
}
function bindPage() {
  document.querySelectorAll('.work-item').forEach(b => b.addEventListener('click', () => openViewer(+b.dataset.index)));
  document.querySelector('form')?.addEventListener('submit', e => { e.preventDefault(); e.target.querySelector('.form-status').textContent = 'Thank you. Your enquiry is ready to send.'; });
}

let current = 0; const viewer = document.querySelector('.viewer'); const viewerImg = viewer.querySelector('img');
function openViewer(i) { current = (i + works.length) % works.length; viewerImg.src = works[current].src; viewerImg.alt = works[current].alt; viewer.querySelector('figcaption').textContent = `${String(current + 1).padStart(2, '0')} / ${String(works.length).padStart(2, '0')}`; viewer.hidden = false; document.body.classList.add('no-scroll'); viewer.querySelector('.viewer-close').focus(); }
function closeViewer() { viewer.hidden = true; document.body.classList.remove('no-scroll'); }
viewer.querySelector('.viewer-close').onclick = closeViewer; viewer.querySelector('.viewer-prev').onclick = () => openViewer(current - 1); viewer.querySelector('.viewer-next').onclick = () => openViewer(current + 1);
document.addEventListener('keydown', e => { if (viewer.hidden) return; if (e.key === 'Escape') closeViewer(); if (e.key === 'ArrowLeft') openViewer(current - 1); if (e.key === 'ArrowRight') openViewer(current + 1); });
let touchX; viewer.addEventListener('touchstart', e => touchX = e.touches[0].clientX); viewer.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - touchX; if (Math.abs(d) > 50) openViewer(current + (d < 0 ? 1 : -1)); });
menu.onclick = () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); };
window.addEventListener('hashchange', render); window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 20), { passive: true }); render();
