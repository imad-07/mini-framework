
import { patchApp } from './dom.js';
import { routes } from '../page.js';
export function Router(obj) {
  const path = window.location.pathname;
  if (!obj[path]) {
      return obj['/404'].component();
  }
  return obj[path].component();
}

function App() {
  return Router(routes);
}

export function navigateTo(href) {
  history.pushState(null, null, href);
  const container = document.querySelector('#app');
  patchApp(App(), container);
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
      
      if (e.target.matches('[data-link]')) {
          e.preventDefault();
          const href = e.target.getAttribute('href');
          navigateTo(href);
      }
  });

  const container = document.querySelector('#app');
  container.innerHTML = '';
  patchApp(App(), container);
});

window.addEventListener('popstate', () => {
  const container = document.querySelector('#app');
  patchApp(App(), container);
});
