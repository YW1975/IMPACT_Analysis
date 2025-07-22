import React from 'react';
import { Card, Typography, Tag, Space, Button, Tooltip, Badge } from 'antd';
import { 
  BulbOutlined, 
  RiseOutlined, 
  FallOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RightOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// 获取洞察类型图标和颜色
const getInsightTypeIcon = (type) => {
  const typeConfig = {
    improvement: { icon: <RiseOutlined />, color: '#52c41a', text: '改进' },
    warning: { icon: <FallOutlined />, color: '#f5222d', text: '警告' },
    suggestion: { icon: <BulbOutlined />, color: '#1890ff', text: '建议' },
    prediction: { icon: <ClockCircleOutlined />, color: '#722ed1', text: '预测' }
  };
  
  return typeConfig[type] || { icon: <BulbOutlined />, color: '#1890ff', text: '洞察' };
};

// 获取严重程度标签
const getSeverityTag = (severity) => {
  const severityConfig = {
    high: { color: '#f5222d', text: '高' },
    medium: { color: '#faad14', text: '中' },
    low: { color: '#52c41a', text: '低' }
  };
  
  const config = severityConfig[severity] || { color: 'default', text: severity };
  return <Tag color={config.color}>{config.text}</Tag>;
};

// 获取状态标签
const getStatusTag = (status) => {
  const statusConfig = {
    new: { color: '#1890ff', text: '新' },
    in_progress: { color: '#faad14', text: '处理中' },
    resolved: { color: '#52c41a', text: '已解决' },
    ignored: { color: '#d9d9d9', text: '已忽略' }
  };
  
  const config = statusConfig[status] || { color: 'default', text: status };
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

const InsightCard = ({ insight, onClick }) => {
  const typeConfig = getInsightTypeIcon(insight.type);
  
  return (
    <Badge.Ribbon text={typeConfig.text} color={typeConfig.color}>
      <Card 
        className="insight-card"
        hoverable
        onClick={() => onClick && onClick(insight)}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              {getSeverityTag(insight.severity)}
              {getStatusTag(insight.status)}
            </Space>
            <Text type="secondary">{formatTime(insight.timestamp)}</Text>
          </Space>
          
          <Title level={5} style={{ marginTop: 0 }}>
            {insight.title}
          </Title>
          
          <Paragraph 
            ellipsis={{ rows: 3, expandable: false }} 
            style={{ marginBottom: 8 }}
          >
            {insight.description}
          </Paragraph>
          
          <Space wrap>
            {insight.metrics && insight.metrics.map((metric, index) => (
              <Tag key={index}>{metric}</Tag>
            ))}
          </Space>
          
          <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 8 }}>
            <Space>
              {insight.team && <Tag color="blue">{insight.team}</Tag>}
              {insight.project && <Tag color="cyan">{insight.project}</Tag>}
            </Space>
            
            <Tooltip title="查看详情">
              <Button 
                type="link" 
                icon={<RightOutlined />} 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick && onClick(insight);
                }}
              />
            </Tooltip>
          </Space>
        </Space>
      </Card>
    </Badge.Ribbon>
  );
};

export default InsightCard;