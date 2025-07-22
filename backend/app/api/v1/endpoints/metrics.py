from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from loguru import logger

from app.schemas.schemas import APIResponse
from app.services.data_collector import DataCollector
from app.services.ai_service import AIService

router = APIRouter()

# 依赖注入
def get_data_collector() -> DataCollector:
    return DataCollector()

def get_ai_service() -> AIService:
    return AIService()


@router.get("/dora", response_model=APIResponse)
async def get_dora_metrics(
    team_id: Optional[int] = None,
    project_id: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    granularity: str = Query(default="daily", regex="^(daily|weekly|monthly)$"),
    data_collector: DataCollector = Depends(get_data_collector)
):
    """获取DORA指标数据"""
    try:
        # 模拟DORA指标数据
        dora_metrics = {
            "summary": {
                "deployment_frequency": {
                    "value": 1.2,
                    "unit": "deployments/day",
                    "trend": "up",
                    "change_rate": 20.0,
                    "benchmark": "high",
                    "target": 2.0
                },
                "lead_time_for_changes": {
                    "value": 2.5,
                    "unit": "days",
                    "trend": "down",
                    "change_rate": -15.0,
                    "benchmark": "medium",
                    "target": 1.0
                },
                "change_failure_rate": {
                    "value": 8.5,
                    "unit": "percentage",
                    "trend": "down",
                    "change_rate": -25.0,
                    "benchmark": "good",
                    "target": 5.0
                },
                "time_to_restore_service": {
                    "value": 1.8,
                    "unit": "hours",
                    "trend": "down",
                    "change_rate": -20.0,
                    "benchmark": "medium",
                    "target": 1.0
                }
            },
            "time_series": {
                "deployment_frequency": [
                    {"date": "2024-01-01", "value": 1.0, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-02", "value": 1.1, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-03", "value": 1.2, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-04", "value": 1.3, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-05", "value": 1.2, "team_id": team_id, "project_id": project_id}
                ],
                "lead_time": [
                    {"date": "2024-01-01", "value": 3.0, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-02", "value": 2.8, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-03", "value": 2.5, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-04", "value": 2.3, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-05", "value": 2.5, "team_id": team_id, "project_id": project_id}
                ],
                "change_failure_rate": [
                    {"date": "2024-01-01", "value": 12.0, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-02", "value": 10.5, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-03", "value": 9.2, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-04", "value": 8.8, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-05", "value": 8.5, "team_id": team_id, "project_id": project_id}
                ],
                "recovery_time": [
                    {"date": "2024-01-01", "value": 2.5, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-02", "value": 2.2, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-03", "value": 1.9, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-04", "value": 1.7, "team_id": team_id, "project_id": project_id},
                    {"date": "2024-01-05", "value": 1.8, "team_id": team_id, "project_id": project_id}
                ]
            },
            "breakdown": {
                "by_team": [
                    {"team_id": 1, "team_name": "前端团队", "deployment_frequency": 1.3, "lead_time": 2.2, "change_failure_rate": 7.5, "recovery_time": 1.5},
                    {"team_id": 2, "team_name": "后端团队", "deployment_frequency": 1.1, "lead_time": 2.8, "change_failure_rate": 9.5, "recovery_time": 2.1},
                    {"team_id": 3, "team_name": "移动端团队", "deployment_frequency": 0.8, "lead_time": 3.5, "change_failure_rate": 12.0, "recovery_time": 2.5}
                ],
                "by_project": [
                    {"project_id": 1, "project_name": "主要产品", "deployment_frequency": 1.2, "lead_time": 2.5, "change_failure_rate": 8.5, "recovery_time": 1.8},
                    {"project_id": 2, "project_name": "移动应用", "deployment_frequency": 0.9, "lead_time": 3.2, "change_failure_rate": 11.2, "recovery_time": 2.3},
                    {"project_id": 3, "project_name": "数据平台", "deployment_frequency": 0.7, "lead_time": 4.1, "change_failure_rate": 6.8, "recovery_time": 1.9}
                ]
            },
            "insights": [
                "部署频率持续提升，CI/CD优化见效",
                "变更前置时间有所改善，流程优化有效",
                "变更失败率显著下降，质量管控加强",
                "服务恢复时间保持稳定，运维能力良好"
            ]
        }
        
        return APIResponse(
            success=True,
            message="DORA指标获取成功",
            data=dora_metrics
        )
        
    except Exception as e:
        logger.error(f"获取DORA指标失败: {e}")
        raise HTTPException(status_code=500, detail="获取DORA指标失败")


@router.get("/flow", response_model=APIResponse)
async def get_flow_metrics(
    team_id: Optional[int] = None,
    project_id: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    data_collector: DataCollector = Depends(get_data_collector)
):
    """获取流动效率指标"""
    try:
        # 模拟流动效率指标数据
        flow_metrics = {
            "summary": {
                "flow_efficiency": {
                    "value": 28.5,
                    "unit": "percentage",
                    "trend": "up",
                    "change_rate": 15.2,
                    "benchmark": "medium",
                    "target": 40.0
                },
                "cycle_time": {
                    "value": 8.2,
                    "unit": "days",
                    "trend": "down",
                    "change_rate": -12.8,
                    "benchmark": "medium",
                    "target": 5.0
                },
                "throughput": {
                    "value": 12.5,
                    "unit": "items/week",
                    "trend": "up",
                    "change_rate": 18.9,
                    "benchmark": "good",
                    "target": 15.0
                },
                "work_in_progress": {
                    "value": 15,
                    "unit": "items",
                    "trend": "down",
                    "change_rate": -16.7,
                    "benchmark": "good",
                    "target": 12
                }
            },
            "flow_stages": {
                "backlog": {
                    "avg_time": 0.5,
                    "percentage": 5.2,
                    "items_count": 3,
                    "bottleneck_score": 1
                },
                "analysis": {
                    "avg_time": 1.2,
                    "percentage": 12.8,
                    "items_count": 2,
                    "bottleneck_score": 2
                },
                "development": {
                    "avg_time": 4.2,
                    "percentage": 45.8,
                    "items_count": 8,
                    "bottleneck_score": 3
                },
                "review": {
                    "avg_time": 1.8,
                    "percentage": 18.5,
                    "items_count": 4,
                    "bottleneck_score": 2
                },
                "testing": {
                    "avg_time": 2.1,
                    "percentage": 22.3,
                    "items_count": 5,
                    "bottleneck_score": 4
                },
                "deployment": {
                    "avg_time": 0.8,
                    "percentage": 8.2,
                    "items_count": 1,
                    "bottleneck_score": 1
                }
            },
            "time_series": {
                "flow_efficiency": [
                    {"date": "2024-01-01", "value": 24.5},
                    {"date": "2024-01-08", "value": 26.2},
                    {"date": "2024-01-15", "value": 28.5},
                    {"date": "2024-01-22", "value": 29.8},
                    {"date": "2024-01-29", "value": 28.1}
                ],
                "cycle_time": [
                    {"date": "2024-01-01", "value": 9.5},
                    {"date": "2024-01-08", "value": 8.9},
                    {"date": "2024-01-15", "value": 8.2},
                    {"date": "2024-01-22", "value": 7.8},
                    {"date": "2024-01-29", "value": 8.1}
                ],
                "throughput": [
                    {"date": "2024-01-01", "value": 10.5},
                    {"date": "2024-01-08", "value": 11.2},
                    {"date": "2024-01-15", "value": 12.5},
                    {"date": "2024-01-22", "value": 13.1},
                    {"date": "2024-01-29", "value": 12.8}
                ],
                "wip": [
                    {"date": "2024-01-01", "value": 18},
                    {"date": "2024-01-08", "value": 17},
                    {"date": "2024-01-15", "value": 15},
                    {"date": "2024-01-22", "value": 14},
                    {"date": "2024-01-29", "value": 15}
                ]
            },
            "bottleneck_analysis": {
                "primary_bottleneck": "testing",
                "secondary_bottleneck": "development",
                "bottleneck_impact": {
                    "testing": "影响整体交付速度30%",
                    "development": "影响整体交付速度20%"
                },
                "improvement_suggestions": [
                    "增加自动化测试覆盖率",
                    "并行化测试执行",
                    "优化代码审查流程",
                    "减少工作在制品数量"
                ]
            },
            "team_comparison": [
                {"team_id": 1, "team_name": "前端团队", "flow_efficiency": 32.1, "cycle_time": 7.2, "throughput": 14.5},
                {"team_id": 2, "team_name": "后端团队", "flow_efficiency": 28.5, "cycle_time": 8.2, "throughput": 12.5},
                {"team_id": 3, "team_name": "移动端团队", "flow_efficiency": 24.8, "cycle_time": 9.8, "throughput": 10.2}
            ]
        }
        
        return APIResponse(
            success=True,
            message="流动效率指标获取成功",
            data=flow_metrics
        )
        
    except Exception as e:
        logger.error(f"获取流动效率指标失败: {e}")
        raise HTTPException(status_code=500, detail="获取流动效率指标失败")


@router.get("/team", response_model=APIResponse)
async def get_team_metrics(
    team_id: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    data_collector: DataCollector = Depends(get_data_collector)
):
    """获取团队效能指标"""
    try:
        # 模拟团队效能指标数据
        team_metrics = {
            "summary": {
                "productivity_score": {
                    "value": 78.5,
                    "unit": "score",
                    "trend": "up",
                    "change_rate": 8.6,
                    "benchmark": "high",
                    "target": 85.0
                },
                "collaboration_score": {
                    "value": 82.1,
                    "unit": "score",
                    "trend": "up",
                    "change_rate": 5.2,
                    "benchmark": "high",
                    "target": 85.0
                },
                "satisfaction_score": {
                    "value": 75.2,
                    "unit": "score",
                    "trend": "up",
                    "change_rate": 6.8,
                    "benchmark": "medium",
                    "target": 80.0
                },
                "skill_growth_rate": {
                    "value": 12.5,
                    "unit": "percentage",
                    "trend": "up",
                    "change_rate": 15.2,
                    "benchmark": "good",
                    "target": 15.0
                }
            },
            "detailed_metrics": {
                "velocity": {
                    "current_sprint": 45,
                    "avg_last_3_sprints": 42,
                    "trend": "up",
                    "consistency_score": 85
                },
                "quality": {
                    "defect_density": 0.8,
                    "test_coverage": 82,
                    "code_review_coverage": 95,
                    "technical_debt_ratio": 12.5
                },
                "communication": {
                    "meeting_efficiency": 72,
                    "response_time_hours": 2.3,
                    "knowledge_sharing_score": 68,
                    "documentation_quality": 75
                },
                "innovation": {
                    "new_ideas_per_month": 8,
                    "implementation_rate": 35,
                    "learning_hours_per_week": 4.5,
                    "technology_adoption_score": 78
                }
            },
            "individual_performance": [
                {
                    "member_id": 1,
                    "name": "张三",
                    "role": "Team Lead",
                    "productivity": 92,
                    "quality": 88,
                    "collaboration": 95,
                    "growth": 85,
                    "workload": 85,
                    "satisfaction": 88
                },
                {
                    "member_id": 2,
                    "name": "李四",
                    "role": "Senior Developer",
                    "productivity": 85,
                    "quality": 90,
                    "collaboration": 82,
                    "growth": 88,
                    "workload": 78,
                    "satisfaction": 82
                },
                {
                    "member_id": 3,
                    "name": "王五",
                    "role": "Developer",
                    "productivity": 78,
                    "quality": 82,
                    "collaboration": 88,
                    "growth": 92,
                    "workload": 70,
                    "satisfaction": 85
                }
            ],
            "time_series": {
                "productivity": [
                    {"date": "2024-01-01", "value": 72.3},
                    {"date": "2024-01-08", "value": 74.8},
                    {"date": "2024-01-15", "value": 76.5},
                    {"date": "2024-01-22", "value": 78.2},
                    {"date": "2024-01-29", "value": 78.5}
                ],
                "satisfaction": [
                    {"date": "2024-01-01", "value": 70.5},
                    {"date": "2024-01-08", "value": 72.1},
                    {"date": "2024-01-15", "value": 73.8},
                    {"date": "2024-01-22", "value": 74.9},
                    {"date": "2024-01-29", "value": 75.2}
                ],
                "collaboration": [
                    {"date": "2024-01-01", "value": 78.2},
                    {"date": "2024-01-08", "value": 79.5},
                    {"date": "2024-01-15", "value": 81.1},
                    {"date": "2024-01-22", "value": 81.8},
                    {"date": "2024-01-29", "value": 82.1}
                ]
            },
            "skill_matrix": {
                "technical_skills": {
                    "frontend": {"average": 78, "max": 92, "min": 65},
                    "backend": {"average": 72, "max": 88, "min": 58},
                    "testing": {"average": 75, "max": 85, "min": 68},
                    "devops": {"average": 65, "max": 78, "min": 52}
                },
                "soft_skills": {
                    "communication": {"average": 82, "max": 95, "min": 75},
                    "leadership": {"average": 68, "max": 92, "min": 45},
                    "problem_solving": {"average": 85, "max": 92, "min": 78},
                    "adaptability": {"average": 78, "max": 88, "min": 68}
                }
            },
            "health_indicators": {
                "burnout_risk": "low",
                "turnover_risk": "low",
                "skill_gap_risk": "medium",
                "collaboration_health": "good",
                "workload_balance": "good"
            }
        }
        
        return APIResponse(
            success=True,
            message="团队效能指标获取成功",
            data=team_metrics
        )
        
    except Exception as e:
        logger.error(f"获取团队效能指标失败: {e}")
        raise HTTPException(status_code=500, detail="获取团队效能指标失败")


@router.get("/quality", response_model=APIResponse)
async def get_quality_metrics(
    team_id: Optional[int] = None,
    project_id: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    data_collector: DataCollector = Depends(get_data_collector)
):
    """获取质量指标"""
    try:
        # 模拟质量指标数据
        quality_metrics = {
            "summary": {
                "overall_quality_score": {
                    "value": 85.2,
                    "unit": "score",
                    "trend": "up",
                    "change_rate": 8.5,
                    "benchmark": "high",
                    "target": 90.0
                },
                "defect_density": {
                    "value": 0.8,
                    "unit": "defects/kloc",
                    "trend": "down",
                    "change_rate": -35.0,
                    "benchmark": "good",
                    "target": 0.5
                },
                "test_coverage": {
                    "value": 82.5,
                    "unit": "percentage",
                    "trend": "up",
                    "change_rate": 12.3,
                    "benchmark": "good",
                    "target": 90.0
                },
                "technical_debt_ratio": {
                    "value": 12.5,
                    "unit": "percentage",
                    "trend": "down",
                    "change_rate": -18.4,
                    "benchmark": "medium",
                    "target": 10.0
                }
            },
            "detailed_metrics": {
                "code_quality": {
                    "complexity_score": 7.2,
                    "maintainability_index": 78,
                    "code_duplication": 5.8,
                    "coding_standards_compliance": 92
                },
                "testing": {
                    "unit_test_coverage": 85,
                    "integration_test_coverage": 78,
                    "e2e_test_coverage": 65,
                    "test_automation_rate": 88
                },
                "security": {
                    "vulnerability_count": 3,
                    "security_score": 88,
                    "compliance_score": 92,
                    "security_test_coverage": 75
                },
                "performance": {
                    "response_time_p95": 250,
                    "throughput_rps": 1200,
                    "error_rate": 0.15,
                    "availability": 99.8
                }
            },
            "defect_analysis": {
                "by_severity": {
                    "critical": 1,
                    "high": 3,
                    "medium": 8,
                    "low": 12
                },
                "by_category": {
                    "functional": 45,
                    "performance": 20,
                    "security": 15,
                    "usability": 12,
                    "compatibility": 8
                },
                "by_source": {
                    "development": 60,
                    "requirements": 25,
                    "design": 10,
                    "environment": 5
                },
                "resolution_time": {
                    "avg_resolution_hours": 18.5,
                    "critical_resolution_hours": 4.2,
                    "high_resolution_hours": 12.8
                }
            },
            "time_series": {
                "quality_score": [
                    {"date": "2024-01-01", "value": 78.5},
                    {"date": "2024-01-08", "value": 80.2},
                    {"date": "2024-01-15", "value": 82.8},
                    {"date": "2024-01-22", "value": 84.5},
                    {"date": "2024-01-29", "value": 85.2}
                ],
                "defect_density": [
                    {"date": "2024-01-01", "value": 1.2},
                    {"date": "2024-01-08", "value": 1.0},
                    {"date": "2024-01-15", "value": 0.9},
                    {"date": "2024-01-22", "value": 0.8},
                    {"date": "2024-01-29", "value": 0.8}
                ],
                "test_coverage": [
                    {"date": "2024-01-01", "value": 75.2},
                    {"date": "2024-01-08", "value": 77.8},
                    {"date": "2024-01-15", "value": 80.1},
                    {"date": "2024-01-22", "value": 81.8},
                    {"date": "2024-01-29", "value": 82.5}
                ]
            },
            "quality_gates": {
                "code_review": {
                    "coverage": 95,
                    "avg_review_time": 4.2,
                    "approval_rate": 88,
                    "rework_rate": 12
                },
                "automated_testing": {
                    "pass_rate": 92,
                    "execution_time": 25.5,
                    "flaky_test_rate": 3.2,
                    "coverage_threshold_met": True
                },
                "static_analysis": {
                    "issues_count": 15,
                    "critical_issues": 0,
                    "code_smell_density": 2.1,
                    "maintainability_rating": "A"
                }
            },
            "improvement_suggestions": [
                "增加单元测试覆盖率到90%以上",
                "减少代码复杂度，重构复杂模块",
                "建立更严格的代码审查标准",
                "实施持续的安全扫描",
                "优化性能测试自动化"
            ]
        }
        
        return APIResponse(
            success=True,
            message="质量指标获取成功",
            data=quality_metrics
        )
        
    except Exception as e:
        logger.error(f"获取质量指标失败: {e}")
        raise HTTPException(status_code=500, detail="获取质量指标失败")


@router.get("/custom", response_model=APIResponse)
async def get_custom_metrics(
    metric_names: str,  # 逗号分隔的指标名称
    team_id: Optional[int] = None,
    project_id: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    data_collector: DataCollector = Depends(get_data_collector)
):
    """获取自定义指标"""
    try:
        # 解析指标名称
        metrics_list = [name.strip() for name in metric_names.split(",")]
        
        # 模拟自定义指标数据
        custom_metrics = {
            "requested_metrics": metrics_list,
            "data": {},
            "metadata": {
                "collection_time": datetime.now().isoformat(),
                "data_sources": ["GitHub", "Jira", "Jenkins", "SonarQube"],
                "team_id": team_id,
                "project_id": project_id
            }
        }
        
        # 为每个请求的指标生成模拟数据
        for metric in metrics_list:
            if metric == "code_commits":
                custom_metrics["data"][metric] = {
                    "value": 156,
                    "unit": "commits",
                    "period": "last_30_days",
                    "trend": "up",
                    "change_rate": 12.5,
                    "time_series": [
                        {"date": "2024-01-01", "value": 32},
                        {"date": "2024-01-08", "value": 38},
                        {"date": "2024-01-15", "value": 42},
                        {"date": "2024-01-22", "value": 44}
                    ]
                }
            elif metric == "pull_requests":
                custom_metrics["data"][metric] = {
                    "value": 45,
                    "unit": "PRs",
                    "period": "last_30_days",
                    "trend": "up",
                    "change_rate": 8.2,
                    "breakdown": {
                        "merged": 42,
                        "closed": 2,
                        "open": 1
                    }
                }
            elif metric == "story_points":
                custom_metrics["data"][metric] = {
                    "value": 128,
                    "unit": "points",
                    "period": "current_sprint",
                    "trend": "stable",
                    "change_rate": 2.1,
                    "breakdown": {
                        "completed": 115,
                        "in_progress": 8,
                        "todo": 5
                    }
                }
            elif metric == "bug_reports":
                custom_metrics["data"][metric] = {
                    "value": 18,
                    "unit": "bugs",
                    "period": "last_30_days",
                    "trend": "down",
                    "change_rate": -25.0,
                    "breakdown": {
                        "open": 5,
                        "in_progress": 3,
                        "resolved": 10
                    }
                }
            elif metric == "customer_satisfaction":
                custom_metrics["data"][metric] = {
                    "value": 4.2,
                    "unit": "rating (1-5)",
                    "period": "last_30_days",
                    "trend": "up",
                    "change_rate": 5.0,
                    "sample_size": 156
                }
            else:
                # 为未知指标生成通用数据
                custom_metrics["data"][metric] = {
                    "value": 75.5,
                    "unit": "score",
                    "period": "last_30_days",
                    "trend": "stable",
                    "change_rate": 0.0,
                    "note": "模拟数据"
                }
        
        return APIResponse(
            success=True,
            message="自定义指标获取成功",
            data=custom_metrics
        )
        
    except Exception as e:
        logger.error(f"获取自定义指标失败: {e}")
        raise HTTPException(status_code=500, detail="获取自定义指标失败")


@router.post("/collect", response_model=APIResponse)
async def trigger_metrics_collection(
    team_id: Optional[int] = None,
    project_id: Optional[int] = None,
    metric_types: Optional[List[str]] = None,
    data_collector: DataCollector = Depends(get_data_collector)
):
    """手动触发指标数据采集"""
    try:
        # 模拟数据采集过程
        collection_result = {
            "collection_id": f"collection_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "status": "completed",
            "start_time": (datetime.now() - timedelta(minutes=2)).isoformat(),
            "end_time": datetime.now().isoformat(),
            "duration_seconds": 120,
            "collected_metrics": {
                "dora_metrics": {
                    "deployment_frequency": True,
                    "lead_time": True,
                    "change_failure_rate": True,
                    "recovery_time": True
                },
                "flow_metrics": {
                    "flow_efficiency": True,
                    "cycle_time": True,
                    "throughput": True,
                    "work_in_progress": True
                },
                "team_metrics": {
                    "productivity": True,
                    "collaboration": True,
                    "satisfaction": True,
                    "skill_growth": True
                },
                "quality_metrics": {
                    "defect_density": True,
                    "test_coverage": True,
                    "code_quality": True,
                    "technical_debt": True
                }
            },
            "data_sources": {
                "github": {"status": "success", "records": 1250},
                "jira": {"status": "success", "records": 890},
                "jenkins": {"status": "success", "records": 340},
                "sonarqube": {"status": "success", "records": 156}
            },
            "errors": [],
            "warnings": [
                "部分历史数据缺失，使用默认值填充",
                "GitHub API速率限制，部分数据延迟更新"
            ],
            "next_scheduled_collection": (datetime.now() + timedelta(hours=1)).isoformat()
        }
        
        return APIResponse(
            success=True,
            message="指标数据采集完成",
            data=collection_result
        )
        
    except Exception as e:
        logger.error(f"触发指标数据采集失败: {e}")
        raise HTTPException(status_code=500, detail="触发指标数据采集失败")


@router.get("/summary", response_model=APIResponse)
async def get_metrics_summary(
    team_id: Optional[int] = None,
    project_id: Optional[int] = None,
    ai_service: AIService = Depends(get_ai_service)
):
    """获取指标汇总和AI分析"""
    try:
        # 模拟指标汇总数据
        metrics_summary = {
            "overall_health_score": 82.5,
            "health_status": "good",
            "key_metrics": {
                "dora": {
                    "score": 78.2,
                    "status": "good",
                    "trend": "up",
                    "key_insight": "部署频率和质量都在提升"
                },
                "flow": {
                    "score": 75.8,
                    "status": "medium",
                    "trend": "up",
                    "key_insight": "流动效率有改善，但仍有优化空间"
                },
                "team": {
                    "score": 85.1,
                    "status": "good",
                    "trend": "stable",
                    "key_insight": "团队协作和满意度表现良好"
                },
                "quality": {
                    "score": 88.9,
                    "status": "excellent",
                    "trend": "up",
                    "key_insight": "代码质量持续提升，技术债务减少"
                }
            },
            "top_achievements": [
                "部署频率提升50%，达到行业先进水平",
                "代码质量得分提升15%，技术债务显著减少",
                "团队满意度达到82分，创历史新高",
                "变更失败率降低30%，系统稳定性增强"
            ],
            "priority_improvements": [
                {
                    "area": "流动效率",
                    "current_score": 75.8,
                    "target_score": 85.0,
                    "impact": "high",
                    "effort": "medium",
                    "recommendation": "优化测试流程，减少瓶颈"
                },
                {
                    "area": "自动化程度",
                    "current_score": 68.5,
                    "target_score": 80.0,
                    "impact": "high",
                    "effort": "high",
                    "recommendation": "增加CI/CD自动化覆盖率"
                },
                {
                    "area": "知识分享",
                    "current_score": 72.1,
                    "target_score": 80.0,
                    "impact": "medium",
                    "effort": "low",
                    "recommendation": "建立定期技术分享机制"
                }
            ],
            "ai_insights": [
                "基于历史数据分析，预计下月部署频率将继续提升15%",
                "团队协作模式优化后，预期生产力将提升12%",
                "当前质量趋势良好，建议保持现有质量管控措施",
                "流动效率瓶颈主要在测试环节，建议重点优化"
            ],
            "benchmark_comparison": {
                "industry_percentile": 75,
                "company_ranking": "上游25%",
                "peer_comparison": "优于同规模团队平均水平18%"
            },
            "trend_forecast": {
                "next_30_days": {
                    "overall_score_prediction": 85.2,
                    "confidence": 0.82,
                    "key_drivers": ["持续改进措施", "团队技能提升", "工具优化"]
                }
            }
        }
        
        return APIResponse(
            success=True,
            message="指标汇总获取成功",
            data=metrics_summary
        )
        
    except Exception as e:
        logger.error(f"获取指标汇总失败: {e}")
        raise HTTPException(status_code=500, detail="获取指标汇总失败")