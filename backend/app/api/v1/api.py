from fastapi import APIRouter

from app.api.v1.endpoints import (
    dashboard,
    insights,
    analytics,
    teams,
    projects,
    metrics,
    chat
)

# 创建API路由器
api_router = APIRouter()

# 注册各个模块的路由
api_router.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["dashboard"]
)

api_router.include_router(
    insights.router,
    prefix="/insights",
    tags=["insights"]
)

api_router.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["analytics"]
)

api_router.include_router(
    teams.router,
    prefix="/teams",
    tags=["teams"]
)

api_router.include_router(
    projects.router,
    prefix="/projects",
    tags=["projects"]
)

api_router.include_router(
    metrics.router,
    prefix="/metrics",
    tags=["metrics"]
)

api_router.include_router(
    chat.router,
    prefix="/chat",
    tags=["chat"]
)