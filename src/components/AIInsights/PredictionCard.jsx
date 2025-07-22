import React from 'react';
import { Card, Typography, Tag, Space, Progress, Tooltip, Statistic } from 'antd';
import { 
  LineChartOutlined, 
  ClockCircleOutlined,
  InfoCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const { Title, Text, Paragraph } = Typography;

// 获取预测类型图标和颜色
const getPredictionTypeIcon = (type) => {
  const typeConfig = {
    trend: { icon: <LineChartOutlined />, color: '#1890ff', text: '趋势预测' },
    risk: { icon: <ExclamationCircleOutlined />, color: '#f5222d', text: '风险预测' },
    capacity: { icon: <ClockCircleOutlined />, color: '#52c41a', text: '容量预测' }
  };
  
  return typeConfig[type] || { icon: <LineChartOutlined />, color: '#1890ff', text: '预测' };
};

// 获取置信度标签
const getConfidenceTag = (confidence) => {
  let color = '#d9d9d9';
  if (confidence >= 90) color = '#52c41a';
  else if (confidence >= 70) color = '#1890ff';
  else if (confidence >= 50) color = '#faad14';
  else color = '#f5222d';
  
  return <Tag color={color}>置信度: {confidence}%</Tag>;
};

// 获取趋势图标和颜色
const getTrendIcon = (trend, value) => {
  if (!trend || value === undefined) return null;
  
  const isPositive = trend === 'up';
  const isGood = trend === 'good';
  
  return isPositive ? (
    <span className={isGood ? 'trend-up' : 'trend-down'}>
      <ArrowUpOutlined /> {Math.abs(value)}%
    </span>
  ) : (
    <span className={isGood ? 'trend-up' : 'trend-down'}>
      <ArrowDownOutlined /> {Math.abs(value)}%
    </span>
  );
};

const PredictionCard = ({ prediction }) => {
  const typeConfig = getPredictionTypeIcon(prediction.type);
  
  return (
    <Card 
      className="prediction-card"
      title={
        <Space>
          <span style={{ color: typeConfig.color }}>{typeConfig.icon}</span>
          <span>{prediction.title}</span>
        </Space>
      }
      extra={getConfidenceTag(prediction.confidence)}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Paragraph>{prediction.description}</Paragraph>
        
        {prediction.current !== undefined && prediction.predicted !== undefined && (
          <div className="prediction-values">
            <Space size="large">
              <Statistic 
                title="当前值" 
                value={prediction.current} 
                suffix={prediction.unit} 
                precision={1}
              />
              <Statistic 
                title={
                  <Tooltip title="AI预测的未来值">
                    <span>预测值 <InfoCircleOutlined /></span>
                  </Tooltip>
                } 
                value={prediction.predicted} 
                suffix={prediction.unit} 
                precision={1}
                valueStyle={{ color: '#1890ff' }}
              />
              {prediction.change !== undefined && (
                <Statistic 
                  title="变化率" 
                  value={prediction.change} 
                  suffix="%" 
                  precision={1}
                  prefix={prediction.change > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  valueStyle={{ 
                    color: (prediction.change > 0 && prediction.trend === 'good') || 
                           (prediction.change < 0 && prediction.trend === 'bad') ? 
                           '#52c41a' : '#f5222d' 
                  }}
                />
              )}
            </Space>
          </div>
        )}
        
        {prediction.timeframe && (
          <div className="prediction-timeframe">
            <Tag icon={<ClockCircleOutlined />} color="blue">
              预测时间范围: {prediction.timeframe}
            </Tag>
          </div>
        )}
        
        {prediction.data && prediction.data.length > 0 && (
          <div className="prediction-chart" style={{ height: 200, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prediction.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#52c41a" 
                  name="实际值" 
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#1890ff" 
                  name="预测值" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
                {prediction.threshold !== undefined && (
                  <ReferenceLine 
                    y={prediction.threshold} 
                    stroke="#f5222d" 
                    strokeDasharray="3 3" 
                    label={{ value: '阈值', position: 'right', fill: '#f5222d' }} 
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {prediction.factors && prediction.factors.length > 0 && (
          <div className="prediction-factors" style={{ marginTop: 16 }}>
            <Text strong>影响因素:</Text>
            <div style={{ marginTop: 8 }}>
              {prediction.factors.map((factor, index) => (
                <Tag key={index} style={{ marginBottom: 8 }}>
                  {factor.name}: {factor.impact > 0 ? '+' : ''}{factor.impact}%
                </Tag>
              ))}
            </div>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default PredictionCard;