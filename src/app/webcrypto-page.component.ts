import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-webcrypto-page',
  templateUrl: './webcrypto-page.component.html',
  styleUrls: ['./webcrypto-page.component.scss']
})
export class WebcryptoPageComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }
}
