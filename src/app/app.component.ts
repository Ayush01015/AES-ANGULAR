import { Component } from '@angular/core';
import { EncryptionService } from './services/encryption.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AES-APP';

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

  encryptionLib: string = 'webcrypto';

  constructor(
    public snackBar: MatSnackBar,
    private cryptoService: EncryptionService,
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

  async encrypt() {
    if (this.encryptionLib === 'cryptojs') {
      this.encryptedText = 'CryptoJS support coming soon. Please use Web Crypto API for now.';
      return;
    }
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
    } catch (err) {
      this.encryptedText = 'Encryption failed';
    }
  }

  async decrypt() {
    if (this.encryptionLib === 'cryptojs') {
      this.decryptedText = 'CryptoJS support coming soon. Please use Web Crypto API for now.';
      return;
    }
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
    } catch (err) {
      this.decryptedText = 'Decryption failed or invalid key.';
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
