# SecureLink: Encrypted Data Communication Framework

A full-stack web application demonstrating end-to-end encryption (E2EE) using AES-256 and RSA-2048 algorithms with a modern React frontend and Python Flask backend.

![SecureLink](https://img.shields.io/badge/Encryption-AES--256-blue)
![Backend](https://img.shields.io/badge/Backend-Python%20Flask-green)
![Frontend](https://img.shields.io/badge/Frontend-React%20TypeScript-cyan)

## 🔐 Features

### Security & Encryption
- **AES-256-CBC Encryption**: Industry-standard symmetric encryption for message payloads
- **RSA-2048 Key Exchange**: Secure asymmetric encryption for key distribution
- **HMAC-SHA256**: Message integrity verification
- **JWT Authentication**: Secure stateless user authentication
- **bcrypt Password Hashing**: Secure password storage

### Real-Time Communication
- **TCP/IP Socket Server**: Real-time encrypted messaging
- **Secure Handshake Protocol**: RSA-based key exchange
- **Multi-Client Support**: Concurrent connection handling

### User Features
- User registration and authentication
- Encrypted message transmission
- Message history with search and filtering
- Communication logs and audit trail
- Session management
- Real-time encryption visualization

## 🏗️ Architecture

```
SecureLink/
├── frontend/                  # React TypeScript Frontend
│   ├── pages/                # Application pages
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── VisualizationPage.tsx
│   │   ├── HistoryPage.tsx
│   │   └── AboutPage.tsx
│   ├── services/             # API and business logic
│   │   ├── apiService.ts
│   │   ├── authService.ts
│   │   ├── messageService.ts
│   │   ├── cryptoService.ts
│   │   └── geminiService.ts
│   └── components/           # Reusable components
│       └── Layout.tsx
│
└── backend/                  # Python Flask Backend
    ├── app.py               # Main Flask application
    ├── config.py            # Configuration
    ├── models/              # Database models
    │   ├── user.py
    │   ├── message.py
    │   ├── session.py
    │   └── communication_log.py
    ├── services/            # Business logic
    │   ├── crypto_service.py
    │   ├── auth_service.py
    │   └── socket_service.py
    ├── routes/              # API endpoints
    │   ├── auth_routes.py
    │   ├── message_routes.py
    │   └── user_routes.py
    └── database/            # Database setup
        ├── db.py
        └── schema.sql
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **npm** or **yarn**

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the backend server**:
   ```bash
   python app.py
   ```

   The backend will start on:
   - **Flask API**: `http://localhost:5000`
   - **Socket Server**: `localhost:5001`

### Frontend Setup

1. **Navigate to project root**:
   ```bash
   cd ..
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT)
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/keypair` - Generate RSA keypair

### Messages
- `POST /api/messages/send` - Send encrypted message
- `GET /api/messages/history` - Get message history
- `GET /api/messages/:id` - Get specific message
- `DELETE /api/messages/:id` - Delete message
- `POST /api/messages/decrypt` - Decrypt message

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/sessions` - Get active sessions
- `GET /api/users/logs` - Get communication logs
- `GET /api/users/search?q=<query>` - Search users

## 🔒 Encryption Flow

1. **User Registration**:
   - Generate RSA-2048 keypair for user
   - Store public key in database
   - Hash password with bcrypt

2. **Message Encryption**:
   - Generate random AES-256 key
   - Encrypt message with AES-256-CBC
   - Encrypt AES key with receiver's RSA public key
   - Store encrypted message and encrypted AES key

3. **Message Decryption**:
   - Decrypt AES key with receiver's RSA private key
   - Decrypt message with AES-256-CBC
   - Verify message integrity with HMAC

4. **Socket Communication**:
   - Client connects to server
   - Server sends RSA public key
   - Client generates AES session key
   - Client encrypts AES key with server's RSA public key
   - All subsequent messages encrypted with AES session key

## 🛠️ Technology Stack

### Frontend
- React 19 with TypeScript
- Vite (Build tool)
- React Router (Navigation)
- Framer Motion (Animations)
- Tailwind CSS (Styling)
- Axios (HTTP client)
- Lucide React (Icons)
- Web Crypto API (Client-side encryption)

### Backend
- Python 3.10+
- Flask (Web framework)
- Flask-CORS (Cross-origin requests)
- Flask-JWT-Extended (Authentication)
- SQLAlchemy (ORM)
- SQLite (Database)
- cryptography (AES/RSA encryption)
- bcrypt (Password hashing)
- socket (TCP/IP server)

## 📊 Database Schema

### Users Table
- `id`, `username`, `email`, `password_hash`
- `public_key`, `private_key_encrypted`
- `created_at`

### Messages Table
- `id`, `sender_id`, `receiver_id`
- `encrypted_content`, `iv`, `encrypted_aes_key`
- `algorithm`, `timestamp`

### Sessions Table
- `id`, `user_id`, `session_key`
- `ip_address`, `user_agent`
- `created_at`, `expires_at`, `is_active`

### Communication Logs Table
- `id`, `session_id`, `user_id`
- `action`, `details`, `timestamp`

## 🎯 Use Cases

- **Educational**: Learn about end-to-end encryption
- **Demonstration**: Showcase secure communication protocols
- **Research**: Study encryption algorithms and implementations
- **Development**: Base for secure messaging applications

## 🔐 Security Features

- End-to-end encryption (E2EE)
- Zero-knowledge architecture
- Secure key exchange (RSA)
- Message integrity verification (HMAC)
- Session management
- Audit logging
- Input validation and sanitization
- CORS protection
- Rate limiting ready

## 📝 License

This is an educational project demonstrating end-to-end encryption concepts.

## 👨‍💻 Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
npm test
```

### Building for Production
```bash
# Frontend
npm run build

# Backend
# Use Gunicorn or uWSGI for production deployment
```

## 🤝 Contributing

This is an educational project. Feel free to fork and experiment!

## 📧 Contact

For questions or feedback about this encryption demonstration project, please open an issue.

---

**⚠️ Disclaimer**: This is an educational project. For production use, conduct thorough security audits and follow industry best practices.
