import { createRoot } from 'react-dom/client';
import '@src/index.css';
import Popup from '@src/Popup';
import { RecoilRoot } from 'recoil';
// eslint-disable-next-line
// @ts-ignore
import tailwindOutput from '@src/tailwind-output.css?inline';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

const root = document.createElement('div');
root.id = 'algo-engage-ui-root';

document.body.insertBefore(root, document.body.firstChild);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });
shadowRoot.appendChild(rootIntoShadow);

const styleElement = document.createElement('style');
styleElement.innerHTML = tailwindOutput;
shadowRoot.appendChild(styleElement);

const cache = createCache({
  key: 'css',
  prepend: true,
  container: shadowRoot,
});

createRoot(rootIntoShadow).render(
  <CacheProvider value={cache}>
    <RecoilRoot>
      <Popup />
    </RecoilRoot>
  </CacheProvider>,
);

console.log('Popup UI loaded');
