from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
from loguru import logger

from app.core.config import settings
from app.api.v1.api import api_router
from app.core.database import init_db
from app.services.ai_service import AIService
from app.services.data_collector import DataCollector


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时执行
    logger.info("启动AI驱动软件开发效能管理平台...")
    
    # 初始化数据库
    await init_db()
    
    # 初始化AI服务
    ai_service = AIService()
    app.state.ai_service = ai_service
    
    # 初始化数据采集器
    data_collector = DataCollector()
    app.state.data_collector = data_collector
    
    logger.info("平台启动完成")
    
    yield
    
    # 关闭时执行
    logger.info("正在关闭平台...")
    # 清理资源
    logger.info("平台已关闭")


# 创建FastAPI应用实例
app = FastAPI(
    title="AI驱动软件开发效能管理平台",
    description="基于VSM+框架的智能化效能度量系统，通过AI技术自动采集、分析和可视化软件开发过程中的数据",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# 配置CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册API路由
app.include_router(api_router, prefix="/api/v1")

# 静态文件服务
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    """根路径健康检查"""
    return {
        "message": "AI驱动软件开发效能管理平台API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {
        "status": "healthy",
        "timestamp": "2024-01-01T00:00:00Z"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )