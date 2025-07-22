import React from 'react';
import { Card, Row, Col, Statistic, Tooltip, Progress, Typography } from 'antd';
import { 
  TeamOutlined, 
  RocketOutlined, 
  SmileOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';

const { Text } = Typography;

// 获取趋势图标和颜色
const getTrendIcon = (trend, change) => {
  if (!trend || !change) return null;
  
  const isPositive = trend === 'up';
  const isGood = (isPositive && change > 0) || (!isPositive && change < 0);
  
  return isPositive ? (
    <span className={isGood ? 'trend-up' : 'trend-down'}>
      <ArrowUpOutlined /> {Math.abs(change)}%
    </span>
  ) : (
    <span className={isGood ? 'trend-down' : 'trend-up'}>
      <ArrowDownOutlined /> {Math.abs(change)}%
    </span>
  );
};

// 获取评分等级
const getScoreLevel = (score) => {
  if (score >= 90) return { text: '卓越', color: '#52c41a' };
  if (score >= 80) return { text: '优秀', color: '#1890ff' };
  if (score >= 70) return { text: '良好', color: '#faad14' };
  if (score >= 60) return { text: '一般', color: '#fa8c16' };
  return { text: '需改进', color: '#f5222d' };
};

const TeamMetrics = ({ metrics, radarData, loading = false }) => {
  if (!metrics) {
    return <Card loading={true} className="metrics-card" />;
  }
  
  const { performance, velocity, satisfaction, collaboration } = metrics;
  
  // 获取团队整体评分
  const overallScore = Math.round(
    (performance.value + velocity.value + satisfaction.value * 20 + collaboration.value) / 4
  );
  const scoreLevel = getScoreLevel(overallScore);
  
  return (
    <Card className="metrics-card" loading={loading} title="团队指标">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card className="inner-card team-score-card">
            <Statistic
              title={
                <Tooltip title="团队整体效能评分">
                  <span>团队评分</span>
                </Tooltip>
              }
              value={overallScore}
              suffix="/100"
              valueStyle={{ color: scoreLevel.color }}
              prefix={<TrophyOutlined />}
            />
            <Text style={{ color: scoreLevel.color }}>{scoreLevel.text}</Text>
            <Progress 
              percent={overallScore} 
              size="small" 
              showInfo={false} 
              strokeColor={scoreLevel.color} 
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        
        <Col span={12}>
          <Card className="inner-card">
            <Statistic
              title={
                <Tooltip title="团队整体效能表现">
                  <span>效能</span>
                </Tooltip>
              }
              value={performance.value}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
              prefix={<TeamOutlined />}
            />
            <div className="trend-indicator">
              {getTrendIcon(performance.trend, performance.change)}
            </div>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card className="inner-card">
            <Statistic
              title={
                <Tooltip title="团队交付速度，以每周完成的故事点数量衡量">
                  <span>速度</span>
                </Tooltip>
              }
              value={velocity.value}
              suffix="点/周"
              valueStyle={{ color: '#52c41a' }}
              prefix={<RocketOutlined />}
            />
            <div className="trend-indicator">
              {getTrendIcon(velocity.trend, velocity.change)}
            </div>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card className="inner-card">
            <Statistic
              title={
                <Tooltip title="团队成员满意度评分">
                  <span>满意度</span>
                </Tooltip>
              }
              value={satisfaction.value}
              suffix="/5"
              valueStyle={{ color: '#722ed1' }}
              prefix={<SmileOutlined />}
            />
            <div className="trend-indicator">
              {getTrendIcon(satisfaction.trend, satisfaction.change)}
            </div>
            <Progress 
              percent={satisfaction.value * 20} 
              size="small" 
              showInfo={false} 
              strokeColor="#722ed1" 
            />
          </Card>
        </Col>
        
        <Col span={12}>
          <Card className="inner-card">
            <Statistic
              title={
                <Tooltip title="团队协作效率评分">
                  <span>协作</span>
                </Tooltip>
              }
              value={collaboration.value}
              suffix="%"
              valueStyle={{ color: '#fa8c16' }}
              prefix={<TeamOutlined />}
            />
            <div className="trend-indicator">
              {getTrendIcon(collaboration.trend, collaboration.change)}
            </div>
            <Progress 
              percent={collaboration.value} 
              size="small" 
              showInfo={false} 
              strokeColor="#fa8c16" 
            />
          </Card>
        </Col>
      </Row>
      
      {radarData && radarData.length > 0 && (
        <div className="radar-chart" style={{ marginTop: 16, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar 
                name="当前团队" 
                dataKey="value" 
                stroke="#1890ff" 
                fill="#1890ff" 
                fillOpacity={0.6} 
              />
              {radarData[0].benchmark && (
                <Radar 
                  name="行业基准" 
                  dataKey="benchmark" 
                  stroke="#52c41a" 
                  fill="#52c41a" 
                  fillOpacity={0.3} 
                />
              )}
              <RechartsTooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default TeamMetrics;