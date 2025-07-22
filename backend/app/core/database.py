from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from typing import AsyncGenerator
import asyncio
from loguru import logger

from .config import settings

# 创建数据库引擎
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DATABASE_ECHO,
    pool_pre_ping=True
)

# 创建会话工厂
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 创建基础模型类
Base = declarative_base()


def get_db():
    """获取数据库会话"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def init_db():
    """初始化数据库"""
    try:
        logger.info("正在初始化数据库...")
        
        # 创建所有表
        Base.metadata.create_all(bind=engine)
        
        logger.info("数据库初始化完成")
        
        # 创建默认数据
        await create_default_data()
        
    except Exception as e:
        logger.error(f"数据库初始化失败: {e}")
        raise


async def create_default_data():
    """创建默认数据"""
    try:
        logger.info("正在创建默认数据...")
        
        # 这里可以添加创建默认用户、团队等数据的逻辑
        # 暂时使用模拟数据
        
        logger.info("默认数据创建完成")
        
    except Exception as e:
        logger.error(f"创建默认数据失败: {e}")
        raise


class DatabaseManager:
    """数据库管理器"""
    
    def __init__(self):
        self.engine = engine
        self.SessionLocal = SessionLocal
    
    def get_session(self):
        """获取数据库会话"""
        return self.SessionLocal()
    
    def close_session(self, session):
        """关闭数据库会话"""
        session.close()
    
    async def execute_query(self, query: str, params: dict = None):
        """执行查询"""
        session = self.get_session()
        try:
            result = session.execute(query, params or {})
            session.commit()
            return result
        except Exception as e:
            session.rollback()
            logger.error(f"查询执行失败: {e}")
            raise
        finally:
            self.close_session(session)


# 创建全局数据库管理器实例
db_manager = DatabaseManager()