#!/usr/bin/env python3
"""
启动脚本 - AI驱动软件开发效能管理平台后端

使用方法:
    python run.py                    # 开发模式
    python run.py --prod             # 生产模式
    python run.py --host 0.0.0.0     # 指定主机
    python run.py --port 8080        # 指定端口
"""

import argparse
import uvicorn
from loguru import logger

from app.core.config import settings


def parse_args():
    """解析命令行参数"""
    parser = argparse.ArgumentParser(
        description="AI驱动软件开发效能管理平台后端服务"
    )
    
    parser.add_argument(
        "--host",
        type=str,
        default="127.0.0.1",
        help="服务器主机地址 (默认: 127.0.0.1)"
    )
    
    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="服务器端口 (默认: 8000)"
    )
    
    parser.add_argument(
        "--prod",
        action="store_true",
        help="生产模式运行"
    )
    
    parser.add_argument(
        "--reload",
        action="store_true",
        default=True,
        help="开启自动重载 (默认: True)"
    )
    
    parser.add_argument(
        "--workers",
        type=int,
        default=1,
        help="工作进程数量 (默认: 1)"
    )
    
    parser.add_argument(
        "--log-level",
        type=str,
        default="info",
        choices=["debug", "info", "warning", "error", "critical"],
        help="日志级别 (默认: info)"
    )
    
    return parser.parse_args()


def setup_logging(log_level: str):
    """设置日志配置"""
    logger.remove()  # 移除默认处理器
    
    # 添加控制台输出
    logger.add(
        sink=lambda msg: print(msg, end=""),
        level=log_level.upper(),
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
               "<level>{level: <8}</level> | "
               "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
               "<level>{message}</level>",
        colorize=True
    )
    
    # 添加文件输出
    logger.add(
        "logs/app.log",
        rotation="10 MB",
        retention="7 days",
        level=log_level.upper(),
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        encoding="utf-8"
    )


def main():
    """主函数"""
    args = parse_args()
    
    # 设置日志
    setup_logging(args.log_level)
    
    # 打印启动信息
    logger.info("=" * 60)
    logger.info("🚀 AI驱动软件开发效能管理平台后端服务")
    logger.info("=" * 60)
    logger.info(f"📍 服务地址: http://{args.host}:{args.port}")
    logger.info(f"🔧 运行模式: {'生产模式' if args.prod else '开发模式'}")
    logger.info(f"📊 日志级别: {args.log_level.upper()}")
    logger.info(f"⚙️  自动重载: {'开启' if args.reload and not args.prod else '关闭'}")
    logger.info(f"👥 工作进程: {args.workers}")
    logger.info("=" * 60)
    
    # 配置uvicorn参数
    uvicorn_config = {
        "app": "main:app",
        "host": args.host,
        "port": args.port,
        "log_level": args.log_level,
        "access_log": True,
    }
    
    if args.prod:
        # 生产模式配置
        uvicorn_config.update({
            "workers": args.workers,
            "reload": False,
        })
        logger.info("🏭 生产模式启动中...")
    else:
        # 开发模式配置
        uvicorn_config.update({
            "reload": args.reload,
            "reload_dirs": ["app"],
        })
        logger.info("🛠️  开发模式启动中...")
    
    try:
        # 启动服务器
        uvicorn.run(**uvicorn_config)
    except KeyboardInterrupt:
        logger.info("\n👋 服务器已停止")
    except Exception as e:
        logger.error(f"❌ 服务器启动失败: {e}")
        raise


if __name__ == "__main__":
    main()