# 🌐 Render 部署指南

## 📋 为什么选择 Render

- **免费额度**: 每月750小时免费
- **自动部署**: 支持GitHub集成
- **HTTPS**: 自动SSL证书
- **全球CDN**: 快速访问
- **无资源限制**: 比Railway更宽松

## 🔧 Render 部署步骤

### 第一步：注册 Render 账户

1. 访问 [Render](https://render.com/)
2. 点击 "Get Started for Free"
3. 使用GitHub账户登录

### 第二步：创建 Web Service

1. 在Render控制台点击 "New +"
2. 选择 "Web Service"
3. 连接您的GitHub账户
4. 选择 `socialvibe-backend` 仓库

### 第三步：配置服务

1. **基本信息**:
   - Name: `socialvibe-backend`
   - Environment: `Node`
   - Region: 选择离您最近的地区

2. **构建配置**:
   - Build Command: `npm install`
   - Start Command: `node server.js`

3. **环境变量**:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://socialvibe_user:WP7ELFP8OvNAfwl6@socialvibe-cluster.okvbn5z.mongodb.net/socialvibe?retryWrites=true&w=majority&appName=socialvibe-cluster
   JWT_SECRET=b+G5SZTVsefCCxS2bdwbnP0uKpP9mfRotgN5oC9pZVvzAAFYn9z84lF+60ituaR8tt7BO4psns/JKVaV9JMsnQ==
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   HELMET_ENABLED=true
   COMPRESSION_ENABLED=true
   ```

### 第四步：部署

1. 点击 "Create Web Service"
2. 等待构建和部署完成
3. 获取分配的域名（类似：`https://socialvibe-backend.onrender.com`）

## 📊 部署验证

### 健康检查
```bash
curl https://your-app-name.onrender.com/health
```

### API 测试
```bash
# 测试用户注册
curl -X POST https://your-app-name.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser",
    "displayName": "Test User"
  }'
```

## 🔄 自动部署

每次推送到GitHub主分支时，Render会自动重新部署。

## 📱 iOS 应用更新

部署完成后，更新iOS应用中的API地址：

```objc
// 在 SVNetworkManager.m 中
static NSString *const kBaseURL = @"https://your-app-name.onrender.com/api";
```

## 🚨 故障排除

### 部署失败
- 检查环境变量配置
- 确认MongoDB连接字符串
- 查看构建日志

### 冷启动问题
- Render免费计划有冷启动延迟
- 首次访问可能需要30-60秒
- 考虑升级到付费计划

## 📈 监控和维护

### Render监控
- 在Render控制台查看应用状态
- 监控资源使用情况
- 查看应用日志

### 性能优化
- 启用自动缩放
- 配置健康检查
- 优化启动时间

---

**优势**: 免费额度充足，无资源限制，部署简单 