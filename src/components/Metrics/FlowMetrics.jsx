import React from 'react';
import { Card, Row, Col, Statistic, Tooltip, Typography, Divider } from 'antd';
import { 
  PercentageOutlined, 
  FieldTimeOutlined, 
  AppstoreOutlined, 
  ThunderboltOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

// 获取趋势指标和颜色
const getTrendInfo = (current, previous, metricName) => {
  if (!previous) return { value: 0, isUp: false, color: 'grey' };
  
  const diff = current - previous;
  const percentage = (diff / previous) * 100;
  
  // 对于流动效率和吞吐量，上升是好的
  if (['flowEfficiency', 'throughput'].includes(metricName)) {
    return {
      value: Math.abs(percentage).toFixed(1),
      isUp: diff > 0,
      color: diff > 0 ? '#3f8600' : '#cf1322'
    };
  }
  
  // 对于WIP和周期时间，下降是好的
  return {
    value: Math.abs(percentage).toFixed(1),
    isUp: diff > 0,
    color: diff < 0 ? '#3f8600' : '#cf1322'
  };
};

const FlowMetrics = ({ data, trendData }) => {
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
  const flowEfficiencyTrend = getTrendInfo(data.flowEfficiency, getLastPeriodData('flowEfficiency'), 'flowEfficiency');
  const wipTrend = getTrendInfo(data.wipCount, getLastPeriodData('wipTrend'), 'wipTrend');
  const cycleTimeTrend = getTrendInfo(data.cycleTime, getLastPeriodData('cycleTime'), 'cycleTime');
  const throughputTrend = getTrendInfo(data.throughput, getLastPeriodData('throughput'), 'throughput');
  
  return (
    <Card className="flow-metrics-card">
      <Title level={4}>流动效率指标</Title>
      <Text type="secondary">价值流动与精益软件开发指标</Text>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="metric-card">
            <Statistic
              title={
                <Tooltip title="工作项在增值状态的时间占总周期时间的百分比">
                  <span>流动效率</span>
                </Tooltip>
              }
              value={data.flowEfficiency}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<PercentageOutlined />}
              suffix="%"
            />
            {flowEfficiencyTrend.value > 0 && (
              <div className="trend-indicator">
                {flowEfficiencyTrend.isUp ? (
                  <Text type="success">
                    <ArrowUpOutlined /> {flowEfficiencyTrend.value}%
                  </Text>
                ) : (
                  <Text type="danger">
                    <ArrowDownOutlined /> {flowEfficiencyTrend.value}%
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
                <Tooltip title="当前正在进行中的工作项数量">
                  <span>在制品数量</span>
                </Tooltip>
              }
              value={data.wipCount}
              valueStyle={{ color: '#faad14' }}
              prefix={<AppstoreOutlined />}
              suffix="项"
            />
            {wipTrend.value > 0 && (
              <div className="trend-indicator">
                {!wipTrend.isUp ? (
                  <Text type="success">
                    <ArrowDownOutlined /> {wipTrend.value}%
                  </Text>
                ) : (
                  <Text type="danger">
                    <ArrowUpOutlined /> {wipTrend.value}%
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
                <Tooltip title="工作项从开始到完成所需的平均时间">
                  <span>周期时间</span>
                </Tooltip>
              }
              value={data.cycleTime}
              precision={1}
              valueStyle={{ color: '#52c41a' }}
              prefix={<FieldTimeOutlined />}
              suffix="天"
            />
            {cycleTimeTrend.value > 0 && (
              <div className="trend-indicator">
                {!cycleTimeTrend.isUp ? (
                  <Text type="success">
                    <ArrowDownOutlined /> {cycleTimeTrend.value}%
                  </Text>
                ) : (
                  <Text type="danger">
                    <ArrowUpOutlined /> {cycleTimeTrend.value}%
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
                <Tooltip title="单位时间内完成的工作项数量">
                  <span>吞吐量</span>
                </Tooltip>
              }
              value={data.throughput}
              valueStyle={{ color: '#f5222d' }}
              prefix={<ThunderboltOutlined />}
              suffix="项/月"
            />
            {throughputTrend.value > 0 && (
              <div className="trend-indicator">
                {throughputTrend.isUp ? (
                  <Text type="success">
                    <ArrowUpOutlined /> {throughputTrend.value}%
                  </Text>
                ) : (
                  <Text type="danger">
                    <ArrowDownOutlined /> {throughputTrend.value}%
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
          <Card title="流动效率趋势" className="chart-card">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData.flowEfficiency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1890ff" 
                  activeDot={{ r: 8 }} 
                  name="流动效率（%）"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="在制品数量趋势" className="chart-card">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData.wipTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#faad14" 
                  activeDot={{ r: 8 }} 
                  name="在制品数量（项）"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="周期时间趋势" className="chart-card">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData.cycleTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#52c41a" 
                  activeDot={{ r: 8 }} 
                  name="周期时间（天）"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="吞吐量趋势" className="chart-card">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData.throughput}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f5222d" 
                  activeDot={{ r: 8 }} 
                  name="吞吐量（项/月）"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default FlowMetrics;