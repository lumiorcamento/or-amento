/**
 * Shared crypto utilities for Edge Functions
 * Uses Web Crypto API (AES-GCM)
 */

const ENCRYPTION_KEY_NAME = 'INTEGRATION_ENCRYPTION_KEY';

async function getKey() {
  const rawKey = Deno.env.get(ENCRYPTION_KEY_NAME);
  if (!rawKey) throw new Error(`${ENCRYPTION_KEY_NAME} not configured`);
  
  // Hash the key to ensure it's 32 bytes (256 bits) for AES-256
  const keyBuf = new TextEncoder().encode(rawKey);
  const hash = await crypto.subtle.digest('SHA-256', keyBuf);
  
  return await crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptSecret(text: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  
  // Return IV + Encrypted Data in base64
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

export async function decryptSecret(base64: string): Promise<string> {
  const key = await getKey();
  const combined = new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)));
  
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  return new TextDecoder().decode(decrypted);
}
