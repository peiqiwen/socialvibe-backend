# 🗄️ MongoDB Atlas 手动配置指南

## 📋 配置信息

- **邮箱**: peiqiwen7@gmail.com
- **密码**: WPQ850592231@
- **项目名**: SocialVibe
- **集群名**: socialvibe-cluster
- **数据库名**: socialvibe
- **用户名**: socialvibe_user

## 🔧 手动配置步骤

### 第一步：登录MongoDB Atlas

1. 访问 [MongoDB Atlas](https://cloud.mongodb.com)
2. 点击 "Sign In"
3. 输入邮箱：`peiqiwen7@gmail.com`
4. 输入密码：`WPQ850592231@`
5. 点击 "Sign In"

### 第二步：创建项目

1. 登录后，点击 "Build a Database"
2. 在 "Create a project" 页面：
   - 项目名称：`SocialVibe`
   - 描述：`SocialVibe Backend Database`
3. 点击 "Next"
4. 点击 "Create Project"

### 第三步：创建数据库集群

1. 在 "Deploy a database" 页面：
   - 选择 "FREE" 套餐（M0）
   - 云提供商：选择 "AWS"
   - 地区：选择 "US East (N. Virginia) us-east-1"
   - 集群名称：`socialvibe-cluster`
2. 点击 "Create"

### 第四步：配置数据库访问

1. 在 "Security Quickstart" 页面：
   - 用户名：`socialvibe_user`
   - 密码：点击 "Autogenerate Secure Password" 或手动设置强密码"WP7ELFP8OvNAfwl6"
   - **重要**：请记住这个密码！
2. 点击 "Create User"

### 第五步：配置网络访问

1. 在 "Network Access" 页面：
   - 点击 "Add IP Address"
   - 选择 "Allow Access from Anywhere"（输入 `0.0.0.0/0`）
   - 点击 "Confirm"

### 第六步：获取连接字符串

1. 点击 "Go to Databases"
2. 等待集群创建完成（可能需要几分钟）
3. 点击集群名称 `socialvibe-cluster`
4. 点击 "Connect"
5. 选择 "Connect your application"
6. 复制连接字符串 "mongodb+srv://socialvibe_user: WP7ELFP8OvNAfwl6@socialvibe-cluster.okvbn5z.mongodb.net/socialvibe?retryWrites=true&w=majority&appName=socialvibe-cluster"

### 第七步：配置连接字符串

连接字符串格式：
```
mongodb+srv://socialvibe_user:<password>@socialvibe-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

需要修改的地方：
1. 将 `<password>` 替换为第四步设置的密码
2. 在 `?` 前添加数据库名：`/socialvibe?`

最终格式：
```
mongodb+srv://socialvibe_user:your_password@socialvibe-cluster.xxxxx.mongodb.net/socialvibe?retryWrites=true&w=majority
```

## 📝 环境变量配置

创建 `.env.production` 文件：

```env
# MongoDB Atlas Configuration
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://socialvibe_user:your_password@socialvibe-cluster.xxxxx.mongodb.net/socialvibe?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
HELMET_ENABLED=true
COMPRESSION_ENABLED=true
```

JWT Secret: b+G5SZTVsefCCxS2bdwbnP0uKpP9mfRotgN5oC9pZVvzAAFYn9z84lF+60ituaR8
tt7BO4psns/JKVaV9JMsnQ==

## 🧪 测试连接

配置完成后，可以测试连接：

```bash
# 启动服务器
node server.js

# 或者测试连接
curl http://localhost:3000/health
```

## 📊 数据库结构

配置完成后，MongoDB Atlas会自动创建以下集合：

- `users` - 用户信息
- `feeds` - Feed内容
- `vibe_transactions` - Vibe币交易记录

## 🔒 安全注意事项

1. **密码安全**：使用强密码，包含大小写字母、数字和特殊字符
2. **网络访问**：生产环境建议限制IP地址范围
3. **用户权限**：只授予必要的数据库权限
4. **定期备份**：MongoDB Atlas提供自动备份

## 🚨 故障排除

### 连接失败
- 检查密码是否正确
- 确认网络访问设置
- 验证连接字符串格式

### 权限错误
- 确认用户有读写权限
- 检查数据库名称是否正确

### 超时错误
- 检查网络连接
- 确认集群状态正常

## 📞 支持

如果遇到问题：
1. 查看MongoDB Atlas文档
2. 检查错误日志
3. 联系MongoDB支持

---

**配置完成后，请将连接字符串提供给我，我将帮您配置Railway部署。** 