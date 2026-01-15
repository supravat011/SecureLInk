// Using the native Web Crypto API for realistic simulation

export const generateKey = async (): Promise<CryptoKey> => {
  return window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
};

export const encryptMessage = async (text: string, key: CryptoKey): Promise<{ cipherText: string, iv: Uint8Array }> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    data
  );

  // Convert buffer to base64 for display
  const encryptedArray = new Uint8Array(encryptedBuffer);
  let binary = '';
  for (let i = 0; i < encryptedArray.length; i++) {
    binary += String.fromCharCode(encryptedArray[i]);
  }
  const cipherText = btoa(binary);

  return { cipherText, iv };
};

export const decryptMessage = async (cipherText: string, key: CryptoKey, iv: Uint8Array): Promise<string> => {
  const binary = atob(cipherText);
  const encryptedArray = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    encryptedArray[i] = binary.charCodeAt(i);
  }

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedArray
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
};