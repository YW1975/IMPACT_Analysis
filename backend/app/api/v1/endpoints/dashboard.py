from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from datetime import datetime, timedelta
from loguru import logger

from app.schemas.schemas import APIResponse, DashboardData
from app.services.data_collector import DataCollector

router = APIRouter()

# 依赖注入
def get_data_collector() -> DataCollector:
    return DataCollector()


@router.get("/overview", response_model=APIResponse)
async def get_dashboard_overview(
    data_collector: DataCollector = Depends(get_data_collector)
):
    """获取仪表盘概览数据"""
    try:
        # 获取最新的指标数据
        metrics_data = await data_collector.collect_all_metrics()
        
        # 构建仪表盘数据
        dashboard_data = {
            "dora_metrics": {
                "deployment_frequency": metrics_data.get('dora', {}).get('deployment_frequency', 0.5),
                "lead_time_for_changes": metrics_data.get('dora', {}).get('lead_time_for_changes', 48),
                "change_failure_rate": metrics_data.get('dora', {}).get('change_failure_rate', 10),
                "time_to_restore_service": metrics_data.get('dora', {}).get('time_to_restore_service', 4),
                "trend": {
                    "deployment_frequency": "up",
                    "lead_time_for_changes": "down",
                    "change_failure_rate": "down",
                    "time_to_restore_service": "stable"
                }
            },
            "flow_metrics": {
                "flow_efficiency": metrics_data.get('flow', {}).get('flow_efficiency', 25),
                "work_in_progress": metrics_data.get('flow', {}).get('work_in_progress', 8),
                "cycle_time": metrics_data.get('flow', {}).get('cycle_time', 7),
                "throughput": metrics_data.get('flow', {}).get('throughput', 3),
                "trend": {
                    "flow_efficiency": "up",
                    "work_in_progress": "down",
                    "cycle_time": "down",
                    "throughput": "up"
                }
            },
            "team_rankings": [
                {
                    "id": 1,
                    "name": "前端团队",
                    "score": 85,
                    "trend": "up",
                    "change": 5,
                    "members": 6
                },
                {
                    "id": 2,
                    "name": "后端团队",
                    "score": 82,
                    "trend": "stable",
                    "change": 1,
                    "members": 8
                },
                {
                    "id": 3,
                    "name": "移动端团队",
                    "score": 78,
                    "trend": "up",
                    "change": 3,
                    "members": 4
                }
            ],
            "recent_activities": [
                {
                    "id": 1,
                    "type": "deployment",
                    "title": "生产环境部署",
                    "description": "v2.1.0 版本成功部署到生产环境",
                    "team": "前端团队",
                    "status": "success",
                    "timestamp": (datetime.now() - timedelta(minutes=30)).isoformat()
                },
                {
                    "id": 2,
                    "type": "commit",
                    "title": "功能开发",
                    "description": "完成用户权限管理模块开发",
                    "team": "后端团队",
                    "status": "completed",
                    "timestamp": (datetime.now() - timedelta(hours=1)).isoformat()
                },
                {
                    "id": 3,
                    "type": "incident",
                    "title": "性能问题",
                    "description": "API响应时间异常，已修复",
                    "team": "后端团队",
                    "status": "resolved",
                    "timestamp": (datetime.now() - timedelta(hours=2)).isoformat()
                },
                {
                    "id": 4,
                    "type": "review",
                    "title": "代码审查",
                    "description": "完成支付模块代码审查",
                    "team": "前端团队",
                    "status": "approved",
                    "timestamp": (datetime.now() - timedelta(hours=3)).isoformat()
                }
            ],
            "alerts": [
                {
                    "id": 1,
                    "type": "warning",
                    "title": "部署频率偏低",
                    "message": "本周部署频率低于目标值，建议关注",
                    "severity": "medium",
                    "timestamp": (datetime.now() - timedelta(hours=1)).isoformat()
                },
                {
                    "id": 2,
                    "type": "info",
                    "title": "代码质量提升",
                    "message": "本月代码审查通过率达到95%",
                    "severity": "low",
                    "timestamp": (datetime.now() - timedelta(hours=6)).isoformat()
                }
            ]
        }
        
        return APIResponse(
            success=True,
            message="仪表盘数据获取成功",
            data=dashboard_data
        )
        
    except Exception as e:
        logger.error(f"获取仪表盘数据失败: {e}")
        raise HTTPException(status_code=500, detail="获取仪表盘数据失败")


@router.get("/dora-metrics", response_model=APIResponse)
async def get_dora_metrics(
    days: int = 30,
    data_collector: DataCollector = Depends(get_data_collector)
):
    """获取DORA指标历史数据"""
    try:
        # 模拟历史数据
        historical_data = []
        base_date = datetime.now() - timedelta(days=days)
        
        for i in range(days):
            date = base_date + timedelta(days=i)
            historical_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "deployment_frequency": 0.3 + (i * 0.02),
                "lead_time_for_changes": 60 - (i * 0.5),
                "change_failure_rate": 15 - (i * 0.1),
                "time_to_restore_service": 6 - (i * 0.05)
            })
        
        return APIResponse(
            success=True,
            message="DORA指标历史数据获取成功",
            data={
                "metrics": historical_data,
                "period": f"{days}天",
                "summary": {
                    "avg_deployment_frequency": sum(d["deployment_frequency"] for d in historical_data) / len(historical_data),
                    "avg_lead_time": sum(d["lead_time_for_changes"] for d in historical_data) / len(historical_data),
                    "avg_failure_rate": sum(d["change_failure_rate"] for d in historical_data) / len(historical_data),
                    "avg_recovery_time": sum(d["time_to_restore_service"] for d in historical_data) / len(historical_data)
                }
            }
        )
        
    except Exception as e:
        logger.error(f"获取DORA指标历史数据失败: {e}")
        raise HTTPException(status_code=500, detail="获取DORA指标历史数据失败")


@router.get("/flow-metrics", response_model=APIResponse)
async def get_flow_metrics(
    days: int = 30,
    data_collector: DataCollector = Depends(get_data_collector)
):
    """获取流动效率指标历史数据"""
    try:
        # 模拟历史数据
        historical_data = []
        base_date = datetime.now() - timedelta(days=days)
        
        for i in range(days):
            date = base_date + timedelta(days=i)
            historical_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "flow_efficiency": 20 + (i * 0.3),
                "work_in_progress": 12 - (i * 0.1),
                "cycle_time": 10 - (i * 0.08),
                "throughput": 2 + (i * 0.05)
            })
        
        return APIResponse(
            success=True,
            message="流动效率指标历史数据获取成功",
            data={
                "metrics": historical_data,
                "period": f"{days}天",
                "summary": {
                    "avg_flow_efficiency": sum(d["flow_efficiency"] for d in historical_data) / len(historical_data),
                    "avg_wip": sum(d["work_in_progress"] for d in historical_data) / len(historical_data),
                    "avg_cycle_time": sum(d["cycle_time"] for d in historical_data) / len(historical_data),
                    "avg_throughput": sum(d["throughput"] for d in historical_data) / len(historical_data)
                }
            }
        )
        
    except Exception as e:
        logger.error(f"获取流动效率指标历史数据失败: {e}")
        raise HTTPException(status_code=500, detail="获取流动效率指标历史数据失败")


@router.get("/team-rankings", response_model=APIResponse)
async def get_team_rankings(
    data_collector: DataCollector = Depends(get_data_collector)
):
    """获取团队效能排行"""
    try:
        # 模拟团队排行数据
        team_rankings = [
            {
                "id": 1,
                "name": "前端团队",
                "score": 85,
                "trend": "up",
                "change": 5,
                "members": 6,
                "metrics": {
                    "efficiency": 88,
                    "velocity": 82,
                    "satisfaction": 85,
                    "collaboration": 90
                },
                "recent_achievements": [
                    "完成移动端适配",
                    "性能优化提升30%",
                    "零缺陷发布"
                ]
            },
            {
                "id": 2,
                "name": "后端团队",
                "score": 82,
                "trend": "stable",
                "change": 1,
                "members": 8,
                "metrics": {
                    "efficiency": 85,
                    "velocity": 80,
                    "satisfaction": 82,
                    "collaboration": 85
                },
                "recent_achievements": [
                    "API性能优化",
                    "微服务架构升级",
                    "监控体系完善"
                ]
            },
            {
                "id": 3,
                "name": "移动端团队",
                "score": 78,
                "trend": "up",
                "change": 3,
                "members": 4,
                "metrics": {
                    "efficiency": 80,
                    "velocity": 75,
                    "satisfaction": 78,
                    "collaboration": 82
                },
                "recent_achievements": [
                    "新版本发布",
                    "用户体验优化",
                    "崩溃率降低50%"
                ]
            }
        ]
        
        return APIResponse(
            success=True,
            message="团队效能排行获取成功",
            data={
                "rankings": team_rankings,
                "total_teams": len(team_rankings),
                "avg_score": sum(team["score"] for team in team_rankings) / len(team_rankings)
            }
        )
        
    except Exception as e:
        logger.error(f"获取团队效能排行失败: {e}")
        raise HTTPException(status_code=500, detail="获取团队效能排行失败")


@router.get("/activities", response_model=APIResponse)
async def get_recent_activities(
    limit: int = 20,
    activity_type: str = None
):
    """获取最近活动"""
    try:
        # 模拟活动数据
        all_activities = [
            {
                "id": 1,
                "type": "deployment",
                "title": "生产环境部署",
                "description": "v2.1.0 版本成功部署到生产环境",
                "team": "前端团队",
                "user": "张三",
                "status": "success",
                "timestamp": (datetime.now() - timedelta(minutes=30)).isoformat(),
                "details": {
                    "version": "v2.1.0",
                    "environment": "production",
                    "duration": "5分钟"
                }
            },
            {
                "id": 2,
                "type": "commit",
                "title": "功能开发",
                "description": "完成用户权限管理模块开发",
                "team": "后端团队",
                "user": "李四",
                "status": "completed",
                "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(),
                "details": {
                    "files_changed": 8,
                    "lines_added": 245,
                    "lines_deleted": 32
                }
            },
            {
                "id": 3,
                "type": "incident",
                "title": "性能问题",
                "description": "API响应时间异常，已修复",
                "team": "后端团队",
                "user": "王五",
                "status": "resolved",
                "timestamp": (datetime.now() - timedelta(hours=2)).isoformat(),
                "details": {
                    "severity": "medium",
                    "affected_users": 150,
                    "resolution_time": "45分钟"
                }
            },
            {
                "id": 4,
                "type": "review",
                "title": "代码审查",
                "description": "完成支付模块代码审查",
                "team": "前端团队",
                "user": "赵六",
                "status": "approved",
                "timestamp": (datetime.now() - timedelta(hours=3)).isoformat(),
                "details": {
                    "pull_request": "#123",
                    "reviewers": 2,
                    "comments": 5
                }
            },
            {
                "id": 5,
                "type": "test",
                "title": "自动化测试",
                "description": "回归测试全部通过",
                "team": "QA团队",
                "user": "孙七",
                "status": "passed",
                "timestamp": (datetime.now() - timedelta(hours=4)).isoformat(),
                "details": {
                    "test_cases": 156,
                    "passed": 156,
                    "failed": 0,
                    "duration": "25分钟"
                }
            }
        ]
        
        # 按类型过滤
        if activity_type:
            all_activities = [a for a in all_activities if a["type"] == activity_type]
        
        # 限制数量
        activities = all_activities[:limit]
        
        return APIResponse(
            success=True,
            message="最近活动获取成功",
            data={
                "activities": activities,
                "total": len(all_activities),
                "filtered": len(activities),
                "types": list(set(a["type"] for a in all_activities))
            }
        )
        
    except Exception as e:
        logger.error(f"获取最近活动失败: {e}")
        raise HTTPException(status_code=500, detail="获取最近活动失败")