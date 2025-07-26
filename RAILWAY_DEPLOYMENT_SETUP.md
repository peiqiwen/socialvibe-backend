# Railway 部署配置指南

## 问题描述
部署到 Railway 后出现 `OPENAI_API_KEY` 环境变量缺失错误。

## 解决步骤

### 1. 登录 Railway 控制台
访问 [Railway Dashboard](https://railway.app/dashboard)

### 2. 选择您的项目
找到项目：`socialvibe-backend-production-1a85`

### 3. 配置环境变量
1. 点击项目进入详情页
2. 选择 **Variables** 标签页
3. 点击 **New Variable** 按钮
4. 添加以下环境变量：

```
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
PORT=3000
NODE_ENV=production
```

### 4. 重新部署
1. 在 Railway 控制台点击 **Deploy** 按钮
2. 等待部署完成

### 5. 验证部署
部署完成后，测试以下端点：

```bash
# 健康检查
curl https://socialvibe-backend-production-1a85.up.railway.app/health

# AI 服务健康检查
curl https://socialvibe-backend-production-1a85.up.railway.app/api/ai/health
```

## 环境变量说明

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `OPENAI_API_KEY` | OpenAI API 密钥 | ✅ |
| `MONGODB_URI` | MongoDB 连接字符串 | ✅ |
| `JWT_SECRET` | JWT 签名密钥 | ✅ |
| `PORT` | 服务器端口 | ❌ (默认 3000) |
| `NODE_ENV` | 环境模式 | ❌ (默认 development) |

## 常见问题

### Q: 如何获取 OpenAI API Key？
A: 
1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 登录您的账户
3. 点击 **Create new secret key**
4. 复制生成的密钥

### Q: 部署后仍然报错？
A: 
1. 检查环境变量是否正确设置
2. 确保没有多余的空格或换行符
3. 重新部署项目

### Q: 如何查看部署日志？
A: 
1. 在 Railway 控制台选择项目
2. 点击 **Deployments** 标签
3. 选择最新的部署
4. 查看 **Build Logs** 和 **Deploy Logs**

## 本地测试

在部署前，可以在本地测试配置：

```bash
cd backend
node check-deployment-config.js
```

## 联系支持

如果问题仍然存在：
1. 检查 Railway 部署日志
2. 确认所有环境变量都已设置
3. 验证 OpenAI API Key 是否有效 