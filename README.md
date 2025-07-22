# AI驱动的软件开发效能管理平台

这是一个利用AI技术对软件开发过程中的数据进行采集和分析，实现效能评估自动化和可视化的平台。该平台旨在降低传统效能度量的成本，提供实时的数据洞察和改进建议。

## 核心功能

- **DORA指标监控**：部署频率、变更前置时间、变更失败率、恢复时间
- **流动效率分析**：流动效率、在制品数量、周期时间、吞吐量
- **团队效能管理**：团队绩效、技能分布、满意度分析
- **项目进度跟踪**：项目健康度、风险评估、趋势分析
- **AI驱动的洞察**：自动化数据分析、改进建议、预测分析
- **实时数据更新**：通过WebSocket提供实时数据更新

## 技术栈

### 前端
- React
- Ant Design
- Recharts (图表可视化)
- Socket.io-client (实时数据)

### 后端
- Node.js
- Express
- Socket.io
- OpenAI API (AI分析)
- GitHub API (代码数据)

## 快速开始

### 前提条件
- Node.js 14.x 或更高版本
- npm 或 yarn

### 安装与运行

1. 克隆仓库
```bash
git clone <repository-url>
cd ai-devops-efficiency-platform
```

2. 安装依赖
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

3. 配置环境变量
```bash
# 在server目录中
cp .env.example .env
# 编辑.env文件，添加必要的API密钥
```

4. 启动服务
```bash
# 启动后端服务（在server目录中）
npm run dev

# 启动前端开发服务器（在项目根目录）
npm run dev
```

5. 访问应用
在浏览器中打开 http://localhost:3000

## 平台架构

该平台采用前后端分离的架构：

- **前端**：负责数据可视化和用户交互
- **后端**：提供API服务、数据处理和AI分析
- **实时通信**：通过WebSocket实现实时数据更新
- **外部集成**：与GitHub、Jira、Jenkins等开发工具集成

## AI能力

平台利用AI技术实现以下能力：

1. **自动化数据采集与整合**：消除数据孤岛，自动从不同工具中提取数据
2. **智能化分析与洞察**：预测性分析、自动化根因分析、定性数据量化
3. **实时反馈与主动干预**：实时监控和反馈，主动预防问题

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议。请遵循以下步骤：

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件