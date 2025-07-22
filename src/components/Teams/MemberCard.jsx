import React from 'react';
import { Card, Avatar, Typography, Space, Tag, Progress, Row, Col, Tooltip } from 'antd';
import { 
  UserOutlined, 
  TrophyOutlined, 
  CodeOutlined, 
  TeamOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// 获取效能等级和颜色
const getEfficiencyLevel = (value) => {
  if (value >= 90) return { level: '卓越', color: '#52c41a' };
  if (value >= 80) return { level: '优秀', color: '#1890ff' };
  if (value >= 70) return { level: '良好', color: '#faad14' };
  if (value >= 60) return { level: '一般', color: '#fa8c16' };
  return { level: '需改进', color: '#f5222d' };
};

// 生成随机头像颜色
const getAvatarColor = (name) => {
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96'];
  const charCode = name.charCodeAt(0);
  return colors[charCode % colors.length];
};

const MemberCard = ({ member }) => {
  if (!member) return null;
  
  const efficiencyInfo = getEfficiencyLevel(member.efficiency);
  const contributionInfo = getEfficiencyLevel(member.contribution);
  const avatarColor = getAvatarColor(member.name);
  
  return (
    <Card 
      className="member-card"
      bodyStyle={{ padding: '16px' }}
    >
      <Row gutter={16} align="middle">
        <Col xs={24} sm={8} md={6} lg={5} xl={4}>
          <Space>
            <Avatar 
              size={64} 
              style={{ backgroundColor: avatarColor }}
              icon={<UserOutlined />}
            >
              {member.name.charAt(0)}
            </Avatar>
            <Space direction="vertical" size={0}>
              <Title level={4} style={{ margin: 0 }}>{member.name}</Title>
              <Space size="small">
                <TeamOutlined />
                <Text type="secondary">{member.team}</Text>
              </Space>
              <Text type="secondary">{member.role}</Text>
            </Space>
          </Space>
        </Col>
        
        <Col xs={24} sm={16} md={18} lg={19} xl={20} style={{ marginTop: { xs: 16, sm: 0 } }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space align="center">
                  <TrophyOutlined style={{ color: efficiencyInfo.color }} />
                  <Text strong>效能评分</Text>
                  <Tag color={efficiencyInfo.color}>{efficiencyInfo.level}</Tag>
                </Space>
                <Tooltip title={`效能评分: ${member.efficiency}/100`}>
                  <Progress 
                    percent={member.efficiency} 
                    strokeColor={efficiencyInfo.color}
                    showInfo={false}
                  />
                </Tooltip>
              </Space>
            </Col>
            
            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space align="center">
                  <CodeOutlined style={{ color: contributionInfo.color }} />
                  <Text strong>贡献度</Text>
                  <Tag color={contributionInfo.color}>{contributionInfo.level}</Tag>
                </Space>
                <Tooltip title={`贡献度: ${member.contribution}/100`}>
                  <Progress 
                    percent={member.contribution} 
                    strokeColor={contributionInfo.color}
                    showInfo={false}
                  />
                </Tooltip>
              </Space>
            </Col>
            
            <Col span={24}>
              <Space wrap>
                <Text strong>技能:</Text>
                {member.skills.map(skill => (
                  <Tag key={skill} color="blue">{skill}</Tag>
                ))}
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default MemberCard;