import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AES-APP';
  encryptionLib: string = 'webcrypto';

  constructor(
    public snackBar: MatSnackBar,
    private router: Router,
  ) {}

  showSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  onLibraryChange() {
    if (this.encryptionLib === 'webcrypto') {
      this.router.navigate(['/webcrypto']);
      this.showSnackBar('Switched to Web Crypto API');
    } else if (this.encryptionLib === 'cryptojs') {
      this.router.navigate(['/cryptojs']);
      this.showSnackBar('Switched to CryptoJS');
    }
  }
}
