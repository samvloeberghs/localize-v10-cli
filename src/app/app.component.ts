import { Component } from '@angular/core';
import { LanguageService } from './language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  aboutRoutePath = $localize`:about path string|The path string for the about route@@aboutRoutePath:about`;
  contactRoutePath = $localize`:contact path string|The path string for the contact route@@contactRoutePath:contact`;
  public readonly language = this.languageService.language;

  constructor(private readonly languageService: LanguageService) {

  }
}
