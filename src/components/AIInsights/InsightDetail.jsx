import React from 'react';
import { Card, Typography, Tag, Space, Divider, Button, Tooltip } from 'antd';
import { 
  ClockCircleOutlined, 
  TeamOutlined, 
  ProjectOutlined, 
  TagOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  RightCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

// 根据洞察类型返回对应的颜色
const getTypeColor = (type) => {
  const typeColors = {
    quality: 'blue',
    process: 'orange',
    performance: 'green',
    risk: 'red',
    collaboration: 'purple'
  };
  return typeColors[type] || 'default';
};

// 根据严重程度返回对应的颜色
const getSeverityColor = (severity) => {
  const severityColors = {
    low: 'green',
    medium: 'orange',
    high: 'red'
  };
  return severityColors[severity] || 'default';
};

// 根据状态返回对应的图标和颜色
const getStatusIcon = (status) => {
  const statusConfig = {
    open: { icon: <RightCircleOutlined />, color: 'blue', text: '待处理' },
    in_progress: { icon: <SyncOutlined spin />, color: 'orange', text: '处理中' },
    resolved: { icon: <CheckCircleOutlined />, color: 'green', text: '已解决' },
    closed: { icon: <CloseCircleOutlined />, color: 'default', text: '已关闭' }
  };
  return statusConfig[status] || { icon: <RightCircleOutlined />, color: 'default', text: '未知' };
};

// 格式化日期时间
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const InsightDetail = ({ insight, onClose, onStatusChange }) => {
  if (!insight) return null;
  
  const statusInfo = getStatusIcon(insight.status);
  
  return (
    <Card
      className="insight-detail-card"
      title={
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <Space>
            <Tag color={getTypeColor(insight.type)}>
              {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
            </Tag>
            <Tag color={getSeverityColor(insight.severity)}>
              {insight.severity === 'high' ? '高优先级' : 
               insight.severity === 'medium' ? '中优先级' : '低优先级'}
            </Tag>
            <Tag color={statusInfo.color} icon={statusInfo.icon}>
              {statusInfo.text}
            </Tag>
          </Space>
          <Title level={4} style={{ marginTop: 8, marginBottom: 0 }}>
            {insight.title}
          </Title>
        </Space>
      }
      extra={
        <Button type="primary" onClick={onClose}>
          关闭
        </Button>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Paragraph>
          {insight.description}
        </Paragraph>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <Space size="large">
          <Tooltip title="创建时间">
            <Space>
              <ClockCircleOutlined />
              <Text type="secondary">{formatDateTime(insight.createdAt)}</Text>
            </Space>
          </Tooltip>
          
          <Tooltip title="相关团队">
            <Space>
              <TeamOutlined />
              <Text>{insight.relatedTeam}</Text>
            </Space>
          </Tooltip>
          
          <Tooltip title="相关项目">
            <Space>
              <ProjectOutlined />
              <Text>{insight.relatedProject}</Text>
            </Space>
          </Tooltip>
        </Space>
        
        <Space wrap>
          <TagOutlined />
          {insight.metrics.map(metric => (
            <Tag key={metric}>{metric}</Tag>
          ))}
        </Space>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <Space>
          <Button 
            type="primary" 
            disabled={insight.status === 'resolved' || insight.status === 'closed'}
            onClick={() => onStatusChange(insight.id, 
              insight.status === 'open' ? 'in_progress' : 
              insight.status === 'in_progress' ? 'resolved' : insight.status
            )}
          >
            {insight.status === 'open' ? '开始处理' : 
             insight.status === 'in_progress' ? '标记为已解决' : 
             insight.status === 'resolved' ? '已解决' : '已关闭'}
          </Button>
          
          {insight.status !== 'closed' && (
            <Button 
              danger 
              onClick={() => onStatusChange(insight.id, 'closed')}
            >
              关闭洞察
            </Button>
          )}
        </Space>
      </Space>
    </Card>
  );
};

export default InsightDetail;