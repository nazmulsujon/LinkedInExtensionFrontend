import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

const isFirefox = process.env.__FIREFOX__ === 'true';

const sidePanelConfig = {
  side_panel: {
    default_path: 'side-panel/index.html',
  },
  permissions: !isFirefox ? ['sidePanel'] : [],
};

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = Object.assign({
  manifest_version: 3,
  default_locale: 'en',
  /**
   * if you want to support multiple languages, you can use the following reference
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
   */
  name: '__MSG_extensionName__',
  version: packageJson.version,
  description: '__MSG_extensionDescription__',
  permissions: ['storage','tabs'],
  background: {
    service_worker: 'background.iife.js',
    type: 'module',
  },
  action: {
    default_icon: 'icon-34.png',
  },

  icons: {
    128: 'icon-128.png',
  },
  content_scripts: [
    {
      matches: ['https://www.linkedin.com/*'],
      js: ['content/index.iife.js'],
    },
    {
      matches: ['https://www.linkedin.com/*'],
      js: ['content-ui/index.iife.js', 'content-popup-ui/index.iife.js'],
      
    },
    {
      matches: ['https://www.linkedin.com/*'],
      css: ['content.css'], // public folder
    },
  ],

  web_accessible_resources: [
    {
      resources: ['*.js', '*.css', '*.svg', 'icon-128.png', 'icon-34.png'],
      matches: ['*://*/*'],
    },
  ],
});

export default manifest;
