from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import sqlite3
import os

db = SQLAlchemy()

def init_db(app):
    """Initialize the database"""
    db.init_app(app)
    
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Execute schema.sql for additional setup
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        if os.path.exists(schema_path):
            with open(schema_path, 'r') as f:
                schema_sql = f.read()
                
            # Get the database path
            db_path = app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')
            
            # Execute schema
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.executescript(schema_sql)
            conn.commit()
            conn.close()
            
    return db

def log_communication(user_id, action, details, session_id=None):
    """Helper function to log communication events"""
    from models.communication_log import CommunicationLog
    
    log = CommunicationLog(
        user_id=user_id,
        session_id=session_id,
        action=action,
        details=details
    )
    db.session.add(log)
    db.session.commit()
    return log
