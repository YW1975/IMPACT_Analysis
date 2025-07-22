import React from 'react';
import { Card, Typography, Tag, Space, Button, Progress, List, Tooltip } from 'antd';
import { 
  BulbOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  RightOutlined,
  ArrowUpOutlined,
  LineChartOutlined,
  TeamOutlined,
  CodeOutlined,
  RocketOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// 获取改进类型图标和颜色
const getRecommendationIcon = (category) => {
  const categoryConfig = {
    process: { icon: <LineChartOutlined />, color: '#1890ff', text: '流程' },
    team: { icon: <TeamOutlined />, color: '#52c41a', text: '团队' },
    code: { icon: <CodeOutlined />, color: '#722ed1', text: '代码' },
    deployment: { icon: <RocketOutlined />, color: '#fa8c16', text: '部署' },
    testing: { icon: <CheckCircleOutlined />, color: '#faad14', text: '测试' }
  };
  
  return categoryConfig[category] || { icon: <BulbOutlined />, color: '#1890ff', text: '建议' };
};

// 获取预期影响标签
const getImpactTag = (impact) => {
  const impactConfig = {
    high: { color: '#f5222d', text: '高影响' },
    medium: { color: '#faad14', text: '中等影响' },
    low: { color: '#52c41a', text: '低影响' }
  };
  
  const config = impactConfig[impact] || { color: 'default', text: impact };
  return <Tag color={config.color}>{config.text}</Tag>;
};

// 获取实施难度标签
const getDifficultyTag = (difficulty) => {
  const difficultyConfig = {
    easy: { color: '#52c41a', text: '容易' },
    medium: { color: '#faad14', text: '中等' },
    hard: { color: '#f5222d', text: '困难' }
  };
  
  const config = difficultyConfig[difficulty] || { color: 'default', text: difficulty };
  return <Tag color={config.color}>{config.text}</Tag>;
};

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const RecommendationCard = ({ recommendation, onClick }) => {
  const categoryConfig = getRecommendationIcon(recommendation.category);
  
  return (
    <Card 
      className="recommendation-card"
      hoverable
      onClick={() => onClick && onClick(recommendation)}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Tag color={categoryConfig.color} icon={categoryConfig.icon}>
              {categoryConfig.text}
            </Tag>
            {getImpactTag(recommendation.impact)}
            {getDifficultyTag(recommendation.difficulty)}
          </Space>
          <Text type="secondary">{formatTime(recommendation.timestamp)}</Text>
        </Space>
        
        <Title level={5} style={{ marginTop: 8 }}>
          {recommendation.title}
        </Title>
        
        <Paragraph 
          ellipsis={{ rows: 2, expandable: false }} 
          style={{ marginBottom: 8 }}
        >
          {recommendation.description}
        </Paragraph>
        
        {recommendation.benefits && (
          <div className="benefits-section">
            <Text strong>预期收益:</Text>
            <List
              size="small"
              dataSource={recommendation.benefits}
              renderItem={benefit => (
                <List.Item>
                  <Space>
                    <ArrowUpOutlined style={{ color: '#52c41a' }} />
                    <Text>{benefit}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        )}
        
        {recommendation.implementation_progress !== undefined && (
          <div className="progress-section" style={{ marginTop: 8 }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text>实施进度</Text>
              <Text>{recommendation.implementation_progress}%</Text>
            </Space>
            <Progress 
              percent={recommendation.implementation_progress} 
              size="small" 
              status={recommendation.implementation_progress === 100 ? 'success' : 'active'}
            />
          </div>
        )}
        
        <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 8 }}>
          <Space>
            {recommendation.team && <Tag color="blue">{recommendation.team}</Tag>}
            {recommendation.estimated_time && (
              <Tooltip title="预计实施时间">
                <Tag icon={<ClockCircleOutlined />}>{recommendation.estimated_time}</Tag>
              </Tooltip>
            )}
          </Space>
          
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              icon={<RightOutlined />} 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onClick && onClick(recommendation);
              }}
            />
          </Tooltip>
        </Space>
      </Space>
    </Card>
  );
};

export default RecommendationCard;