import { Component } from '@angular/core';
import { EncryptionService } from './services/encryption.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cryptojs-page',
  templateUrl: './cryptojs-page.component.html',
  styleUrls: ['./cryptojs-page.component.scss']
})
export class CryptojsPageComponent {

  plainText: string = '';
  encryptKey: string = '';
  encryptedText: string = '';

  encryptedInput: string = '';
  decryptKey: string = '';
  decryptedText: string = '';

  constructor(
    private encryptionService: EncryptionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async encrypt() {
    if (!this.plainText || !this.encryptKey) {
      this.encryptedText = '';
      return;
    }
    
    try {
      this.encryptedText = this.encryptionService.cryptoAESEncrypt(this.plainText, this.encryptKey);
      this.showSnackBar('Encryption successful!');
    } catch (error: any) {
      this.encryptedText = 'Encryption failed: ' + error.message;
      this.showSnackBar('Encryption failed');
    }
  }

  async decrypt() {
    if (!this.encryptedInput || !this.decryptKey) {
      this.decryptedText = '';
      return;
    }

    try {
      this.decryptedText = this.encryptionService.cryptoAESDecrypt(this.encryptedInput, this.decryptKey);
      this.showSnackBar('Decryption successful!');
    } catch (error: any) {
      this.decryptedText = 'Decryption failed: ' + error.message;
      this.showSnackBar('Decryption failed');
    }
  }

  clearEncrypt() {
    this.plainText = '';
    this.encryptKey = '';
    this.encryptedText = '';
  }

  clearDecrypt() {
    this.encryptedInput = '';
    this.decryptKey = '';
    this.decryptedText = '';
  }

  goToWebCrypto() {
    this.router.navigate(['/webcrypto']);
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
