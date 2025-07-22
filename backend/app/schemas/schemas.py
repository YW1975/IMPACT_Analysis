from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum


# 枚举类型定义
class UserRole(str, Enum):
    DEVELOPER = "developer"
    TEAM_LEAD = "team_lead"
    PROJECT_MANAGER = "project_manager"
    ADMIN = "admin"


class InsightType(str, Enum):
    PERFORMANCE = "performance"
    QUALITY = "quality"
    RISK = "risk"
    OPPORTUNITY = "opportunity"


class SeverityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class PriorityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class TrendDirection(str, Enum):
    UP = "up"
    DOWN = "down"
    STABLE = "stable"


# 基础模式
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True


# 用户相关模式
class UserBase(BaseSchema):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole = UserRole.DEVELOPER


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseSchema):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None


# 团队相关模式
class TeamBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    lead_id: Optional[int] = None


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    lead_id: Optional[int] = None
    is_active: Optional[bool] = None


class Team(TeamBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None


# 团队成员相关模式
class TeamMemberBase(BaseSchema):
    user_id: int
    team_id: int
    role: Optional[str] = "member"
    joined_at: Optional[datetime] = None
    is_active: bool = True


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(BaseSchema):
    role: Optional[str] = None
    is_active: Optional[bool] = None


class TeamMember(TeamMemberBase):
    id: int
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


# 项目相关模式
class ProjectBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    team_id: int
    repository_url: Optional[str] = None
    status: str = "active"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    repository_url: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class Project(ProjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


# DORA指标模式
class DoraMetricBase(BaseSchema):
    team_id: Optional[int] = None
    project_id: Optional[int] = None
    deployment_frequency: Optional[float] = None
    lead_time_for_changes: Optional[float] = None
    change_failure_rate: Optional[float] = None
    time_to_restore_service: Optional[float] = None


class DoraMetricCreate(DoraMetricBase):
    pass


class DoraMetric(DoraMetricBase):
    id: int
    measured_at: datetime
    created_at: datetime


# 流动效率指标模式
class FlowMetricBase(BaseSchema):
    team_id: Optional[int] = None
    project_id: Optional[int] = None
    flow_efficiency: Optional[float] = None
    work_in_progress: Optional[int] = None
    cycle_time: Optional[float] = None
    throughput: Optional[float] = None


class FlowMetricCreate(FlowMetricBase):
    pass


class FlowMetric(FlowMetricBase):
    id: int
    measured_at: datetime
    created_at: datetime


# 团队效能指标模式
class TeamMetricBase(BaseSchema):
    team_id: int
    overall_score: Optional[float] = None
    efficiency: Optional[float] = None
    velocity: Optional[float] = None
    satisfaction: Optional[float] = None
    collaboration: Optional[float] = None


class TeamMetricCreate(TeamMetricBase):
    pass


class TeamMetric(TeamMetricBase):
    id: int
    measured_at: datetime
    created_at: datetime


# AI洞察模式
class InsightBase(BaseSchema):
    title: str = Field(..., min_length=1, max_length=200)
    description: str
    type: InsightType
    severity: SeverityLevel
    confidence: float = Field(..., ge=0.0, le=1.0)
    team_id: Optional[int] = None
    project_id: Optional[int] = None
    metrics: Optional[Dict[str, Any]] = None
    recommendations: Optional[List[str]] = None


class InsightCreate(InsightBase):
    pass


class InsightUpdate(BaseSchema):
    status: Optional[str] = None
    recommendations: Optional[List[str]] = None


class Insight(InsightBase):
    id: int
    status: str
    created_by: str
    created_by_user_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


# 改进建议模式
class RecommendationBase(BaseSchema):
    title: str = Field(..., min_length=1, max_length=200)
    description: str
    type: str
    priority: PriorityLevel
    effort: str
    impact: str
    team_id: Optional[int] = None
    project_id: Optional[int] = None
    insight_id: Optional[int] = None
    estimated_duration: Optional[int] = None


class RecommendationCreate(RecommendationBase):
    pass


class RecommendationUpdate(BaseSchema):
    status: Optional[str] = None
    progress: Optional[float] = None


class Recommendation(RecommendationBase):
    id: int
    status: str
    progress: float
    created_at: datetime
    updated_at: Optional[datetime] = None


# 预测分析模式
class PredictionBase(BaseSchema):
    metric_name: str
    metric_type: str
    current_value: float
    predicted_value: float
    confidence: float = Field(..., ge=0.0, le=1.0)
    prediction_horizon: int
    trend: TrendDirection
    change_rate: Optional[float] = None
    factors: Optional[List[str]] = None
    time_series_data: Optional[List[Dict[str, Any]]] = None
    team_id: Optional[int] = None
    project_id: Optional[int] = None


class PredictionCreate(PredictionBase):
    valid_until: datetime


class Prediction(PredictionBase):
    id: int
    created_at: datetime
    valid_until: datetime


# AI聊天模式
class ChatMessage(BaseSchema):
    message: str = Field(..., min_length=1)
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseSchema):
    response: str
    confidence: float
    suggestions: Optional[List[str]] = None
    timestamp: datetime


class AIChatRequest(BaseSchema):
    message: str = Field(..., min_length=1)
    context: Optional[Dict[str, Any]] = None
    user_id: Optional[int] = None


class AIChatResponse(BaseSchema):
    message: str
    suggestions: Optional[List[str]] = None
    data_insights: Optional[Dict[str, Any]] = None
    follow_up_questions: Optional[List[str]] = None
    timestamp: str


# 仪表盘数据模式
class DashboardData(BaseSchema):
    dora_metrics: DoraMetric
    flow_metrics: FlowMetric
    team_rankings: List[Dict[str, Any]]
    recent_activities: List[Dict[str, Any]]
    alerts: List[Dict[str, Any]]


# API响应模式
class APIResponse(BaseSchema):
    success: bool = True
    message: str = "操作成功"
    data: Optional[Any] = None
    timestamp: datetime = Field(default_factory=datetime.now)


class ErrorResponse(BaseSchema):
    success: bool = False
    message: str
    error_code: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.now)


# 分页模式
class PaginationParams(BaseSchema):
    page: int = Field(1, ge=1)
    size: int = Field(20, ge=1, le=100)


class PaginatedResponse(BaseSchema):
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int