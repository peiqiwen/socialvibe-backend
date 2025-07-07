# ⚡ 快速 Render 部署指南

## 🎯 为什么选择 Render

- ✅ 每月750小时免费（足够24/7运行）
- ✅ 无项目数量限制
- ✅ 自动HTTPS和CDN
- ✅ 简单的GitHub集成
- ✅ 比Railway更宽松的限制

## 🚀 5分钟快速部署

### 第一步：注册Render（1分钟）

1. 访问 [Render](https://render.com/)
2. 点击 "Get Started for Free"
3. 使用GitHub账户登录

### 第二步：创建Web Service（2分钟）

1. 点击 "New +" → "Web Service"
2. 连接GitHub账户
3. 选择 `socialvibe-backend` 仓库

### 第三步：配置服务（1分钟）

**基本信息**：
- Name: `socialvibe-backend`
- Environment: `Node`
- Region: 选择离您最近的地区

**构建配置**：
- Build Command: `npm install`
- Start Command: `node server.js`

### 第四步：设置环境变量（1分钟）

在 "Environment Variables" 部分添加：

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

### 第五步：部署（自动）

1. 点击 "Create Web Service"
2. 等待构建完成（约2-3分钟）
3. 获取域名：`https://socialvibe-backend.onrender.com`

## 🧪 测试部署

### 健康检查
```bash
curl https://socialvibe-backend.onrender.com/health
```

### 用户注册测试
```bash
curl -X POST https://socialvibe-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser",
    "displayName": "Test User"
  }'
```

## 📱 更新iOS应用

部署完成后，更新iOS应用中的API地址：

```objc
// 在 SocialVibe/Services/SVNetworkManager.m 中
static NSString *const kBaseURL = @"https://socialvibe-backend.onrender.com/api";
```

## 🔄 自动部署

每次推送到GitHub主分支时，Render会自动重新部署。

## ⚠️ 注意事项

1. **冷启动**：免费计划首次访问可能需要30-60秒
2. **端口**：Render使用端口10000，已在配置中设置
3. **HTTPS**：自动提供SSL证书

## 🎉 完成！

部署成功后，您就可以在任何地方使用SocialVibe应用了！

---

**优势对比**：
- Railway: 每月$5，3个项目限制
- Render: 每月750小时免费，无项目限制 