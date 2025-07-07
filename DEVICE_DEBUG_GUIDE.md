# 📱 真机调试完整指南

## 🎯 概述

真机调试与模拟器调试不同，需要特殊的网络配置和证书设置。本指南将帮助您成功在真机上调试SocialVibe应用。

## 🌐 网络配置

### 1. 获取Mac的局域网IP地址

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

当前配置的IP地址：`192.168.0.109`

### 2. 更新iOS应用API地址

在 `SocialVibe/Services/SVNetworkManager.m` 中：
```objc
static NSString *const kBaseURL = @"http://192.168.0.109:3000/api";
```

### 3. 更新后端服务器配置

服务器已配置为绑定到所有网络接口：
```javascript
app.listen(PORT, '0.0.0.0', () => {
  // 服务器启动代码
});
```

CORS配置已更新以允许真机访问：
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.0.109:3000', 'https://socialvibe.app', 'capacitor://localhost'],
  credentials: true
}));
```

## 🔧 Xcode配置

### 1. 开发者证书设置

1. 打开Xcode项目
2. 选择项目 → Signing & Capabilities
3. 选择您的开发者团队
4. 确保Bundle Identifier唯一

### 2. 设备配置

1. 将iOS设备连接到Mac
2. 在Xcode中选择您的设备作为运行目标
3. 确保设备已解锁并信任此电脑

### 3. 网络权限配置

在 `Info.plist` 中确保有以下配置：
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

## 🚀 启动步骤

### 1. 启动后端服务器

```bash
cd backend
node server.js
```

### 2. 测试API连接

```bash
cd backend
./test-device-api.sh
```

### 3. 在Xcode中运行应用

1. 选择您的设备作为运行目标
2. 点击运行按钮
3. 在设备上信任开发者证书（如果提示）

## 📱 设备端设置

### 1. 信任开发者证书

首次运行应用时：
1. 打开设置 → 通用 → VPN与设备管理
2. 找到您的开发者证书
3. 点击"信任"

### 2. 网络连接

确保：
- iOS设备和Mac在同一WiFi网络
- 防火墙允许端口3000
- 网络连接稳定

## 🧪 测试账户

使用以下测试账户登录：
- **邮箱**: `device_test@example.com`
- **密码**: `password123`

## 🔍 故障排除

### 问题1：无法连接到服务器

**解决方案**：
1. 检查设备是否在同一网络
2. 验证IP地址是否正确
3. 确认服务器正在运行
4. 检查防火墙设置

### 问题2：证书信任问题

**解决方案**：
1. 在设备上手动信任开发者证书
2. 重新安装应用
3. 检查Xcode签名配置

### 问题3：网络超时

**解决方案**：
1. 增加网络超时时间
2. 检查网络连接质量
3. 重启设备和Mac

## 📊 网络测试

### 手动测试API

```bash
# 健康检查
curl http://192.168.0.109:3000/health

# 用户注册
curl -X POST http://192.168.0.109:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser","displayName":"Test User"}'

# 用户登录
curl -X POST http://192.168.0.109:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🎉 成功标志

当您看到以下情况时，说明真机调试配置成功：

1. ✅ 应用成功安装到设备
2. ✅ 应用启动无错误
3. ✅ 登录界面正常显示
4. ✅ 可以成功注册/登录用户
5. ✅ Feed列表正常加载
6. ✅ 所有功能正常工作

## 📞 技术支持

如果遇到问题：
1. 检查网络连接
2. 验证API地址配置
3. 确认服务器状态
4. 查看Xcode控制台错误信息
5. 运行测试脚本验证API功能

---

**注意**: 真机调试需要有效的Apple开发者账户。如果您使用的是免费账户，应用将在7天后过期，需要重新安装。 