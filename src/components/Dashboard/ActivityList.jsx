import React from 'react';
import { List, Typography, Tag, Space, Avatar, Tooltip } from 'antd';
import { 
  RocketOutlined, 
  CodeOutlined, 
  WarningOutlined, 
  CheckCircleOutlined,
  TeamOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;

// 获取活动类型图标和颜色
const getActivityIcon = (type) => {
  const iconConfig = {
    deployment: { icon: <RocketOutlined />, color: '#1890ff', text: '部署' },
    code: { icon: <CodeOutlined />, color: '#52c41a', text: '代码' },
    incident: { icon: <WarningOutlined />, color: '#f5222d', text: '事件' },
    test: { icon: <CheckCircleOutlined />, color: '#722ed1', text: '测试' },
    meeting: { icon: <TeamOutlined />, color: '#faad14', text: '会议' }
  };
  
  return iconConfig[type] || { icon: <CodeOutlined />, color: '#1890ff', text: '活动' };
};

// 获取状态标签
const getStatusTag = (status) => {
  const statusConfig = {
    success: { color: '#52c41a', text: '成功' },
    failed: { color: '#f5222d', text: '失败' },
    in_progress: { color: '#1890ff', text: '进行中' },
    resolved: { color: '#722ed1', text: '已解决' },
    completed: { color: '#faad14', text: '已完成' }
  };
  
  const config = statusConfig[status] || { color: 'default', text: status };
  return <Tag color={config.color}>{config.text}</Tag>;
};

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return '刚刚';
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  if (diffDay < 7) return `${diffDay}天前`;
  
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ActivityList = ({ activities, loading = false }) => {
  return (
    <List
      className="activity-list"
      loading={loading}
      itemLayout="horizontal"
      dataSource={activities || []}
      renderItem={activity => {
        const iconConfig = getActivityIcon(activity.type);
        
        return (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={iconConfig.icon} 
                  style={{ backgroundColor: iconConfig.color }}
                />
              }
              title={
                <Space>
                  <Text strong>{activity.description}</Text>
                  {getStatusTag(activity.status)}
                </Space>
              }
              description={
                <Space>
                  <Text type="secondary">{activity.project}</Text>
                  <Text type="secondary">·</Text>
                  <Text type="secondary">{activity.user}</Text>
                  <Text type="secondary">·</Text>
                  <Tooltip title={new Date(activity.timestamp).toLocaleString()}>
                    <Text type="secondary">
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {formatTime(activity.timestamp)}
                    </Text>
                  </Tooltip>
                </Space>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default ActivityList;