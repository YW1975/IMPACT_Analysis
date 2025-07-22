from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional, Dict, Any

from app.core.database import Base


class User(Base):
    """用户模型"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=True)
    role = Column(String(20), default="developer")  # developer, team_lead, project_manager, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关联关系
    team_memberships = relationship("TeamMember", back_populates="user")
    insights = relationship("Insight", back_populates="created_by_user")


class Team(Base):
    """团队模型"""
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    lead_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关联关系
    members = relationship("TeamMember", back_populates="team")
    projects = relationship("Project", back_populates="team")
    metrics = relationship("TeamMetric", back_populates="team")


class TeamMember(Base):
    """团队成员模型"""
    __tablename__ = "team_members"
    
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(50), default="member")  # member, lead, admin
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关联关系
    team = relationship("Team", back_populates="members")
    user = relationship("User", back_populates="team_memberships")


class Project(Base):
    """项目模型"""
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    repository_url = Column(String(255), nullable=True)
    status = Column(String(20), default="active")  # active, completed, archived
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关联关系
    team = relationship("Team", back_populates="projects")
    metrics = relationship("ProjectMetric", back_populates="project")


class DoraMetric(Base):
    """DORA指标模型"""
    __tablename__ = "dora_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    
    # DORA四大指标
    deployment_frequency = Column(Float, nullable=True)  # 部署频率
    lead_time_for_changes = Column(Float, nullable=True)  # 变更前置时间(小时)
    change_failure_rate = Column(Float, nullable=True)  # 变更失败率(%)
    time_to_restore_service = Column(Float, nullable=True)  # 平均恢复时间(小时)
    
    # 时间戳
    measured_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class FlowMetric(Base):
    """流动效率指标模型"""
    __tablename__ = "flow_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    
    # 流动效率指标
    flow_efficiency = Column(Float, nullable=True)  # 流动效率(%)
    work_in_progress = Column(Integer, nullable=True)  # 在制品数量
    cycle_time = Column(Float, nullable=True)  # 周期时间(天)
    throughput = Column(Float, nullable=True)  # 吞吐量(个/周)
    
    # 时间戳
    measured_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class TeamMetric(Base):
    """团队效能指标模型"""
    __tablename__ = "team_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    
    # 团队效能指标
    overall_score = Column(Float, nullable=True)  # 综合评分
    efficiency = Column(Float, nullable=True)  # 效能
    velocity = Column(Float, nullable=True)  # 速度
    satisfaction = Column(Float, nullable=True)  # 满意度
    collaboration = Column(Float, nullable=True)  # 协作
    
    # 时间戳
    measured_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关联关系
    team = relationship("Team", back_populates="metrics")


class ProjectMetric(Base):
    """项目指标模型"""
    __tablename__ = "project_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    
    # 项目指标
    health_score = Column(Float, nullable=True)  # 健康度评分
    progress = Column(Float, nullable=True)  # 进度(%)
    risk_level = Column(String(20), nullable=True)  # 风险等级
    resource_utilization = Column(Float, nullable=True)  # 资源利用率(%)
    
    # 时间戳
    measured_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关联关系
    project = relationship("Project", back_populates="metrics")


class Insight(Base):
    """AI洞察模型"""
    __tablename__ = "insights"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)  # performance, quality, risk, opportunity
    severity = Column(String(20), nullable=False)  # low, medium, high, critical
    confidence = Column(Float, nullable=False)  # 置信度 0-1
    status = Column(String(20), default="new")  # new, acknowledged, resolved
    
    # 相关信息
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    metrics = Column(JSON, nullable=True)  # 相关指标数据
    recommendations = Column(JSON, nullable=True)  # 建议行动
    
    # 创建信息
    created_by = Column(String(20), default="ai")  # ai, user
    created_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关联关系
    created_by_user = relationship("User", back_populates="insights")


class Recommendation(Base):
    """改进建议模型"""
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)  # process, tool, practice, training
    priority = Column(String(20), nullable=False)  # low, medium, high, urgent
    effort = Column(String(20), nullable=False)  # low, medium, high
    impact = Column(String(20), nullable=False)  # low, medium, high
    
    # 实施信息
    status = Column(String(20), default="pending")  # pending, in_progress, completed, rejected
    progress = Column(Float, default=0.0)  # 实施进度 0-100
    estimated_duration = Column(Integer, nullable=True)  # 预计实施时间(天)
    
    # 相关信息
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    insight_id = Column(Integer, ForeignKey("insights.id"), nullable=True)
    
    # 创建信息
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Prediction(Base):
    """预测分析模型"""
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String(100), nullable=False)  # 预测的指标名称
    metric_type = Column(String(50), nullable=False)  # dora, flow, team, project
    current_value = Column(Float, nullable=False)  # 当前值
    predicted_value = Column(Float, nullable=False)  # 预测值
    confidence = Column(Float, nullable=False)  # 置信度 0-1
    
    # 预测信息
    prediction_horizon = Column(Integer, nullable=False)  # 预测时间范围(天)
    trend = Column(String(20), nullable=False)  # up, down, stable
    change_rate = Column(Float, nullable=True)  # 变化率(%)
    
    # 影响因素
    factors = Column(JSON, nullable=True)  # 影响因素列表
    time_series_data = Column(JSON, nullable=True)  # 时间序列数据
    
    # 相关信息
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    
    # 创建信息
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    valid_until = Column(DateTime(timezone=True), nullable=False)  # 预测有效期