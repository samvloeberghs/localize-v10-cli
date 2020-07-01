import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  {
    path: $localize`:@@aboutRoutePath:about`,
    component: AboutComponent,
  },
  {
    path: $localize`:@@contactRoutePath:contact`,
    loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
