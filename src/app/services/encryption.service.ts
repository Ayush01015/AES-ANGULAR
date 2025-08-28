import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  constructor() { }

  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  private async deriveKey(password: string, salt: Uint8Array, iterations = 100000, hash: string = 'SHA-512', aesName: string = 'AES-GCM', aesLength: number = 256): Promise<CryptoKey> {
    const baseKey = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt.buffer as ArrayBuffer,
        iterations,
        hash
      },
      baseKey,
      {
        name: aesName,
        length: aesLength
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encryptAESGCM(
    plainText: string,
    password: string,
    salt?: Uint8Array,
    iv?: Uint8Array,
    iterations: number = 100000,
    hash: string = 'SHA-512',
    aesName: string = 'AES-GCM',
    aesLength: number = 256
  ): Promise<string> {
    salt = salt || crypto.getRandomValues(new Uint8Array(16));
    iv = iv || crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(password, salt, iterations, hash, aesName, aesLength);

    const encrypted = await crypto.subtle.encrypt(
      { name: aesName, iv: iv.buffer as ArrayBuffer },
      key,
      this.encoder.encode(plainText)
    );

    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  async decryptAESGCM(
    encryptedBase64: string,
    password: string,
    iterations: number = 100000,
    hash: string = 'SHA-512',
    aesName: string = 'AES-GCM',
    aesLength: number = 256
  ): Promise<string> {
    const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const data = combined.slice(28);

    const key = await this.deriveKey(password, salt, iterations, hash, aesName, aesLength);

    const decrypted = await crypto.subtle.decrypt(
      { name: aesName, iv: iv.buffer as ArrayBuffer },
      key,
      data
    );

    return this.decoder.decode(decrypted);
  }

  cryptoAESEncrypt(data: any, key: any) {
    try {
      // Validate key presence
      if (!key || key === '') {
        console.error('Encryption failed: Key is not present or empty');
        throw new Error('Key cannot be empty');
      }

      const dataString = typeof data === 'string' ? data : JSON.stringify(data);
      const iv = CryptoJS.lib.WordArray.random(128/8);
      const keyUtf8 = CryptoJS.enc.Base64.parse(key);
      const encrypted = CryptoJS.AES.encrypt(dataString, keyUtf8, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7 
      });
      const result = iv.concat(encrypted.ciphertext);

      return CryptoJS.enc.Base64.stringify(result);

    } catch (error:any) {
      if (error.message === 'Key cannot be empty') {
        throw error;
      }
      console.error('Encryption failed: Unable to fetch key from cloud or key is invalid', error);
      throw new Error('Encryption failed due to key issues');
    }
  }  
  cryptoAESDecrypt(data: any, key: any) {
    try {
      if (!key || key === '') {
        console.error('Decryption failed: Key is not present or empty');
        throw new Error('Key cannot be empty');
      }

      const keyUtf8 = CryptoJS.enc.Base64.parse(key);
      const ciphertext = CryptoJS.enc.Base64.parse(data);
      const iv = CryptoJS.lib.WordArray.create(ciphertext.words.slice(0, 4));
      const encrypted = CryptoJS.lib.WordArray.create(ciphertext.words.slice(4));
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: encrypted
      });
      const decrypted = CryptoJS.AES.decrypt(cipherParams, keyUtf8, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      try {
        console.log('Decrypted string from service:', decryptedString);
        return JSON.parse(decryptedString);
      } catch (e) {
        return decryptedString;
      }
    } catch (error:any) {
      if (error.message === 'Key cannot be empty') {
        throw error;
      }
      console.error('Decryption failed: Unable to fetch key from cloud or key is invalid', error);
      throw new Error('Decryption failed due to key issues');
    }
  }

}
