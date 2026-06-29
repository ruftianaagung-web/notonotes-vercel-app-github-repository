export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function encryptData(data: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(data)
  );
  
  const encryptedArray = Array.from(new Uint8Array(encrypted));
  const encryptedHex = encryptedArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return JSON.stringify({ v: 1, s: saltHex, i: ivHex, d: encryptedHex });
}

export async function decryptData(encryptedStr: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const parsed = JSON.parse(encryptedStr);
  if (parsed.v !== 1) throw new Error("Unsupported version");
  
  const salt = new Uint8Array(parsed.s.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
  const iv = new Uint8Array(parsed.i.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
  const encryptedData = new Uint8Array(parsed.d.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
  
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encryptedData
  );
  
  return new TextDecoder().decode(decrypted);
}
