from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from loguru import logger

from app.schemas.schemas import (
    APIResponse, Team, TeamCreate, TeamUpdate,
    TeamMember, TeamMemberCreate, TeamMemberUpdate,
    PaginatedResponse
)
from app.services.data_collector import DataCollector

router = APIRouter()

# 依赖注入
def get_data_collector() -> DataCollector:
    return DataCollector()


@router.get("/", response_model=APIResponse)
async def get_teams(
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    status: Optional[str] = None
):
    """获取团队列表"""
    try:
        # 模拟团队数据
        teams = [
            {
                "id": 1,
                "name": "前端团队",
                "description": "负责Web前端和移动端UI开发",
                "status": "active",
                "team_lead_id": 1,
                "team_lead_name": "张三",
                "member_count": 8,
                "projects": ["主要产品", "移动应用"],
                "technologies": ["React", "Vue.js", "TypeScript", "Tailwind CSS"],
                "performance_score": 85.2,
                "productivity_trend": "up",
                "created_at": "2023-01-15T10:00:00Z",
                "updated_at": "2024-01-10T15:30:00Z",
                "metrics": {
                    "velocity": 45,
                    "quality_score": 88,
                    "satisfaction": 82,
                    "collaboration": 90
                }
            },
            {
                "id": 2,
                "name": "后端团队",
                "description": "负责服务端API开发和系统架构",
                "status": "active",
                "team_lead_id": 2,
                "team_lead_name": "李四",
                "member_count": 10,
                "projects": ["主要产品", "数据平台"],
                "technologies": ["Python", "FastAPI", "PostgreSQL", "Redis"],
                "performance_score": 78.9,
                "productivity_trend": "stable",
                "created_at": "2023-01-15T10:00:00Z",
                "updated_at": "2024-01-08T09:15:00Z",
                "metrics": {
                    "velocity": 38,
                    "quality_score": 92,
                    "satisfaction": 75,
                    "collaboration": 85
                }
            },
            {
                "id": 3,
                "name": "移动端团队",
                "description": "负责iOS和Android原生应用开发",
                "status": "active",
                "team_lead_id": 3,
                "team_lead_name": "王五",
                "member_count": 6,
                "projects": ["移动应用"],
                "technologies": ["Swift", "Kotlin", "React Native", "Flutter"],
                "performance_score": 72.5,
                "productivity_trend": "down",
                "created_at": "2023-03-01T14:00:00Z",
                "updated_at": "2024-01-05T11:45:00Z",
                "metrics": {
                    "velocity": 32,
                    "quality_score": 78,
                    "satisfaction": 68,
                    "collaboration": 75
                }
            },
            {
                "id": 4,
                "name": "DevOps团队",
                "description": "负责基础设施和CI/CD流水线",
                "status": "active",
                "team_lead_id": 4,
                "team_lead_name": "赵六",
                "member_count": 4,
                "projects": ["基础设施", "监控系统"],
                "technologies": ["Docker", "Kubernetes", "Jenkins", "Terraform"],
                "performance_score": 88.7,
                "productivity_trend": "up",
                "created_at": "2023-02-01T09:00:00Z",
                "updated_at": "2024-01-12T16:20:00Z",
                "metrics": {
                    "velocity": 28,
                    "quality_score": 95,
                    "satisfaction": 85,
                    "collaboration": 88
                }
            },
            {
                "id": 5,
                "name": "QA团队",
                "description": "负责质量保证和自动化测试",
                "status": "active",
                "team_lead_id": 5,
                "team_lead_name": "孙七",
                "member_count": 5,
                "projects": ["测试框架", "质量监控"],
                "technologies": ["Selenium", "Jest", "Cypress", "JMeter"],
                "performance_score": 81.3,
                "productivity_trend": "up",
                "created_at": "2023-01-20T13:00:00Z",
                "updated_at": "2024-01-09T14:10:00Z",
                "metrics": {
                    "velocity": 35,
                    "quality_score": 90,
                    "satisfaction": 78,
                    "collaboration": 82
                }
            }
        ]
        
        # 搜索过滤
        if search:
            teams = [t for t in teams if search.lower() in t["name"].lower() or search.lower() in t["description"].lower()]
        
        # 状态过滤
        if status:
            teams = [t for t in teams if t["status"] == status]
        
        # 分页
        total = len(teams)
        teams = teams[skip:skip + limit]
        
        return APIResponse(
            success=True,
            message="团队列表获取成功",
            data={
                "teams": teams,
                "total": total,
                "skip": skip,
                "limit": limit,
                "summary": {
                    "total_teams": total,
                    "active_teams": len([t for t in teams if t["status"] == "active"]),
                    "total_members": sum(t["member_count"] for t in teams),
                    "avg_performance": sum(t["performance_score"] for t in teams) / len(teams) if teams else 0
                }
            }
        )
        
    except Exception as e:
        logger.error(f"获取团队列表失败: {e}")
        raise HTTPException(status_code=500, detail="获取团队列表失败")


@router.get("/{team_id}", response_model=APIResponse)
async def get_team_detail(team_id: int):
    """获取团队详情"""
    try:
        # 模拟团队详情数据
        team_detail = {
            "id": team_id,
            "name": "前端团队",
            "description": "负责Web前端和移动端UI开发，致力于提供优秀的用户体验",
            "status": "active",
            "team_lead_id": 1,
            "team_lead_name": "张三",
            "team_lead_email": "zhangsan@company.com",
            "member_count": 8,
            "projects": [
                {"id": 1, "name": "主要产品", "role": "前端开发"},
                {"id": 2, "name": "移动应用", "role": "UI开发"}
            ],
            "technologies": [
                {"name": "React", "proficiency": 90, "usage": 95},
                {"name": "Vue.js", "proficiency": 75, "usage": 60},
                {"name": "TypeScript", "proficiency": 85, "usage": 90},
                {"name": "Tailwind CSS", "proficiency": 80, "usage": 85}
            ],
            "performance_metrics": {
                "current_sprint": {
                    "velocity": 45,
                    "burndown_health": 85,
                    "story_completion_rate": 92,
                    "quality_score": 88
                },
                "trends": {
                    "velocity_trend": "up",
                    "quality_trend": "stable",
                    "satisfaction_trend": "up",
                    "productivity_trend": "up"
                },
                "historical_data": {
                    "velocity": [
                        {"sprint": "Sprint 1", "value": 38},
                        {"sprint": "Sprint 2", "value": 42},
                        {"sprint": "Sprint 3", "value": 45},
                        {"sprint": "Sprint 4", "value": 47},
                        {"sprint": "Sprint 5", "value": 45}
                    ],
                    "quality": [
                        {"sprint": "Sprint 1", "value": 82},
                        {"sprint": "Sprint 2", "value": 85},
                        {"sprint": "Sprint 3", "value": 88},
                        {"sprint": "Sprint 4", "value": 90},
                        {"sprint": "Sprint 5", "value": 88}
                    ]
                }
            },
            "team_health": {
                "overall_score": 85.2,
                "dimensions": {
                    "productivity": 88,
                    "quality": 85,
                    "collaboration": 90,
                    "satisfaction": 82,
                    "learning": 78,
                    "delivery": 87
                },
                "strengths": [
                    "团队协作良好",
                    "技术能力强",
                    "交付质量高",
                    "响应速度快"
                ],
                "improvement_areas": [
                    "知识分享可以更频繁",
                    "新技术学习需要加强",
                    "文档质量有待提升"
                ]
            },
            "workload_analysis": {
                "capacity_utilization": 85,
                "work_distribution": {
                    "development": 60,
                    "testing": 20,
                    "meetings": 10,
                    "learning": 5,
                    "other": 5
                },
                "bottlenecks": [
                    "代码审查环节偶有延迟",
                    "设计评审需要更多时间"
                ]
            },
            "collaboration_metrics": {
                "internal_collaboration": 90,
                "cross_team_collaboration": 75,
                "communication_frequency": 85,
                "knowledge_sharing": 70,
                "conflict_resolution": 88
            },
            "created_at": "2023-01-15T10:00:00Z",
            "updated_at": "2024-01-10T15:30:00Z"
        }
        
        return APIResponse(
            success=True,
            message="团队详情获取成功",
            data=team_detail
        )
        
    except Exception as e:
        logger.error(f"获取团队详情失败: {e}")
        raise HTTPException(status_code=500, detail="获取团队详情失败")


@router.post("/", response_model=APIResponse)
async def create_team(team_data: TeamCreate):
    """创建新团队"""
    try:
        # 模拟创建团队
        new_team = {
            "id": 6,
            "name": team_data.name,
            "description": team_data.description,
            "status": "active",
            "team_lead_id": team_data.team_lead_id,
            "member_count": 0,
            "projects": [],
            "technologies": [],
            "performance_score": 0,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        return APIResponse(
            success=True,
            message="团队创建成功",
            data=new_team
        )
        
    except Exception as e:
        logger.error(f"创建团队失败: {e}")
        raise HTTPException(status_code=500, detail="创建团队失败")


@router.put("/{team_id}", response_model=APIResponse)
async def update_team(team_id: int, team_data: TeamUpdate):
    """更新团队信息"""
    try:
        # 模拟更新团队
        updated_team = {
            "id": team_id,
            "name": team_data.name,
            "description": team_data.description,
            "status": team_data.status,
            "team_lead_id": team_data.team_lead_id,
            "updated_at": datetime.now().isoformat()
        }
        
        return APIResponse(
            success=True,
            message="团队信息更新成功",
            data=updated_team
        )
        
    except Exception as e:
        logger.error(f"更新团队信息失败: {e}")
        raise HTTPException(status_code=500, detail="更新团队信息失败")


@router.delete("/{team_id}", response_model=APIResponse)
async def delete_team(team_id: int):
    """删除团队"""
    try:
        # 模拟删除团队
        return APIResponse(
            success=True,
            message="团队删除成功",
            data={"deleted_team_id": team_id}
        )
        
    except Exception as e:
        logger.error(f"删除团队失败: {e}")
        raise HTTPException(status_code=500, detail="删除团队失败")


@router.get("/{team_id}/members", response_model=APIResponse)
async def get_team_members(team_id: int):
    """获取团队成员列表"""
    try:
        # 模拟团队成员数据
        members = [
            {
                "id": 1,
                "user_id": 1,
                "name": "张三",
                "email": "zhangsan@company.com",
                "role": "Team Lead",
                "position": "高级前端工程师",
                "join_date": "2023-01-15",
                "status": "active",
                "skills": ["React", "TypeScript", "Node.js", "UI/UX"],
                "performance": {
                    "productivity": 92,
                    "quality": 88,
                    "collaboration": 95,
                    "growth": 85
                },
                "workload": {
                    "current_tasks": 5,
                    "capacity_utilization": 85,
                    "overtime_hours": 2
                },
                "recent_achievements": [
                    "完成新组件库设计",
                    "优化页面加载性能30%",
                    "指导2名新员工"
                ]
            },
            {
                "id": 2,
                "user_id": 2,
                "name": "李四",
                "email": "lisi@company.com",
                "role": "Senior Developer",
                "position": "前端工程师",
                "join_date": "2023-03-01",
                "status": "active",
                "skills": ["Vue.js", "JavaScript", "CSS", "Webpack"],
                "performance": {
                    "productivity": 85,
                    "quality": 90,
                    "collaboration": 82,
                    "growth": 88
                },
                "workload": {
                    "current_tasks": 4,
                    "capacity_utilization": 78,
                    "overtime_hours": 1
                },
                "recent_achievements": [
                    "重构遗留代码模块",
                    "提升测试覆盖率至90%",
                    "分享技术最佳实践"
                ]
            },
            {
                "id": 3,
                "user_id": 3,
                "name": "王五",
                "email": "wangwu@company.com",
                "role": "Developer",
                "position": "前端工程师",
                "join_date": "2023-06-15",
                "status": "active",
                "skills": ["React", "JavaScript", "HTML/CSS"],
                "performance": {
                    "productivity": 78,
                    "quality": 82,
                    "collaboration": 88,
                    "growth": 92
                },
                "workload": {
                    "current_tasks": 3,
                    "capacity_utilization": 70,
                    "overtime_hours": 0
                },
                "recent_achievements": [
                    "完成移动端适配",
                    "学习TypeScript",
                    "参与代码审查"
                ]
            }
        ]
        
        return APIResponse(
            success=True,
            message="团队成员列表获取成功",
            data={
                "members": members,
                "total": len(members),
                "summary": {
                    "active_members": len([m for m in members if m["status"] == "active"]),
                    "avg_productivity": sum(m["performance"]["productivity"] for m in members) / len(members),
                    "avg_utilization": sum(m["workload"]["capacity_utilization"] for m in members) / len(members),
                    "total_tasks": sum(m["workload"]["current_tasks"] for m in members)
                }
            }
        )
        
    except Exception as e:
        logger.error(f"获取团队成员列表失败: {e}")
        raise HTTPException(status_code=500, detail="获取团队成员列表失败")


@router.post("/{team_id}/members", response_model=APIResponse)
async def add_team_member(team_id: int, member_data: TeamMemberCreate):
    """添加团队成员"""
    try:
        # 模拟添加成员
        new_member = {
            "id": 4,
            "team_id": team_id,
            "user_id": member_data.user_id,
            "role": member_data.role,
            "join_date": datetime.now().date().isoformat(),
            "status": "active",
            "created_at": datetime.now().isoformat()
        }
        
        return APIResponse(
            success=True,
            message="团队成员添加成功",
            data=new_member
        )
        
    except Exception as e:
        logger.error(f"添加团队成员失败: {e}")
        raise HTTPException(status_code=500, detail="添加团队成员失败")


@router.put("/{team_id}/members/{member_id}", response_model=APIResponse)
async def update_team_member(team_id: int, member_id: int, member_data: TeamMemberUpdate):
    """更新团队成员信息"""
    try:
        # 模拟更新成员
        updated_member = {
            "id": member_id,
            "team_id": team_id,
            "role": member_data.role,
            "status": member_data.status,
            "updated_at": datetime.now().isoformat()
        }
        
        return APIResponse(
            success=True,
            message="团队成员信息更新成功",
            data=updated_member
        )
        
    except Exception as e:
        logger.error(f"更新团队成员信息失败: {e}")
        raise HTTPException(status_code=500, detail="更新团队成员信息失败")


@router.delete("/{team_id}/members/{member_id}", response_model=APIResponse)
async def remove_team_member(team_id: int, member_id: int):
    """移除团队成员"""
    try:
        # 模拟移除成员
        return APIResponse(
            success=True,
            message="团队成员移除成功",
            data={"removed_member_id": member_id, "team_id": team_id}
        )
        
    except Exception as e:
        logger.error(f"移除团队成员失败: {e}")
        raise HTTPException(status_code=500, detail="移除团队成员失败")


@router.get("/{team_id}/performance", response_model=APIResponse)
async def get_team_performance(
    team_id: int,
    period: str = "30d",
    data_collector: DataCollector = Depends(get_data_collector)
):
    """获取团队效能分析"""
    try:
        # 模拟团队效能数据
        performance_data = {
            "team_id": team_id,
            "period": period,
            "overall_score": 85.2,
            "metrics": {
                "velocity": {
                    "current": 45,
                    "target": 50,
                    "trend": "up",
                    "change_rate": 12.5
                },
                "quality": {
                    "current": 88,
                    "target": 90,
                    "trend": "stable",
                    "change_rate": 2.3
                },
                "satisfaction": {
                    "current": 82,
                    "target": 85,
                    "trend": "up",
                    "change_rate": 8.6
                },
                "collaboration": {
                    "current": 90,
                    "target": 88,
                    "trend": "up",
                    "change_rate": 5.9
                }
            },
            "dora_metrics": {
                "deployment_frequency": 1.2,
                "lead_time": 2.5,
                "change_failure_rate": 8.5,
                "recovery_time": 1.8
            },
            "flow_metrics": {
                "flow_efficiency": 32.1,
                "cycle_time": 7.2,
                "throughput": 14.5,
                "wip_limit_adherence": 85
            },
            "improvement_suggestions": [
                "增加自动化测试覆盖率",
                "优化代码审查流程",
                "加强跨团队协作",
                "提升技术文档质量"
            ],
            "time_series": {
                "velocity": [
                    {"date": "2024-01-01", "value": 40},
                    {"date": "2024-01-08", "value": 42},
                    {"date": "2024-01-15", "value": 45},
                    {"date": "2024-01-22", "value": 47},
                    {"date": "2024-01-29", "value": 45}
                ],
                "quality": [
                    {"date": "2024-01-01", "value": 85},
                    {"date": "2024-01-08", "value": 86},
                    {"date": "2024-01-15", "value": 88},
                    {"date": "2024-01-22", "value": 89},
                    {"date": "2024-01-29", "value": 88}
                ]
            }
        }
        
        return APIResponse(
            success=True,
            message="团队效能分析获取成功",
            data=performance_data
        )
        
    except Exception as e:
        logger.error(f"获取团队效能分析失败: {e}")
        raise HTTPException(status_code=500, detail="获取团队效能分析失败")


@router.get("/comparison", response_model=APIResponse)
async def get_teams_comparison(
    team_ids: str,  # 逗号分隔的团队ID
    metric: str = "overall"
):
    """获取团队对比分析"""
    try:
        # 解析团队ID
        team_id_list = [int(id.strip()) for id in team_ids.split(",")]
        
        # 模拟团队对比数据
        comparison_data = {
            "teams": [
                {
                    "id": 1,
                    "name": "前端团队",
                    "overall_score": 85.2,
                    "velocity": 45,
                    "quality": 88,
                    "satisfaction": 82,
                    "collaboration": 90,
                    "deployment_frequency": 1.2,
                    "lead_time": 2.5
                },
                {
                    "id": 2,
                    "name": "后端团队",
                    "overall_score": 78.9,
                    "velocity": 38,
                    "quality": 92,
                    "satisfaction": 75,
                    "collaboration": 85,
                    "deployment_frequency": 0.9,
                    "lead_time": 3.1
                },
                {
                    "id": 3,
                    "name": "移动端团队",
                    "overall_score": 72.5,
                    "velocity": 32,
                    "quality": 78,
                    "satisfaction": 68,
                    "collaboration": 75,
                    "deployment_frequency": 0.7,
                    "lead_time": 4.2
                }
            ],
            "insights": [
                "前端团队在协作和整体效能方面表现最佳",
                "后端团队代码质量最高，但部署频率有待提升",
                "移动端团队在各项指标上都有改进空间",
                "团队间可以加强知识分享和最佳实践交流"
            ],
            "recommendations": [
                "组织跨团队技术分享会",
                "建立团队间协作机制",
                "制定统一的质量标准",
                "实施团队效能提升计划"
            ]
        }
        
        return APIResponse(
            success=True,
            message="团队对比分析获取成功",
            data=comparison_data
        )
        
    except Exception as e:
        logger.error(f"获取团队对比分析失败: {e}")
        raise HTTPException(status_code=500, detail="获取团队对比分析失败")