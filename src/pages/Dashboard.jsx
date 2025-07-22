import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, Progress, List, Avatar, Tag, Spin, Typography } from 'antd'

const { Title } = Typography
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  BugOutlined,
  CodeOutlined,
  TeamOutlined,
  RocketOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// 导入自定义组件
import ActivityList from '../components/Dashboard/ActivityList'
import TeamPerformanceChart from '../components/Dashboard/TeamPerformanceChart'
import TeamRanking from '../components/Dashboard/TeamRanking'
import DeploymentTrend from '../components/Dashboard/DeploymentTrend'
import LeadTimeTrend from '../components/Dashboard/LeadTimeTrend'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [doraMetrics, setDoraMetrics] = useState({})
  const [flowMetrics, setFlowMetrics] = useState({})
  const [teamMetrics, setTeamMetrics] = useState([])
  const [deploymentData, setDeploymentData] = useState([])
  const [leadTimeData, setLeadTimeData] = useState([])
  const [activities, setActivities] = useState([])

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setDoraMetrics({
        deploymentFrequency: { value: 12.5, trend: 'up', change: 8.2 },
        leadTime: { value: 2.3, trend: 'down', change: -15.6 },
        changeFailureRate: { value: 3.2, trend: 'down', change: -22.1 },
        mttr: { value: 45, trend: 'down', change: -18.9 }
      })
      
      setFlowMetrics({
        throughput: { value: 28, trend: 'up', change: 12.5 },
        cycleTime: { value: 4.2, trend: 'down', change: -8.3 },
        wip: { value: 15, trend: 'up', change: 5.2 },
        flowEfficiency: { value: 68, trend: 'up', change: 3.1 }
      })
      
      setTeamMetrics([
        { name: '前端团队', efficiency: 85, velocity: 32, satisfaction: 4.2, memberCount: 8, score: 88, trend: 'up', trendValue: 5 },
        { name: '后端团队', efficiency: 78, velocity: 28, satisfaction: 4.0, memberCount: 12, score: 82, trend: 'up', trendValue: 3 },
        { name: '移动端团队', efficiency: 92, velocity: 24, satisfaction: 4.5, memberCount: 6, score: 94, trend: 'up', trendValue: 8 },
        { name: 'DevOps团队', efficiency: 88, velocity: 18, satisfaction: 4.3, memberCount: 5, score: 90, trend: 'down', trendValue: 2 },
        { name: '测试团队', efficiency: 75, velocity: 22, satisfaction: 3.8, memberCount: 7, score: 78, trend: 'up', trendValue: 4 }
      ])
      
      // 部署趋势数据
      setDeploymentData([
        { date: '1月', success: 42, failure: 3 },
        { date: '2月', success: 50, failure: 2 },
        { date: '3月', success: 46, failure: 2 },
        { date: '4月', success: 59, failure: 2 },
        { date: '5月', success: 56, failure: 2 },
        { date: '6月', success: 65, failure: 2 }
      ])
      
      // 变更前置时间数据
      setLeadTimeData([
        { date: 'W1', leadTime: 3.2, changes: 15 },
        { date: 'W2', leadTime: 2.8, changes: 18 },
        { date: 'W3', leadTime: 2.1, changes: 22 },
        { date: 'W4', leadTime: 2.3, changes: 20 },
        { date: 'W5', leadTime: 2.0, changes: 25 },
        { date: 'W6', leadTime: 1.8, changes: 28 }
      ])
      
      // 最近活动数据
      setActivities([
        {
          type: 'deployment',
          description: '前端项目部署到生产环境',
          status: 'success',
          project: '用户中心',
          user: '张工程师',
          timestamp: Date.now() - 1000 * 60 * 5 // 5分钟前
        },
        {
          type: 'code',
          description: '合并代码到主分支',
          status: 'success',
          project: 'API服务',
          user: '李开发',
          timestamp: Date.now() - 1000 * 60 * 15 // 15分钟前
        },
        {
          type: 'incident',
          description: '生产环境服务器CPU使用率过高',
          status: 'resolved',
          project: '支付系统',
          user: '王运维',
          timestamp: Date.now() - 1000 * 60 * 45 // 45分钟前
        },
        {
          type: 'test',
          description: '自动化测试套件执行完成',
          status: 'completed',
          project: '移动应用',
          user: '赵测试',
          timestamp: Date.now() - 1000 * 60 * 120 // 2小时前
        },
        {
          type: 'meeting',
          description: '每日站会',
          status: 'completed',
          project: '全部团队',
          user: '项目经理',
          timestamp: Date.now() - 1000 * 60 * 180 // 3小时前
        }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])

  // 团队效能数据已在useEffect中设置

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="正在加载效能数据..." />
      </div>
    )
  }

  return (
    <div>
      {/* DORA 指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="部署频率"
              value={doraMetrics.deploymentFrequency.value}
              precision={1}
              suffix="次/天"
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <span className="trend-up">↑ {doraMetrics.deploymentFrequency.change}%</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="变更前置时间"
              value={doraMetrics.leadTime.value}
              precision={1}
              suffix="天"
              valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <span className="trend-up">↓ {Math.abs(doraMetrics.leadTime.change)}%</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="变更失败率"
              value={doraMetrics.changeFailureRate.value}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#cf1322' }}
              prefix={<BugOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <span className="trend-up">↓ {Math.abs(doraMetrics.changeFailureRate.change)}%</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="平均恢复时间"
              value={doraMetrics.mttr.value}
              suffix="分钟"
              valueStyle={{ color: '#722ed1' }}
              prefix={<CodeOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <span className="trend-up">↓ {Math.abs(doraMetrics.mttr.change)}%</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 流动效率指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="吞吐量"
              value={flowMetrics.throughput.value}
              suffix="个/周"
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress percent={75} size="small" showInfo={false} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="周期时间"
              value={flowMetrics.cycleTime.value}
              precision={1}
              suffix="天"
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress percent={68} size="small" showInfo={false} strokeColor="#52c41a" />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="在制品数量"
              value={flowMetrics.wip.value}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
            />
            <Progress percent={60} size="small" showInfo={false} strokeColor="#faad14" />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="流动效率"
              value={flowMetrics.flowEfficiency.value}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
            <Progress percent={flowMetrics.flowEfficiency.value} size="small" showInfo={false} strokeColor="#722ed1" />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <DeploymentTrend data={deploymentData} loading={loading} period="月" />
        </Col>
        <Col span={12}>
          <LeadTimeTrend data={leadTimeData} loading={loading} period="周" />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <TeamPerformanceChart teams={teamMetrics} />
        </Col>
        <Col span={8}>
          <TeamRanking teams={teamMetrics} loading={loading} />
        </Col>
        <Col span={8}>
          <Card className="activity-card">
            <Title level={4}>最近活动</Title>
            <ActivityList activities={activities} loading={loading} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard