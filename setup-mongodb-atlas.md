# 🗄️ MongoDB Atlas 设置指南

## 📋 步骤概览

1. ✅ 注册MongoDB Atlas账户
2. ✅ 创建免费集群
3. ✅ 配置数据库用户
4. ✅ 设置网络访问
5. ✅ 获取连接字符串
6. ✅ 更新环境变量

---

## 🚀 详细步骤

### 第一步：注册账户

1. 访问 [MongoDB Atlas](https://cloud.mongodb.com)
2. 点击"Try Free"
3. 填写注册信息：
   - 邮箱地址
   - 密码
   - 账户名称
4. 选择"Free"计划

### 第二步：创建集群

1. **选择云提供商**：
   - 选择AWS（推荐）
   - 选择离您最近的地区

2. **选择集群类型**：
   - 选择"M0 Sandbox"（免费）
   - 点击"Create"

3. **等待集群创建**（约5-10分钟）

### 第三步：配置数据库访问

1. **创建数据库用户**：
   ```
   用户名: socialvibe_user
   密码: [生成强密码，包含字母、数字、特殊字符]
   权限: Read and write to any database
   ```

2. **设置网络访问**：
   - 选择"Allow Access from Anywhere" (0.0.0.0/0)
   - 点击"Confirm"

### 第四步：获取连接字符串

1. 回到"Database"页面
2. 点击"Connect"
3. 选择"Connect your application"
4. 复制连接字符串

**连接字符串格式**：
```
mongodb+srv://socialvibe_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 第五步：更新环境变量

1. 编辑 `.env` 文件
2. 更新 `MONGODB_URI`：
   ```
   MONGODB_URI=mongodb+srv://socialvibe_user:yourpassword@cluster0.xxxxx.mongodb.net/socialvibe?retryWrites=true&w=majority
   ```
   
   **注意**：
   - 将 `<password>` 替换为您的实际密码
   - 在 `?` 前添加 `/socialvibe` 作为数据库名

### 第六步：测试连接

1. 重启服务器：
   ```bash
   npm run dev
   ```

2. 检查连接状态：
   ```bash
   curl http://localhost:3000/health
   ```

---

## 🔧 故障排除

### 常见问题

1. **连接被拒绝**：
   - 检查网络访问设置
   - 确保IP地址已添加到白名单

2. **认证失败**：
   - 检查用户名和密码
   - 确保数据库用户权限正确

3. **集群不可用**：
   - 等待集群完全创建
   - 检查集群状态

### 安全建议

1. **密码安全**：
   - 使用强密码
   - 定期更换密码

2. **网络安全**：
   - 生产环境限制特定IP
   - 使用VPN或专用网络

3. **监控**：
   - 启用数据库监控
   - 设置告警

---

## 📊 免费计划限制

- **存储空间**：512MB
- **RAM**：共享
- **连接数**：最多500个连接
- **备份**：自动备份（7天）

---

## 🎯 下一步

设置完成后，您可以：

1. **测试API功能**：
   - 用户注册/登录
   - 创建Feed
   - 测试Vibe币功能

2. **部署到生产环境**：
   - 使用Railway部署
   - 配置生产环境变量

3. **监控和维护**：
   - 设置数据库监控
   - 定期备份数据

---

## 📞 支持

- [MongoDB Atlas文档](https://docs.atlas.mongodb.com/)
- [MongoDB社区论坛](https://community.mongodb.com/)
- [Atlas支持](https://www.mongodb.com/support)

---

*设置完成后，您的SocialVibe后端将完全正常运行！🚀* 