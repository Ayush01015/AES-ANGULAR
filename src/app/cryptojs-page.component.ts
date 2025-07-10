import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cryptojs-page',
  templateUrl: './cryptojs-page.component.html',
  styleUrls: ['./cryptojs-page.component.scss']
})
export class CryptojsPageComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }
}
