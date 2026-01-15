import socket
import threading
import json
import logging
from services.crypto_service import CryptoService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SocketServer:
    """TCP/IP Socket Server for encrypted real-time communication"""
    
    def __init__(self, host='0.0.0.0', port=5001):
        self.host = host
        self.port = port
        self.server_socket = None
        self.clients = {}  # {client_address: {'socket': socket, 'aes_key': key}}
        self.running = False
        
        # Generate server RSA keypair
        self.private_key, self.public_key = CryptoService.generate_rsa_keypair()
        logger.info("Server RSA keypair generated")
    
    def start(self):
        """Start the socket server"""
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.server_socket.bind((self.host, self.port))
        self.server_socket.listen(5)
        self.running = True
        
        logger.info(f"Socket server started on {self.host}:{self.port}")
        
        # Start accepting connections in a separate thread
        accept_thread = threading.Thread(target=self._accept_connections)
        accept_thread.daemon = True
        accept_thread.start()
    
    def _accept_connections(self):
        """Accept incoming client connections"""
        while self.running:
            try:
                client_socket, client_address = self.server_socket.accept()
                logger.info(f"New connection from {client_address}")
                
                # Handle client in a separate thread
                client_thread = threading.Thread(
                    target=self._handle_client,
                    args=(client_socket, client_address)
                )
                client_thread.daemon = True
                client_thread.start()
            except Exception as e:
                if self.running:
                    logger.error(f"Error accepting connection: {e}")
    
    def _handle_client(self, client_socket, client_address):
        """Handle individual client connection"""
        try:
            # Step 1: Send server public key to client
            handshake_data = {
                'type': 'handshake',
                'public_key': self.public_key
            }
            client_socket.send(json.dumps(handshake_data).encode('utf-8'))
            logger.info(f"Sent public key to {client_address}")
            
            # Step 2: Receive encrypted AES key from client
            encrypted_aes_key_b64 = client_socket.recv(4096).decode('utf-8')
            encrypted_aes_key = CryptoService.decode_base64(encrypted_aes_key_b64)
            
            # Step 3: Decrypt AES key with server's private key
            aes_key = CryptoService.decrypt_rsa(encrypted_aes_key, self.private_key)
            logger.info(f"Established secure channel with {client_address}")
            
            # Store client info
            self.clients[client_address] = {
                'socket': client_socket,
                'aes_key': aes_key
            }
            
            # Step 4: Listen for encrypted messages
            while self.running:
                data = client_socket.recv(4096)
                if not data:
                    break
                
                # Decrypt message
                message_data = json.loads(data.decode('utf-8'))
                ciphertext = CryptoService.decode_base64(message_data['ciphertext'])
                iv = CryptoService.decode_base64(message_data['iv'])
                
                plaintext = CryptoService.decrypt_aes(ciphertext, aes_key, iv)
                logger.info(f"Received from {client_address}: {plaintext}")
                
                # Echo back encrypted response
                response = f"Server received: {plaintext}"
                response_iv = CryptoService.generate_iv()
                response_ciphertext = CryptoService.encrypt_aes(response, aes_key, response_iv)
                
                response_data = {
                    'ciphertext': CryptoService.encode_base64(response_ciphertext),
                    'iv': CryptoService.encode_base64(response_iv)
                }
                client_socket.send(json.dumps(response_data).encode('utf-8'))
                
        except Exception as e:
            logger.error(f"Error handling client {client_address}: {e}")
        finally:
            # Clean up
            if client_address in self.clients:
                del self.clients[client_address]
            client_socket.close()
            logger.info(f"Connection closed: {client_address}")
    
    def stop(self):
        """Stop the socket server"""
        self.running = False
        if self.server_socket:
            self.server_socket.close()
        logger.info("Socket server stopped")
    
    def broadcast_message(self, message, sender_address=None):
        """Broadcast encrypted message to all connected clients"""
        for address, client_info in self.clients.items():
            if address != sender_address:
                try:
                    iv = CryptoService.generate_iv()
                    ciphertext = CryptoService.encrypt_aes(message, client_info['aes_key'], iv)
                    
                    data = {
                        'ciphertext': CryptoService.encode_base64(ciphertext),
                        'iv': CryptoService.encode_base64(iv)
                    }
                    client_info['socket'].send(json.dumps(data).encode('utf-8'))
                except Exception as e:
                    logger.error(f"Error broadcasting to {address}: {e}")
