# 部署依赖问题修复指南

## 问题描述
部署时出现 `npm ci` 错误，提示 `package.json` 和 `package-lock.json` 不同步，缺少 `openai` 等依赖。

## 解决方案

### 1. 本地修复（推荐）
```bash
cd backend
npm install
git add package-lock.json
git commit -m "Update package-lock.json with openai dependency"
git push
```

### 2. 使用修复脚本
```bash
cd backend
./fix-deployment-deps.sh
```

### 3. 手动修复步骤
```bash
# 1. 更新依赖
npm install

# 2. 验证安装
npm list openai

# 3. 清理并重新安装
rm -rf node_modules
npm ci
```

## 环境变量配置

确保在部署平台设置以下环境变量：

```bash
# OpenAI API 配置
OPENAI_API_KEY=your_openai_api_key_here

# 其他必要配置
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=production
```

## 部署平台特定说明

### Railway
- 确保 `package-lock.json` 已提交到 Git
- 在 Railway 控制台设置环境变量
- 部署会自动运行 `npm ci`

### Render
- 确保 `package-lock.json` 已提交到 Git
- 在 Render 控制台设置环境变量
- 构建命令：`npm ci && npm start`

### Heroku
- 确保 `package-lock.json` 已提交到 Git
- 在 Heroku 控制台设置环境变量
- 部署会自动检测 Node.js 项目

## 验证部署

部署完成后，测试以下端点：

```bash
# 健康检查
curl https://your-app-url/health

# AI 服务健康检查
curl https://your-app-url/api/ai/health

# 获取风格列表
curl https://your-app-url/api/ai/styles
```

## 常见问题

### Q: 仍然出现依赖错误
A: 确保 `package-lock.json` 文件已提交到 Git 仓库

### Q: OpenAI API 调用失败
A: 检查环境变量 `OPENAI_API_KEY` 是否正确设置

### Q: 图片上传失败
A: 确保 `multer` 依赖已正确安装，检查文件大小限制

## 联系支持

如果问题仍然存在，请检查：
1. Node.js 版本（推荐 18+）
2. npm 版本（推荐 8+）
3. 部署平台日志
4. 环境变量配置 