# ⚡ SocialVibe 快速部署指南

## 🎯 5分钟快速部署

### 第一步：注册账户（2分钟）

1. **MongoDB Atlas** - [注册](https://www.mongodb.com/atlas)
   - 选择免费套餐
   - 创建集群
   - 获取连接字符串

2. **Railway** - [注册](https://railway.app/)
   - 使用GitHub登录
   - 创建新项目

### 第二步：配置数据库（1分钟）

1. 在MongoDB Atlas中：
   - 创建数据库用户
   - 设置网络访问为 `0.0.0.0/0`
   - 复制连接字符串

2. 连接字符串格式：
   ```
   mongodb+srv://username:password@cluster.mongodb.net/socialvibe
   ```

### 第三步：部署到Railway（1分钟）

1. 在Railway中：
   - 选择 "Deploy from GitHub repo"
   - 连接您的SocialVibe仓库

2. 添加环境变量：
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key
   ```

### 第四步：获取部署URL（30秒）

- Railway会自动部署
- 获取类似 `https://your-app-name.railway.app` 的URL

### 第五步：更新iOS应用（30秒）

在 `SVNetworkManager.m` 中更新：
```objc
static NSString *const kBaseURL = @"https://your-app-name.railway.app/api";
```

## 🧪 测试部署

```bash
# 健康检查
curl https://your-app-name.railway.app/health

# 测试注册
curl -X POST https://your-app-name.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser","displayName":"Test User"}'
```

## ✅ 完成！

现在您可以在任何地方使用SocialVibe应用了！

---

**详细指南**: 查看 `COMPLETE_DEPLOYMENT_GUIDE.md`
**故障排除**: 查看 `DEPLOYMENT_TROUBLESHOOTING.md` 