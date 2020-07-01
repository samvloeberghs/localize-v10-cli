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
    const translationData = await getTranslations('/assets/i18n/nl.json');
    console.log(translationData);
    await platformBrowserDynamic().bootstrapModule(AppModule);
  } catch (err) {
    console.log(err);
  }
});
