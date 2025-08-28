import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CryptojsPageComponent } from './cryptojs-page.component';
import { WebcryptoPageComponent } from './webcrypto-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/webcrypto', pathMatch: 'full' },
  { path: 'webcrypto', component: WebcryptoPageComponent },
  { path: 'cryptojs', component: CryptojsPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
