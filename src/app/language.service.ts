import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { isPlatformBrowser } from '@angular/common';

export enum Languages {
  EN = 'English',
  NL = 'Nederlands'
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  public language: Languages;

  constructor(
    @Optional() @Inject(REQUEST) private readonly request: Request,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {

  }

  public init(): Promise<Languages> {
    return new Promise(res => {
      let originalUrl = '';
      if (isPlatformBrowser(this.platformId)) {
        originalUrl = window.location.pathname;
      } else {
        originalUrl = this.request.originalUrl;
      }
      this.language = <Languages>originalUrl.split('/')[1].substr(0, 2);
      res();
    });
  }
}
