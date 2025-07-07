# 🧹 Railway 账户清理指南

## 🔍 检查当前状态

### 1. 查看所有项目
访问 [Railway Dashboard](https://railway.app/dashboard)

### 2. 检查资源使用情况
- 点击左侧 "Billing" 菜单
- 查看 "Usage" 标签页
- 确认当前使用的资源数量

## 🗑️ 彻底清理步骤

### 第一步：删除所有项目
1. 在Dashboard中，对每个项目点击 "Settings"
2. 滚动到底部，点击 "Delete Project"
3. 输入项目名称确认删除
4. 重复此步骤删除所有项目

### 第二步：清理GitHub集成
1. 访问 [GitHub Settings](https://github.com/settings/installations)
2. 找到Railway应用
3. 点击 "Configure"
4. 移除所有仓库访问权限

### 第三步：等待资源释放
- 删除后等待10-15分钟
- 资源可能需要时间完全释放

### 第四步：重新创建项目
1. 回到Railway Dashboard
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择 `socialvibe-backend` 仓库

## ⚠️ 如果仍然报错

### 检查账户状态
```bash
# 检查是否被限制
curl -H "Authorization: Bearer YOUR_RAILWAY_TOKEN" \
  https://backboard.railway.app/graphql/v2 \
  -d '{"query":"query { me { id email } }"}'
```

### 联系Railway支持
如果问题持续，可以：
1. 访问 [Railway Support](https://railway.app/support)
2. 提交支持请求
3. 说明免费计划资源限制问题

## 🎯 推荐方案

**建议直接使用Render**：
- 更宽松的免费限制
- 更简单的部署流程
- 更好的稳定性

参考：`QUICK_RENDER_SETUP.md` 