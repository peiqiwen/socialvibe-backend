# 🚀 Railway 部署指南

## 📋 部署前准备

### 1. 注册账户
- [Railway](https://railway.app/) - 免费额度每月$5
- [MongoDB Atlas](https://www.mongodb.com/atlas) - 免费512MB数据库

### 2. 项目配置更新

#### 更新环境变量
创建 `.env.production` 文件：
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/socialvibe
JWT_SECRET=your_super_secret_jwt_key_here
```

#### 更新CORS配置
在 `server.js` 中更新CORS配置：
```javascript
app.use(cors({
  origin: ['https://your-app-name.railway.app', 'capacitor://localhost'],
  credentials: true
}));
```

## 🔧 部署步骤

### 1. 连接GitHub仓库
1. 在Railway中点击"New Project"
2. 选择"Deploy from GitHub repo"
3. 选择您的SocialVibe仓库

### 2. 配置环境变量
在Railway项目设置中添加：
- `NODE_ENV=production`
- `MONGODB_URI=your_mongodb_atlas_connection_string`
- `JWT_SECRET=your_jwt_secret`

### 3. 部署配置
Railway会自动检测Node.js项目并部署。

### 4. 获取部署URL
部署完成后，Railway会提供一个类似 `https://your-app-name.railway.app` 的URL。

## 📱 iOS应用更新

### 更新API地址
在 `SVNetworkManager.m` 中：
```objc
static NSString *const kBaseURL = @"https://your-app-name.railway.app/api";
```

## 🧪 测试部署

### 1. 健康检查
```bash
curl https://your-app-name.railway.app/health
```

### 2. API测试
```bash
# 用户注册
curl -X POST https://your-app-name.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser","displayName":"Test User"}'

# 用户登录
curl -X POST https://your-app-name.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔄 自动部署

每次推送到GitHub主分支时，Railway会自动重新部署。

## 📊 监控和日志

- 在Railway控制台查看应用日志
- 监控资源使用情况
- 设置自定义域名（可选）

---

**优势**：
- ✅ 免费额度充足
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ 自动部署
- ✅ 简单易用 