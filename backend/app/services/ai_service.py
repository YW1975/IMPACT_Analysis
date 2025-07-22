import openai
import json
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from loguru import logger
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler

from app.core.config import settings
from app.schemas.schemas import (
    Insight, InsightCreate, InsightType, SeverityLevel,
    Recommendation, RecommendationCreate, PriorityLevel,
    Prediction, PredictionCreate, TrendDirection,
    ChatMessage, ChatResponse
)


class AIService:
    """AI服务类，提供智能分析功能"""
    
    def __init__(self):
        self.openai_client = None
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
            self.openai_client = openai
        
        self.scaler = StandardScaler()
        self.models = {}
        
        logger.info("AI服务初始化完成")
    
    async def generate_insights(self, metrics_data: Dict[str, Any]) -> List[InsightCreate]:
        """生成AI洞察"""
        try:
            insights = []
            
            # 分析DORA指标
            dora_insights = await self._analyze_dora_metrics(metrics_data.get('dora', {}))
            insights.extend(dora_insights)
            
            # 分析流动效率
            flow_insights = await self._analyze_flow_metrics(metrics_data.get('flow', {}))
            insights.extend(flow_insights)
            
            # 分析团队效能
            team_insights = await self._analyze_team_metrics(metrics_data.get('team', {}))
            insights.extend(team_insights)
            
            logger.info(f"生成了 {len(insights)} 个AI洞察")
            return insights
            
        except Exception as e:
            logger.error(f"生成AI洞察失败: {e}")
            return []
    
    async def _analyze_dora_metrics(self, dora_data: Dict[str, Any]) -> List[InsightCreate]:
        """分析DORA指标"""
        insights = []
        
        try:
            # 部署频率分析
            deployment_freq = dora_data.get('deployment_frequency', 0)
            if deployment_freq < 1:  # 每天少于1次部署
                insights.append(InsightCreate(
                    title="部署频率偏低",
                    description=f"当前部署频率为 {deployment_freq:.2f} 次/天，建议提高自动化部署能力",
                    type=InsightType.PERFORMANCE,
                    severity=SeverityLevel.MEDIUM,
                    confidence=0.85,
                    metrics={"deployment_frequency": deployment_freq},
                    recommendations=[
                        "实施CI/CD自动化流水线",
                        "减少手动部署步骤",
                        "建立部署监控机制"
                    ]
                ))
            
            # 变更前置时间分析
            lead_time = dora_data.get('lead_time_for_changes', 0)
            if lead_time > 168:  # 超过一周
                insights.append(InsightCreate(
                    title="变更前置时间过长",
                    description=f"当前变更前置时间为 {lead_time:.1f} 小时，影响交付速度",
                    type=InsightType.PERFORMANCE,
                    severity=SeverityLevel.HIGH,
                    confidence=0.90,
                    metrics={"lead_time_for_changes": lead_time},
                    recommendations=[
                        "优化代码审查流程",
                        "减少批次大小",
                        "并行化开发任务"
                    ]
                ))
            
            # 变更失败率分析
            failure_rate = dora_data.get('change_failure_rate', 0)
            if failure_rate > 15:  # 失败率超过15%
                insights.append(InsightCreate(
                    title="变更失败率较高",
                    description=f"当前变更失败率为 {failure_rate:.1f}%，需要提升质量控制",
                    type=InsightType.QUALITY,
                    severity=SeverityLevel.HIGH,
                    confidence=0.88,
                    metrics={"change_failure_rate": failure_rate},
                    recommendations=[
                        "加强测试覆盖率",
                        "实施渐进式部署",
                        "建立回滚机制"
                    ]
                ))
            
        except Exception as e:
            logger.error(f"DORA指标分析失败: {e}")
        
        return insights
    
    async def _analyze_flow_metrics(self, flow_data: Dict[str, Any]) -> List[InsightCreate]:
        """分析流动效率指标"""
        insights = []
        
        try:
            # 流动效率分析
            flow_efficiency = flow_data.get('flow_efficiency', 0)
            if flow_efficiency < 20:  # 流动效率低于20%
                insights.append(InsightCreate(
                    title="流动效率偏低",
                    description=f"当前流动效率为 {flow_efficiency:.1f}%，存在较多等待时间",
                    type=InsightType.PERFORMANCE,
                    severity=SeverityLevel.MEDIUM,
                    confidence=0.82,
                    metrics={"flow_efficiency": flow_efficiency},
                    recommendations=[
                        "识别并消除瓶颈",
                        "减少任务切换",
                        "优化工作流程"
                    ]
                ))
            
            # 在制品分析
            wip = flow_data.get('work_in_progress', 0)
            if wip > 10:  # 在制品过多
                insights.append(InsightCreate(
                    title="在制品数量过多",
                    description=f"当前在制品数量为 {wip}，可能影响交付速度",
                    type=InsightType.RISK,
                    severity=SeverityLevel.MEDIUM,
                    confidence=0.75,
                    metrics={"work_in_progress": wip},
                    recommendations=[
                        "限制WIP数量",
                        "优先完成进行中的任务",
                        "提高任务完成率"
                    ]
                ))
            
        except Exception as e:
            logger.error(f"流动效率指标分析失败: {e}")
        
        return insights
    
    async def _analyze_team_metrics(self, team_data: Dict[str, Any]) -> List[InsightCreate]:
        """分析团队效能指标"""
        insights = []
        
        try:
            # 团队满意度分析
            satisfaction = team_data.get('satisfaction', 0)
            if satisfaction < 70:  # 满意度低于70%
                insights.append(InsightCreate(
                    title="团队满意度偏低",
                    description=f"当前团队满意度为 {satisfaction:.1f}%，需要关注团队状态",
                    type=InsightType.RISK,
                    severity=SeverityLevel.HIGH,
                    confidence=0.80,
                    metrics={"satisfaction": satisfaction},
                    recommendations=[
                        "开展团队建设活动",
                        "改善工作环境",
                        "提供技能培训"
                    ]
                ))
            
            # 协作效率分析
            collaboration = team_data.get('collaboration', 0)
            if collaboration < 75:  # 协作效率低于75%
                insights.append(InsightCreate(
                    title="团队协作有待提升",
                    description=f"当前协作效率为 {collaboration:.1f}%，建议加强团队沟通",
                    type=InsightType.OPPORTUNITY,
                    severity=SeverityLevel.MEDIUM,
                    confidence=0.78,
                    metrics={"collaboration": collaboration},
                    recommendations=[
                        "建立定期沟通机制",
                        "使用协作工具",
                        "明确角色职责"
                    ]
                ))
            
        except Exception as e:
            logger.error(f"团队效能指标分析失败: {e}")
        
        return insights
    
    async def generate_recommendations(self, insights: List[Insight]) -> List[RecommendationCreate]:
        """基于洞察生成改进建议"""
        try:
            recommendations = []
            
            for insight in insights:
                if insight.recommendations:
                    for rec_text in insight.recommendations:
                        recommendation = RecommendationCreate(
                            title=f"针对{insight.title}的改进建议",
                            description=rec_text,
                            type=self._get_recommendation_type(insight.type),
                            priority=self._get_priority_from_severity(insight.severity),
                            effort=self._estimate_effort(rec_text),
                            impact=self._estimate_impact(insight.severity),
                            team_id=insight.team_id,
                            project_id=insight.project_id,
                            insight_id=insight.id,
                            estimated_duration=self._estimate_duration(rec_text)
                        )
                        recommendations.append(recommendation)
            
            logger.info(f"生成了 {len(recommendations)} 个改进建议")
            return recommendations
            
        except Exception as e:
            logger.error(f"生成改进建议失败: {e}")
            return []
    
    def _get_recommendation_type(self, insight_type: InsightType) -> str:
        """根据洞察类型确定建议类型"""
        mapping = {
            InsightType.PERFORMANCE: "process",
            InsightType.QUALITY: "practice",
            InsightType.RISK: "tool",
            InsightType.OPPORTUNITY: "training"
        }
        return mapping.get(insight_type, "process")
    
    def _get_priority_from_severity(self, severity: SeverityLevel) -> PriorityLevel:
        """根据严重程度确定优先级"""
        mapping = {
            SeverityLevel.LOW: PriorityLevel.LOW,
            SeverityLevel.MEDIUM: PriorityLevel.MEDIUM,
            SeverityLevel.HIGH: PriorityLevel.HIGH,
            SeverityLevel.CRITICAL: PriorityLevel.URGENT
        }
        return mapping.get(severity, PriorityLevel.MEDIUM)
    
    def _estimate_effort(self, recommendation: str) -> str:
        """估算实施工作量"""
        # 简单的关键词匹配
        if any(word in recommendation.lower() for word in ['自动化', '工具', '系统']):
            return "high"
        elif any(word in recommendation.lower() for word in ['流程', '规范', '培训']):
            return "medium"
        else:
            return "low"
    
    def _estimate_impact(self, severity: SeverityLevel) -> str:
        """估算影响程度"""
        mapping = {
            SeverityLevel.LOW: "low",
            SeverityLevel.MEDIUM: "medium",
            SeverityLevel.HIGH: "high",
            SeverityLevel.CRITICAL: "high"
        }
        return mapping.get(severity, "medium")
    
    def _estimate_duration(self, recommendation: str) -> int:
        """估算实施时间(天)"""
        if any(word in recommendation.lower() for word in ['自动化', '系统', '工具']):
            return 30  # 1个月
        elif any(word in recommendation.lower() for word in ['流程', '规范']):
            return 14  # 2周
        else:
            return 7   # 1周
    
    async def generate_predictions(self, historical_data: Dict[str, List[Dict[str, Any]]]) -> List[PredictionCreate]:
        """生成预测分析"""
        try:
            predictions = []
            
            # 预测DORA指标
            if 'dora' in historical_data:
                dora_predictions = await self._predict_dora_metrics(historical_data['dora'])
                predictions.extend(dora_predictions)
            
            # 预测流动效率
            if 'flow' in historical_data:
                flow_predictions = await self._predict_flow_metrics(historical_data['flow'])
                predictions.extend(flow_predictions)
            
            logger.info(f"生成了 {len(predictions)} 个预测")
            return predictions
            
        except Exception as e:
            logger.error(f"生成预测分析失败: {e}")
            return []
    
    async def _predict_dora_metrics(self, dora_data: List[Dict[str, Any]]) -> List[PredictionCreate]:
        """预测DORA指标"""
        predictions = []
        
        try:
            if len(dora_data) < 3:  # 数据不足
                return predictions
            
            # 预测部署频率
            deployment_freq_values = [d.get('deployment_frequency', 0) for d in dora_data]
            if deployment_freq_values:
                predicted_freq = await self._simple_linear_prediction(deployment_freq_values)
                current_freq = deployment_freq_values[-1]
                
                predictions.append(PredictionCreate(
                    metric_name="部署频率",
                    metric_type="dora",
                    current_value=current_freq,
                    predicted_value=predicted_freq,
                    confidence=0.75,
                    prediction_horizon=30,
                    trend=self._get_trend(current_freq, predicted_freq),
                    change_rate=((predicted_freq - current_freq) / current_freq * 100) if current_freq > 0 else 0,
                    factors=["团队规模", "自动化程度", "代码复杂度"],
                    time_series_data=self._generate_time_series(deployment_freq_values),
                    valid_until=datetime.now() + timedelta(days=30)
                ))
            
        except Exception as e:
            logger.error(f"预测DORA指标失败: {e}")
        
        return predictions
    
    async def _predict_flow_metrics(self, flow_data: List[Dict[str, Any]]) -> List[PredictionCreate]:
        """预测流动效率指标"""
        predictions = []
        
        try:
            if len(flow_data) < 3:  # 数据不足
                return predictions
            
            # 预测流动效率
            flow_efficiency_values = [d.get('flow_efficiency', 0) for d in flow_data]
            if flow_efficiency_values:
                predicted_efficiency = await self._simple_linear_prediction(flow_efficiency_values)
                current_efficiency = flow_efficiency_values[-1]
                
                predictions.append(PredictionCreate(
                    metric_name="流动效率",
                    metric_type="flow",
                    current_value=current_efficiency,
                    predicted_value=predicted_efficiency,
                    confidence=0.70,
                    prediction_horizon=30,
                    trend=self._get_trend(current_efficiency, predicted_efficiency),
                    change_rate=((predicted_efficiency - current_efficiency) / current_efficiency * 100) if current_efficiency > 0 else 0,
                    factors=["在制品数量", "团队协作", "工具效率"],
                    time_series_data=self._generate_time_series(flow_efficiency_values),
                    valid_until=datetime.now() + timedelta(days=30)
                ))
            
        except Exception as e:
            logger.error(f"预测流动效率指标失败: {e}")
        
        return predictions
    
    async def _simple_linear_prediction(self, values: List[float]) -> float:
        """简单线性预测"""
        try:
            if len(values) < 2:
                return values[0] if values else 0
            
            # 使用线性回归进行预测
            X = np.array(range(len(values))).reshape(-1, 1)
            y = np.array(values)
            
            model = LinearRegression()
            model.fit(X, y)
            
            # 预测下一个值
            next_x = np.array([[len(values)]])
            predicted = model.predict(next_x)[0]
            
            return max(0, predicted)  # 确保预测值非负
            
        except Exception as e:
            logger.error(f"线性预测失败: {e}")
            return values[-1] if values else 0
    
    def _get_trend(self, current: float, predicted: float) -> TrendDirection:
        """确定趋势方向"""
        if abs(predicted - current) / current < 0.05:  # 变化小于5%
            return TrendDirection.STABLE
        elif predicted > current:
            return TrendDirection.UP
        else:
            return TrendDirection.DOWN
    
    def _generate_time_series(self, values: List[float]) -> List[Dict[str, Any]]:
        """生成时间序列数据"""
        time_series = []
        base_time = datetime.now() - timedelta(days=len(values))
        
        for i, value in enumerate(values):
            time_series.append({
                "timestamp": (base_time + timedelta(days=i)).isoformat(),
                "value": value
            })
        
        return time_series
    
    async def chat_with_ai(self, message: ChatMessage) -> ChatResponse:
        """AI聊天功能"""
        try:
            # 如果有OpenAI API，使用真实的AI
            if self.openai_client and settings.OPENAI_API_KEY:
                response = await self._openai_chat(message)
            else:
                # 使用模拟响应
                response = await self._mock_chat(message)
            
            return response
            
        except Exception as e:
            logger.error(f"AI聊天失败: {e}")
            return ChatResponse(
                response="抱歉，我暂时无法回答您的问题，请稍后再试。",
                confidence=0.0,
                timestamp=datetime.now()
            )
    
    async def _openai_chat(self, message: ChatMessage) -> ChatResponse:
        """使用OpenAI进行聊天"""
        try:
            prompt = f"""
            你是一个软件开发效能管理专家，专门帮助团队提升开发效能。
            请基于用户的问题提供专业的建议和分析。
            
            用户问题: {message.message}
            
            请提供简洁、实用的回答。
            """
            
            response = await self.openai_client.ChatCompletion.acreate(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "你是一个软件开发效能管理专家。"},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=settings.OPENAI_MAX_TOKENS,
                temperature=settings.OPENAI_TEMPERATURE
            )
            
            ai_response = response.choices[0].message.content
            
            return ChatResponse(
                response=ai_response,
                confidence=0.85,
                suggestions=[
                    "查看相关指标趋势",
                    "分析团队效能报告",
                    "制定改进计划"
                ],
                timestamp=datetime.now()
            )
            
        except Exception as e:
            logger.error(f"OpenAI聊天失败: {e}")
            return await self._mock_chat(message)
    
    async def _mock_chat(self, message: ChatMessage) -> ChatResponse:
        """模拟AI聊天响应"""
        # 简单的关键词匹配
        msg_lower = message.message.lower()
        
        if any(word in msg_lower for word in ['部署', 'deployment']):
            response = "关于部署频率，建议您关注以下几个方面：1) 建立自动化CI/CD流水线；2) 减少手动部署步骤；3) 实施渐进式部署策略。当前的部署频率数据显示还有提升空间。"
        elif any(word in msg_lower for word in ['质量', 'quality', '测试']):
            response = "代码质量是效能的重要基础。建议：1) 提高测试覆盖率；2) 实施代码审查；3) 使用静态代码分析工具；4) 建立质量门禁。"
        elif any(word in msg_lower for word in ['团队', 'team', '协作']):
            response = "团队协作效率直接影响交付速度。建议：1) 建立定期沟通机制；2) 明确角色职责；3) 使用协作工具；4) 开展团队建设活动。"
        elif any(word in msg_lower for word in ['流程', 'process', '效率']):
            response = "流程优化是提升效能的关键。建议：1) 识别并消除瓶颈；2) 标准化工作流程；3) 减少不必要的等待时间；4) 持续改进。"
        else:
            response = "感谢您的问题。作为效能管理专家，我建议您从以下维度分析：1) 交付速度；2) 质量水平；3) 团队协作；4) 流程效率。您可以查看相关的指标数据来深入了解当前状况。"
        
        return ChatResponse(
            response=response,
            confidence=0.75,
            suggestions=[
                "查看DORA指标",
                "分析流动效率",
                "查看团队效能报告"
            ],
            timestamp=datetime.now()
        )