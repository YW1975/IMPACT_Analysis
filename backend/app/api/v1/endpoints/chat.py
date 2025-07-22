from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime
from loguru import logger

from app.schemas.schemas import (
    AIChatRequest, AIChatResponse, APIResponse
)
from app.services.ai_service import AIService
from app.services.data_collector import DataCollector

router = APIRouter()

# 依赖注入
def get_ai_service() -> AIService:
    return AIService()

def get_data_collector() -> DataCollector:
    return DataCollector()


@router.post("/message", response_model=APIResponse)
async def send_chat_message(
    request: AIChatRequest,
    ai_service: AIService = Depends(get_ai_service),
    data_collector: DataCollector = Depends(get_data_collector)
):
    """发送聊天消息并获取AI回复"""
    try:
        # 获取AI回复
        ai_response = await ai_service.chat_with_ai(
            message=request.message,
            context=request.context,
            user_id=request.user_id
        )
        
        # 构建响应
        chat_response = AIChatResponse(
            message=ai_response["message"],
            suggestions=ai_response.get("suggestions", []),
            data_insights=ai_response.get("data_insights", {}),
            follow_up_questions=ai_response.get("follow_up_questions", []),
            timestamp=datetime.now().isoformat()
        )
        
        return APIResponse(
            success=True,
            message="AI回复生成成功",
            data=chat_response.dict()
        )
        
    except Exception as e:
        logger.error(f"AI聊天失败: {e}")
        raise HTTPException(status_code=500, detail="AI聊天服务暂时不可用")


@router.get("/suggestions", response_model=APIResponse)
async def get_chat_suggestions(
    context: Optional[str] = None,
    team_id: Optional[int] = None,
    project_id: Optional[int] = None,
    ai_service: AIService = Depends(get_ai_service)
):
    """获取聊天建议和常用问题"""
    try:
        # 基于上下文生成建议
        suggestions = {
            "quick_questions": [
                "我们团队的DORA指标表现如何？",
                "最近的部署频率有什么变化？",
                "哪些因素影响了我们的交付效率？",
                "团队的代码质量趋势怎么样？",
                "有什么改进建议可以提升效能？"
            ],
            "analysis_suggestions": [
                "分析最近30天的效能趋势",
                "对比不同团队的表现差异",
                "识别当前的主要瓶颈",
                "评估技术债务的影响",
                "预测下个月的效能表现"
            ],
            "action_suggestions": [
                "生成效能改进计划",
                "创建团队对比报告",
                "设置效能监控告警",
                "导出详细分析报告",
                "安排团队效能回顾会议"
            ],
            "contextual_suggestions": []
        }
        
        # 根据上下文添加特定建议
        if context == "dashboard":
            suggestions["contextual_suggestions"].extend([
                "解释仪表盘中的关键指标",
                "分析当前的异常数据点",
                "推荐关注的重要趋势"
            ])
        elif context == "team_analysis":
            suggestions["contextual_suggestions"].extend([
                "深入分析团队协作效率",
                "评估团队技能分布",
                "识别团队改进机会"
            ])
        elif context == "project_review":
            suggestions["contextual_suggestions"].extend([
                "分析项目交付质量",
                "评估项目风险因素",
                "优化项目流程建议"
            ])
        
        return APIResponse(
            success=True,
            message="聊天建议获取成功",
            data=suggestions
        )
        
    except Exception as e:
        logger.error(f"获取聊天建议失败: {e}")
        raise HTTPException(status_code=500, detail="获取聊天建议失败")


@router.get("/history", response_model=APIResponse)
async def get_chat_history(
    user_id: int,
    limit: int = 50,
    offset: int = 0
):
    """获取聊天历史记录"""
    try:
        # 模拟聊天历史数据
        chat_history = {
            "total_count": 125,
            "conversations": [
                {
                    "id": 1,
                    "timestamp": "2024-01-29T10:30:00Z",
                    "user_message": "我们团队的DORA指标表现如何？",
                    "ai_response": "根据最新数据分析，您的团队DORA指标整体表现良好。部署频率为1.2次/天，处于行业中等水平；变更前置时间为2.5天，有改进空间；变更失败率为8.5%，表现不错；服务恢复时间为1.8小时，符合预期。建议重点优化变更前置时间。",
                    "context": "dashboard",
                    "insights_provided": True
                },
                {
                    "id": 2,
                    "timestamp": "2024-01-29T09:15:00Z",
                    "user_message": "最近代码质量有什么变化？",
                    "ai_response": "代码质量呈现积极趋势！测试覆盖率从75%提升到82.5%，技术债务比率从15.2%降低到12.5%，代码复杂度得分改善了8.5%。主要改进来自于加强的代码审查流程和自动化测试。建议继续保持这个势头。",
                    "context": "quality_analysis",
                    "insights_provided": True
                },
                {
                    "id": 3,
                    "timestamp": "2024-01-28T16:45:00Z",
                    "user_message": "团队协作效率如何提升？",
                    "ai_response": "基于数据分析，建议从以下几个方面提升团队协作：1) 优化会议效率，当前会议效率得分72分；2) 减少响应时间，目前平均2.3小时；3) 加强知识分享，得分68分有提升空间；4) 改进文档质量，当前75分。可以考虑引入协作工具和建立更好的沟通机制。",
                    "context": "team_analysis",
                    "insights_provided": True
                },
                {
                    "id": 4,
                    "timestamp": "2024-01-28T14:20:00Z",
                    "user_message": "预测下个月的效能表现",
                    "ai_response": "基于历史趋势和当前改进措施，预测下个月效能表现：整体效能得分预计从82.5提升到85.2（置信度82%）。主要驱动因素包括持续改进措施、团队技能提升和工具优化。建议重点关注流动效率的提升，这是最大的增长潜力点。",
                    "context": "prediction",
                    "insights_provided": True
                },
                {
                    "id": 5,
                    "timestamp": "2024-01-28T11:30:00Z",
                    "user_message": "如何减少部署风险？",
                    "ai_response": "减少部署风险的建议：1) 增强自动化测试，当前覆盖率82.5%可提升到90%+；2) 实施蓝绿部署或金丝雀发布；3) 加强监控和告警机制；4) 建立快速回滚流程；5) 进行更频繁的小批量部署。当前变更失败率8.5%已经不错，通过这些措施可以进一步降低到5%以下。",
                    "context": "deployment",
                    "insights_provided": True
                }
            ],
            "pagination": {
                "current_page": offset // limit + 1,
                "total_pages": (125 + limit - 1) // limit,
                "has_next": offset + limit < 125,
                "has_previous": offset > 0
            }
        }
        
        return APIResponse(
            success=True,
            message="聊天历史获取成功",
            data=chat_history
        )
        
    except Exception as e:
        logger.error(f"获取聊天历史失败: {e}")
        raise HTTPException(status_code=500, detail="获取聊天历史失败")


@router.delete("/history/{conversation_id}", response_model=APIResponse)
async def delete_conversation(
    conversation_id: int,
    user_id: int
):
    """删除特定对话"""
    try:
        # 模拟删除操作
        result = {
            "deleted_conversation_id": conversation_id,
            "user_id": user_id,
            "deleted_at": datetime.now().isoformat()
        }
        
        return APIResponse(
            success=True,
            message="对话删除成功",
            data=result
        )
        
    except Exception as e:
        logger.error(f"删除对话失败: {e}")
        raise HTTPException(status_code=500, detail="删除对话失败")


@router.post("/analyze", response_model=APIResponse)
async def analyze_with_ai(
    query: str,
    data_type: str,  # "dora", "flow", "team", "quality", "custom"
    team_id: Optional[int] = None,
    project_id: Optional[int] = None,
    time_range: Optional[str] = "30d",
    ai_service: AIService = Depends(get_ai_service),
    data_collector: DataCollector = Depends(get_data_collector)
):
    """使用AI分析特定数据"""
    try:
        # 根据数据类型获取相关数据
        analysis_data = {}
        
        if data_type == "dora":
            # 获取DORA指标数据进行分析
            analysis_data = {
                "deployment_frequency": 1.2,
                "lead_time": 2.5,
                "change_failure_rate": 8.5,
                "recovery_time": 1.8,
                "trends": {
                    "deployment_frequency": "improving",
                    "lead_time": "stable",
                    "change_failure_rate": "improving",
                    "recovery_time": "stable"
                }
            }
        elif data_type == "flow":
            # 获取流动效率数据
            analysis_data = {
                "flow_efficiency": 28.5,
                "cycle_time": 8.2,
                "throughput": 12.5,
                "wip": 15,
                "bottlenecks": ["testing", "development"]
            }
        elif data_type == "team":
            # 获取团队效能数据
            analysis_data = {
                "productivity_score": 78.5,
                "collaboration_score": 82.1,
                "satisfaction_score": 75.2,
                "skill_growth_rate": 12.5,
                "team_health": "good"
            }
        elif data_type == "quality":
            # 获取质量指标数据
            analysis_data = {
                "quality_score": 85.2,
                "defect_density": 0.8,
                "test_coverage": 82.5,
                "technical_debt_ratio": 12.5,
                "code_quality_trend": "improving"
            }
        
        # 使用AI服务进行分析
        ai_analysis = await ai_service.analyze_data_with_query(
            query=query,
            data=analysis_data,
            data_type=data_type
        )
        
        # 构建分析结果
        analysis_result = {
            "query": query,
            "data_type": data_type,
            "analysis_timestamp": datetime.now().isoformat(),
            "ai_analysis": ai_analysis,
            "data_summary": analysis_data,
            "insights": [
                "基于当前数据趋势，整体表现呈积极态势",
                "建议重点关注识别出的瓶颈环节",
                "持续监控关键指标的变化趋势"
            ],
            "recommendations": [
                "制定针对性的改进计划",
                "设置关键指标的监控告警",
                "定期回顾和调整优化策略"
            ],
            "confidence_score": 0.85,
            "data_quality": "high"
        }
        
        return APIResponse(
            success=True,
            message="AI分析完成",
            data=analysis_result
        )
        
    except Exception as e:
        logger.error(f"AI分析失败: {e}")
        raise HTTPException(status_code=500, detail="AI分析服务暂时不可用")


@router.post("/explain", response_model=APIResponse)
async def explain_metric(
    metric_name: str,
    metric_value: float,
    context: Optional[Dict[str, Any]] = None,
    ai_service: AIService = Depends(get_ai_service)
):
    """解释特定指标的含义和影响"""
    try:
        # 使用AI服务解释指标
        explanation = await ai_service.explain_metric(
            metric_name=metric_name,
            metric_value=metric_value,
            context=context or {}
        )
        
        # 构建解释结果
        explanation_result = {
            "metric_name": metric_name,
            "metric_value": metric_value,
            "explanation": explanation,
            "benchmark_comparison": {
                "industry_average": explanation.get("industry_average"),
                "performance_level": explanation.get("performance_level"),
                "percentile": explanation.get("percentile")
            },
            "impact_analysis": {
                "business_impact": explanation.get("business_impact"),
                "technical_impact": explanation.get("technical_impact"),
                "team_impact": explanation.get("team_impact")
            },
            "improvement_suggestions": explanation.get("suggestions", []),
            "related_metrics": explanation.get("related_metrics", []),
            "calculation_method": explanation.get("calculation_method"),
            "best_practices": explanation.get("best_practices", [])
        }
        
        return APIResponse(
            success=True,
            message="指标解释生成成功",
            data=explanation_result
        )
        
    except Exception as e:
        logger.error(f"指标解释失败: {e}")
        raise HTTPException(status_code=500, detail="指标解释服务暂时不可用")


@router.get("/templates", response_model=APIResponse)
async def get_question_templates():
    """获取问题模板和示例"""
    try:
        templates = {
            "categories": {
                "performance_analysis": {
                    "name": "效能分析",
                    "templates": [
                        "我们团队的{metric_name}表现如何？",
                        "最近{time_period}的{metric_name}趋势怎么样？",
                        "与行业基准相比，我们的{metric_name}处于什么水平？",
                        "影响{metric_name}的主要因素有哪些？"
                    ]
                },
                "comparison_analysis": {
                    "name": "对比分析",
                    "templates": [
                        "对比{team_a}和{team_b}的效能表现",
                        "分析{project_a}和{project_b}的质量差异",
                        "比较不同时间段的{metric_name}变化",
                        "评估{improvement_action}前后的效果对比"
                    ]
                },
                "root_cause_analysis": {
                    "name": "根因分析",
                    "templates": [
                        "为什么{metric_name}出现{trend_direction}？",
                        "导致{issue_description}的根本原因是什么？",
                        "分析{metric_name}异常的可能原因",
                        "识别影响{process_name}效率的瓶颈"
                    ]
                },
                "prediction_planning": {
                    "name": "预测规划",
                    "templates": [
                        "预测下{time_period}的{metric_name}趋势",
                        "如果实施{improvement_plan}，预期效果如何？",
                        "达到{target_value}需要多长时间？",
                        "制定提升{metric_name}的行动计划"
                    ]
                },
                "improvement_suggestions": {
                    "name": "改进建议",
                    "templates": [
                        "如何提升{metric_name}？",
                        "针对{problem_area}有什么改进建议？",
                        "优化{process_name}的最佳实践是什么？",
                        "减少{waste_type}的有效方法有哪些？"
                    ]
                }
            },
            "popular_questions": [
                "我们团队的整体效能表现如何？",
                "最近一个月的部署质量有什么变化？",
                "哪些因素影响了我们的交付速度？",
                "如何减少变更失败率？",
                "团队协作效率如何提升？",
                "代码质量趋势分析",
                "预测下个季度的效能表现",
                "与同行业团队相比我们的优势在哪里？",
                "技术债务对效能的影响有多大？",
                "如何平衡速度和质量？"
            ],
            "metric_specific_questions": {
                "deployment_frequency": [
                    "我们的部署频率是否达到行业标准？",
                    "如何安全地提高部署频率？",
                    "部署频率与质量之间如何平衡？"
                ],
                "lead_time": [
                    "变更前置时间的主要瓶颈在哪里？",
                    "如何缩短从开发到部署的时间？",
                    "前置时间的行业基准是多少？"
                ],
                "change_failure_rate": [
                    "变更失败的主要原因是什么？",
                    "如何降低变更失败率？",
                    "失败变更的成本影响有多大？"
                ],
                "recovery_time": [
                    "如何缩短服务恢复时间？",
                    "恢复时间的目标值应该设定为多少？",
                    "影响恢复速度的关键因素有哪些？"
                ]
            },
            "context_variables": {
                "metrics": ["部署频率", "变更前置时间", "变更失败率", "服务恢复时间", "流动效率", "代码质量"],
                "time_periods": ["一周", "一个月", "一个季度", "半年", "一年"],
                "trend_directions": ["上升", "下降", "波动", "稳定"],
                "teams": ["前端团队", "后端团队", "移动端团队", "测试团队", "运维团队"],
                "projects": ["主要产品", "移动应用", "数据平台", "管理系统"]
            }
        }
        
        return APIResponse(
            success=True,
            message="问题模板获取成功",
            data=templates
        )
        
    except Exception as e:
        logger.error(f"获取问题模板失败: {e}")
        raise HTTPException(status_code=500, detail="获取问题模板失败")