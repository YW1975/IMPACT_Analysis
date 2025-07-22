import React from 'react';
import { Card, Avatar, Typography, Space, Tag, Progress, Row, Col, Tooltip, Divider } from 'antd';
import { 
  TeamOutlined, 
  TrophyOutlined, 
  RocketOutlined, 
  SmileOutlined,
  CodeOutlined,
  CheckCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { Radar } from 'recharts';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

// 获取趋势图标和颜色
const getTrendIcon = (trend, trendValue) => {
  if (!trendValue) return null;
  
  return trend === 'up' ? (
    <Text type="success" style={{ fontSize: '12px' }}>
      <ArrowUpOutlined /> {trendValue}%
    </Text>
  ) : (
    <Text type="danger" style={{ fontSize: '12px' }}>
      <ArrowDownOutlined /> {trendValue}%
    </Text>
  );
};

// 获取效能等级和颜色
const getEfficiencyLevel = (value) => {
  if (value >= 90) return { level: '卓越', color: '#52c41a' };
  if (value >= 80) return { level: '优秀', color: '#1890ff' };
  if (value >= 70) return { level: '良好', color: '#faad14' };
  if (value >= 60) return { level: '一般', color: '#fa8c16' };
  return { level: '需改进', color: '#f5222d' };
};

const TeamCard = ({ team, showDetails = false }) => {
  if (!team) return null;
  
  const efficiencyInfo = getEfficiencyLevel(team.efficiency);
  
  // 将技能数据转换为雷达图所需格式
  const skillsData = team.skills.map(skill => ({
    subject: skill.name,
    A: skill.value,
    fullMark: 100
  }));
  
  return (
    <Card 
      className="team-card"
      title={
        <Space>
          <Avatar 
            size="large" 
            style={{ backgroundColor: efficiencyInfo.color }}
            icon={<TeamOutlined />}
          />
          <Space direction="vertical" size={0}>
            <Title level={4} style={{ margin: 0 }}>{team.name}</Title>
            <Space size="small">
              <Text type="secondary">负责人: {team.lead}</Text>
              <Text type="secondary">·</Text>
              <Text type="secondary">{team.memberCount}名成员</Text>
            </Space>
          </Space>
        </Space>
      }
      extra={
        <Tag color={efficiencyInfo.color}>
          {efficiencyInfo.level}
        </Tag>
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={showDetails ? 12 : 24}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div>
              <Space align="center">
                <TrophyOutlined style={{ color: efficiencyInfo.color }} />
                <Text strong>团队效能</Text>
                {getTrendIcon(team.trend, team.trendValue)}
              </Space>
              <Tooltip title={`效能评分: ${team.efficiency}/100`}>
                <Progress 
                  percent={team.efficiency} 
                  strokeColor={efficiencyInfo.color}
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
              </Tooltip>
            </div>
            
            <Row gutter={16}>
              <Col span={8}>
                <Tooltip title="团队速度">
                  <div className="team-stat">
                    <RocketOutlined style={{ color: '#1890ff' }} />
                    <div>
                      <div className="stat-value">{team.velocity}</div>
                      <div className="stat-label">速度</div>
                    </div>
                  </div>
                </Tooltip>
              </Col>
              
              <Col span={8}>
                <Tooltip title="团队满意度">
                  <div className="team-stat">
                    <SmileOutlined style={{ color: '#52c41a' }} />
                    <div>
                      <div className="stat-value">{team.satisfaction}</div>
                      <div className="stat-label">满意度</div>
                    </div>
                  </div>
                </Tooltip>
              </Col>
              
              <Col span={8}>
                <Tooltip title="代码质量评分">
                  <div className="team-stat">
                    <CodeOutlined style={{ color: '#722ed1' }} />
                    <div>
                      <div className="stat-value">{team.qualityScore}</div>
                      <div className="stat-label">质量</div>
                    </div>
                  </div>
                </Tooltip>
              </Col>
            </Row>
            
            {!showDetails && (
              <Space wrap>
                {team.skills.slice(0, 3).map(skill => (
                  <Tag key={skill.name} color="blue">{skill.name}</Tag>
                ))}
                {team.skills.length > 3 && (
                  <Tag>+{team.skills.length - 3}</Tag>
                )}
              </Space>
            )}
          </Space>
        </Col>
        
        {showDetails && (
          <Col xs={24} md={12}>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={skillsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="技能"
                    dataKey="A"
                    stroke={efficiencyInfo.color}
                    fill={efficiencyInfo.color}
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Col>
        )}
      </Row>
      
      {showDetails && (
        <>
          <Divider>DORA指标</Divider>
          
          <Row gutter={16}>
            <Col span={6}>
              <Tooltip title="部署频率（次/月）">
                <div className="team-metric">
                  <Text type="secondary">部署频率</Text>
                  <Text strong>{team.metrics.deployFrequency}</Text>
                </div>
              </Tooltip>
            </Col>
            
            <Col span={6}>
              <Tooltip title="变更前置时间（天）">
                <div className="team-metric">
                  <Text type="secondary">前置时间</Text>
                  <Text strong>{team.metrics.leadTime}</Text>
                </div>
              </Tooltip>
            </Col>
            
            <Col span={6}>
              <Tooltip title="变更失败率（%）">
                <div className="team-metric">
                  <Text type="secondary">失败率</Text>
                  <Text strong>{team.metrics.failureRate}%</Text>
                </div>
              </Tooltip>
            </Col>
            
            <Col span={6}>
              <Tooltip title="平均恢复时间（分钟）">
                <div className="team-metric">
                  <Text type="secondary">恢复时间</Text>
                  <Text strong>{team.metrics.mttr}</Text>
                </div>
              </Tooltip>
            </Col>
          </Row>
          
          <Divider>质量指标</Divider>
          
          <Row gutter={16}>
            <Col span={12}>
              <Tooltip title="代码质量评分">
                <div className="team-metric">
                  <Text type="secondary">代码质量</Text>
                  <Progress 
                    percent={team.metrics.codeQuality} 
                    size="small" 
                    format={percent => `${percent}`}
                  />
                </div>
              </Tooltip>
            </Col>
            
            <Col span={12}>
              <Tooltip title="测试覆盖率（%）">
                <div className="team-metric">
                  <Text type="secondary">测试覆盖率</Text>
                  <Progress 
                    percent={team.metrics.testCoverage} 
                    size="small" 
                    strokeColor="#52c41a"
                    format={percent => `${percent}%`}
                  />
                </div>
              </Tooltip>
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
};

export default TeamCard;