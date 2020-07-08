import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { getTranslations } from '@locl/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const language = window.location.pathname.split('/')[1].substr(0, 2);
    console.log('language', language);
    await getTranslations(`/assets/i18n/${language}.json`);
    await platformBrowserDynamic().bootstrapModule(AppModule);
  } catch (err) {
    console.log(err);
  }
});
