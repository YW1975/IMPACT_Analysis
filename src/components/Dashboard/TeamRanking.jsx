import React from 'react';
import { Card, Typography, List, Space, Progress, Tag } from 'antd';
import { 
  TrophyOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  MinusOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// 获取排名图标
const getRankIcon = (index) => {
  const colors = ['#f5b041', '#aab7b8', '#cd6155'];
  if (index < 3) {
    return (
      <TrophyOutlined 
        style={{ 
          fontSize: 18, 
          color: colors[index],
          marginRight: 8
        }} 
      />
    );
  }
  return <Text style={{ width: 26, textAlign: 'center' }}>{index + 1}</Text>;
};

// 获取趋势图标和颜色
const getTrendIcon = (trend, trendValue) => {
  if (!trend || !trendValue) {
    return <MinusOutlined style={{ color: '#8c8c8c' }} />;
  }
  
  return trend === 'up' ? (
    <Tag color="#52c41a" style={{ marginLeft: 8 }}>
      <ArrowUpOutlined /> {trendValue}%
    </Tag>
  ) : (
    <Tag color="#f5222d" style={{ marginLeft: 8 }}>
      <ArrowDownOutlined /> {trendValue}%
    </Tag>
  );
};

// 获取效能等级和颜色
const getEfficiencyColor = (value) => {
  if (value >= 90) return '#52c41a';
  if (value >= 80) return '#1890ff';
  if (value >= 70) return '#faad14';
  if (value >= 60) return '#fa8c16';
  return '#f5222d';
};

const TeamRanking = ({ teams, loading = false }) => {
  return (
    <Card className="team-ranking-card">
      <Title level={4}>团队效能排行</Title>
      <List
        loading={loading}
        dataSource={teams || []}
        renderItem={(team, index) => (
          <List.Item>
            <Space style={{ width: '100%' }}>
              {getRankIcon(index)}
              <div style={{ flex: 1 }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text strong>{team.name}</Text>
                  <Space>
                    <Text>{team.score}</Text>
                    {getTrendIcon(team.trend, team.trendValue)}
                  </Space>
                </Space>
                <Progress 
                  percent={team.score} 
                  strokeColor={getEfficiencyColor(team.score)}
                  showInfo={false}
                  size="small"
                  style={{ marginTop: 4 }}
                />
              </div>
            </Space>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TeamRanking;