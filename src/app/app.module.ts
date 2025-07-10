import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebcryptoPageComponent } from './webcrypto-page.component';
import { CryptojsPageComponent } from './cryptojs-page.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const routes: Routes = [
  { path: '', redirectTo: '/webcrypto', pathMatch: 'full' },
  { path: 'webcrypto', component: WebcryptoPageComponent },
  { path: 'cryptojs', component: CryptojsPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    WebcryptoPageComponent,
    CryptojsPageComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(routes),
    MatSnackBarModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
