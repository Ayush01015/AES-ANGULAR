import { Injectable } from '@angular/core';

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
        salt,
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
      { name: aesName, iv },
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
      { name: aesName, iv },
      key,
      data
    );

    return this.decoder.decode(decrypted);
  }

}
