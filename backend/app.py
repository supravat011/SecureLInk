from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database.db import init_db
from routes.auth_routes import auth_bp
from routes.message_routes import message_bp
from routes.user_routes import user_bp
from services.socket_service import SocketServer
import threading

def create_app(config_class=Config):
    """Application factory"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    CORS(app, origins=app.config['CORS_ORIGINS'])
    JWTManager(app)
    
    # Initialize database
    init_db(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(message_bp)
    app.register_blueprint(user_bp)
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy', 'message': 'SecureLink API is running'}, 200
    
    @app.route('/', methods=['GET'])
    def index():
        return {
            'name': 'SecureLink API',
            'version': '1.0.0',
            'description': 'Encrypted Data Communication Framework',
            'endpoints': {
                'auth': '/api/auth/*',
                'messages': '/api/messages/*',
                'users': '/api/users/*',
                'health': '/api/health'
            }
        }, 200
    
    return app

def start_socket_server(app):
    """Start the socket server in a separate thread"""
    socket_server = SocketServer(
        host=app.config['SOCKET_HOST'],
        port=app.config['SOCKET_PORT']
    )
    socket_server.start()
    return socket_server

if __name__ == '__main__':
    app = create_app()
    
    # Start socket server in background
    print("Starting Socket Server...")
    socket_server = start_socket_server(app)
    
    # Run Flask app
    print("Starting Flask API...")
    app.run(host='0.0.0.0', port=5000, debug=True)
