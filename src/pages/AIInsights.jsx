import React, { useState, useEffect } from 'react';
import { Card, Row, Col, List, Avatar, Tag, Button, Modal, Input, Spin, Alert, Progress, Timeline } from 'antd';
import {
  RobotOutlined,
  BulbOutlined,
  WarningOutlined,
  TrophyOutlined,
  ReloadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LineChartOutlined
} from '@ant-design/icons';

// 导入自定义组件
import InsightCard from '../components/AIInsights/InsightCard';
import RecommendationCard from '../components/AIInsights/RecommendationCard';
import PredictionCard from '../components/AIInsights/PredictionCard';
import AIChat from '../components/AIInsights/AIChat';

const { TextArea } = Input;

const AIInsights = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [analysisModal, setAnalysisModal] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [customQuery, setCustomQuery] = useState('');
  const [queryLoading, setQueryLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = () => {
    setLoading(true);
    // 模拟AI分析数据加载
    setTimeout(() => {
      setInsights([
        {
          id: 1,
          type: 'performance',
          title: '代码质量下降趋势检测',
          description: 'AI检测到前端团队在过去两周的代码复杂度指标持续上升，建议进行代码重构。',
          severity: 'warning',
          confidence: 87,
          impact: 'medium',
          timestamp: '2024-01-15 14:30',
          details: {
            metrics: ['代码复杂度: +15%', '测试覆盖率: -8%', '技术债务: +22%'],
            affectedTeams: ['前端团队'],
            suggestedActions: ['安排代码重构Sprint', '增加代码审查频率', '引入静态代码分析工具']
          }
        },
        {
          id: 2,
          type: 'efficiency',
          title: '部署流水线优化机会',
          description: 'AI分析发现CI/CD流水线存在优化空间，预计可减少30%的构建时间。',
          severity: 'info',
          confidence: 92,
          impact: 'high',
          timestamp: '2024-01-15 12:15',
          details: {
            metrics: ['平均构建时间: 12分钟', '并行度利用率: 45%', '缓存命中率: 68%'],
            affectedTeams: ['DevOps团队', '所有开发团队'],
            suggestedActions: ['优化Docker镜像层', '增加构建缓存策略', '并行化测试执行']
          }
        },
        {
          id: 3,
          type: 'collaboration',
          title: '团队协作模式分析',
          description: '移动端团队的协作效率显著提升，可作为最佳实践推广到其他团队。',
          severity: 'success',
          confidence: 95,
          impact: 'high',
          timestamp: '2024-01-15 10:45',
          details: {
            metrics: ['代码审查响应时间: -40%', '知识分享频率: +60%', '跨团队协作: +35%'],
            affectedTeams: ['移动端团队'],
            suggestedActions: ['总结最佳实践', '组织经验分享会', '制定协作标准流程']
          }
        }
      ]);

      setRecommendations([
        {
          id: 1,
          type: 'process',
          title: '实施渐进式代码重构',
          priority: 'high',
          effort: 'medium',
          impact: 'high',
          description: '基于技术债务分析，建议对核心模块进行渐进式重构，预计可提升20%的开发效率。',
          benefits: ['提高代码可维护性', '减少bug修复时间', '提升开发速度'],
          progress: 0,
          team: '前端团队',
          estimatedTime: '4周',
          steps: [
            '识别高复杂度模块',
            '制定重构计划',
            '分阶段执行重构',
            '验证重构效果'
          ]
        },
        {
          id: 2,
          type: 'testing',
          title: '优化测试自动化策略',
          priority: 'medium',
          effort: 'low',
          impact: 'medium',
          description: '通过智能测试选择和并行化执行，可减少50%的测试执行时间。',
          benefits: ['加快反馈循环', '提高测试效率', '减少CI资源消耗'],
          progress: 25,
          team: 'QA团队',
          estimatedTime: '2周',
          steps: [
            '分析测试执行模式',
            '实施智能测试选择',
            '优化测试并行度',
            '监控测试效果'
          ]
        },
        {
          id: 3,
          type: 'knowledge',
          title: '建立知识管理体系',
          priority: 'medium',
          effort: 'high',
          impact: 'high',
          description: '构建AI驱动的知识管理平台，提升团队学习和知识传承效率。',
          benefits: ['减少知识孤岛', '加速新成员融入', '提高问题解决效率'],
          progress: 10,
          team: '所有团队',
          estimatedTime: '8周',
          steps: [
            '梳理知识资产',
            '建立知识图谱',
            '实施智能推荐',
            '持续优化更新'
          ]
        }
      ]);

      setPredictions([
        {
          id: 1,
          type: 'trend',
          title: '部署频率预测',
          description: '基于历史数据分析，AI预测下个月部署频率将提升15%，主要受自动化流程改进影响。',
          confidence: 89,
          current: 12.5,
          predicted: 14.4,
          unit: '次/周',
          change: 15.2,
          trend: 'good',
          timeframe: '未来4周',
          threshold: 10,
          data: [
            { date: '第1周', actual: 10.2, predicted: null },
            { date: '第2周', actual: 11.5, predicted: null },
            { date: '第3周', actual: 12.0, predicted: null },
            { date: '第4周', actual: 12.5, predicted: null },
            { date: '第5周', actual: null, predicted: 13.1 },
            { date: '第6周', actual: null, predicted: 13.8 },
            { date: '第7周', actual: null, predicted: 14.2 },
            { date: '第8周', actual: null, predicted: 14.4 }
          ],
          factors: [
            { name: 'CI/CD自动化', impact: 45 },
            { name: '代码审查效率', impact: 30 },
            { name: '团队规模扩大', impact: 15 },
            { name: '技术债务', impact: -10 }
          ]
        },
        {
          id: 2,
          type: 'risk',
          title: '变更失败率风险预警',
          description: 'AI检测到当前开发模式可能导致变更失败率上升，建议增强自动化测试覆盖率。',
          confidence: 82,
          current: 4.2,
          predicted: 6.8,
          unit: '%',
          change: 61.9,
          trend: 'bad',
          timeframe: '未来4周',
          threshold: 5,
          data: [
            { date: '第1周', actual: 3.5, predicted: null },
            { date: '第2周', actual: 3.8, predicted: null },
            { date: '第3周', actual: 4.0, predicted: null },
            { date: '第4周', actual: 4.2, predicted: null },
            { date: '第5周', actual: null, predicted: 5.1 },
            { date: '第6周', actual: null, predicted: 5.9 },
            { date: '第7周', actual: null, predicted: 6.5 },
            { date: '第8周', actual: null, predicted: 6.8 }
          ],
          factors: [
            { name: '测试覆盖率下降', impact: 40 },
            { name: '复杂度增加', impact: 35 },
            { name: '发布规模扩大', impact: 15 },
            { name: '新团队成员', impact: 10 }
          ]
        },
        {
          id: 3,
          type: 'capacity',
          title: '团队容量预测',
          description: 'AI预测下季度团队效能将提升12%，主要受知识共享和工具改进影响。',
          confidence: 76,
          current: 85,
          predicted: 95.2,
          unit: '点/冲刺',
          change: 12,
          trend: 'good',
          timeframe: '下季度',
          data: [
            { date: '冲刺1', actual: 78, predicted: null },
            { date: '冲刺2', actual: 82, predicted: null },
            { date: '冲刺3', actual: 84, predicted: null },
            { date: '冲刺4', actual: 85, predicted: null },
            { date: '冲刺5', actual: null, predicted: 88 },
            { date: '冲刺6', actual: null, predicted: 91 },
            { date: '冲刺7', actual: null, predicted: 93 },
            { date: '冲刺8', actual: null, predicted: 95.2 }
          ],
          factors: [
            { name: '知识共享改进', impact: 35 },
            { name: '开发工具升级', impact: 25 },
            { name: '流程自动化', impact: 20 },
            { name: '团队稳定性', impact: 20 }
          ]
        }
      ]);

      // 初始化聊天消息
      setChatMessages([
        {
          role: 'assistant',
          content: '你好！我是AI效能助手，可以帮助你分析开发效能数据，提供洞察和建议。有什么我可以帮助你的吗？'
        }
      ]);

      setLoading(false);
    }, 1500);
  };

  const handleCustomQuery = async () => {
    if (!customQuery.trim()) return;
    
    // 添加用户消息
    const userMessage = { role: 'user', content: customQuery };
    setChatMessages([...chatMessages, userMessage]);
    
    setQueryLoading(true);
    // 模拟AI查询处理
    setTimeout(() => {
      // 添加AI回复
      const aiResponse = { 
        role: 'assistant', 
        content: `基于当前数据分析，您提到的"${customQuery}"问题可能与以下因素相关：

1. 代码复杂度增加导致的维护成本上升
2. 测试覆盖率不足影响代码质量
3. 团队协作流程需要进一步优化

建议采取相应的改进措施，例如增加代码审查频率、提高测试覆盖率，以及优化团队协作流程。`
      };
      
      setChatMessages(prevMessages => [...prevMessages, aiResponse]);
      setCustomQuery('');
      setQueryLoading(false);
    }, 2000);
  };

  const showInsightDetails = (insight) => {
    setSelectedInsight(insight);
    setAnalysisModal(true);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success': return 'green';
      case 'warning': return 'orange';
      case 'error': return 'red';
      default: return 'blue';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'success': return <CheckCircleOutlined />;
      case 'warning': return <WarningOutlined />;
      case 'error': return <ExclamationCircleOutlined />;
      default: return <BulbOutlined />;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="AI正在分析效能数据..." />
      </div>
    );
  }

  return (
    <div>
      {/* AI洞察概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Alert
            message="AI 效能洞察"
            description="基于机器学习算法分析您的开发数据，提供智能化的效能洞察和改进建议。"
            type="info"
            showIcon
            icon={<RobotOutlined />}
            action={
              <Button size="small" icon={<ReloadOutlined />} onClick={loadAIInsights}>
                刷新分析
              </Button>
            }
          />
        </Col>
      </Row>

      {/* AI聊天 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="AI 智能问答" className="dashboard-card" extra={<Tag icon={<RobotOutlined />} color="blue">AI助手</Tag>}>
            <AIChat 
              messages={chatMessages} 
              onSendMessage={(message) => {
                // 添加用户消息
                const userMessage = { role: 'user', content: message };
                setChatMessages([...chatMessages, userMessage]);
                
                // 模拟AI回复
                setQueryLoading(true);
                setTimeout(() => {
                  const aiResponse = { 
                    role: 'assistant', 
                    content: `感谢您的问题。基于我对您开发数据的分析，"${message}"相关的情况是：

- 您的团队在过去两周内代码复杂度上升了15%
- 测试覆盖率下降了8%
- 技术债务增加了22%

建议您考虑安排一次代码重构Sprint，增加代码审查频率，并引入静态代码分析工具来改善这一情况。`
                  };
                  
                  setChatMessages(prevMessages => [...prevMessages, aiResponse]);
                  setQueryLoading(false);
                }, 1500);
              }}
              loading={queryLoading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* AI洞察列表 */}
        <Col span={12}>
          <Card 
            title="智能洞察" 
            className="dashboard-card"
            extra={<Tag color="blue">{insights.length} 条洞察</Tag>}
          >
            <List
              itemLayout="vertical"
              dataSource={insights}
              renderItem={(item) => (
                <InsightCard 
                  insight={item} 
                  onViewDetails={() => showInsightDetails(item)} 
                />
              )}
            />
          </Card>
        </Col>

        {/* AI建议 */}
        <Col span={12}>
          <Card 
            title="改进建议" 
            className="dashboard-card"
            extra={<Tag color="green">{recommendations.length} 条建议</Tag>}
          >
            <List
              itemLayout="vertical"
              dataSource={recommendations}
              renderItem={(item) => (
                <RecommendationCard recommendation={item} />
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 预测分析 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title="AI 预测分析" 
            className="dashboard-card"
            extra={<Tag icon={<LineChartOutlined />} color="purple">{predictions.length} 项预测</Tag>}
          >
            <Row gutter={[16, 16]}>
              {predictions.map((prediction) => (
                <Col span={8} key={prediction.id}>
                  <PredictionCard prediction={prediction} />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 洞察详情模态框 */}
      <Modal
        title="洞察详情"
        open={analysisModal}
        onCancel={() => setAnalysisModal(false)}
        footer={null}
        width={800}
      >
        {selectedInsight && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h3>{selectedInsight.title}</h3>
              <p>{selectedInsight.description}</p>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <Tag color={getSeverityColor(selectedInsight.severity)}>置信度: {selectedInsight.confidence}%</Tag>
                <Tag>影响程度: {selectedInsight.impact === 'high' ? '高' : selectedInsight.impact === 'medium' ? '中' : '低'}</Tag>
                <Tag>时间: {selectedInsight.timestamp}</Tag>
              </div>
            </div>
            
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card size="small" title="相关指标">
                  <List
                    size="small"
                    dataSource={selectedInsight.details.metrics}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="影响团队">
                  <List
                    size="small"
                    dataSource={selectedInsight.details.affectedTeams}
                    renderItem={(item) => <List.Item><Tag>{item}</Tag></List.Item>}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="建议行动">
                  <Timeline
                    size="small"
                    items={selectedInsight.details.suggestedActions.map((action, index) => ({
                      children: action
                    }))}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AIInsights;