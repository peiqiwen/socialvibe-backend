# 🚀 SocialVibe 完整部署指南

## 📋 概述

本指南将帮助您将SocialVibe后端部署到云服务器，这样您就可以在任何地方访问应用，无需复杂的真机调试配置。

## 🎯 推荐方案

### 方案1：Railway + MongoDB Atlas（推荐）
- **Railway**: 免费额度每月$5，简单易用
- **MongoDB Atlas**: 免费512MB数据库
- **优势**: 自动HTTPS、全球CDN、自动部署

### 方案2：Render + MongoDB Atlas
- **Render**: 免费额度充足，支持自动部署
- **MongoDB Atlas**: 同上
- **优势**: 稳定可靠，适合生产环境

### 方案3：Heroku + MongoDB Atlas
- **Heroku**: 经典选择，但免费额度有限
- **MongoDB Atlas**: 同上
- **优势**: 生态丰富，文档完善

## 🔧 部署步骤（以Railway为例）

### 第一步：准备MongoDB Atlas数据库

1. **注册MongoDB Atlas账户**
   - 访问 [MongoDB Atlas](https://www.mongodb.com/atlas)
   - 注册免费账户

2. **创建集群**
   - 选择免费套餐（M0）
   - 选择离您最近的地区
   - 创建集群

3. **配置数据库访问**
   - 进入 Database Access
   - 添加新用户：`socialvibe_user`
   - 设置密码（请记住）
   - 权限：Read and write to any database

4. **配置网络访问**
   - 进入 Network Access
   - 添加IP地址：`0.0.0.0/0`（允许所有IP）
   - 或者添加特定IP以提高安全性

5. **获取连接字符串**
   - 点击 Clusters → Connect
   - 选择 "Connect your application"
   - 复制连接字符串
   - 替换 `<password>` 为您的密码
   - 替换 `<dbname>` 为 `socialvibe`

### 第二步：准备Railway部署

1. **注册Railway账户**
   - 访问 [Railway](https://railway.app/)
   - 使用GitHub账户登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 连接您的GitHub仓库

3. **配置环境变量**
   在Railway项目设置中添加：
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://socialvibe_user:your_password@cluster.mongodb.net/socialvibe
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   PORT=3000
   ```

### 第三步：部署应用

1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Railway自动部署**
   - Railway会自动检测到代码变更
   - 开始构建和部署过程
   - 等待部署完成

3. **获取部署URL**
   - 部署完成后，Railway会提供类似 `https://your-app-name.railway.app` 的URL
   - 记录这个URL，稍后需要更新iOS应用

### 第四步：测试部署

1. **健康检查**
   ```bash
   curl https://your-app-name.railway.app/health
   ```

2. **API测试**
   ```bash
   # 测试用户注册
   curl -X POST https://your-app-name.railway.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","username":"testuser","displayName":"Test User"}'
   
   # 测试用户登录
   curl -X POST https://your-app-name.railway.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

### 第五步：更新iOS应用

1. **更新API地址**
   在 `SocialVibe/Services/SVNetworkManager.m` 中：
   ```objc
   static NSString *const kBaseURL = @"https://your-app-name.railway.app/api";
   ```

2. **重新编译应用**
   - 在Xcode中重新编译项目
   - 安装到设备上测试

## 🔄 自动部署配置

### GitHub Actions（可选）

创建 `.github/workflows/deploy.yml`：
```yaml
name: Deploy to Railway

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Railway
      uses: railway/deploy@v1
      with:
        railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

## 📊 监控和维护

### 1. 日志监控
- 在Railway控制台查看应用日志
- 监控错误和性能问题

### 2. 数据库监控
- 在MongoDB Atlas控制台监控数据库使用情况
- 设置告警和备份

### 3. 性能监控
- 监控API响应时间
- 检查资源使用情况

## 🔒 安全配置

### 1. 环境变量安全
- 不要在代码中硬编码敏感信息
- 使用Railway的环境变量功能
- 定期轮换JWT密钥

### 2. 数据库安全
- 使用强密码
- 限制网络访问
- 启用数据库审计

### 3. API安全
- 启用速率限制
- 验证输入数据
- 使用HTTPS

## 🚨 故障排除

### 常见问题

1. **部署失败**
   - 检查构建日志
   - 验证环境变量
   - 确认代码无语法错误

2. **数据库连接失败**
   - 检查MongoDB连接字符串
   - 验证用户名和密码
   - 确认网络访问设置

3. **API返回错误**
   - 检查服务器日志
   - 验证请求格式
   - 确认CORS配置

4. **iOS应用无法连接**
   - 验证API地址正确
   - 检查网络连接
   - 确认HTTPS配置

## 📈 扩展建议

### 1. 自定义域名
- 在Railway中配置自定义域名
- 设置SSL证书

### 2. CDN配置
- 配置Cloudflare等CDN服务
- 提高全球访问速度

### 3. 监控服务
- 集成Sentry等错误监控
- 设置性能监控

## 🎉 部署完成

部署成功后，您将拥有：
- ✅ 稳定的云服务器
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ 自动部署
- ✅ 完整的监控

现在您可以在任何地方使用SocialVibe应用了！

---

**需要帮助？**
- 查看Railway文档：https://docs.railway.app/
- 查看MongoDB Atlas文档：https://docs.atlas.mongodb.com/
- 联系开发团队获取支持 