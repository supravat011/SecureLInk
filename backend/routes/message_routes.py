from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.message import Message
from models.user import User
from database.db import db, log_communication
from services.crypto_service import CryptoService

message_bp = Blueprint('messages', __name__, url_prefix='/api/messages')

@message_bp.route('/send', methods=['POST'])
@jwt_required()
def send_message():
    """Send an encrypted message"""
    sender_id = get_jwt_identity()
    data = request.get_json()
    
    receiver_username = data.get('receiver_username')
    encrypted_content = data.get('encrypted_content')
    iv = data.get('iv')
    encrypted_aes_key = data.get('encrypted_aes_key')
    algorithm = data.get('algorithm', 'AES-256-CBC')
    
    if not all([receiver_username, encrypted_content, iv, encrypted_aes_key]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Find receiver
    receiver = User.query.filter_by(username=receiver_username).first()
    if not receiver:
        return jsonify({'error': 'Receiver not found'}), 404
    
    # Create message
    message = Message(
        sender_id=sender_id,
        receiver_id=receiver.id,
        encrypted_content=encrypted_content,
        iv=iv,
        encrypted_aes_key=encrypted_aes_key,
        algorithm=algorithm
    )
    
    db.session.add(message)
    db.session.commit()
    
    # Log communication
    log_communication(
        sender_id,
        'MESSAGE_SENT',
        f'Message sent to {receiver_username}'
    )
    
    return jsonify({
        'message': 'Message sent successfully',
        'data': message.to_dict()
    }), 201

@message_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get message history for current user"""
    user_id = get_jwt_identity()
    
    # Get messages where user is sender or receiver
    sent_messages = Message.query.filter_by(sender_id=user_id).all()
    received_messages = Message.query.filter_by(receiver_id=user_id).all()
    
    all_messages = sent_messages + received_messages
    all_messages.sort(key=lambda x: x.timestamp, reverse=True)
    
    return jsonify({
        'messages': [msg.to_dict() for msg in all_messages]
    }), 200

@message_bp.route('/<int:message_id>', methods=['GET'])
@jwt_required()
def get_message(message_id):
    """Get a specific message"""
    user_id = get_jwt_identity()
    message = Message.query.get(message_id)
    
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    # Check if user is sender or receiver
    if message.sender_id != user_id and message.receiver_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({'message': message.to_dict()}), 200

@message_bp.route('/<int:message_id>', methods=['DELETE'])
@jwt_required()
def delete_message(message_id):
    """Delete a message"""
    user_id = get_jwt_identity()
    message = Message.query.get(message_id)
    
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    # Only sender can delete
    if message.sender_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(message)
    db.session.commit()
    
    log_communication(user_id, 'MESSAGE_DELETED', f'Message {message_id} deleted')
    
    return jsonify({'message': 'Message deleted successfully'}), 200

@message_bp.route('/decrypt', methods=['POST'])
@jwt_required()
def decrypt_message():
    """Decrypt a message (for demonstration purposes)"""
    data = request.get_json()
    
    encrypted_content = data.get('encrypted_content')
    iv = data.get('iv')
    aes_key_b64 = data.get('aes_key')
    
    if not all([encrypted_content, iv, aes_key_b64]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        # Decode from base64
        ciphertext = CryptoService.decode_base64(encrypted_content)
        iv_bytes = CryptoService.decode_base64(iv)
        aes_key = CryptoService.decode_base64(aes_key_b64)
        
        # Decrypt
        plaintext = CryptoService.decrypt_aes(ciphertext, aes_key, iv_bytes)
        
        return jsonify({'plaintext': plaintext}), 200
    except Exception as e:
        return jsonify({'error': f'Decryption failed: {str(e)}'}), 400
