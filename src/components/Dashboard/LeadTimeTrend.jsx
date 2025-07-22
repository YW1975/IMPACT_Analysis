import React from 'react';
import { Card, Typography, Empty } from 'antd';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const { Title, Text } = Typography;

// 自定义提示框内容
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-item">
          <span className="tooltip-name">变更前置时间: </span>
          <span className="tooltip-value">{data.leadTime}</span>
          <span className="tooltip-unit"> 小时</span>
        </p>
        <p className="tooltip-item">
          <span className="tooltip-name">变更数量: </span>
          <span className="tooltip-value">{data.changes}</span>
          <span className="tooltip-unit"> 个</span>
        </p>
      </div>
    );
  }
  return null;
};

const LeadTimeTrend = ({ data, loading = false, period = '周' }) => {
  // 确保数据存在
  if (!data || data.length === 0) {
    return (
      <Card className="chart-card" loading={loading}>
        <Title level={4}>变更前置时间趋势</Title>
        <Empty description="暂无变更数据" />
      </Card>
    );
  }

  // 计算平均值用于参考线
  const calculateAverage = (dataKey) => {
    const sum = data.reduce((acc, item) => acc + (item[dataKey] || 0), 0);
    return sum / data.length;
  };

  const leadTimeAvg = calculateAverage('leadTime');

  // 获取最大值以设置Y轴范围
  const maxLeadTime = Math.max(...data.map(item => item.leadTime)) * 1.2;

  return (
    <Card className="chart-card" loading={loading}>
      <Title level={4}>变更前置时间趋势</Title>
      <Text type="secondary">每{period}变更从提交到部署的平均时间</Text>
      
      <div style={{ width: '100%', height: 300, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              domain={[0, maxLeadTime]} 
              label={{ 
                value: '小时', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={leadTimeAvg} 
              stroke="#1890ff" 
              strokeDasharray="3 3" 
              label={{ 
                value: `平均: ${leadTimeAvg.toFixed(1)}小时`, 
                position: 'right', 
                fill: '#1890ff' 
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="leadTime" 
              name="变更前置时间" 
              stroke="#1890ff" 
              fill="#1890ff" 
              fillOpacity={0.3} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default LeadTimeTrend;