from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from loguru import logger

from app.schemas.schemas import APIResponse
from app.services.ai_service import AIService
from app.services.data_collector import DataCollector

router = APIRouter()

# 依赖注入
def get_ai_service() -> AIService:
    return AIService()

def get_data_collector() -> DataCollector:
    return DataCollector()


@router.get("/dora", response_model=APIResponse)
async def get_dora_analytics(
    team_id: Optional[int] = None,
    project_id: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    granularity: str = Query(default="daily", regex="^(daily|weekly|monthly)$")
):
    """获取DORA指标分析"""
    try:
        # 模拟DORA指标分析数据
        dora_analytics = {
            "summary": {
                "deployment_frequency": {
                    "current": 1.2,
                    "previous": 0.8,
                    "change_rate": 50.0,
                    "trend": "up",
                    "benchmark": "high",
                    "target": 2.0
                },
                "lead_time": {
                    "current": 2.5,
                    "previous": 3.2,
                    "change_rate": -21.9,
                    "trend": "down",
                    "benchmark": "medium",
                    "target": 1.0
                },
                "change_failure_rate": {
                    "current": 8.5,
                    "previous": 12.3,
                    "change_rate": -30.9,
                    "trend": "down",
                    "benchmark": "high",
                    "target": 5.0
                },
                "recovery_time": {
                    "current": 1.8,
                    "previous": 2.5,
                    "change_rate": -28.0,
                    "trend": "down",
                    "benchmark": "medium",
                    "target": 1.0
                }
            },
            "time_series": {
                "deployment_frequency": [
                    {"date": "2024-01-01", "value": 0.8, "team_id": 1},
                    {"date": "2024-01-02", "value": 0.9, "team_id": 1},
                    {"date": "2024-01-03", "value": 1.0, "team_id": 1},
                    {"date": "2024-01-04", "value": 1.1, "team_id": 1},
                    {"date": "2024-01-05", "value": 1.2, "team_id": 1},
                    {"date": "2024-01-06", "value": 1.3, "team_id": 1},
                    {"date": "2024-01-07", "value": 1.2, "team_id": 1}
                ],
                "lead_time": [
                    {"date": "2024-01-01", "value": 3.2, "team_id": 1},
                    {"date": "2024-01-02", "value": 3.0, "team_id": 1},
                    {"date": "2024-01-03", "value": 2.8, "team_id": 1},
                    {"date": "2024-01-04", "value": 2.6, "team_id": 1},
                    {"date": "2024-01-05", "value": 2.5, "team_id": 1},
                    {"date": "2024-01-06", "value": 2.4, "team_id": 1},
                    {"date": "2024-01-07", "value": 2.5, "team_id": 1}
                ],
                "change_failure_rate": [
                    {"date": "2024-01-01", "value": 12.3, "team_id": 1},
                    {"date": "2024-01-02", "value": 11.8, "team_id": 1},
                    {"date": "2024-01-03", "value": 10.5, "team_id": 1},
                    {"date": "2024-01-04", "value": 9.2, "team_id": 1},
                    {"date": "2024-01-05", "value": 8.5, "team_id": 1},
                    {"date": "2024-01-06", "value": 8.0, "team_id": 1},
                    {"date": "2024-01-07", "value": 8.5, "team_id": 1}
                ],
                "recovery_time": [
                    {"date": "2024-01-01", "value": 2.5, "team_id": 1},
                    {"date": "2024-01-02", "value": 2.3, "team_id": 1},
                    {"date": "2024-01-03", "value": 2.1, "team_id": 1},
                    {"date": "2024-01-04", "value": 1.9, "team_id": 1},
                    {"date": "2024-01-05", "value": 1.8, "team_id": 1},
                    {"date": "2024-01-06", "value": 1.7, "team_id": 1},
                    {"date": "2024-01-07", "value": 1.8, "team_id": 1}
                ]
            },
            "team_comparison": [
                {
                    "team_id": 1,
                    "team_name": "前端团队",
                    "deployment_frequency": 1.2,
                    "lead_time": 2.5,
                    "change_failure_rate": 8.5,
                    "recovery_time": 1.8,
                    "overall_score": 85
                },
                {
                    "team_id": 2,
                    "team_name": "后端团队",
                    "deployment_frequency": 0.9,
                    "lead_time": 3.1,
                    "change_failure_rate": 6.2,
                    "recovery_time": 1.5,
                    "overall_score": 78
                },
                {
                    "team_id": 3,
                    "team_name": "移动端团队",
                    "deployment_frequency": 0.7,
                    "lead_time": 4.2,
                    "change_failure_rate": 12.1,
                    "recovery_time": 2.3,
                    "overall_score": 65
                }
            ],
            "correlations": {
                "deployment_frequency_vs_quality": -0.65,
                "lead_time_vs_satisfaction": -0.72,
                "automation_vs_reliability": 0.83,
                "team_size_vs_velocity": 0.45
            },
            "insights": [
                "部署频率提升50%，主要得益于CI/CD流水线优化",
                "变更失败率显著下降，代码质量管控措施见效",
                "前端团队在所有DORA指标上表现最佳",
                "移动端团队需要重点关注流程优化"
            ]
        }
        
        return APIResponse(
            success=True,
            message="DORA指标分析获取成功",
            data=dora_analytics
        )
        
    except Exception as e:
        logger.error(f"获取DORA指标分析失败: {e}")
        raise HTTPException(status_code=500, detail="获取DORA指标分析失败")


@router.get("/flow", response_model=APIResponse)
async def get_flow_analytics(
    team_id: Optional[int] = None,
    project_id: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """获取流动效率分析"""
    try:
        # 模拟流动效率分析数据
        flow_analytics = {
            "summary": {
                "flow_efficiency": {
                    "current": 28.5,
                    "previous": 22.3,
                    "change_rate": 27.8,
                    "trend": "up",
                    "benchmark": "medium",
                    "target": 40.0
                },
                "cycle_time": {
                    "current": 8.2,
                    "previous": 10.5,
                    "change_rate": -21.9,
                    "trend": "down",
                    "benchmark": "medium",
                    "target": 5.0
                },
                "work_in_progress": {
                    "current": 15,
                    "previous": 18,
                    "change_rate": -16.7,
                    "trend": "down",
                    "benchmark": "good",
                    "target": 12
                },
                "throughput": {
                    "current": 12.5,
                    "previous": 9.8,
                    "change_rate": 27.6,
                    "trend": "up",
                    "benchmark": "high",
                    "target": 15.0
                }
            },
            "flow_stages": {
                "todo": {
                    "avg_time": 0.5,
                    "percentage": 5.2,
                    "bottleneck_score": 1
                },
                "in_progress": {
                    "avg_time": 4.2,
                    "percentage": 45.8,
                    "bottleneck_score": 3
                },
                "code_review": {
                    "avg_time": 1.8,
                    "percentage": 18.5,
                    "bottleneck_score": 2
                },
                "testing": {
                    "avg_time": 2.1,
                    "percentage": 22.3,
                    "bottleneck_score": 4
                },
                "deployment": {
                    "avg_time": 0.8,
                    "percentage": 8.2,
                    "bottleneck_score": 1
                }
            },
            "bottleneck_analysis": {
                "primary_bottleneck": "testing",
                "secondary_bottleneck": "in_progress",
                "improvement_potential": {
                    "testing": "实施自动化测试可减少40%时间",
                    "in_progress": "优化任务分解可提升30%效率",
                    "code_review": "增加审查人员可减少20%等待时间"
                }
            },
            "time_series": {
                "flow_efficiency": [
                    {"date": "2024-01-01", "value": 22.3},
                    {"date": "2024-01-02", "value": 24.1},
                    {"date": "2024-01-03", "value": 25.8},
                    {"date": "2024-01-04", "value": 27.2},
                    {"date": "2024-01-05", "value": 28.5},
                    {"date": "2024-01-06", "value": 29.1},
                    {"date": "2024-01-07", "value": 28.8}
                ],
                "cycle_time": [
                    {"date": "2024-01-01", "value": 10.5},
                    {"date": "2024-01-02", "value": 9.8},
                    {"date": "2024-01-03", "value": 9.2},
                    {"date": "2024-01-04", "value": 8.7},
                    {"date": "2024-01-05", "value": 8.2},
                    {"date": "2024-01-06", "value": 7.9},
                    {"date": "2024-01-07", "value": 8.1}
                ],
                "throughput": [
                    {"date": "2024-01-01", "value": 9.8},
                    {"date": "2024-01-02", "value": 10.2},
                    {"date": "2024-01-03", "value": 10.8},
                    {"date": "2024-01-04", "value": 11.5},
                    {"date": "2024-01-05", "value": 12.5},
                    {"date": "2024-01-06", "value": 13.1},
                    {"date": "2024-01-07", "value": 12.8}
                ]
            },
            "team_comparison": [
                {
                    "team_id": 1,
                    "team_name": "前端团队",
                    "flow_efficiency": 32.1,
                    "cycle_time": 7.2,
                    "throughput": 14.5,
                    "wip_limit_adherence": 85
                },
                {
                    "team_id": 2,
                    "team_name": "后端团队",
                    "flow_efficiency": 28.5,
                    "cycle_time": 8.2,
                    "throughput": 12.5,
                    "wip_limit_adherence": 78
                },
                {
                    "team_id": 3,
                    "team_name": "移动端团队",
                    "flow_efficiency": 24.8,
                    "cycle_time": 9.8,
                    "throughput": 10.2,
                    "wip_limit_adherence": 65
                }
            ]
        }
        
        return APIResponse(
            success=True,
            message="流动效率分析获取成功",
            data=flow_analytics
        )
        
    except Exception as e:
        logger.error(f"获取流动效率分析失败: {e}")
        raise HTTPException(status_code=500, detail="获取流动效率分析失败")


@router.get("/team", response_model=APIResponse)
async def get_team_analytics(
    team_id: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """获取团队效能分析"""
    try:
        # 模拟团队效能分析数据
        team_analytics = {
            "summary": {
                "productivity_score": {
                    "current": 78.5,
                    "previous": 72.3,
                    "change_rate": 8.6,
                    "trend": "up",
                    "benchmark": "high"
                },
                "collaboration_score": {
                    "current": 82.1,
                    "previous": 79.8,
                    "change_rate": 2.9,
                    "trend": "up",
                    "benchmark": "high"
                },
                "satisfaction_score": {
                    "current": 75.2,
                    "previous": 71.5,
                    "change_rate": 5.2,
                    "trend": "up",
                    "benchmark": "medium"
                },
                "skill_growth": {
                    "current": 68.9,
                    "previous": 65.2,
                    "change_rate": 5.7,
                    "trend": "up",
                    "benchmark": "medium"
                }
            },
            "team_metrics": {
                "velocity": {
                    "current_sprint": 45,
                    "avg_last_3_sprints": 42,
                    "trend": "up",
                    "consistency": 0.85
                },
                "burndown_health": {
                    "on_track_percentage": 78,
                    "early_completion": 15,
                    "delayed_completion": 7
                },
                "code_quality": {
                    "review_coverage": 95,
                    "defect_density": 0.8,
                    "technical_debt_ratio": 12.5,
                    "test_coverage": 82
                },
                "communication": {
                    "meeting_efficiency": 72,
                    "response_time": 2.3,
                    "knowledge_sharing": 68,
                    "documentation_quality": 75
                }
            },
            "individual_performance": [
                {
                    "member_id": 1,
                    "name": "张三",
                    "role": "前端开发",
                    "productivity": 85,
                    "code_quality": 88,
                    "collaboration": 82,
                    "growth_rate": 12,
                    "strengths": ["React开发", "UI设计", "性能优化"],
                    "improvement_areas": ["后端知识", "测试技能"]
                },
                {
                    "member_id": 2,
                    "name": "李四",
                    "role": "后端开发",
                    "productivity": 78,
                    "code_quality": 92,
                    "collaboration": 75,
                    "growth_rate": 8,
                    "strengths": ["系统架构", "数据库设计", "API开发"],
                    "improvement_areas": ["前端技术", "沟通技巧"]
                },
                {
                    "member_id": 3,
                    "name": "王五",
                    "role": "测试工程师",
                    "productivity": 82,
                    "code_quality": 85,
                    "collaboration": 90,
                    "growth_rate": 15,
                    "strengths": ["自动化测试", "质量保证", "团队协作"],
                    "improvement_areas": ["性能测试", "安全测试"]
                }
            ],
            "skill_matrix": {
                "technical_skills": {
                    "frontend": {"average": 78, "distribution": [85, 65, 70]},
                    "backend": {"average": 72, "distribution": [60, 92, 65]},
                    "testing": {"average": 75, "distribution": [70, 68, 88]},
                    "devops": {"average": 65, "distribution": [62, 70, 63]}
                },
                "soft_skills": {
                    "communication": {"average": 82, "distribution": [82, 75, 90]},
                    "leadership": {"average": 68, "distribution": [75, 60, 70]},
                    "problem_solving": {"average": 85, "distribution": [88, 85, 82]},
                    "adaptability": {"average": 78, "distribution": [80, 72, 82]}
                }
            },
            "workload_distribution": {
                "balanced": 65,
                "overloaded": 20,
                "underutilized": 15,
                "recommendations": [
                    "重新分配部分任务给空闲成员",
                    "为过载成员提供支持",
                    "优化任务分解和估算"
                ]
            },
            "time_series": {
                "productivity": [
                    {"date": "2024-01-01", "value": 72.3},
                    {"date": "2024-01-02", "value": 74.1},
                    {"date": "2024-01-03", "value": 75.8},
                    {"date": "2024-01-04", "value": 77.2},
                    {"date": "2024-01-05", "value": 78.5}
                ],
                "satisfaction": [
                    {"date": "2024-01-01", "value": 71.5},
                    {"date": "2024-01-02", "value": 72.8},
                    {"date": "2024-01-03", "value": 73.9},
                    {"date": "2024-01-04", "value": 74.6},
                    {"date": "2024-01-05", "value": 75.2}
                ]
            }
        }
        
        return APIResponse(
            success=True,
            message="团队效能分析获取成功",
            data=team_analytics
        )
        
    except Exception as e:
        logger.error(f"获取团队效能分析失败: {e}")
        raise HTTPException(status_code=500, detail="获取团队效能分析失败")


@router.get("/trends", response_model=APIResponse)
async def get_trend_analysis(
    metric_type: str = Query(..., regex="^(dora|flow|team|quality)$"),
    period: str = Query(default="30d", regex="^(7d|30d|90d|1y)$"),
    team_id: Optional[int] = None
):
    """获取趋势分析"""
    try:
        # 模拟趋势分析数据
        trend_analysis = {
            "metric_type": metric_type,
            "period": period,
            "overall_trend": "improving",
            "trend_strength": 0.75,
            "key_insights": [
                "整体效能指标呈上升趋势",
                "团队协作效率显著提升",
                "代码质量持续改善",
                "部署频率稳步增长"
            ],
            "metrics": {
                "primary_metric": {
                    "name": "综合效能得分",
                    "current_value": 78.5,
                    "start_value": 65.2,
                    "change_rate": 20.4,
                    "trend_direction": "up",
                    "volatility": 0.15,
                    "confidence": 0.92
                },
                "supporting_metrics": [
                    {
                        "name": "部署频率",
                        "current_value": 1.2,
                        "change_rate": 50.0,
                        "trend_direction": "up"
                    },
                    {
                        "name": "变更前置时间",
                        "current_value": 2.5,
                        "change_rate": -21.9,
                        "trend_direction": "down"
                    },
                    {
                        "name": "团队满意度",
                        "current_value": 75.2,
                        "change_rate": 8.6,
                        "trend_direction": "up"
                    }
                ]
            },
            "time_series": [
                {"date": "2024-01-01", "value": 65.2, "prediction": None},
                {"date": "2024-01-08", "value": 67.1, "prediction": None},
                {"date": "2024-01-15", "value": 69.8, "prediction": None},
                {"date": "2024-01-22", "value": 72.5, "prediction": None},
                {"date": "2024-01-29", "value": 75.3, "prediction": None},
                {"date": "2024-02-05", "value": 78.5, "prediction": None},
                {"date": "2024-02-12", "value": None, "prediction": 81.2},
                {"date": "2024-02-19", "value": None, "prediction": 83.8},
                {"date": "2024-02-26", "value": None, "prediction": 85.9}
            ],
            "seasonal_patterns": {
                "weekly": {
                    "pattern_detected": True,
                    "description": "周一至周三效能较高，周五略有下降",
                    "strength": 0.65
                },
                "monthly": {
                    "pattern_detected": False,
                    "description": "月度模式不明显",
                    "strength": 0.25
                }
            },
            "anomalies": [
                {
                    "date": "2024-01-15",
                    "type": "positive",
                    "description": "效能指标异常提升，可能与新工具引入有关",
                    "impact": 15.2
                },
                {
                    "date": "2024-01-28",
                    "type": "negative",
                    "description": "短期效能下降，与系统故障相关",
                    "impact": -8.5
                }
            ],
            "forecasting": {
                "next_30_days": {
                    "predicted_value": 85.9,
                    "confidence_interval": [82.1, 89.7],
                    "trend_continuation_probability": 0.78
                },
                "factors": [
                    "当前改进措施持续生效",
                    "团队技能提升",
                    "工具和流程优化",
                    "外部环境稳定"
                ]
            }
        }
        
        return APIResponse(
            success=True,
            message="趋势分析获取成功",
            data=trend_analysis
        )
        
    except Exception as e:
        logger.error(f"获取趋势分析失败: {e}")
        raise HTTPException(status_code=500, detail="获取趋势分析失败")


@router.get("/benchmarks", response_model=APIResponse)
async def get_benchmark_analysis(
    industry: Optional[str] = None,
    company_size: Optional[str] = None
):
    """获取基准对比分析"""
    try:
        # 模拟基准对比数据
        benchmark_analysis = {
            "organization_profile": {
                "industry": industry or "软件开发",
                "company_size": company_size or "中型企业",
                "team_count": 3,
                "developer_count": 25
            },
            "benchmark_comparison": {
                "dora_metrics": {
                    "deployment_frequency": {
                        "our_value": 1.2,
                        "industry_avg": 0.8,
                        "top_10_percent": 2.5,
                        "percentile": 75,
                        "status": "above_average"
                    },
                    "lead_time": {
                        "our_value": 2.5,
                        "industry_avg": 4.2,
                        "top_10_percent": 1.0,
                        "percentile": 80,
                        "status": "above_average"
                    },
                    "change_failure_rate": {
                        "our_value": 8.5,
                        "industry_avg": 15.2,
                        "top_10_percent": 3.0,
                        "percentile": 70,
                        "status": "above_average"
                    },
                    "recovery_time": {
                        "our_value": 1.8,
                        "industry_avg": 3.5,
                        "top_10_percent": 0.5,
                        "percentile": 75,
                        "status": "above_average"
                    }
                },
                "flow_metrics": {
                    "flow_efficiency": {
                        "our_value": 28.5,
                        "industry_avg": 22.0,
                        "top_10_percent": 45.0,
                        "percentile": 65,
                        "status": "above_average"
                    },
                    "cycle_time": {
                        "our_value": 8.2,
                        "industry_avg": 12.5,
                        "top_10_percent": 4.0,
                        "percentile": 70,
                        "status": "above_average"
                    }
                },
                "team_metrics": {
                    "productivity_score": {
                        "our_value": 78.5,
                        "industry_avg": 68.0,
                        "top_10_percent": 90.0,
                        "percentile": 75,
                        "status": "above_average"
                    },
                    "satisfaction_score": {
                        "our_value": 75.2,
                        "industry_avg": 70.5,
                        "top_10_percent": 85.0,
                        "percentile": 60,
                        "status": "average"
                    }
                }
            },
            "improvement_opportunities": [
                {
                    "metric": "流动效率",
                    "current_percentile": 65,
                    "target_percentile": 80,
                    "improvement_potential": "58%",
                    "recommended_actions": [
                        "减少工作在制品数量",
                        "优化流程瓶颈",
                        "提高自动化程度"
                    ]
                },
                {
                    "metric": "团队满意度",
                    "current_percentile": 60,
                    "target_percentile": 75,
                    "improvement_potential": "25%",
                    "recommended_actions": [
                        "改善工作环境",
                        "提供更多培训机会",
                        "优化激励机制"
                    ]
                }
            ],
            "industry_trends": {
                "emerging_practices": [
                    "AI辅助代码审查",
                    "自动化测试优先",
                    "持续部署",
                    "DevSecOps集成"
                ],
                "technology_adoption": {
                    "containerization": 85,
                    "microservices": 72,
                    "cloud_native": 68,
                    "ai_ml_integration": 45
                }
            },
            "competitive_position": {
                "overall_ranking": "上游25%",
                "strengths": [
                    "部署效率高",
                    "代码质量好",
                    "团队协作强"
                ],
                "areas_for_improvement": [
                    "流动效率有提升空间",
                    "团队满意度可以更高",
                    "创新能力需要加强"
                ]
            }
        }
        
        return APIResponse(
            success=True,
            message="基准对比分析获取成功",
            data=benchmark_analysis
        )
        
    except Exception as e:
        logger.error(f"获取基准对比分析失败: {e}")
        raise HTTPException(status_code=500, detail="获取基准对比分析失败")