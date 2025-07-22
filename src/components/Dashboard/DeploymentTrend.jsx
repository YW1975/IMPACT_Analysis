import React from 'react';
import { Card, Typography, Empty } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const { Title, Text } = Typography;

// 自定义提示框内容
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            <span className="tooltip-name">{entry.name}: </span>
            <span className="tooltip-value">{entry.value}</span>
            {entry.unit ? <span className="tooltip-unit"> {entry.unit}</span> : null}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DeploymentTrend = ({ data, loading = false, period = '周' }) => {
  // 确保数据存在
  if (!data || data.length === 0) {
    return (
      <Card className="chart-card" loading={loading}>
        <Title level={4}>部署趋势</Title>
        <Empty description="暂无部署数据" />
      </Card>
    );
  }

  // 计算平均值用于参考线
  const calculateAverage = (dataKey) => {
    const sum = data.reduce((acc, item) => acc + (item[dataKey] || 0), 0);
    return sum / data.length;
  };

  const successAvg = calculateAverage('success');
  const failureAvg = calculateAverage('failure');

  return (
    <Card className="chart-card" loading={loading}>
      <Title level={4}>部署趋势</Title>
      <Text type="secondary">每{period}部署成功与失败次数</Text>
      
      <div style={{ width: '100%', height: 300, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine 
              y={successAvg} 
              stroke="#52c41a" 
              strokeDasharray="3 3" 
              label={{ value: '成功平均', position: 'insideBottomRight', fill: '#52c41a' }} 
            />
            <ReferenceLine 
              y={failureAvg} 
              stroke="#f5222d" 
              strokeDasharray="3 3" 
              label={{ value: '失败平均', position: 'insideTopRight', fill: '#f5222d' }} 
            />
            <Line 
              type="monotone" 
              dataKey="success" 
              name="成功部署" 
              stroke="#52c41a" 
              activeDot={{ r: 8 }} 
              unit="次"
            />
            <Line 
              type="monotone" 
              dataKey="failure" 
              name="失败部署" 
              stroke="#f5222d" 
              unit="次"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DeploymentTrend;