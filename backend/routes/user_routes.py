from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.communication_log import CommunicationLog
from services.auth_service import AuthService
from database.db import db

user_bp = Blueprint('users', __name__, url_prefix='/api/users')

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': user.to_dict()}), 200

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Update allowed fields
    if 'email' in data:
        # Check if email already exists
        existing = User.query.filter_by(email=data['email']).first()
        if existing and existing.id != user_id:
            return jsonify({'error': 'Email already in use'}), 400
        user.email = data['email']
    
    if 'public_key' in data:
        user.public_key = data['public_key']
    
    if 'private_key_encrypted' in data:
        user.private_key_encrypted = data['private_key_encrypted']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict()
    }), 200

@user_bp.route('/sessions', methods=['GET'])
@jwt_required()
def get_sessions():
    """Get active sessions for current user"""
    user_id = get_jwt_identity()
    sessions = AuthService.get_active_sessions(user_id)
    
    return jsonify({
        'sessions': [session.to_dict() for session in sessions]
    }), 200

@user_bp.route('/logs', methods=['GET'])
@jwt_required()
def get_logs():
    """Get communication logs for current user"""
    user_id = get_jwt_identity()
    
    # Get query parameters for pagination
    limit = request.args.get('limit', 50, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    logs = CommunicationLog.query.filter_by(user_id=user_id)\
        .order_by(CommunicationLog.timestamp.desc())\
        .limit(limit)\
        .offset(offset)\
        .all()
    
    total = CommunicationLog.query.filter_by(user_id=user_id).count()
    
    return jsonify({
        'logs': [log.to_dict() for log in logs],
        'total': total,
        'limit': limit,
        'offset': offset
    }), 200

@user_bp.route('/search', methods=['GET'])
@jwt_required()
def search_users():
    """Search for users by username"""
    query = request.args.get('q', '')
    
    if not query:
        return jsonify({'users': []}), 200
    
    users = User.query.filter(User.username.like(f'%{query}%')).limit(10).all()
    
    return jsonify({
        'users': [user.to_dict() for user in users]
    }), 200

@user_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_users():
    """Get all users (for demo purposes)"""
    users = User.query.all()
    
    return jsonify({
        'users': [user.to_dict() for user in users]
    }), 200
