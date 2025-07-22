import React from 'react';
import { Card, Typography, Empty } from 'antd';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ZAxis,
  Legend
} from 'recharts';

const { Title, Text } = Typography;

// 自定义提示框内容
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-title">{data.name}</p>
        <p className="tooltip-item">
          <span className="label">效能: </span>
          <span className="value">{data.efficiency}</span>
        </p>
        <p className="tooltip-item">
          <span className="label">速度: </span>
          <span className="value">{data.velocity}</span>
        </p>
        <p className="tooltip-item">
          <span className="label">成员: </span>
          <span className="value">{data.z}人</span>
        </p>
      </div>
    );
  }

  return null;
};

const TeamPerformanceChart = ({ teams }) => {
  // 确保数据存在
  if (!teams || teams.length === 0) {
    return (
      <Card className="chart-card">
        <Title level={4}>团队效能分布</Title>
        <Empty description="暂无团队数据" />
      </Card>
    );
  }
  
  // 转换数据格式
  const chartData = teams.map(team => ({
    name: team.name,
    x: team.velocity,  // X轴为速度
    y: team.efficiency, // Y轴为效能
    z: team.memberCount, // 气泡大小为团队成员数
    efficiency: team.efficiency,
    velocity: team.velocity
  }));
  
  return (
    <Card className="chart-card">
      <Title level={4}>团队效能分布</Title>
      <Text type="secondary">团队效能与速度的关系分析</Text>
      
      <div style={{ width: '100%', height: 300, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="速度" 
              unit="点/周" 
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="效能" 
              unit="%" 
              domain={[0, 100]}
            />
            <ZAxis 
              type="number" 
              dataKey="z" 
              range={[50, 200]} 
              name="成员数" 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Scatter 
              name="团队" 
              data={chartData} 
              fill="#1890ff" 
              shape="circle"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TeamPerformanceChart;