import asyncio
import aiohttp
import json
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from loguru import logger
import base64

from app.core.config import settings
from app.schemas.schemas import (
    DoraMetricCreate, FlowMetricCreate, TeamMetricCreate
)


class DataCollector:
    """数据采集服务类"""
    
    def __init__(self):
        self.session = None
        self.collectors = {
            'github': GitHubCollector(),
            'jira': JiraCollector(),
            'jenkins': JenkinsCollector()
        }
        logger.info("数据采集服务初始化完成")
    
    async def start_collection(self):
        """开始数据采集"""
        try:
            self.session = aiohttp.ClientSession()
            
            # 启动定期采集任务
            asyncio.create_task(self._periodic_collection())
            
            logger.info("数据采集服务已启动")
            
        except Exception as e:
            logger.error(f"启动数据采集服务失败: {e}")
    
    async def stop_collection(self):
        """停止数据采集"""
        try:
            if self.session:
                await self.session.close()
            
            logger.info("数据采集服务已停止")
            
        except Exception as e:
            logger.error(f"停止数据采集服务失败: {e}")
    
    async def _periodic_collection(self):
        """定期数据采集"""
        while True:
            try:
                await self.collect_all_metrics()
                await asyncio.sleep(settings.DATA_COLLECTION_INTERVAL)
                
            except Exception as e:
                logger.error(f"定期数据采集失败: {e}")
                await asyncio.sleep(60)  # 出错时等待1分钟后重试
    
    async def collect_all_metrics(self) -> Dict[str, Any]:
        """采集所有指标数据"""
        try:
            logger.info("开始采集指标数据...")
            
            # 并行采集各类数据
            tasks = [
                self.collect_dora_metrics(),
                self.collect_flow_metrics(),
                self.collect_team_metrics()
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            metrics_data = {
                'dora': results[0] if not isinstance(results[0], Exception) else {},
                'flow': results[1] if not isinstance(results[1], Exception) else {},
                'team': results[2] if not isinstance(results[2], Exception) else {},
                'timestamp': datetime.now().isoformat()
            }
            
            logger.info("指标数据采集完成")
            return metrics_data
            
        except Exception as e:
            logger.error(f"采集指标数据失败: {e}")
            return {}
    
    async def collect_dora_metrics(self) -> Dict[str, Any]:
        """采集DORA指标"""
        try:
            # 从GitHub采集部署和变更数据
            github_data = await self.collectors['github'].collect_deployment_data()
            
            # 从Jenkins采集CI/CD数据
            jenkins_data = await self.collectors['jenkins'].collect_build_data()
            
            # 计算DORA指标
            dora_metrics = self._calculate_dora_metrics(github_data, jenkins_data)
            
            return dora_metrics
            
        except Exception as e:
            logger.error(f"采集DORA指标失败: {e}")
            return {}
    
    async def collect_flow_metrics(self) -> Dict[str, Any]:
        """采集流动效率指标"""
        try:
            # 从Jira采集工作项数据
            jira_data = await self.collectors['jira'].collect_work_items()
            
            # 从GitHub采集代码变更数据
            github_data = await self.collectors['github'].collect_pull_requests()
            
            # 计算流动效率指标
            flow_metrics = self._calculate_flow_metrics(jira_data, github_data)
            
            return flow_metrics
            
        except Exception as e:
            logger.error(f"采集流动效率指标失败: {e}")
            return {}
    
    async def collect_team_metrics(self) -> Dict[str, Any]:
        """采集团队效能指标"""
        try:
            # 从各个数据源采集团队相关数据
            github_data = await self.collectors['github'].collect_team_activity()
            jira_data = await self.collectors['jira'].collect_team_performance()
            
            # 计算团队效能指标
            team_metrics = self._calculate_team_metrics(github_data, jira_data)
            
            return team_metrics
            
        except Exception as e:
            logger.error(f"采集团队效能指标失败: {e}")
            return {}
    
    def _calculate_dora_metrics(self, github_data: Dict, jenkins_data: Dict) -> Dict[str, Any]:
        """计算DORA指标"""
        try:
            # 模拟计算逻辑，实际应用中需要根据真实数据计算
            deployments = github_data.get('deployments', [])
            builds = jenkins_data.get('builds', [])
            
            # 部署频率 (次/天)
            deployment_frequency = len(deployments) / 7 if deployments else 0.5
            
            # 变更前置时间 (小时)
            lead_times = [d.get('lead_time', 24) for d in deployments]
            lead_time_for_changes = sum(lead_times) / len(lead_times) if lead_times else 48
            
            # 变更失败率 (%)
            failed_deployments = [d for d in deployments if d.get('status') == 'failed']
            change_failure_rate = (len(failed_deployments) / len(deployments) * 100) if deployments else 10
            
            # 平均恢复时间 (小时)
            recovery_times = [d.get('recovery_time', 2) for d in failed_deployments]
            time_to_restore_service = sum(recovery_times) / len(recovery_times) if recovery_times else 4
            
            return {
                'deployment_frequency': deployment_frequency,
                'lead_time_for_changes': lead_time_for_changes,
                'change_failure_rate': change_failure_rate,
                'time_to_restore_service': time_to_restore_service
            }
            
        except Exception as e:
            logger.error(f"计算DORA指标失败: {e}")
            return {}
    
    def _calculate_flow_metrics(self, jira_data: Dict, github_data: Dict) -> Dict[str, Any]:
        """计算流动效率指标"""
        try:
            work_items = jira_data.get('work_items', [])
            pull_requests = github_data.get('pull_requests', [])
            
            # 流动效率 (%)
            total_time = sum([item.get('total_time', 0) for item in work_items])
            active_time = sum([item.get('active_time', 0) for item in work_items])
            flow_efficiency = (active_time / total_time * 100) if total_time > 0 else 25
            
            # 在制品数量
            work_in_progress = len([item for item in work_items if item.get('status') == 'in_progress'])
            
            # 周期时间 (天)
            cycle_times = [item.get('cycle_time', 5) for item in work_items if item.get('completed')]
            cycle_time = sum(cycle_times) / len(cycle_times) if cycle_times else 7
            
            # 吞吐量 (个/周)
            completed_items = [item for item in work_items if item.get('completed')]
            throughput = len(completed_items) if completed_items else 3
            
            return {
                'flow_efficiency': flow_efficiency,
                'work_in_progress': work_in_progress,
                'cycle_time': cycle_time,
                'throughput': throughput
            }
            
        except Exception as e:
            logger.error(f"计算流动效率指标失败: {e}")
            return {}
    
    def _calculate_team_metrics(self, github_data: Dict, jira_data: Dict) -> Dict[str, Any]:
        """计算团队效能指标"""
        try:
            # 基于各种数据源计算团队指标
            commits = github_data.get('commits', [])
            reviews = github_data.get('reviews', [])
            work_items = jira_data.get('work_items', [])
            
            # 综合评分 (0-100)
            overall_score = 75 + (len(commits) * 0.5) + (len(reviews) * 0.3)
            overall_score = min(100, overall_score)
            
            # 效能 (0-100)
            completed_items = len([item for item in work_items if item.get('completed')])
            efficiency = min(100, 60 + completed_items * 2)
            
            # 速度 (0-100)
            velocity = min(100, 50 + len(commits) * 1.5)
            
            # 满意度 (0-100) - 模拟数据
            satisfaction = 80
            
            # 协作 (0-100)
            collaboration = min(100, 70 + len(reviews) * 2)
            
            return {
                'overall_score': overall_score,
                'efficiency': efficiency,
                'velocity': velocity,
                'satisfaction': satisfaction,
                'collaboration': collaboration
            }
            
        except Exception as e:
            logger.error(f"计算团队效能指标失败: {e}")
            return {}


class GitHubCollector:
    """GitHub数据采集器"""
    
    def __init__(self):
        self.token = settings.GITHUB_TOKEN
        self.base_url = "https://api.github.com"
    
    async def collect_deployment_data(self) -> Dict[str, Any]:
        """采集部署数据"""
        try:
            # 模拟GitHub部署数据
            deployments = [
                {
                    'id': 1,
                    'status': 'success',
                    'created_at': (datetime.now() - timedelta(days=1)).isoformat(),
                    'lead_time': 24,
                    'recovery_time': None
                },
                {
                    'id': 2,
                    'status': 'failed',
                    'created_at': (datetime.now() - timedelta(days=2)).isoformat(),
                    'lead_time': 36,
                    'recovery_time': 2
                }
            ]
            
            return {'deployments': deployments}
            
        except Exception as e:
            logger.error(f"采集GitHub部署数据失败: {e}")
            return {}
    
    async def collect_pull_requests(self) -> Dict[str, Any]:
        """采集Pull Request数据"""
        try:
            # 模拟PR数据
            pull_requests = [
                {
                    'id': 1,
                    'state': 'merged',
                    'created_at': (datetime.now() - timedelta(days=1)).isoformat(),
                    'merged_at': datetime.now().isoformat(),
                    'review_time': 4
                },
                {
                    'id': 2,
                    'state': 'open',
                    'created_at': (datetime.now() - timedelta(hours=6)).isoformat(),
                    'merged_at': None,
                    'review_time': None
                }
            ]
            
            return {'pull_requests': pull_requests}
            
        except Exception as e:
            logger.error(f"采集GitHub PR数据失败: {e}")
            return {}
    
    async def collect_team_activity(self) -> Dict[str, Any]:
        """采集团队活动数据"""
        try:
            # 模拟团队活动数据
            commits = [
                {'id': 1, 'author': 'user1', 'date': datetime.now().isoformat()},
                {'id': 2, 'author': 'user2', 'date': (datetime.now() - timedelta(hours=2)).isoformat()}
            ]
            
            reviews = [
                {'id': 1, 'reviewer': 'user1', 'date': datetime.now().isoformat()},
                {'id': 2, 'reviewer': 'user3', 'date': (datetime.now() - timedelta(hours=1)).isoformat()}
            ]
            
            return {
                'commits': commits,
                'reviews': reviews
            }
            
        except Exception as e:
            logger.error(f"采集GitHub团队活动数据失败: {e}")
            return {}


class JiraCollector:
    """Jira数据采集器"""
    
    def __init__(self):
        self.url = settings.JIRA_URL
        self.username = settings.JIRA_USERNAME
        self.token = settings.JIRA_API_TOKEN
    
    async def collect_work_items(self) -> Dict[str, Any]:
        """采集工作项数据"""
        try:
            # 模拟Jira工作项数据
            work_items = [
                {
                    'id': 'PROJ-1',
                    'status': 'done',
                    'completed': True,
                    'total_time': 120,  # 小时
                    'active_time': 30,  # 小时
                    'cycle_time': 5     # 天
                },
                {
                    'id': 'PROJ-2',
                    'status': 'in_progress',
                    'completed': False,
                    'total_time': 48,
                    'active_time': 12,
                    'cycle_time': None
                }
            ]
            
            return {'work_items': work_items}
            
        except Exception as e:
            logger.error(f"采集Jira工作项数据失败: {e}")
            return {}
    
    async def collect_team_performance(self) -> Dict[str, Any]:
        """采集团队绩效数据"""
        try:
            # 模拟团队绩效数据
            work_items = [
                {
                    'id': 'PROJ-1',
                    'assignee': 'user1',
                    'completed': True,
                    'story_points': 5
                },
                {
                    'id': 'PROJ-2',
                    'assignee': 'user2',
                    'completed': True,
                    'story_points': 3
                }
            ]
            
            return {'work_items': work_items}
            
        except Exception as e:
            logger.error(f"采集Jira团队绩效数据失败: {e}")
            return {}


class JenkinsCollector:
    """Jenkins数据采集器"""
    
    def __init__(self):
        self.url = settings.JENKINS_URL
        self.username = settings.JENKINS_USERNAME
        self.token = settings.JENKINS_API_TOKEN
    
    async def collect_build_data(self) -> Dict[str, Any]:
        """采集构建数据"""
        try:
            # 模拟Jenkins构建数据
            builds = [
                {
                    'id': 1,
                    'status': 'success',
                    'duration': 300,  # 秒
                    'timestamp': datetime.now().isoformat()
                },
                {
                    'id': 2,
                    'status': 'failed',
                    'duration': 180,
                    'timestamp': (datetime.now() - timedelta(hours=2)).isoformat()
                }
            ]
            
            return {'builds': builds}
            
        except Exception as e:
            logger.error(f"采集Jenkins构建数据失败: {e}")
            return {}