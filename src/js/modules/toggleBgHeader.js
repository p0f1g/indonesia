export default function toggleBgHeader() {
  const header = document.querySelector('.header');
  const HEADER_SCROLLED_CLASS = 'header--scrolled';
  const startScroll = 30;

  if (
    window.scrollY >= startScroll &&
    !header.classList.contains(HEADER_SCROLLED_CLASS)
  ) {
    header.classList.add(HEADER_SCROLLED_CLASS);
  }

  if (
    window.scrollY < startScroll &&
    header.classList.contains(HEADER_SCROLLED_CLASS)
  ) {
    header.classList.remove(HEADER_SCROLLED_CLASS);
  }
}
