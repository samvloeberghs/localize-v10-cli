import 'zone.js/dist/zone-node';

import * as express from 'express';
import { join } from 'path';

const en = require('./src/assets/i18n/en.json');
const nl = require('./src/assets/i18n/nl.json');

import {
  AppServerModule,
  REQUEST,
  RESPONSE,
  ngExpressEngine,
  APP_BASE_HREF,
  parseTranslations,
  loadTranslations,
} from './src/main.server';
import { existsSync } from 'fs';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/localize-v10-cli/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  const translations = {
    en: parseTranslations(JSON.stringify(en)),
    nl: parseTranslations(JSON.stringify(nl)),
  };

  server.engine('html', (_, options, callback) => {
    const renderOptions: any /* RenderOptions */ = options;
    /* -RenderOptions
        req: Request;
        res?: Response;
        url?: string;
        document?: string;
        bootstrap: Type<{}> | NgModuleFactory<{}>;
        providers?: StaticProvider[];
    */
    return ngExpressEngine({
      bootstrap: AppServerModule,
      providers: [
        {
          provide: REQUEST,
          useValue: renderOptions.req,
        },
        {
          provide: RESPONSE,
          useValue: renderOptions.req.res,
        },
      ],
    })(_, renderOptions, callback);
  });

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y',
  }));

  // ORIGINAL:
  // ---------

  /*
  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    const availableLanguages = ['en', 'nl'];
    const defaultLanguage = 'en';
    const requestLang = req.originalUrl.split('/')[1].substr(0, 2);
    const backupLanguage = req.acceptsLanguages(availableLanguages) || defaultLanguage;

    // IF NO LANGUAGE GIVEN
    //  REDIRECT TO MOST OBVIOUS BACKUPLANGUAGE
    if (!requestLang) {
      res.redirect(303, `/${backupLanguage}`);
      return;
    }

    // IF NOT VALID LANGUAGE GIVEN
    //  REDIRECT TO BACKUP LANGUAGE 404
    if (!availableLanguages.includes(requestLang)) {
      res.redirect(404, `/${backupLanguage}/404`);
      return;
    }

    loadTranslations(translations[requestLang]);
    res.render(indexHtml, {req, providers: [{provide: APP_BASE_HREF, useValue: req.baseUrl}]});
  });
   */

  // SUGGESTED CHANGE:
  // -----------------

  const availableLanguages = ['en', 'nl'];
  const defaultLanguage = 'en';

  // All accepted language/* routes
  availableLanguages.forEach(language => {
    server.get(`/${language}`, (req, res) => {
      const requestLang = req.originalUrl.split('/')[1].substr(0, 2);
      loadTranslations(translations[requestLang]);
      res.render(indexHtml, {req, providers: [{provide: APP_BASE_HREF, useValue: req.baseUrl}]});
    });
    server.get(`/${language}/*`, (req, res) => {
      const requestLang = req.originalUrl.split('/')[1].substr(0, 2);
      loadTranslations(translations[requestLang]);
      res.render(indexHtml, {req, providers: [{provide: APP_BASE_HREF, useValue: req.baseUrl}]});
    });
  })

  // Other routes, no language
  server.get('*', (req, res) => {
    const requestLang = req.originalUrl.split('/')[1].substr(0, 2);

    const backupLanguage = req.acceptsLanguages(availableLanguages) || defaultLanguage;
    // IF NO LANGUAGE GIVEN
    //  REDIRECT TO MOST OBVIOUS BACKUPLANGUAGE
    if (!requestLang) {
      res.redirect(303, `/${backupLanguage}`);
      return;
    }

    // IF NOT VALID LANGUAGE GIVEN
    //  REDIRECT TO BACKUP LANGUAGE 404
    if (!availableLanguages.includes(requestLang)) {
      res.redirect(404, `/${backupLanguage}/404`);
      return;
    }

    // loadTranslations(translations[requestLang]);
    // res.render(indexHtml, {req, providers: [{provide: APP_BASE_HREF, useValue: req.baseUrl}]});
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  try {
    // Start up the Node server
    const server = app();
    server.listen(port, () => {
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.log(err);
  }

}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
