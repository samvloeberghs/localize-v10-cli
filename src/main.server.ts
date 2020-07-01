/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
export { renderModule, renderModuleFactory } from '@angular/platform-server';
export { ngExpressEngine, RenderOptions } from '@nguniversal/express-engine';
export { getTranslations, fetchTranslations, loadTranslations, parseTranslations } from '@locl/core';
export { APP_BASE_HREF } from '@angular/common';

export { AppServerModule } from './app/app.server.module';
