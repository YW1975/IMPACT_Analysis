# AI驱动软件开发效能管理平台 - 后端服务

基于 Python + FastAPI 构建的现代化软件开发效能管理平台后端服务，集成AI能力，实现VSM+框架的五个维度效能评估。

## 🚀 特性

- **现代化架构**: 基于 FastAPI + SQLAlchemy + Alembic
- **AI 集成**: 集成 OpenAI API，提供智能分析和洞察
- **VSM+ 框架**: 实现交付价值、流动效率、产品价值、能力价值、商业价值五个维度
- **自动化数据采集**: 支持 GitHub、Jira、Jenkins 等数据源
- **实时分析**: 提供实时效能指标分析和预测
- **RESTful API**: 完整的 REST API 接口
- **类型安全**: 使用 Pydantic 进行数据验证
- **数据库迁移**: 使用 Alembic 管理数据库版本

## 📋 系统要求

- Python 3.8+
- PostgreSQL 12+
- Redis 6+ (可选，用于缓存)

## 🛠️ 安装

### 1. 克隆项目

```bash
git clone <repository-url>
cd backend
```

### 2. 创建虚拟环境

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate     # Windows
```

### 3. 安装依赖

```bash
pip install -r requirements.txt
```

### 4. 环境配置

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置必要的环境变量：

```env
# 基础配置
APP_NAME="AI驱动软件开发效能管理平台"
APP_VERSION="1.0.0"
DEBUG=true
ENVIRONMENT=development

# 安全配置
SECRET_KEY="your-secret-key-here"
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 数据库配置
DATABASE_URL="postgresql://user:password@localhost:5432/devops_platform"

# Redis配置 (可选)
REDIS_URL="redis://localhost:6379/0"

# AI服务配置
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-3.5-turbo"

# 数据采集配置
GITHUB_TOKEN="your-github-token"
JIRA_URL="https://your-company.atlassian.net"
JIRA_USERNAME="your-jira-username"
JIRA_API_TOKEN="your-jira-api-token"
JENKINS_URL="http://your-jenkins-url"
JENKINS_USERNAME="your-jenkins-username"
JENKINS_API_TOKEN="your-jenkins-api-token"
```

### 5. 数据库设置

```bash
# 创建数据库
createdb devops_platform

# 初始化数据库迁移
alembic init alembic

# 生成初始迁移
alembic revision --autogenerate -m "Initial migration"

# 执行迁移
alembic upgrade head
```

## 🚀 运行

### 开发模式

```bash
# 使用内置脚本
python run.py

# 或直接使用 uvicorn
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 生产模式

```bash
# 使用内置脚本
python run.py --prod --host 0.0.0.0 --port 8000 --workers 4

# 或直接使用 uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 使用 Docker

```bash
# 构建镜像
docker build -t devops-platform-backend .

# 运行容器
docker run -p 8000:8000 --env-file .env devops-platform-backend
```

## 📚 API 文档

启动服务后，访问以下地址查看 API 文档：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🏗️ 项目结构

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── api.py              # API路由入口
│   │       └── endpoints/          # API端点
│   │           ├── dashboard.py    # 仪表盘API
│   │           ├── insights.py     # AI洞察API
│   │           ├── analytics.py    # 数据分析API
│   │           ├── teams.py        # 团队管理API
│   │           ├── projects.py     # 项目管理API
│   │           ├── metrics.py      # 效能指标API
│   │           └── chat.py         # AI聊天API
│   ├── core/
│   │   ├── config.py              # 配置管理
│   │   └── database.py            # 数据库配置
│   ├── models/
│   │   └── models.py              # 数据模型
│   ├── schemas/
│   │   └── schemas.py             # Pydantic模式
│   └── services/
│       ├── ai_service.py          # AI服务
│       └── data_collector.py      # 数据采集服务
├── alembic/                       # 数据库迁移
├── logs/                          # 日志文件
├── main.py                        # 应用入口
├── run.py                         # 启动脚本
├── requirements.txt               # 依赖列表
├── alembic.ini                    # Alembic配置
└── README.md                      # 项目文档
```

## 🔧 核心功能

### 1. 智能仪表盘
- 实时效能指标展示
- DORA指标监控
- 流动效率分析
- 团队效能排行

### 2. AI洞察引擎
- 自动化数据分析
- 智能洞察生成
- 改进建议推荐
- 预测性分析

### 3. 数据采集中心
- GitHub数据采集
- Jira工单分析
- Jenkins构建数据
- 自定义数据源集成

### 4. 效能分析
- DORA指标分析
- 流动效率评估
- 团队效能对比
- 质量指标监控

### 5. AI聊天助手
- 自然语言查询
- 智能问答
- 数据解释
- 改进建议

## 🧪 测试

```bash
# 运行所有测试
pytest

# 运行特定测试
pytest tests/test_api.py

# 生成覆盖率报告
pytest --cov=app tests/
```

## 📊 监控

### 健康检查

```bash
curl http://localhost:8000/health
```

### 指标监控

```bash
curl http://localhost:8000/metrics
```

## 🔒 安全

- JWT令牌认证
- CORS配置
- 输入验证
- SQL注入防护
- 敏感信息加密

## 🚀 部署

### Docker部署

```bash
# 使用docker-compose
docker-compose up -d
```

### Kubernetes部署

```bash
# 应用配置
kubectl apply -f k8s/
```

### 云平台部署

支持部署到：
- AWS ECS/EKS
- Google Cloud Run/GKE
- Azure Container Instances/AKS
- 阿里云容器服务

## 🔧 配置说明

### 环境变量

| 变量名 | 描述 | 默认值 | 必需 |
|--------|------|--------|------|
| `APP_NAME` | 应用名称 | "AI驱动软件开发效能管理平台" | 否 |
| `DEBUG` | 调试模式 | `false` | 否 |
| `DATABASE_URL` | 数据库连接URL | - | 是 |
| `OPENAI_API_KEY` | OpenAI API密钥 | - | 是 |
| `GITHUB_TOKEN` | GitHub访问令牌 | - | 否 |
| `JIRA_URL` | Jira服务器URL | - | 否 |
| `JENKINS_URL` | Jenkins服务器URL | - | 否 |

## 🤝 贡献

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持

如有问题或建议，请：

1. 查看 [文档](docs/)
2. 提交 [Issue](issues/)
3. 联系维护团队

## 🔄 更新日志

### v1.0.0 (2024-01-29)
- 初始版本发布
- 实现核心API功能
- 集成AI分析能力
- 支持多数据源采集

---

**注意**: 这是一个演示项目，生产环境使用前请确保：
1. 配置正确的安全设置
2. 设置适当的数据库连接池
3. 配置日志轮转和监控
4. 实施备份策略