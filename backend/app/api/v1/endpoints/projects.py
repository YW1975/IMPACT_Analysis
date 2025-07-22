from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from loguru import logger

from app.schemas.schemas import (
    APIResponse, Project, ProjectCreate, ProjectUpdate,
    PaginatedResponse
)
from app.services.data_collector import DataCollector

router = APIRouter()

# 依赖注入
def get_data_collector() -> DataCollector:
    return DataCollector()


@router.get("/", response_model=APIResponse)
async def get_projects(
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    status: Optional[str] = None,
    team_id: Optional[int] = None
):
    """获取项目列表"""
    try:
        # 模拟项目数据
        projects = [
            {
                "id": 1,
                "name": "主要产品",
                "description": "公司核心产品的Web和移动端应用开发",
                "status": "active",
                "priority": "high",
                "start_date": "2023-01-01",
                "end_date": "2024-12-31",
                "progress": 65,
                "budget": 5000000,
                "spent": 3250000,
                "team_count": 3,
                "member_count": 18,
                "technologies": ["React", "Python", "PostgreSQL", "Redis"],
                "performance_score": 82.5,
                "health_status": "good",
                "created_at": "2023-01-01T09:00:00Z",
                "updated_at": "2024-01-10T16:30:00Z",
                "metrics": {
                    "velocity": 42,
                    "quality_score": 85,
                    "on_time_delivery": 88,
                    "budget_utilization": 65
                },
                "teams": [
                    {"id": 1, "name": "前端团队", "role": "UI开发"},
                    {"id": 2, "name": "后端团队", "role": "API开发"},
                    {"id": 5, "name": "QA团队", "role": "质量保证"}
                ]
            },
            {
                "id": 2,
                "name": "移动应用",
                "description": "iOS和Android原生移动应用开发项目",
                "status": "active",
                "priority": "medium",
                "start_date": "2023-06-01",
                "end_date": "2024-06-30",
                "progress": 45,
                "budget": 2000000,
                "spent": 900000,
                "team_count": 2,
                "member_count": 10,
                "technologies": ["Swift", "Kotlin", "React Native", "Firebase"],
                "performance_score": 75.8,
                "health_status": "warning",
                "created_at": "2023-06-01T10:00:00Z",
                "updated_at": "2024-01-08T14:20:00Z",
                "metrics": {
                    "velocity": 35,
                    "quality_score": 78,
                    "on_time_delivery": 72,
                    "budget_utilization": 45
                },
                "teams": [
                    {"id": 3, "name": "移动端团队", "role": "原生开发"},
                    {"id": 5, "name": "QA团队", "role": "测试"}
                ]
            },
            {
                "id": 3,
                "name": "数据平台",
                "description": "企业级数据分析和BI平台建设",
                "status": "active",
                "priority": "medium",
                "start_date": "2023-09-01",
                "end_date": "2024-09-30",
                "progress": 30,
                "budget": 3000000,
                "spent": 900000,
                "team_count": 2,
                "member_count": 12,
                "technologies": ["Python", "Apache Spark", "Elasticsearch", "Tableau"],
                "performance_score": 78.2,
                "health_status": "good",
                "created_at": "2023-09-01T11:00:00Z",
                "updated_at": "2024-01-09T13:45:00Z",
                "metrics": {
                    "velocity": 38,
                    "quality_score": 88,
                    "on_time_delivery": 85,
                    "budget_utilization": 30
                },
                "teams": [
                    {"id": 2, "name": "后端团队", "role": "数据处理"},
                    {"id": 4, "name": "DevOps团队", "role": "基础设施"}
                ]
            },
            {
                "id": 4,
                "name": "基础设施升级",
                "description": "云原生基础设施和CI/CD流水线升级",
                "status": "completed",
                "priority": "high",
                "start_date": "2023-03-01",
                "end_date": "2023-12-31",
                "progress": 100,
                "budget": 1500000,
                "spent": 1450000,
                "team_count": 1,
                "member_count": 4,
                "technologies": ["Kubernetes", "Docker", "Terraform", "Jenkins"],
                "performance_score": 92.1,
                "health_status": "excellent",
                "created_at": "2023-03-01T08:00:00Z",
                "updated_at": "2023-12-31T17:00:00Z",
                "metrics": {
                    "velocity": 28,
                    "quality_score": 95,
                    "on_time_delivery": 100,
                    "budget_utilization": 97
                },
                "teams": [
                    {"id": 4, "name": "DevOps团队", "role": "基础设施"}
                ]
            },
            {
                "id": 5,
                "name": "AI助手集成",
                "description": "在产品中集成AI助手功能",
                "status": "planning",
                "priority": "low",
                "start_date": "2024-03-01",
                "end_date": "2024-08-31",
                "progress": 5,
                "budget": 1200000,
                "spent": 60000,
                "team_count": 2,
                "member_count": 8,
                "technologies": ["Python", "TensorFlow", "OpenAI API", "FastAPI"],
                "performance_score": 0,
                "health_status": "planning",
                "created_at": "2024-01-15T12:00:00Z",
                "updated_at": "2024-01-15T12:00:00Z",
                "metrics": {
                    "velocity": 0,
                    "quality_score": 0,
                    "on_time_delivery": 0,
                    "budget_utilization": 5
                },
                "teams": [
                    {"id": 1, "name": "前端团队", "role": "UI集成"},
                    {"id": 2, "name": "后端团队", "role": "AI服务"}
                ]
            }
        ]
        
        # 搜索过滤
        if search:
            projects = [p for p in projects if search.lower() in p["name"].lower() or search.lower() in p["description"].lower()]
        
        # 状态过滤
        if status:
            projects = [p for p in projects if p["status"] == status]
        
        # 团队过滤
        if team_id:
            projects = [p for p in projects if any(t["id"] == team_id for t in p["teams"])]
        
        # 分页
        total = len(projects)
        projects = projects[skip:skip + limit]
        
        return APIResponse(
            success=True,
            message="项目列表获取成功",
            data={
                "projects": projects,
                "total": total,
                "skip": skip,
                "limit": limit,
                "summary": {
                    "total_projects": total,
                    "active_projects": len([p for p in projects if p["status"] == "active"]),
                    "completed_projects": len([p for p in projects if p["status"] == "completed"]),
                    "total_budget": sum(p["budget"] for p in projects),
                    "total_spent": sum(p["spent"] for p in projects),
                    "avg_progress": sum(p["progress"] for p in projects) / len(projects) if projects else 0
                }
            }
        )
        
    except Exception as e:
        logger.error(f"获取项目列表失败: {e}")
        raise HTTPException(status_code=500, detail="获取项目列表失败")


@router.get("/{project_id}", response_model=APIResponse)
async def get_project_detail(project_id: int):
    """获取项目详情"""
    try:
        # 模拟项目详情数据
        project_detail = {
            "id": project_id,
            "name": "主要产品",
            "description": "公司核心产品的Web和移动端应用开发，包括用户界面优化、后端API开发、数据库设计等",
            "status": "active",
            "priority": "high",
            "start_date": "2023-01-01",
            "end_date": "2024-12-31",
            "progress": 65,
            "budget": 5000000,
            "spent": 3250000,
            "remaining_budget": 1750000,
            "team_count": 3,
            "member_count": 18,
            "technologies": [
                {"name": "React", "usage": 90, "proficiency": 85},
                {"name": "Python", "usage": 95, "proficiency": 88},
                {"name": "PostgreSQL", "usage": 80, "proficiency": 82},
                {"name": "Redis", "usage": 70, "proficiency": 75}
            ],
            "performance_metrics": {
                "overall_score": 82.5,
                "velocity": {
                    "current": 42,
                    "target": 45,
                    "trend": "up",
                    "change_rate": 8.5
                },
                "quality": {
                    "current": 85,
                    "target": 90,
                    "trend": "stable",
                    "change_rate": 2.1
                },
                "delivery": {
                    "on_time_rate": 88,
                    "early_delivery_rate": 12,
                    "delayed_delivery_rate": 0
                },
                "budget": {
                    "utilization_rate": 65,
                    "burn_rate": 270833,  # 每月
                    "projected_completion": "2024-11-15"
                }
            },
            "milestones": [
                {
                    "id": 1,
                    "name": "MVP发布",
                    "description": "最小可行产品版本发布",
                    "due_date": "2023-06-30",
                    "status": "completed",
                    "completion_date": "2023-06-28",
                    "progress": 100
                },
                {
                    "id": 2,
                    "name": "Beta版本",
                    "description": "功能完整的Beta测试版本",
                    "due_date": "2023-12-31",
                    "status": "completed",
                    "completion_date": "2023-12-20",
                    "progress": 100
                },
                {
                    "id": 3,
                    "name": "正式发布",
                    "description": "产品正式版本发布",
                    "due_date": "2024-06-30",
                    "status": "in_progress",
                    "completion_date": None,
                    "progress": 75
                },
                {
                    "id": 4,
                    "name": "功能增强",
                    "description": "高级功能和性能优化",
                    "due_date": "2024-12-31",
                    "status": "planned",
                    "completion_date": None,
                    "progress": 0
                }
            ],
            "teams": [
                {
                    "id": 1,
                    "name": "前端团队",
                    "role": "UI/UX开发",
                    "member_count": 8,
                    "allocation": 80,
                    "performance": 85.2,
                    "contribution": 35
                },
                {
                    "id": 2,
                    "name": "后端团队",
                    "role": "API和服务开发",
                    "member_count": 10,
                    "allocation": 70,
                    "performance": 78.9,
                    "contribution": 45
                },
                {
                    "id": 5,
                    "name": "QA团队",
                    "role": "质量保证和测试",
                    "member_count": 5,
                    "allocation": 60,
                    "performance": 81.3,
                    "contribution": 20
                }
            ],
            "risks": [
                {
                    "id": 1,
                    "title": "第三方API依赖",
                    "description": "关键第三方服务可能影响项目进度",
                    "probability": "medium",
                    "impact": "high",
                    "status": "active",
                    "mitigation": "准备备用方案和本地缓存"
                },
                {
                    "id": 2,
                    "title": "人员流失风险",
                    "description": "关键开发人员可能离职",
                    "probability": "low",
                    "impact": "medium",
                    "status": "monitoring",
                    "mitigation": "知识文档化和交叉培训"
                }
            ],
            "recent_activities": [
                {
                    "date": "2024-01-10",
                    "type": "milestone",
                    "description": "完成用户认证模块开发",
                    "team": "后端团队"
                },
                {
                    "date": "2024-01-09",
                    "type": "deployment",
                    "description": "部署测试环境v2.1.0",
                    "team": "DevOps团队"
                },
                {
                    "date": "2024-01-08",
                    "type": "review",
                    "description": "UI设计评审会议",
                    "team": "前端团队"
                }
            ],
            "health_indicators": {
                "schedule_health": "good",
                "budget_health": "good",
                "quality_health": "good",
                "team_health": "excellent",
                "risk_level": "low"
            },
            "created_at": "2023-01-01T09:00:00Z",
            "updated_at": "2024-01-10T16:30:00Z"
        }
        
        return APIResponse(
            success=True,
            message="项目详情获取成功",
            data=project_detail
        )
        
    except Exception as e:
        logger.error(f"获取项目详情失败: {e}")
        raise HTTPException(status_code=500, detail="获取项目详情失败")


@router.post("/", response_model=APIResponse)
async def create_project(project_data: ProjectCreate):
    """创建新项目"""
    try:
        # 模拟创建项目
        new_project = {
            "id": 6,
            "name": project_data.name,
            "description": project_data.description,
            "status": "planning",
            "priority": project_data.priority,
            "start_date": project_data.start_date,
            "end_date": project_data.end_date,
            "budget": project_data.budget,
            "progress": 0,
            "spent": 0,
            "team_count": 0,
            "member_count": 0,
            "performance_score": 0,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        return APIResponse(
            success=True,
            message="项目创建成功",
            data=new_project
        )
        
    except Exception as e:
        logger.error(f"创建项目失败: {e}")
        raise HTTPException(status_code=500, detail="创建项目失败")


@router.put("/{project_id}", response_model=APIResponse)
async def update_project(project_id: int, project_data: ProjectUpdate):
    """更新项目信息"""
    try:
        # 模拟更新项目
        updated_project = {
            "id": project_id,
            "name": project_data.name,
            "description": project_data.description,
            "status": project_data.status,
            "priority": project_data.priority,
            "start_date": project_data.start_date,
            "end_date": project_data.end_date,
            "budget": project_data.budget,
            "updated_at": datetime.now().isoformat()
        }
        
        return APIResponse(
            success=True,
            message="项目信息更新成功",
            data=updated_project
        )
        
    except Exception as e:
        logger.error(f"更新项目信息失败: {e}")
        raise HTTPException(status_code=500, detail="更新项目信息失败")


@router.delete("/{project_id}", response_model=APIResponse)
async def delete_project(project_id: int):
    """删除项目"""
    try:
        # 模拟删除项目
        return APIResponse(
            success=True,
            message="项目删除成功",
            data={"deleted_project_id": project_id}
        )
        
    except Exception as e:
        logger.error(f"删除项目失败: {e}")
        raise HTTPException(status_code=500, detail="删除项目失败")


@router.get("/{project_id}/metrics", response_model=APIResponse)
async def get_project_metrics(
    project_id: int,
    period: str = "30d",
    data_collector: DataCollector = Depends(get_data_collector)
):
    """获取项目效能指标"""
    try:
        # 模拟项目指标数据
        metrics_data = {
            "project_id": project_id,
            "period": period,
            "dora_metrics": {
                "deployment_frequency": {
                    "value": 1.1,
                    "trend": "up",
                    "change_rate": 15.8,
                    "benchmark": "medium"
                },
                "lead_time": {
                    "value": 2.8,
                    "trend": "down",
                    "change_rate": -12.5,
                    "benchmark": "medium"
                },
                "change_failure_rate": {
                    "value": 9.2,
                    "trend": "down",
                    "change_rate": -25.8,
                    "benchmark": "good"
                },
                "recovery_time": {
                    "value": 2.1,
                    "trend": "stable",
                    "change_rate": 2.4,
                    "benchmark": "medium"
                }
            },
            "flow_metrics": {
                "flow_efficiency": {
                    "value": 29.5,
                    "trend": "up",
                    "change_rate": 18.2
                },
                "cycle_time": {
                    "value": 8.5,
                    "trend": "down",
                    "change_rate": -15.0
                },
                "throughput": {
                    "value": 13.2,
                    "trend": "up",
                    "change_rate": 22.3
                },
                "work_in_progress": {
                    "value": 16,
                    "trend": "stable",
                    "change_rate": -6.3
                }
            },
            "quality_metrics": {
                "defect_density": {
                    "value": 0.9,
                    "trend": "down",
                    "change_rate": -35.7
                },
                "test_coverage": {
                    "value": 82,
                    "trend": "up",
                    "change_rate": 8.9
                },
                "code_review_coverage": {
                    "value": 95,
                    "trend": "stable",
                    "change_rate": 2.2
                },
                "technical_debt_ratio": {
                    "value": 14.2,
                    "trend": "down",
                    "change_rate": -18.4
                }
            },
            "productivity_metrics": {
                "velocity": {
                    "value": 42,
                    "trend": "up",
                    "change_rate": 10.5
                },
                "story_completion_rate": {
                    "value": 88,
                    "trend": "stable",
                    "change_rate": 3.5
                },
                "sprint_goal_achievement": {
                    "value": 85,
                    "trend": "up",
                    "change_rate": 12.1
                }
            },
            "time_series": {
                "deployment_frequency": [
                    {"date": "2024-01-01", "value": 0.9},
                    {"date": "2024-01-08", "value": 1.0},
                    {"date": "2024-01-15", "value": 1.1},
                    {"date": "2024-01-22", "value": 1.2},
                    {"date": "2024-01-29", "value": 1.1}
                ],
                "velocity": [
                    {"date": "Sprint 1", "value": 38},
                    {"date": "Sprint 2", "value": 40},
                    {"date": "Sprint 3", "value": 42},
                    {"date": "Sprint 4", "value": 44},
                    {"date": "Sprint 5", "value": 42}
                ],
                "quality_score": [
                    {"date": "2024-01-01", "value": 80},
                    {"date": "2024-01-08", "value": 82},
                    {"date": "2024-01-15", "value": 85},
                    {"date": "2024-01-22", "value": 87},
                    {"date": "2024-01-29", "value": 85}
                ]
            },
            "insights": [
                "部署频率稳步提升，CI/CD优化见效",
                "代码质量持续改善，技术债务减少",
                "团队速度保持稳定，交付能力强",
                "测试覆盖率有所提升，质量保障加强"
            ]
        }
        
        return APIResponse(
            success=True,
            message="项目效能指标获取成功",
            data=metrics_data
        )
        
    except Exception as e:
        logger.error(f"获取项目效能指标失败: {e}")
        raise HTTPException(status_code=500, detail="获取项目效能指标失败")


@router.get("/{project_id}/timeline", response_model=APIResponse)
async def get_project_timeline(project_id: int):
    """获取项目时间线"""
    try:
        # 模拟项目时间线数据
        timeline_data = {
            "project_id": project_id,
            "events": [
                {
                    "id": 1,
                    "date": "2023-01-01",
                    "type": "milestone",
                    "title": "项目启动",
                    "description": "项目正式启动，团队组建完成",
                    "status": "completed",
                    "participants": ["项目经理", "技术负责人"]
                },
                {
                    "id": 2,
                    "date": "2023-01-15",
                    "type": "development",
                    "title": "需求分析完成",
                    "description": "完成详细需求分析和技术方案设计",
                    "status": "completed",
                    "participants": ["产品经理", "架构师"]
                },
                {
                    "id": 3,
                    "date": "2023-02-01",
                    "type": "development",
                    "title": "开发环境搭建",
                    "description": "完成开发、测试、生产环境搭建",
                    "status": "completed",
                    "participants": ["DevOps团队"]
                },
                {
                    "id": 4,
                    "date": "2023-06-28",
                    "type": "milestone",
                    "title": "MVP发布",
                    "description": "最小可行产品版本成功发布",
                    "status": "completed",
                    "participants": ["全体团队"]
                },
                {
                    "id": 5,
                    "date": "2023-12-20",
                    "type": "milestone",
                    "title": "Beta版本发布",
                    "description": "功能完整的Beta测试版本发布",
                    "status": "completed",
                    "participants": ["全体团队"]
                },
                {
                    "id": 6,
                    "date": "2024-01-10",
                    "type": "development",
                    "title": "用户认证模块",
                    "description": "完成用户认证和权限管理模块",
                    "status": "completed",
                    "participants": ["后端团队"]
                },
                {
                    "id": 7,
                    "date": "2024-02-15",
                    "type": "development",
                    "title": "支付系统集成",
                    "description": "集成第三方支付系统",
                    "status": "in_progress",
                    "participants": ["后端团队", "前端团队"]
                },
                {
                    "id": 8,
                    "date": "2024-06-30",
                    "type": "milestone",
                    "title": "正式版本发布",
                    "description": "产品正式版本发布上线",
                    "status": "planned",
                    "participants": ["全体团队"]
                },
                {
                    "id": 9,
                    "date": "2024-12-31",
                    "type": "milestone",
                    "title": "项目完成",
                    "description": "项目所有功能开发完成",
                    "status": "planned",
                    "participants": ["全体团队"]
                }
            ],
            "phases": [
                {
                    "name": "需求分析",
                    "start_date": "2023-01-01",
                    "end_date": "2023-01-31",
                    "status": "completed",
                    "progress": 100
                },
                {
                    "name": "MVP开发",
                    "start_date": "2023-02-01",
                    "end_date": "2023-06-30",
                    "status": "completed",
                    "progress": 100
                },
                {
                    "name": "Beta开发",
                    "start_date": "2023-07-01",
                    "end_date": "2023-12-31",
                    "status": "completed",
                    "progress": 100
                },
                {
                    "name": "正式版开发",
                    "start_date": "2024-01-01",
                    "end_date": "2024-06-30",
                    "status": "in_progress",
                    "progress": 75
                },
                {
                    "name": "功能增强",
                    "start_date": "2024-07-01",
                    "end_date": "2024-12-31",
                    "status": "planned",
                    "progress": 0
                }
            ],
            "critical_path": [
                "需求分析",
                "核心功能开发",
                "集成测试",
                "性能优化",
                "上线部署"
            ]
        }
        
        return APIResponse(
            success=True,
            message="项目时间线获取成功",
            data=timeline_data
        )
        
    except Exception as e:
        logger.error(f"获取项目时间线失败: {e}")
        raise HTTPException(status_code=500, detail="获取项目时间线失败")


@router.get("/comparison", response_model=APIResponse)
async def get_projects_comparison(
    project_ids: str,  # 逗号分隔的项目ID
    metric: str = "overall"
):
    """获取项目对比分析"""
    try:
        # 解析项目ID
        project_id_list = [int(id.strip()) for id in project_ids.split(",")]
        
        # 模拟项目对比数据
        comparison_data = {
            "projects": [
                {
                    "id": 1,
                    "name": "主要产品",
                    "status": "active",
                    "progress": 65,
                    "performance_score": 82.5,
                    "budget_utilization": 65,
                    "on_time_delivery": 88,
                    "quality_score": 85,
                    "team_satisfaction": 82
                },
                {
                    "id": 2,
                    "name": "移动应用",
                    "status": "active",
                    "progress": 45,
                    "performance_score": 75.8,
                    "budget_utilization": 45,
                    "on_time_delivery": 72,
                    "quality_score": 78,
                    "team_satisfaction": 75
                },
                {
                    "id": 3,
                    "name": "数据平台",
                    "status": "active",
                    "progress": 30,
                    "performance_score": 78.2,
                    "budget_utilization": 30,
                    "on_time_delivery": 85,
                    "quality_score": 88,
                    "team_satisfaction": 80
                }
            ],
            "insights": [
                "主要产品项目整体表现最佳，进度和质量都很好",
                "移动应用项目需要关注进度和交付时间",
                "数据平台项目质量很高，但进度相对较慢",
                "所有项目的团队满意度都在可接受范围内"
            ],
            "recommendations": [
                "为移动应用项目增加资源投入",
                "优化数据平台项目的开发流程",
                "在项目间分享最佳实践",
                "建立项目间的协作机制"
            ],
            "benchmark": {
                "industry_avg_performance": 75.0,
                "industry_avg_delivery": 80.0,
                "industry_avg_quality": 82.0
            }
        }
        
        return APIResponse(
            success=True,
            message="项目对比分析获取成功",
            data=comparison_data
        )
        
    except Exception as e:
        logger.error(f"获取项目对比分析失败: {e}")
        raise HTTPException(status_code=500, detail="获取项目对比分析失败")