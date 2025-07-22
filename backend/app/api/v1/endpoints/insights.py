from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from loguru import logger

from app.schemas.schemas import (
    APIResponse, Insight, InsightCreate, InsightUpdate,
    Recommendation, RecommendationCreate, RecommendationUpdate,
    Prediction, PredictionCreate
)
from app.services.ai_service import AIService
from app.services.data_collector import DataCollector

router = APIRouter()

# 依赖注入
def get_ai_service() -> AIService:
    return AIService()

def get_data_collector() -> DataCollector:
    return DataCollector()


@router.get("/", response_model=APIResponse)
async def get_insights(
    limit: int = 20,
    insight_type: Optional[str] = None,
    severity: Optional[str] = None,
    ai_service: AIService = Depends(get_ai_service)
):
    """获取AI洞察列表"""
    try:
        # 模拟洞察数据
        insights = [
            {
                "id": 1,
                "title": "部署频率持续下降",
                "description": "过去两周部署频率从每天1.2次下降到0.8次，建议检查CI/CD流水线效率",
                "type": "performance",
                "severity": "medium",
                "confidence": 0.85,
                "status": "new",
                "team_id": 1,
                "project_id": None,
                "metrics": {
                    "deployment_frequency": 0.8,
                    "trend": "down",
                    "change_rate": -33.3
                },
                "recommendations": [
                    "优化CI/CD流水线配置",
                    "减少手动审批环节",
                    "实施自动化测试"
                ],
                "created_by": "ai",
                "created_at": (datetime.now() - timedelta(hours=2)).isoformat(),
                "updated_at": None
            },
            {
                "id": 2,
                "title": "代码质量显著提升",
                "description": "本月代码审查通过率达到95%，缺陷密度降低40%，团队代码质量意识明显增强",
                "type": "quality",
                "severity": "low",
                "confidence": 0.92,
                "status": "acknowledged",
                "team_id": 2,
                "project_id": 1,
                "metrics": {
                    "code_review_pass_rate": 95,
                    "defect_density": 0.6,
                    "trend": "up"
                },
                "recommendations": [
                    "继续保持当前的代码审查标准",
                    "分享最佳实践给其他团队",
                    "建立代码质量激励机制"
                ],
                "created_by": "ai",
                "created_at": (datetime.now() - timedelta(hours=6)).isoformat(),
                "updated_at": (datetime.now() - timedelta(hours=1)).isoformat()
            },
            {
                "id": 3,
                "title": "团队协作效率有待提升",
                "description": "团队间沟通延迟导致任务阻塞增加，平均等待时间超过预期",
                "type": "risk",
                "severity": "high",
                "confidence": 0.78,
                "status": "new",
                "team_id": 3,
                "project_id": 2,
                "metrics": {
                    "collaboration_score": 65,
                    "waiting_time": 8.5,
                    "blocked_tasks": 12
                },
                "recommendations": [
                    "建立跨团队日常同步机制",
                    "使用协作工具提高透明度",
                    "明确团队间接口和职责"
                ],
                "created_by": "ai",
                "created_at": (datetime.now() - timedelta(hours=12)).isoformat(),
                "updated_at": None
            },
            {
                "id": 4,
                "title": "技术债务积累风险",
                "description": "代码复杂度持续上升，维护成本增加，建议制定技术债务清理计划",
                "type": "risk",
                "severity": "medium",
                "confidence": 0.80,
                "status": "new",
                "team_id": 1,
                "project_id": 1,
                "metrics": {
                    "code_complexity": 7.2,
                    "technical_debt_ratio": 15.3,
                    "maintenance_time": 25
                },
                "recommendations": [
                    "制定重构计划",
                    "设置代码复杂度阈值",
                    "定期进行技术债务评估"
                ],
                "created_by": "ai",
                "created_at": (datetime.now() - timedelta(days=1)).isoformat(),
                "updated_at": None
            },
            {
                "id": 5,
                "title": "自动化测试覆盖率提升机会",
                "description": "当前测试覆盖率为68%，存在提升空间，可以减少手动测试工作量",
                "type": "opportunity",
                "severity": "low",
                "confidence": 0.75,
                "status": "new",
                "team_id": 2,
                "project_id": 1,
                "metrics": {
                    "test_coverage": 68,
                    "manual_test_ratio": 35,
                    "automation_potential": 25
                },
                "recommendations": [
                    "增加单元测试覆盖率",
                    "实施集成测试自动化",
                    "建立测试质量门禁"
                ],
                "created_by": "ai",
                "created_at": (datetime.now() - timedelta(days=2)).isoformat(),
                "updated_at": None
            }
        ]
        
        # 按类型过滤
        if insight_type:
            insights = [i for i in insights if i["type"] == insight_type]
        
        # 按严重程度过滤
        if severity:
            insights = [i for i in insights if i["severity"] == severity]
        
        # 限制数量
        insights = insights[:limit]
        
        return APIResponse(
            success=True,
            message="AI洞察获取成功",
            data={
                "insights": insights,
                "total": len(insights),
                "summary": {
                    "new": len([i for i in insights if i["status"] == "new"]),
                    "acknowledged": len([i for i in insights if i["status"] == "acknowledged"]),
                    "resolved": len([i for i in insights if i["status"] == "resolved"]),
                    "high_severity": len([i for i in insights if i["severity"] == "high"]),
                    "avg_confidence": sum(i["confidence"] for i in insights) / len(insights) if insights else 0
                }
            }
        )
        
    except Exception as e:
        logger.error(f"获取AI洞察失败: {e}")
        raise HTTPException(status_code=500, detail="获取AI洞察失败")


@router.get("/{insight_id}", response_model=APIResponse)
async def get_insight_detail(insight_id: int):
    """获取洞察详情"""
    try:
        # 模拟洞察详情数据
        insight_detail = {
            "id": insight_id,
            "title": "部署频率持续下降",
            "description": "过去两周部署频率从每天1.2次下降到0.8次，建议检查CI/CD流水线效率",
            "type": "performance",
            "severity": "medium",
            "confidence": 0.85,
            "status": "new",
            "team_id": 1,
            "team_name": "前端团队",
            "project_id": None,
            "project_name": None,
            "metrics": {
                "deployment_frequency": 0.8,
                "trend": "down",
                "change_rate": -33.3,
                "historical_data": [
                    {"date": "2024-01-01", "value": 1.2},
                    {"date": "2024-01-02", "value": 1.1},
                    {"date": "2024-01-03", "value": 1.0},
                    {"date": "2024-01-04", "value": 0.9},
                    {"date": "2024-01-05", "value": 0.8}
                ]
            },
            "recommendations": [
                {
                    "title": "优化CI/CD流水线配置",
                    "description": "检查并优化构建和部署流水线的配置，减少不必要的步骤",
                    "priority": "high",
                    "effort": "medium",
                    "impact": "high"
                },
                {
                    "title": "减少手动审批环节",
                    "description": "自动化部分手动审批流程，提高部署效率",
                    "priority": "medium",
                    "effort": "low",
                    "impact": "medium"
                },
                {
                    "title": "实施自动化测试",
                    "description": "增加自动化测试覆盖率，减少手动测试时间",
                    "priority": "medium",
                    "effort": "high",
                    "impact": "high"
                }
            ],
            "affected_teams": ["前端团队"],
            "related_metrics": [
                "部署频率",
                "变更前置时间",
                "流水线成功率"
            ],
            "analysis_details": {
                "data_sources": ["GitHub", "Jenkins", "GitLab CI"],
                "analysis_period": "过去14天",
                "sample_size": 28,
                "statistical_significance": 0.95
            },
            "created_by": "ai",
            "created_at": (datetime.now() - timedelta(hours=2)).isoformat(),
            "updated_at": None
        }
        
        return APIResponse(
            success=True,
            message="洞察详情获取成功",
            data=insight_detail
        )
        
    except Exception as e:
        logger.error(f"获取洞察详情失败: {e}")
        raise HTTPException(status_code=500, detail="获取洞察详情失败")


@router.put("/{insight_id}", response_model=APIResponse)
async def update_insight(insight_id: int, insight_update: InsightUpdate):
    """更新洞察状态"""
    try:
        # 模拟更新操作
        updated_insight = {
            "id": insight_id,
            "status": insight_update.status,
            "updated_at": datetime.now().isoformat()
        }
        
        return APIResponse(
            success=True,
            message="洞察状态更新成功",
            data=updated_insight
        )
        
    except Exception as e:
        logger.error(f"更新洞察状态失败: {e}")
        raise HTTPException(status_code=500, detail="更新洞察状态失败")


@router.get("/recommendations/", response_model=APIResponse)
async def get_recommendations(
    limit: int = 20,
    priority: Optional[str] = None,
    status: Optional[str] = None
):
    """获取改进建议列表"""
    try:
        # 模拟建议数据
        recommendations = [
            {
                "id": 1,
                "title": "实施自动化部署流水线",
                "description": "建立完整的CI/CD自动化流水线，减少手动部署步骤，提高部署频率和可靠性",
                "type": "process",
                "priority": "high",
                "effort": "high",
                "impact": "high",
                "status": "pending",
                "progress": 0,
                "estimated_duration": 30,
                "team_id": 1,
                "team_name": "前端团队",
                "project_id": 1,
                "project_name": "主要产品",
                "insight_id": 1,
                "expected_benefits": [
                    "部署频率提升50%",
                    "部署错误率降低80%",
                    "人工成本节省60%"
                ],
                "implementation_steps": [
                    "评估现有部署流程",
                    "设计自动化方案",
                    "开发部署脚本",
                    "测试和优化",
                    "全面推广"
                ],
                "created_at": (datetime.now() - timedelta(hours=1)).isoformat(),
                "updated_at": None
            },
            {
                "id": 2,
                "title": "建立代码质量门禁",
                "description": "设置代码质量检查点，确保只有符合质量标准的代码才能合并到主分支",
                "type": "practice",
                "priority": "medium",
                "effort": "medium",
                "impact": "high",
                "status": "in_progress",
                "progress": 35,
                "estimated_duration": 14,
                "team_id": 2,
                "team_name": "后端团队",
                "project_id": 1,
                "project_name": "主要产品",
                "insight_id": 2,
                "expected_benefits": [
                    "代码质量提升30%",
                    "缺陷率降低50%",
                    "维护成本减少25%"
                ],
                "implementation_steps": [
                    "定义质量标准",
                    "配置检查工具",
                    "集成到CI流程",
                    "团队培训",
                    "持续优化"
                ],
                "created_at": (datetime.now() - timedelta(days=1)).isoformat(),
                "updated_at": (datetime.now() - timedelta(hours=2)).isoformat()
            },
            {
                "id": 3,
                "title": "优化团队协作流程",
                "description": "建立标准化的团队协作流程，减少沟通成本，提高协作效率",
                "type": "process",
                "priority": "medium",
                "effort": "low",
                "impact": "medium",
                "status": "completed",
                "progress": 100,
                "estimated_duration": 7,
                "team_id": 3,
                "team_name": "移动端团队",
                "project_id": 2,
                "project_name": "移动应用",
                "insight_id": 3,
                "expected_benefits": [
                    "沟通效率提升40%",
                    "任务阻塞减少60%",
                    "团队满意度提升20%"
                ],
                "implementation_steps": [
                    "分析现有流程",
                    "设计新流程",
                    "团队培训",
                    "试点运行",
                    "全面推广"
                ],
                "created_at": (datetime.now() - timedelta(days=3)).isoformat(),
                "updated_at": (datetime.now() - timedelta(hours=6)).isoformat()
            }
        ]
        
        # 按优先级过滤
        if priority:
            recommendations = [r for r in recommendations if r["priority"] == priority]
        
        # 按状态过滤
        if status:
            recommendations = [r for r in recommendations if r["status"] == status]
        
        # 限制数量
        recommendations = recommendations[:limit]
        
        return APIResponse(
            success=True,
            message="改进建议获取成功",
            data={
                "recommendations": recommendations,
                "total": len(recommendations),
                "summary": {
                    "pending": len([r for r in recommendations if r["status"] == "pending"]),
                    "in_progress": len([r for r in recommendations if r["status"] == "in_progress"]),
                    "completed": len([r for r in recommendations if r["status"] == "completed"]),
                    "high_priority": len([r for r in recommendations if r["priority"] == "high"]),
                    "avg_progress": sum(r["progress"] for r in recommendations) / len(recommendations) if recommendations else 0
                }
            }
        )
        
    except Exception as e:
        logger.error(f"获取改进建议失败: {e}")
        raise HTTPException(status_code=500, detail="获取改进建议失败")


@router.get("/predictions/", response_model=APIResponse)
async def get_predictions(
    limit: int = 10,
    metric_type: Optional[str] = None,
    ai_service: AIService = Depends(get_ai_service)
):
    """获取预测分析"""
    try:
        # 模拟预测数据
        predictions = [
            {
                "id": 1,
                "metric_name": "部署频率",
                "metric_type": "dora",
                "current_value": 0.8,
                "predicted_value": 1.2,
                "confidence": 0.85,
                "prediction_horizon": 30,
                "trend": "up",
                "change_rate": 50.0,
                "factors": [
                    "CI/CD流水线优化",
                    "自动化测试增加",
                    "团队技能提升"
                ],
                "time_series_data": [
                    {"date": "2024-01-01", "actual": 0.8, "predicted": 0.85},
                    {"date": "2024-01-02", "actual": None, "predicted": 0.9},
                    {"date": "2024-01-03", "actual": None, "predicted": 0.95},
                    {"date": "2024-01-04", "actual": None, "predicted": 1.0},
                    {"date": "2024-01-05", "actual": None, "predicted": 1.2}
                ],
                "team_id": 1,
                "project_id": None,
                "created_at": datetime.now().isoformat(),
                "valid_until": (datetime.now() + timedelta(days=30)).isoformat()
            },
            {
                "id": 2,
                "metric_name": "流动效率",
                "metric_type": "flow",
                "current_value": 25.0,
                "predicted_value": 35.0,
                "confidence": 0.78,
                "prediction_horizon": 30,
                "trend": "up",
                "change_rate": 40.0,
                "factors": [
                    "流程优化",
                    "工具改进",
                    "团队协作提升"
                ],
                "time_series_data": [
                    {"date": "2024-01-01", "actual": 25.0, "predicted": 26.0},
                    {"date": "2024-01-02", "actual": None, "predicted": 28.0},
                    {"date": "2024-01-03", "actual": None, "predicted": 30.0},
                    {"date": "2024-01-04", "actual": None, "predicted": 32.0},
                    {"date": "2024-01-05", "actual": None, "predicted": 35.0}
                ],
                "team_id": 2,
                "project_id": 1,
                "created_at": datetime.now().isoformat(),
                "valid_until": (datetime.now() + timedelta(days=30)).isoformat()
            },
            {
                "id": 3,
                "metric_name": "团队满意度",
                "metric_type": "team",
                "current_value": 75.0,
                "predicted_value": 82.0,
                "confidence": 0.72,
                "prediction_horizon": 30,
                "trend": "up",
                "change_rate": 9.3,
                "factors": [
                    "工作环境改善",
                    "技能培训增加",
                    "激励机制优化"
                ],
                "time_series_data": [
                    {"date": "2024-01-01", "actual": 75.0, "predicted": 76.0},
                    {"date": "2024-01-02", "actual": None, "predicted": 77.5},
                    {"date": "2024-01-03", "actual": None, "predicted": 79.0},
                    {"date": "2024-01-04", "actual": None, "predicted": 80.5},
                    {"date": "2024-01-05", "actual": None, "predicted": 82.0}
                ],
                "team_id": 3,
                "project_id": None,
                "created_at": datetime.now().isoformat(),
                "valid_until": (datetime.now() + timedelta(days=30)).isoformat()
            }
        ]
        
        # 按指标类型过滤
        if metric_type:
            predictions = [p for p in predictions if p["metric_type"] == metric_type]
        
        # 限制数量
        predictions = predictions[:limit]
        
        return APIResponse(
            success=True,
            message="预测分析获取成功",
            data={
                "predictions": predictions,
                "total": len(predictions),
                "summary": {
                    "avg_confidence": sum(p["confidence"] for p in predictions) / len(predictions) if predictions else 0,
                    "positive_trends": len([p for p in predictions if p["trend"] == "up"]),
                    "negative_trends": len([p for p in predictions if p["trend"] == "down"]),
                    "stable_trends": len([p for p in predictions if p["trend"] == "stable"])
                }
            }
        )
        
    except Exception as e:
        logger.error(f"获取预测分析失败: {e}")
        raise HTTPException(status_code=500, detail="获取预测分析失败")


@router.post("/generate", response_model=APIResponse)
async def generate_insights(
    ai_service: AIService = Depends(get_ai_service),
    data_collector: DataCollector = Depends(get_data_collector)
):
    """手动触发AI洞察生成"""
    try:
        # 收集最新数据
        metrics_data = await data_collector.collect_all_metrics()
        
        # 生成AI洞察
        insights = await ai_service.generate_insights(metrics_data)
        
        return APIResponse(
            success=True,
            message=f"成功生成 {len(insights)} 个AI洞察",
            data={
                "generated_insights": len(insights),
                "insights": [insight.dict() for insight in insights]
            }
        )
        
    except Exception as e:
        logger.error(f"生成AI洞察失败: {e}")
        raise HTTPException(status_code=500, detail="生成AI洞察失败")