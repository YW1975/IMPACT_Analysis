from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    """应用配置类"""
    
    # 基础配置
    APP_NAME: str = "AI驱动软件开发效能管理平台"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # 安全配置
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    
    # CORS配置
    ALLOWED_HOSTS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # 数据库配置
    DATABASE_URL: str = "sqlite:///./devops_efficiency.db"
    DATABASE_ECHO: bool = False
    
    # Redis配置
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI服务配置
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    OPENAI_MAX_TOKENS: int = 1000
    OPENAI_TEMPERATURE: float = 0.7
    
    # 数据采集配置
    GITHUB_TOKEN: Optional[str] = None
    JIRA_URL: Optional[str] = None
    JIRA_USERNAME: Optional[str] = None
    JIRA_API_TOKEN: Optional[str] = None
    
    # Jenkins配置
    JENKINS_URL: Optional[str] = None
    JENKINS_USERNAME: Optional[str] = None
    JENKINS_API_TOKEN: Optional[str] = None
    
    # 日志配置
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/app.log"
    
    # 缓存配置
    CACHE_TTL: int = 300  # 5分钟
    
    # 数据采集配置
    DATA_COLLECTION_INTERVAL: int = 300  # 5分钟
    METRICS_RETENTION_DAYS: int = 90
    
    # AI分析配置
    AI_ANALYSIS_INTERVAL: int = 3600  # 1小时
    INSIGHT_CONFIDENCE_THRESHOLD: float = 0.7
    
    # WebSocket配置
    WS_HEARTBEAT_INTERVAL: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# 创建全局设置实例
settings = Settings()