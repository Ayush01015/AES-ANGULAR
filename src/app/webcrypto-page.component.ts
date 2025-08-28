import { Component } from '@angular/core';
import { EncryptionService } from './services/encryption.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-webcrypto-page',
  templateUrl: './webcrypto-page.component.html',
  styleUrls: ['./webcrypto-page.component.scss']
})
export class WebcryptoPageComponent {

  plainText: string = '';
  encryptKey: string = '';
  encryptedText: string = '';

  encryptedInput: string = '';
  decryptKey: string = '';
  decryptedText: string = '';

  // Advanced options
  showAdvanced: boolean = false;

  // Advanced config fields (default values match service defaults)
  advSalt: string = '';
  advIV: string = '';
  advIterations: number = 100000;
  advHash: string = 'SHA-512';
  advAesName: string = 'AES-GCM';
  advAesLength: number = 256;

  constructor(
    private cryptoService: EncryptionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  showSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  async encrypt() {
    if (!this.plainText || !this.encryptKey) {
      this.encryptedText = '';
      return;
    }
    try {
      let salt: Uint8Array;
      let iv: Uint8Array;
      let iterations = this.advIterations;
      let hash = this.advHash;
      let aesName = this.advAesName;
      let aesLength = this.advAesLength;
      if (this.showAdvanced) {
        salt = this.advSalt ? Uint8Array.from(this.advSalt.split(',').map(Number)) : crypto.getRandomValues(new Uint8Array(16));
        iv = this.advIV ? Uint8Array.from(this.advIV.split(',').map(Number)) : crypto.getRandomValues(new Uint8Array(12));
      } else {
        salt = crypto.getRandomValues(new Uint8Array(16));
        iv = crypto.getRandomValues(new Uint8Array(12));
        iterations = 100000;
        hash = 'SHA-512';
        aesName = 'AES-GCM';
        aesLength = 256;
      }
      this.encryptedText = await this.cryptoService.encryptAESGCM(
        this.plainText,
        this.encryptKey,
        salt,
        iv,
        iterations,
        hash,
        aesName,
        aesLength
      );
      this.showSnackBar('Encryption successful!');
    } catch (err) {
      this.encryptedText = 'Encryption failed';
      this.showSnackBar('Encryption failed');
    }
  }

  async decrypt() {
    if (!this.encryptedInput || !this.decryptKey) {
      this.decryptedText = '';
      return;
    }
    try {
      let iterations = this.advIterations;
      let hash = this.advHash;
      let aesName = this.advAesName;
      let aesLength = this.advAesLength;
      if (!this.showAdvanced) {
        iterations = 100000;
        hash = 'SHA-512';
        aesName = 'AES-GCM';
        aesLength = 256;
      }
      this.decryptedText = await this.cryptoService.decryptAESGCM(
        this.encryptedInput,
        this.decryptKey,
        iterations,
        hash,
        aesName,
        aesLength
      );
      this.showSnackBar('Decryption successful!');
    } catch (err) {
      this.decryptedText = 'Decryption failed or invalid key.';
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

  goToCryptoJS() {
    this.router.navigate(['/cryptojs']);
  }

  ngOnInit() {
    // Optionally, reset advanced fields on load
    this.resetAdvancedOptions();
  }

  ngOnChanges() {
    // Optionally, reset advanced fields on changes
    if (!this.showAdvanced) {
      this.resetAdvancedOptions();
    }
  }

  resetAdvancedOptions() {
    this.advSalt = '';
    this.advIV = '';
    this.advIterations = 100000;
    this.advHash = 'SHA-512';
    this.advAesName = 'AES-GCM';
    this.advAesLength = 256;
  }

  // Watch for showAdvanced changes
  ngDoCheck() {
    if (!this.showAdvanced && (this.advSalt || this.advIV || this.advIterations !== 100000 || this.advHash !== 'SHA-512' || this.advAesName !== 'AES-GCM' || this.advAesLength !== 256)) {
      this.resetAdvancedOptions();
    }
  }
}
