from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import hashes, hmac, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.backends import default_backend
import os
import base64

class CryptoService:
    """Encryption and decryption service using AES-256 and RSA-2048"""
    
    @staticmethod
    def generate_aes_key():
        """Generate a random 256-bit AES key"""
        return os.urandom(32)  # 32 bytes = 256 bits
    
    @staticmethod
    def generate_iv():
        """Generate a random initialization vector for AES"""
        return os.urandom(16)  # 16 bytes for AES
    
    @staticmethod
    def encrypt_aes(plaintext, key, iv):
        """
        Encrypt plaintext using AES-256-CBC
        
        Args:
            plaintext (str): The text to encrypt
            key (bytes): 32-byte AES key
            iv (bytes): 16-byte initialization vector
            
        Returns:
            bytes: Encrypted ciphertext
        """
        # Pad plaintext to be multiple of 16 bytes
        plaintext_bytes = plaintext.encode('utf-8')
        padding_length = 16 - (len(plaintext_bytes) % 16)
        padded_plaintext = plaintext_bytes + bytes([padding_length] * padding_length)
        
        # Create cipher and encrypt
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        ciphertext = encryptor.update(padded_plaintext) + encryptor.finalize()
        
        return ciphertext
    
    @staticmethod
    def decrypt_aes(ciphertext, key, iv):
        """
        Decrypt ciphertext using AES-256-CBC
        
        Args:
            ciphertext (bytes): The encrypted data
            key (bytes): 32-byte AES key
            iv (bytes): 16-byte initialization vector
            
        Returns:
            str: Decrypted plaintext
        """
        # Create cipher and decrypt
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        padded_plaintext = decryptor.update(ciphertext) + decryptor.finalize()
        
        # Remove padding
        padding_length = padded_plaintext[-1]
        plaintext_bytes = padded_plaintext[:-padding_length]
        
        return plaintext_bytes.decode('utf-8')
    
    @staticmethod
    def generate_rsa_keypair():
        """
        Generate RSA-2048 key pair
        
        Returns:
            tuple: (private_key, public_key) as PEM-encoded strings
        """
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )
        public_key = private_key.public_key()
        
        # Serialize to PEM format
        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ).decode('utf-8')
        
        public_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode('utf-8')
        
        return private_pem, public_pem
    
    @staticmethod
    def encrypt_rsa(data, public_key_pem):
        """
        Encrypt data using RSA public key
        
        Args:
            data (bytes): Data to encrypt
            public_key_pem (str): PEM-encoded public key
            
        Returns:
            bytes: Encrypted data
        """
        public_key = serialization.load_pem_public_key(
            public_key_pem.encode('utf-8'),
            backend=default_backend()
        )
        
        ciphertext = public_key.encrypt(
            data,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        
        return ciphertext
    
    @staticmethod
    def decrypt_rsa(ciphertext, private_key_pem):
        """
        Decrypt data using RSA private key
        
        Args:
            ciphertext (bytes): Encrypted data
            private_key_pem (str): PEM-encoded private key
            
        Returns:
            bytes: Decrypted data
        """
        private_key = serialization.load_pem_private_key(
            private_key_pem.encode('utf-8'),
            password=None,
            backend=default_backend()
        )
        
        plaintext = private_key.decrypt(
            ciphertext,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        
        return plaintext
    
    @staticmethod
    def generate_hmac(message, key):
        """
        Generate HMAC-SHA256 for message integrity
        
        Args:
            message (bytes): Message to authenticate
            key (bytes): HMAC key
            
        Returns:
            bytes: HMAC digest
        """
        h = hmac.HMAC(key, hashes.SHA256(), backend=default_backend())
        h.update(message)
        return h.finalize()
    
    @staticmethod
    def verify_hmac(message, key, signature):
        """
        Verify HMAC-SHA256 signature
        
        Args:
            message (bytes): Original message
            key (bytes): HMAC key
            signature (bytes): HMAC signature to verify
            
        Returns:
            bool: True if valid, False otherwise
        """
        try:
            h = hmac.HMAC(key, hashes.SHA256(), backend=default_backend())
            h.update(message)
            h.verify(signature)
            return True
        except Exception:
            return False
    
    @staticmethod
    def encode_base64(data):
        """Encode bytes to base64 string"""
        return base64.b64encode(data).decode('utf-8')
    
    @staticmethod
    def decode_base64(data):
        """Decode base64 string to bytes"""
        return base64.b64decode(data.encode('utf-8'))
