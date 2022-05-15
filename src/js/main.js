import mobileMenu from './modules/mobileMenu.js';
import toggleBgHeader from './modules/toggleBgHeader.js';

document.addEventListener('DOMContentLoaded', () => {
  mobileMenu();
  toggleBgHeader();
});

window.addEventListener('scroll', toggleBgHeader);
