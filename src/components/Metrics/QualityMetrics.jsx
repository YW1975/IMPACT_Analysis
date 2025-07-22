import React from 'react';
import { Card, Row, Col, Statistic, Tooltip, Progress } from 'antd';
import { 
  BugOutlined, 
  CheckCircleOutlined, 
  WarningOutlined,
  FileProtectOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';

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
    <span className={isGood ? 'trend-up' : 'trend-down'}>
      <ArrowDownOutlined /> {Math.abs(change)}%
    </span>
  );
};

const QualityMetrics = ({ metrics, trendData, loading = false }) => {
  if (!metrics) {
    return <Card loading={true} className="metrics-card" />;
  }
  
  const { codeQuality, testCoverage, bugRate, techDebt } = metrics;
  
  return (
    <Card className="metrics-card" loading={loading} title="质量指标">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card className="inner-card">
            <Statistic
              title={
                <Tooltip title="代码质量评分，基于静态代码分析结果">
                  <span>代码质量</span>
                </Tooltip>
              }
              value={codeQuality.value}
              suffix="/100"
              valueStyle={{ color: '#1890ff' }}
              prefix={<FileProtectOutlined />}
            />
            <div className="trend-indicator">
              {getTrendIcon(codeQuality.trend, codeQuality.change)}
            </div>
            <Progress 
              percent={codeQuality.value} 
              size="small" 
              showInfo={false} 
              strokeColor="#1890ff" 
            />
          </Card>
        </Col>
        
        <Col span={12}>
          <Card className="inner-card">
            <Statistic
              title={
                <Tooltip title="测试覆盖率，包括单元测试和集成测试">
                  <span>测试覆盖率</span>
                </Tooltip>
              }
              value={testCoverage.value}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
            <div className="trend-indicator">
              {getTrendIcon(testCoverage.trend, testCoverage.change)}
            </div>
            <Progress 
              percent={testCoverage.value} 
              size="small" 
              showInfo={false} 
              strokeColor="#52c41a" 
            />
          </Card>
        </Col>
        
        <Col span={12}>
          <Card className="inner-card">
            <Statistic
              title={
                <Tooltip title="每千行代码的缺陷数量">
                  <span>缺陷率</span>
                </Tooltip>
              }
              value={bugRate.value}
              suffix="/KLOC"
              valueStyle={{ color: '#f5222d' }}
              prefix={<BugOutlined />}
            />
            <div className="trend-indicator">
              {getTrendIcon(bugRate.trend, bugRate.change)}
            </div>
            <Progress 
              percent={100 - bugRate.value * 10} 
              size="small" 
              showInfo={false} 
              strokeColor="#f5222d" 
            />
          </Card>
        </Col>
        
        <Col span={12}>
          <Card className="inner-card">
            <Statistic
              title={
                <Tooltip title="技术债务，以天为单位的修复时间估计">
                  <span>技术债务</span>
                </Tooltip>
              }
              value={techDebt.value}
              suffix="天"
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
            <div className="trend-indicator">
              {getTrendIcon(techDebt.trend, techDebt.change)}
            </div>
            <Progress 
              percent={100 - Math.min(100, techDebt.value * 5)} 
              size="small" 
              showInfo={false} 
              strokeColor="#faad14" 
            />
          </Card>
        </Col>
      </Row>
      
      {trendData && trendData.length > 0 && (
        <div className="trend-chart" style={{ marginTop: 16, height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Line 
                type="monotone" 
                dataKey="codeQuality" 
                stroke="#1890ff" 
                name="代码质量" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="testCoverage" 
                stroke="#52c41a" 
                name="测试覆盖率" 
              />
              <Line 
                type="monotone" 
                dataKey="bugRate" 
                stroke="#f5222d" 
                name="缺陷率" 
              />
              <Line 
                type="monotone" 
                dataKey="techDebt" 
                stroke="#faad14" 
                name="技术债务" 
                strokeDasharray="5 5" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default QualityMetrics;