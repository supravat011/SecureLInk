from database.db import db
from datetime import datetime

class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    encrypted_content = db.Column(db.Text, nullable=False)
    iv = db.Column(db.Text, nullable=False)
    encrypted_aes_key = db.Column(db.Text, nullable=False)
    algorithm = db.Column(db.String(20), default='AES-256-CBC')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert message to dictionary"""
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'sender_username': self.sender.username if self.sender else None,
            'receiver_username': self.receiver.username if self.receiver else None,
            'encrypted_content': self.encrypted_content,
            'iv': self.iv,
            'encrypted_aes_key': self.encrypted_aes_key,
            'algorithm': self.algorithm,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }
