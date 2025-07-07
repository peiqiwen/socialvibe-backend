# 🚀 Railway 部署指南

## 📋 部署信息

- **GitHub 仓库**: socialvibe-backend
- **MongoDB Atlas**: 已配置完成
- **环境变量**: 已生成

## 🔧 Railway 部署步骤

### 第一步：注册 Railway 账户

1. 访问 [Railway](https://railway.app/)
2. 点击 "Start a New Project"
3. 选择 "Deploy from GitHub repo"
4. 使用 GitHub 账户登录

### 第二步：连接 GitHub 仓库

1. 在 Railway 中选择您的 GitHub 账户
2. 找到 `socialvibe-backend` 仓库
3. 点击 "Deploy Now"

### 第三步：配置环境变量

在 Railway 项目设置中添加以下环境变量：

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://socialvibe_user:WP7ELFP8OvNAfwl6@socialvibe-cluster.okvbn5z.mongodb.net/socialvibe?retryWrites=true&w=majority&appName=socialvibe-cluster
JWT_SECRET=b+G5SZTVsefCCxS2bdwbnP0uKpP9mfRotgN5oC9pZVvzAAFYn9z84lF+60ituaR8tt7BO4psns/JKVaV9JMsnQ==
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
HELMET_ENABLED=true
COMPRESSION_ENABLED=true
```

### 第四步：配置部署设置

1. **构建命令**: `npm install`
2. **启动命令**: `node server.js`
3. **端口**: `3000`

### 第五步：等待部署完成

Railway 会自动：
- 安装依赖
- 构建应用
- 启动服务器
- 分配域名

## 📊 部署验证

### 健康检查
```bash
curl https://your-app-name.railway.app/health
```

### API 测试
```bash
# 测试用户注册
curl -X POST https://your-app-name.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser",
    "displayName": "Test User"
  }'

# 测试用户登录
curl -X POST https://your-app-name.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔄 自动部署

每次推送到 GitHub 主分支时，Railway 会自动重新部署。

## 📱 iOS 应用更新

部署完成后，更新 iOS 应用中的 API 地址：

```objc
// 在 SVNetworkManager.m 中
static NSString *const kBaseURL = @"https://your-app-name.railway.app/api";
```

## 🚨 故障排除

### 部署失败
- 检查环境变量是否正确
- 确认 MongoDB 连接字符串有效
- 查看 Railway 构建日志

### 连接错误
- 确认 MongoDB Atlas 网络访问设置
- 检查环境变量中的密码是否正确
- 验证 JWT_SECRET 是否设置

### 性能问题
- 检查 Railway 资源使用情况
- 考虑升级到付费计划
- 优化数据库查询

## 📈 监控和维护

### Railway 监控
- 在 Railway 控制台查看应用状态
- 监控资源使用情况
- 查看应用日志

### 数据库监控
- 在 MongoDB Atlas 控制台监控数据库
- 设置告警和备份
- 监控连接数和查询性能

## 🔒 安全配置

### 环境变量安全
- 不要在代码中硬编码敏感信息
- 定期轮换 JWT_SECRET
- 使用强密码

### 网络安全
- 启用 HTTPS（Railway 自动提供）
- 配置 CORS 策略
- 限制 API 访问

## 📞 支持

如果遇到问题：
1. 查看 Railway 文档
2. 检查构建日志
3. 验证环境变量
4. 联系 Railway 支持

---

**部署完成后，请将 Railway 分配的域名提供给我，我将帮您测试和配置 iOS 应用。** 