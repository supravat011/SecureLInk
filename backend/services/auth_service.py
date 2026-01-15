from flask_jwt_extended import create_access_token, create_refresh_token
from models.user import User
from models.session import Session
from database.db import db, log_communication
from datetime import datetime, timedelta
import secrets

class AuthService:
    """Authentication service for user management"""
    
    @staticmethod
    def register_user(username, email, password, public_key=None, private_key_encrypted=None):
        """
        Register a new user
        
        Args:
            username (str): Username
            email (str): Email address
            password (str): Plain password
            public_key (str): RSA public key (optional)
            private_key_encrypted (str): Encrypted RSA private key (optional)
            
        Returns:
            tuple: (user, error_message)
        """
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return None, "Username already exists"
        
        if User.query.filter_by(email=email).first():
            return None, "Email already exists"
        
        # Create new user
        user = User(
            username=username,
            email=email,
            public_key=public_key,
            private_key_encrypted=private_key_encrypted
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Log registration
        log_communication(user.id, 'USER_REGISTERED', f'User {username} registered')
        
        return user, None
    
    @staticmethod
    def login_user(username, password, ip_address=None, user_agent=None):
        """
        Authenticate user and create session
        
        Args:
            username (str): Username
            password (str): Password
            ip_address (str): Client IP address
            user_agent (str): Client user agent
            
        Returns:
            tuple: (access_token, refresh_token, user, error_message)
        """
        user = User.query.filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            return None, None, None, "Invalid credentials"
        
        # Create JWT tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        # Create session
        session_key = secrets.token_urlsafe(32)
        session = Session(
            user_id=user.id,
            session_key=session_key,
            ip_address=ip_address,
            user_agent=user_agent,
            expires_at=datetime.utcnow() + timedelta(hours=1)
        )
        db.session.add(session)
        db.session.commit()
        
        # Log login
        log_communication(user.id, 'USER_LOGIN', f'User {username} logged in', session.id)
        
        return access_token, refresh_token, user, None
    
    @staticmethod
    def logout_user(user_id, session_id=None):
        """
        Logout user and deactivate session
        
        Args:
            user_id (int): User ID
            session_id (int): Session ID (optional)
        """
        if session_id:
            session = Session.query.get(session_id)
            if session:
                session.is_active = False
                db.session.commit()
        
        # Log logout
        log_communication(user_id, 'USER_LOGOUT', 'User logged out', session_id)
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        return User.query.get(user_id)
    
    @staticmethod
    def get_active_sessions(user_id):
        """Get all active sessions for a user"""
        return Session.query.filter_by(user_id=user_id, is_active=True).all()
