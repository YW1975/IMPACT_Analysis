import React from 'react';
import { Card, Row, Col, Statistic, Tooltip, Typography, Divider } from 'antd';
import { 
  RocketOutlined, 
  FieldTimeOutlined, 
  WarningOutlined, 
  MedicineBoxOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

// 获取趋势指标和颜色
const getTrendInfo = (current, previous) => {
  if (!previous) return { value: 0, isUp: false, color: 'grey' };
  
  const diff = current - previous;
  const percentage = (diff / previous) * 100;
  
  // 对于部署频率和前置时间，上升是好的
  if (['deploymentFrequency'].includes('deploymentFrequency')) {
    return {
      value: Math.abs(percentage).toFixed(1),
      isUp: diff > 0,
      color: diff > 0 ? '#3f8600' : '#cf1322'
    };
  }
  
  // 对于失败率和恢复时间，下降是好的
  return {
    value: Math.abs(percentage).toFixed(1),
    isUp: diff > 0,
    color: diff < 0 ? '#3f8600' : '#cf1322'
  };
};

const DoraMetrics = ({ data, trendData }) => {
  // 确保数据存在
  if (!data || !trendData) {
    return <Card loading />;
  }
  
  // 获取前一个时间段的数据（用于计算趋势）
  const getLastPeriodData = (metricName) => {
    const metricData = trendData[metricName] || [];
    return metricData.length > 1 ? metricData[metricData.length - 2].value : null;
  };
  
  // 计算各指标的趋势
  const deploymentTrend = getTrendInfo(data.deploymentFrequency, getLastPeriodData('deploymentFrequency'));
  const leadTimeTrend = getTrendInfo(data.leadTime, getLastPeriodData('leadTime'));
  const failureRateTrend = getTrendInfo(data.changeFailureRate, getLastPeriodData('changeFailureRate'));
  const restoreTimeTrend = getTrendInfo(data.timeToRestore, getLastPeriodData('timeToRestore'));
  
  return (
    <Card className="dora-metrics-card">
      <Title level={4}>DORA指标</Title>
      <Text type="secondary">DevOps研究与评估关键指标</Text>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="metric-card">
            <Statistic
              title={
                <Tooltip title="每月部署到生产环境的频率">
                  <span>部署频率</span>
                </Tooltip>
              }
              value={data.deploymentFrequency}
              precision={1}
              valueStyle={{ color: '#1890ff' }}
              prefix={<RocketOutlined />}
              suffix="次/月"
            />
            {deploymentTrend.value > 0 && (
              <div className="trend-indicator">
                {deploymentTrend.isUp ? (
                  <Text type="success">
                    <ArrowUpOutlined /> {deploymentTrend.value}%
                  </Text>
                ) : (
                  <Text type="danger">
                    <ArrowDownOutlined /> {deploymentTrend.value}%
                  </Text>
                )}
              </div>
            )}
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card className="metric-card">
            <Statistic
              title={
                <Tooltip title="从代码提交到成功部署到生产环境所需的时间">
                  <span>变更前置时间</span>
                </Tooltip>
              }
              value={data.leadTime}
              precision={1}
              valueStyle={{ color: '#52c41a' }}
              prefix={<FieldTimeOutlined />}
              suffix="天"
            />
            {leadTimeTrend.value > 0 && (
              <div className="trend-indicator">
                {!leadTimeTrend.isUp ? (
                  <Text type="success">
                    <ArrowDownOutlined /> {leadTimeTrend.value}%
                  </Text>
                ) : (
                  <Text type="danger">
                    <ArrowUpOutlined /> {leadTimeTrend.value}%
                  </Text>
                )}
              </div>
            )}
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card className="metric-card">
            <Statistic
              title={
                <Tooltip title="部署到生产环境后导致服务降级或需要修复的变更百分比">
                  <span>变更失败率</span>
                </Tooltip>
              }
              value={data.changeFailureRate}
              precision={1}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
              suffix="%"
            />
            {failureRateTrend.value > 0 && (
              <div className="trend-indicator">
                {!failureRateTrend.isUp ? (
                  <Text type="success">
                    <ArrowDownOutlined /> {failureRateTrend.value}%
                  </Text>
                ) : (
                  <Text type="danger">
                    <ArrowUpOutlined /> {failureRateTrend.value}%
                  </Text>
                )}
              </div>
            )}
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card className="metric-card">
            <Statistic
              title={
                <Tooltip title="从生产环境故障发生到恢复服务所需的时间">
                  <span>平均恢复时间</span>
                </Tooltip>
              }
              value={data.timeToRestore}
              valueStyle={{ color: '#f5222d' }}
              prefix={<MedicineBoxOutlined />}
              suffix="分钟"
            />
            {restoreTimeTrend.value > 0 && (
              <div className="trend-indicator">
                {!restoreTimeTrend.isUp ? (
                  <Text type="success">
                    <ArrowDownOutlined /> {restoreTimeTrend.value}%
                  </Text>
                ) : (
                  <Text type="danger">
                    <ArrowUpOutlined /> {restoreTimeTrend.value}%
                  </Text>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
      
      <Divider />
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="部署频率趋势" className="chart-card">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData.deploymentFrequency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1890ff" 
                  activeDot={{ r: 8 }} 
                  name="部署频率（次/月）"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="变更前置时间趋势" className="chart-card">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData.leadTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#52c41a" 
                  activeDot={{ r: 8 }} 
                  name="变更前置时间（天）"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="变更失败率趋势" className="chart-card">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData.changeFailureRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#faad14" 
                  activeDot={{ r: 8 }} 
                  name="变更失败率（%）"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="平均恢复时间趋势" className="chart-card">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData.timeToRestore}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f5222d" 
                  activeDot={{ r: 8 }} 
                  name="平均恢复时间（分钟）"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default DoraMetrics;