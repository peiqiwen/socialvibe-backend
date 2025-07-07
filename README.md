# SocialVibe Backend API

A complete backend API for the SocialVibe social media application, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: Register, login, logout with JWT tokens
- **User Management**: Profile management, follow/unfollow users
- **Feed System**: Create, read, update, delete posts with media support
- **Social Features**: Like, comment, share posts
- **Vibe Coin System**: Virtual currency for tips and purchases
- **Real-time Features**: WebSocket support for live updates
- **Security**: Rate limiting, input validation, CORS protection

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Railway account (for deployment)

## 🛠️ Installation

### 1. Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment example
cp env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Database Setup

1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Update `MONGODB_URI` in `.env`

### 4. JWT Secret

Generate a secure JWT secret:

```bash
# Generate a random string
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Update `JWT_SECRET` in `.env`

## 🚀 Running the Application

### Development Mode

```bash
# Start development server
npm run dev

# Server will run on http://localhost:3000
```

### Production Mode

```bash
# Start production server
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users/profile/:username` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/follow/:userId` - Follow user
- `DELETE /api/users/follow/:userId` - Unfollow user
- `GET /api/users/search` - Search users

### Feeds
- `GET /api/feeds` - Get feeds with pagination
- `POST /api/feeds` - Create new feed
- `GET /api/feeds/:feedId` - Get specific feed
- `PUT /api/feeds/:feedId` - Update feed
- `DELETE /api/feeds/:feedId` - Delete feed
- `POST /api/feeds/:feedId/like` - Like/unlike feed
- `POST /api/feeds/:feedId/comment` - Add comment

### Vibe Coins
- `GET /api/vibe/balance` - Get user balance
- `GET /api/vibe/packages` - Get coin packages
- `POST /api/vibe/purchase` - Purchase coins
- `POST /api/vibe/tip` - Tip a feed
- `GET /api/vibe/transactions` - Get transaction history

## 🗄️ Database Schema

### User Model
```javascript
{
  email: String (unique),
  username: String (unique),
  password: String (hashed),
  displayName: String,
  avatar: String,
  bio: String,
  vibeCoins: Number,
  followers: [User],
  following: [User],
  isVerified: Boolean,
  isActive: Boolean,
  preferences: Object
}
```

### Feed Model
```javascript
{
  author: User,
  content: String,
  media: {
    images: [Object],
    video: Object
  },
  tags: [String],
  mentions: [User],
  location: Object,
  likes: [User],
  comments: [Object],
  tips: [Object],
  totalTips: Number,
  viewCount: Number,
  isPublic: Boolean,
  status: String
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `CORS_ORIGIN` | Allowed origins | localhost |

### Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Message**: "Too many requests"

## 🚀 Deployment

### Railway Deployment

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Initial backend setup"
   git push origin main
   ```

2. **Deploy on Railway**
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically

3. **Environment Variables on Railway**
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-jwt-secret
   NODE_ENV=production
   PORT=3000
   ```

### MongoDB Atlas Setup

1. **Create Cluster**
   - Sign up at [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a free cluster
   - Choose your preferred region

2. **Database Access**
   - Create a database user
   - Set username and password
   - Grant read/write permissions

3. **Network Access**
   - Allow access from anywhere (0.0.0.0/0)
   - Or restrict to Railway IPs

4. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/socialvibe?retryWrites=true&w=majority
   ```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: express-validator middleware
- **Rate Limiting**: Prevent abuse
- **CORS Protection**: Configured origins
- **Helmet**: Security headers
- **Compression**: Response compression

## 📊 Monitoring

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### Logging
- Console logging for development
- Structured logging for production
- Error tracking and monitoring

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📝 API Documentation

### Request Headers
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer your-jwt-token"
}
```

### Response Format
```javascript
{
  "message": "Success message",
  "data": {}, // or array
  "error": null
}
```

### Error Response
```javascript
{
  "error": "Error type",
  "message": "Human readable message",
  "details": [] // validation errors
}
```

## 🔄 Updates and Maintenance

### Database Migrations
- Manual schema updates
- Data migration scripts
- Backup strategies

### API Versioning
- Current version: v1
- Backward compatibility
- Deprecation notices

## 📞 Support

For issues and questions:
- Check the logs
- Review API documentation
- Contact development team

## 📄 License

MIT License - see LICENSE file for details 