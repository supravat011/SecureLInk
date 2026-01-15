from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.auth_service import AuthService
from services.crypto_service import CryptoService

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    public_key = data.get('public_key')
    private_key_encrypted = data.get('private_key_encrypted')
    
    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400
    
    user, error = AuthService.register_user(
        username, email, password, public_key, private_key_encrypted
    )
    
    if error:
        return jsonify({'error': error}), 400
    
    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user and return JWT tokens"""
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Missing credentials'}), 400
    
    ip_address = request.remote_addr
    user_agent = request.headers.get('User-Agent')
    
    access_token, refresh_token, user, error = AuthService.login_user(
        username, password, ip_address, user_agent
    )
    
    if error:
        return jsonify({'error': error}), 401
    
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user"""
    user_id = get_jwt_identity()
    session_id = request.get_json().get('session_id')
    
    AuthService.logout_user(user_id, session_id)
    
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify():
    """Verify JWT token and return user info"""
    user_id = get_jwt_identity()
    user = AuthService.get_user_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': user.to_dict()}), 200

@auth_bp.route('/keypair', methods=['GET'])
def generate_keypair():
    """Generate RSA keypair for client"""
    private_key, public_key = CryptoService.generate_rsa_keypair()
    
    return jsonify({
        'private_key': private_key,
        'public_key': public_key
    }), 200
