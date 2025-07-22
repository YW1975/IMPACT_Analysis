import React from 'react';
import { Card, Typography, Space, Tag, Progress, Row, Col, Tooltip, Divider } from 'antd';
import { 
  ProjectOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  UserOutlined,
  RocketOutlined,
  FieldTimeOutlined,
  WarningOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

// 获取项目状态标签
const getStatusTag = (status) => {
  const statusConfig = {
    active: { color: '#52c41a', text: '进行中' },
    planning: { color: '#1890ff', text: '规划中' },
    completed: { color: '#722ed1', text: '已完成' },
    paused: { color: '#faad14', text: '已暂停' },
    cancelled: { color: '#f5222d', text: '已取消' }
  };
  
  const config = statusConfig[status] || { color: 'default', text: '未知' };
  return <Tag color={config.color}>{config.text}</Tag>;
};

// 获取健康度标签
const getHealthTag = (health) => {
  const healthConfig = {
    excellent: { color: '#52c41a', text: '优秀' },
    good: { color: '#1890ff', text: '良好' },
    fair: { color: '#faad14', text: '一般' },
    poor: { color: '#f5222d', text: '较差' },
    critical: { color: '#cf1322', text: '危险' }
  };
  
  const config = healthConfig[health] || { color: 'default', text: '未知' };
  return <Tag color={config.color}>{config.text}</Tag>;
};

// 获取风险标签
const getRiskTag = (risk) => {
  const riskConfig = {
    low: { color: '#52c41a', text: '低风险' },
    medium: { color: '#faad14', text: '中风险' },
    high: { color: '#f5222d', text: '高风险' }
  };
  
  const config = riskConfig[risk] || { color: 'default', text: '未知' };
  return <Tag color={config.color}>{config.text}</Tag>;
};

// 获取优先级标签
const getPriorityTag = (priority) => {
  const priorityConfig = {
    high: { color: '#f5222d', text: '高优先级' },
    medium: { color: '#faad14', text: '中优先级' },
    low: { color: '#52c41a', text: '低优先级' }
  };
  
  const config = priorityConfig[priority] || { color: 'default', text: '未知' };
  return <Tag color={config.color}>{config.text}</Tag>;
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const ProjectCard = ({ project, showDetails = false }) => {
  if (!project) return null;
  
  return (
    <Card 
      className="project-card"
      title={
        <Space>
          <ProjectOutlined style={{ fontSize: 20, color: '#1890ff' }} />
          <Space direction="vertical" size={0}>
            <Title level={4} style={{ margin: 0 }}>{project.name}</Title>
            <Text type="secondary">{project.description}</Text>
          </Space>
        </Space>
      }
      extra={
        <Space>
          {getStatusTag(project.status)}
          {showDetails && getHealthTag(project.health)}
        </Space>
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={showDetails ? 12 : 24}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text strong>项目进度</Text>
              <Tooltip title={`完成度: ${project.progress}%`}>
                <Progress 
                  percent={project.progress} 
                  status={project.progress === 100 ? 'success' : 'active'}
                  style={{ marginTop: 8 }}
                />
              </Tooltip>
            </div>
            
            <Row gutter={16}>
              <Col span={12}>
                <Space>
                  <CalendarOutlined />
                  <Text>开始: {formatDate(project.startDate)}</Text>
                </Space>
              </Col>
              
              <Col span={12}>
                <Space>
                  <CalendarOutlined />
                  <Text>结束: {formatDate(project.endDate)}</Text>
                </Space>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Space>
                  <UserOutlined />
                  <Text>负责人: {project.lead}</Text>
                </Space>
              </Col>
              
              <Col span={12}>
                <Space>
                  <TeamOutlined />
                  <Text>成员: {project.members}人</Text>
                </Space>
              </Col>
            </Row>
            
            <Space wrap>
              {project.teams.map(team => (
                <Tag key={team} color="blue">{team}</Tag>
              ))}
            </Space>
            
            {showDetails && (
              <Space>
                {getRiskTag(project.risk)}
                {getPriorityTag(project.priority)}
              </Space>
            )}
          </Space>
        </Col>
        
        {showDetails && (
          <Col xs={24} md={12}>
            <Card title="DORA指标" size="small" bordered={false}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Tooltip title="部署频率（次/月）">
                    <div className="project-metric">
                      <Space>
                        <RocketOutlined style={{ color: '#1890ff' }} />
                        <Text type="secondary">部署频率</Text>
                      </Space>
                      <Text strong>{project.metrics.deployFrequency}</Text>
                    </div>
                  </Tooltip>
                </Col>
                
                <Col span={12}>
                  <Tooltip title="变更前置时间（天）">
                    <div className="project-metric">
                      <Space>
                        <FieldTimeOutlined style={{ color: '#52c41a' }} />
                        <Text type="secondary">前置时间</Text>
                      </Space>
                      <Text strong>{project.metrics.leadTime}</Text>
                    </div>
                  </Tooltip>
                </Col>
                
                <Col span={12}>
                  <Tooltip title="变更失败率（%）">
                    <div className="project-metric">
                      <Space>
                        <WarningOutlined style={{ color: '#faad14' }} />
                        <Text type="secondary">失败率</Text>
                      </Space>
                      <Text strong>{project.metrics.failureRate}%</Text>
                    </div>
                  </Tooltip>
                </Col>
                
                <Col span={12}>
                  <Tooltip title="平均恢复时间（分钟）">
                    <div className="project-metric">
                      <Space>
                        <MedicineBoxOutlined style={{ color: '#f5222d' }} />
                        <Text type="secondary">恢复时间</Text>
                      </Space>
                      <Text strong>{project.metrics.mttr}</Text>
                    </div>
                  </Tooltip>
                </Col>
              </Row>
            </Card>
          </Col>
        )}
      </Row>
      
      {showDetails && project.trends && (
        <>
          <Divider>趋势分析</Divider>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card title="团队速度趋势" size="small" className="chart-card">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={project.trends.velocity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#1890ff" 
                      activeDot={{ r: 8 }} 
                      name="速度（点/周）"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card title="前置时间趋势" size="small" className="chart-card">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={project.trends.leadTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#52c41a" 
                      activeDot={{ r: 8 }} 
                      name="前置时间（天）"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card title="缺陷率趋势" size="small" className="chart-card">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={project.trends.bugRate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#f5222d" 
                      activeDot={{ r: 8 }} 
                      name="缺陷率（每千行代码）"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
};

export default ProjectCard;