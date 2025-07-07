# 🚀 SocialVibe Backend 部署指南

## 📋 部署概览

本指南将帮助您将SocialVibe后端API部署到Railway平台，使用MongoDB Atlas作为数据库。

### 🎯 部署目标
- ✅ 在Railway上部署Node.js API
- ✅ 连接MongoDB Atlas数据库
- ✅ 配置环境变量和安全设置
- ✅ 测试API功能
- ✅ 更新iOS应用连接

---

## 🛠️ 第一步：准备环境

### 1.1 检查Node.js版本
```bash
# 检查Node.js版本（需要18+）
node --version

# 如果版本低于18，请升级
# macOS: brew install node@18
# Windows: 下载Node.js 18+安装包
```

### 1.2 安装Railway CLI
```bash
# 安装Railway命令行工具
npm install -g @railway/cli

# 验证安装
railway --version
```

### 1.3 准备项目文件
```bash
# 确保在backend目录中
cd backend

# 检查项目结构
ls -la
# 应该看到：package.json, server.js, routes/, models/ 等文件
```

---

## 🗄️ 第二步：设置MongoDB Atlas

### 2.1 创建MongoDB Atlas账户
1. 访问 [MongoDB Atlas](https://cloud.mongodb.com)
2. 注册免费账户
3. 选择"Free"计划（M0集群）

### 2.2 创建数据库集群
1. **选择云提供商和地区**
   - 选择AWS（推荐）
   - 选择离用户最近的地区（如us-east-1）

2. **选择集群类型**
   - 选择"M0 Sandbox"（免费）
   - 点击"Create"

3. **等待集群创建完成**（约5-10分钟）

### 2.3 配置数据库访问
1. **创建数据库用户**
   - 进入"Database Access"
   - 点击"Add New Database User"
   - 用户名：`socialvibe_user`
   - 密码：生成强密码（保存好！）
   - 权限：选择"Read and write to any database"
   - 点击"Add User"

2. **配置网络访问**
   - 进入"Network Access"
   - 点击"Add IP Address"
   - 选择"Allow Access from Anywhere"（0.0.0.0/0）
   - 点击"Confirm"

### 2.4 获取连接字符串
1. **获取连接信息**
   - 回到"Database"页面
   - 点击"Connect"
   - 选择"Connect your application"

2. **复制连接字符串**
   ```
   mongodb+srv://socialvibe_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

3. **修改连接字符串**
   - 将`<password>`替换为你的数据库密码
   - 在`?`前添加`/socialvibe`作为数据库名
   - 最终格式：
   ```
   mongodb+srv://socialvibe_user:yourpassword@cluster0.xxxxx.mongodb.net/socialvibe?retryWrites=true&w=majority
   ```

---

## 🚀 第三步：部署到Railway

### 3.1 登录Railway
```bash
# 登录Railway账户
railway login

# 如果还没有账户，会引导你注册
```

### 3.2 创建Railway项目
```bash
# 在backend目录中初始化Railway项目
railway init

# 选择"Create new project"
# 输入项目名称：socialvibe-backend
```

### 3.3 配置环境变量
```bash
# 设置MongoDB连接字符串
railway variables set MONGODB_URI="mongodb+srv://socialvibe_user:yourpassword@cluster0.xxxxx.mongodb.net/socialvibe?retryWrites=true&w=majority"

# 设置JWT密钥（生成一个强密钥）
railway variables set JWT_SECRET="your-super-secret-jwt-key-at-least-64-characters-long-for-security"

# 设置环境
railway variables set NODE_ENV="production"

# 设置端口
railway variables set PORT="3000"
```

### 3.4 部署应用
```bash
# 部署到Railway
railway up

# 等待部署完成（约2-5分钟）
```

### 3.5 获取部署URL
```bash
# 查看部署状态
railway status

# 获取应用URL
railway domain
# 输出类似：https://socialvibe-backend-production.up.railway.app
```

---

## 🧪 第四步：测试部署

### 4.1 健康检查
```bash
# 测试健康端点
curl https://your-app-name.railway.app/health

# 预期响应：
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### 4.2 API信息测试
```bash
# 测试API根端点
curl https://your-app-name.railway.app/

# 预期响应：
{
  "message": "SocialVibe API Server",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "auth": "/api/auth",
    "users": "/api/users",
    "feeds": "/api/feeds",
    "vibe": "/api/vibe"
  }
}
```

### 4.3 Vibe币套餐测试
```bash
# 测试Vibe币套餐端点
curl https://your-app-name.railway.app/api/vibe/packages

# 预期响应：
{
  "packages": [
    {
      "id": 1,
      "coins": 100,
      "price": 0.99,
      "bonus": 0
    },
    // ... 更多套餐
  ],
  "currency": "USD"
}
```

---

## 📱 第五步：更新iOS应用

### 5.1 更新API基础URL
在iOS项目中找到`SVNetworkManager.m`文件：

```objc
// 找到这一行
#define API_BASE_URL @"https://api.socialvibe.com/v1"

// 替换为你的Railway URL
#define API_BASE_URL @"https://your-app-name.railway.app/api"
```

### 5.2 测试iOS应用连接
1. 重新编译iOS应用
2. 测试登录功能
3. 测试Feed列表加载
4. 测试Vibe币功能

---

## 🔒 第六步：安全配置

### 6.1 检查安全设置
```bash
# 验证环境变量
railway variables

# 确保以下变量已设置：
# - MONGODB_URI
# - JWT_SECRET
# - NODE_ENV=production
```

### 6.2 数据库安全
1. **定期更换数据库密码**
2. **限制网络访问**（可选）
   - 在MongoDB Atlas中，可以限制特定IP访问
   - 获取Railway的IP范围并限制访问

### 6.3 API安全
1. **JWT密钥强度**
   - 确保JWT_SECRET至少64字符
   - 包含字母、数字、特殊字符

2. **CORS设置**
   - 当前允许所有来源
   - 生产环境可以限制特定域名

---

## 📊 第七步：监控和维护

### 7.1 查看日志
```bash
# 查看实时日志
railway logs

# 查看特定时间的日志
railway logs --since 1h
```

### 7.2 监控应用状态
```bash
# 检查应用状态
railway status

# 查看资源使用情况
railway metrics
```

### 7.3 自动部署设置
1. **连接GitHub仓库**
   - 在Railway仪表板中
   - 启用自动部署
   - 每次push到main分支自动部署

---

## 🚨 故障排除

### 常见问题

#### 1. MongoDB连接失败
```bash
# 错误信息：MongoDB connection error
# 解决方案：
# 1. 检查连接字符串格式
# 2. 验证用户名和密码
# 3. 检查网络访问设置
```

#### 2. JWT认证失败
```bash
# 错误信息：Invalid token
# 解决方案：
# 1. 检查JWT_SECRET是否正确设置
# 2. 验证token格式
# 3. 检查token是否过期
```

#### 3. Railway部署失败
```bash
# 错误信息：Build failed
# 解决方案：
# 1. 检查package.json格式
# 2. 验证所有依赖项
# 3. 检查Node.js版本兼容性
```

#### 4. CORS错误
```bash
# 错误信息：CORS policy blocked
# 解决方案：
# 1. 更新CORS_ORIGIN环境变量
# 2. 检查允许的域名列表
```

### 调试命令
```bash
# 本地测试
npm run dev

# 检查环境变量
railway variables

# 查看详细日志
railway logs --follow

# 重启应用
railway service restart
```

---

## 📈 性能优化

### 1. 数据库优化
- 创建适当的索引
- 使用连接池
- 定期清理旧数据

### 2. API优化
- 启用压缩
- 使用缓存
- 实现分页

### 3. 监控优化
- 设置告警
- 监控响应时间
- 跟踪错误率

---

## 🔄 更新和维护

### 1. 代码更新
```bash
# 推送代码到GitHub
git add .
git commit -m "Update API features"
git push origin main

# Railway会自动部署
```

### 2. 环境变量更新
```bash
# 更新环境变量
railway variables set NEW_VARIABLE="new_value"

# 重新部署
railway up
```

### 3. 数据库备份
- MongoDB Atlas提供自动备份
- 可以设置手动备份策略
- 定期测试恢复流程

---

## 📞 支持和帮助

### 1. 官方文档
- [Railway文档](https://docs.railway.app/)
- [MongoDB Atlas文档](https://docs.atlas.mongodb.com/)
- [Node.js文档](https://nodejs.org/docs/)

### 2. 社区支持
- Railway Discord社区
- MongoDB社区论坛
- Stack Overflow

### 3. 联系开发团队
- 项目GitHub Issues
- 开发团队邮箱

---

## ✅ 部署检查清单

- [ ] Node.js 18+ 已安装
- [ ] Railway CLI 已安装
- [ ] MongoDB Atlas 集群已创建
- [ ] 数据库用户已配置
- [ ] 网络访问已设置
- [ ] 连接字符串已获取
- [ ] Railway项目已创建
- [ ] 环境变量已设置
- [ ] 应用已部署
- [ ] 健康检查通过
- [ ] API测试通过
- [ ] iOS应用已更新
- [ ] 安全配置已完成
- [ ] 监控已设置

---

## 🎉 部署完成！

恭喜！您的SocialVibe后端API已成功部署到Railway。

### 下一步建议：
1. **设置自定义域名**（可选）
2. **配置SSL证书**（Railway自动提供）
3. **设置监控告警**
4. **实现CI/CD流程**
5. **添加自动化测试**
6. **优化性能**
7. **准备扩展计划**

### 重要提醒：
- 定期备份数据库
- 监控应用性能
- 及时更新依赖
- 关注安全更新
- 测试恢复流程

祝您的SocialVibe项目成功！🚀 