import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { LanguageRouteComponent } from './language-route.component';
import { LanguageService } from './language.service';

export function defineLanguage(languageService: LanguageService) {
  return () => languageService.init().catch(e => {
    console.error(`Could not retrieve config: ${e}`);
  });
}

@NgModule({
  declarations: [
    AppComponent,
    LanguageRouteComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: defineLanguage,
      multi: true,
      deps: [LanguageService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
