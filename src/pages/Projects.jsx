import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Table, Tag, Button, Avatar, Progress, Statistic, Modal, Form, Input, Select, Tabs, DatePicker, Tooltip, Badge, Space, Divider } from 'antd'
import {
  ProjectOutlined,
  AppstoreOutlined,
  RocketOutlined,
  ClockCircleOutlined,
  BugOutlined,
  CodeOutlined,
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  FileTextOutlined,
  BranchesOutlined
} from '@ant-design/icons'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

const { Option } = Select
const { TabPane } = Tabs
const { RangePicker } = DatePicker

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [projectModal, setProjectModal] = useState(false)
  const [currentProject, setCurrentProject] = useState(null)
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState('1')
  const [timeRange, setTimeRange] = useState('month')

  useEffect(() => {
    fetchProjectsData()
  }, [])

  const fetchProjectsData = () => {
    setLoading(true)
    // 模拟数据加载
    setTimeout(() => {
      setProjects([
        {
          id: 1,
          name: '电商平台重构',
          description: '使用微服务架构重构现有电商平台',
          status: 'active',
          progress: 68,
          startDate: '2023-06-15',
          endDate: '2023-12-30',
          teams: ['前端团队', '后端团队', 'DevOps团队'],
          lead: '张三',
          members: 18,
          health: 'good',
          risk: 'low',
          priority: 'high',
          metrics: {
            deployFrequency: 12.5, // 每月部署次数
            leadTime: 2.3, // 变更前置时间(天)
            failureRate: 3.2, // 变更失败率(%)
            mttr: 45, // 平均恢复时间(分钟)
            codeQuality: 82, // 代码质量评分
            testCoverage: 78, // 测试覆盖率(%)
            velocity: 28, // 团队速度(点/周)
            flowEfficiency: 65, // 流动效率(%)
            techDebt: 15, // 技术债务(%)
            bugRate: 2.8 // 每千行代码缺陷数
          },
          trends: {
            velocity: [
              { date: '2023-07', value: 24 },
              { date: '2023-08', value: 26 },
              { date: '2023-09', value: 25 },
              { date: '2023-10', value: 28 },
              { date: '2023-11', value: 30 }
            ],
            leadTime: [
              { date: '2023-07', value: 3.2 },
              { date: '2023-08', value: 2.8 },
              { date: '2023-09', value: 2.5 },
              { date: '2023-10', value: 2.3 },
              { date: '2023-11', value: 2.1 }
            ],
            bugRate: [
              { date: '2023-07', value: 3.5 },
              { date: '2023-08', value: 3.2 },
              { date: '2023-09', value: 3.0 },
              { date: '2023-10', value: 2.8 },
              { date: '2023-11', value: 2.5 }
            ]
          }
        },
        {
          id: 2,
          name: '移动应用升级',
          description: '升级移动应用UI和核心功能',
          status: 'active',
          progress: 85,
          startDate: '2023-08-01',
          endDate: '2023-12-15',
          teams: ['移动端团队', 'UI设计团队'],
          lead: '王五',
          members: 10,
          health: 'excellent',
          risk: 'low',
          priority: 'medium',
          metrics: {
            deployFrequency: 10.8,
            leadTime: 1.8,
            failureRate: 2.5,
            mttr: 38,
            codeQuality: 88,
            testCoverage: 82,
            velocity: 22,
            flowEfficiency: 72,
            techDebt: 12,
            bugRate: 2.2
          },
          trends: {
            velocity: [
              { date: '2023-08', value: 18 },
              { date: '2023-09', value: 20 },
              { date: '2023-10', value: 21 },
              { date: '2023-11', value: 22 }
            ],
            leadTime: [
              { date: '2023-08', value: 2.2 },
              { date: '2023-09', value: 2.0 },
              { date: '2023-10', value: 1.9 },
              { date: '2023-11', value: 1.8 }
            ],
            bugRate: [
              { date: '2023-08', value: 2.8 },
              { date: '2023-09', value: 2.6 },
              { date: '2023-10', value: 2.4 },
              { date: '2023-11', value: 2.2 }
            ]
          }
        },
        {
          id: 3,
          name: '数据分析平台',
          description: '构建企业级数据分析和可视化平台',
          status: 'planning',
          progress: 15,
          startDate: '2023-11-01',
          endDate: '2024-06-30',
          teams: ['后端团队', 'DevOps团队', '数据团队'],
          lead: '李四',
          members: 12,
          health: 'good',
          risk: 'medium',
          priority: 'high',
          metrics: {
            deployFrequency: 0,
            leadTime: 0,
            failureRate: 0,
            mttr: 0,
            codeQuality: 90,
            testCoverage: 85,
            velocity: 0,
            flowEfficiency: 0,
            techDebt: 5,
            bugRate: 0
          },
          trends: {
            velocity: [
              { date: '2023-11', value: 0 }
            ],
            leadTime: [
              { date: '2023-11', value: 0 }
            ],
            bugRate: [
              { date: '2023-11', value: 0 }
            ]
          }
        },
        {
          id: 4,
          name: 'DevOps流水线优化',
          description: '优化CI/CD流水线，提高部署效率',
          status: 'completed',
          progress: 100,
          startDate: '2023-05-01',
          endDate: '2023-08-15',
          teams: ['DevOps团队'],
          lead: '赵六',
          members: 5,
          health: 'excellent',
          risk: 'low',
          priority: 'medium',
          metrics: {
            deployFrequency: 18.5,
            leadTime: 1.5,
            failureRate: 1.8,
            mttr: 32,
            codeQuality: 86,
            testCoverage: 80,
            velocity: 18,
            flowEfficiency: 75,
            techDebt: 10,
            bugRate: 2.0
          },
          trends: {
            velocity: [
              { date: '2023-05', value: 15 },
              { date: '2023-06', value: 16 },
              { date: '2023-07', value: 17 },
              { date: '2023-08', value: 18 }
            ],
            leadTime: [
              { date: '2023-05', value: 2.0 },
              { date: '2023-06', value: 1.8 },
              { date: '2023-07', value: 1.6 },
              { date: '2023-08', value: 1.5 }
            ],
            bugRate: [
              { date: '2023-05', value: 2.5 },
              { date: '2023-06', value: 2.3 },
              { date: '2023-07', value: 2.1 },
              { date: '2023-08', value: 2.0 }
            ]
          }
        },
        {
          id: 5,
          name: 'API网关重构',
          description: '重构API网关，提高安全性和性能',
          status: 'active',
          progress: 42,
          startDate: '2023-09-01',
          endDate: '2024-01-31',
          teams: ['后端团队', 'DevOps团队'],
          lead: '李四',
          members: 8,
          health: 'warning',
          risk: 'medium',
          priority: 'high',
          metrics: {
            deployFrequency: 8.2,
            leadTime: 2.8,
            failureRate: 4.5,
            mttr: 55,
            codeQuality: 75,
            testCoverage: 68,
            velocity: 16,
            flowEfficiency: 58,
            techDebt: 22,
            bugRate: 3.5
          },
          trends: {
            velocity: [
              { date: '2023-09', value: 14 },
              { date: '2023-10', value: 15 },
              { date: '2023-11', value: 16 }
            ],
            leadTime: [
              { date: '2023-09', value: 3.2 },
              { date: '2023-10', value: 3.0 },
              { date: '2023-11', value: 2.8 }
            ],
            bugRate: [
              { date: '2023-09', value: 4.0 },
              { date: '2023-10', value: 3.8 },
              { date: '2023-11', value: 3.5 }
            ]
          }
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const showProjectModal = (project = null) => {
    setCurrentProject(project)
    form.resetFields()
    if (project) {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        teams: project.teams,
        lead: project.lead,
        startDate: project.startDate,
        endDate: project.endDate
      })
    }
    setProjectModal(true)
  }

  const handleProjectSubmit = () => {
    form.validateFields().then(values => {
      console.log('项目表单提交:', values)
      // 这里应该有保存项目的逻辑
      setProjectModal(false)
    })
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
  }

  const handleTimeRangeChange = (value) => {
    setTimeRange(value)
  }

  const getStatusTag = (status) => {
    switch (status) {
      case 'active':
        return <Tag color="green">进行中</Tag>
      case 'planning':
        return <Tag color="blue">规划中</Tag>
      case 'completed':
        return <Tag color="gray">已完成</Tag>
      case 'paused':
        return <Tag color="orange">已暂停</Tag>
      default:
        return <Tag>{status}</Tag>
    }
  }

  const getHealthTag = (health) => {
    switch (health) {
      case 'excellent':
        return <Tag color="green" icon={<CheckCircleOutlined />}>优秀</Tag>
      case 'good':
        return <Tag color="cyan" icon={<CheckCircleOutlined />}>良好</Tag>
      case 'warning':
        return <Tag color="orange" icon={<ExclamationCircleOutlined />}>警告</Tag>
      case 'critical':
        return <Tag color="red" icon={<CloseCircleOutlined />}>危险</Tag>
      default:
        return <Tag>{health}</Tag>
    }
  }

  const getRiskTag = (risk) => {
    switch (risk) {
      case 'low':
        return <Tag color="green">低风险</Tag>
      case 'medium':
        return <Tag color="orange">中风险</Tag>
      case 'high':
        return <Tag color="red">高风险</Tag>
      default:
        return <Tag>{risk}</Tag>
    }
  }

  const getPriorityTag = (priority) => {
    switch (priority) {
      case 'low':
        return <Tag color="blue">低优先级</Tag>
      case 'medium':
        return <Tag color="orange">中优先级</Tag>
      case 'high':
        return <Tag color="red">高优先级</Tag>
      default:
        return <Tag>{priority}</Tag>
    }
  }

  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar icon={<ProjectOutlined />} style={{ marginRight: 8, backgroundColor: '#1890ff' }} />
          <div>
            <div>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.description}</div>
          </div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status)
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (value) => <Progress percent={value} size="small" />
    },
    {
      title: '健康度',
      dataIndex: 'health',
      key: 'health',
      render: (health) => getHealthTag(health)
    },
    {
      title: '风险',
      dataIndex: 'risk',
      key: 'risk',
      render: (risk) => getRiskTag(risk)
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => getPriorityTag(priority)
    },
    {
      title: '团队',
      dataIndex: 'teams',
      key: 'teams',
      render: (teams) => (
        <div>
          {teams.map(team => (
            <Tag key={team}>{team}</Tag>
          ))}
        </div>
      )
    },
    {
      title: '负责人',
      dataIndex: 'lead',
      key: 'lead',
    },
    {
      title: '时间',
      key: 'time',
      render: (_, record) => (
        <div>
          <div>{record.startDate}</div>
          <div>至</div>
          <div>{record.endDate}</div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button 
            type="link" 
            icon={<BarChartOutlined />} 
            style={{ marginRight: 8 }}
            onClick={() => console.log('查看项目详情', record.id)}
          >
            详情
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            style={{ marginRight: 8 }}
            onClick={() => showProjectModal(record)}
          >
            编辑
          </Button>
        </div>
      )
    }
  ]

  const renderProjectOverview = () => {
    return (
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {projects.map(project => (
            <Col span={8} key={project.id}>
              <Card className="dashboard-card project-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>{project.name}</h3>
                    <div style={{ color: '#666', marginBottom: 8 }}>{project.description}</div>
                  </div>
                  <Space>
                    {getStatusTag(project.status)}
                    {getHealthTag(project.health)}
                  </Space>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <Progress percent={project.progress} status={project.progress === 100 ? 'success' : 'active'} />
                </div>
                
                <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                  <Col span={12}>
                    <div className="metric-item">
                      <TeamOutlined style={{ marginRight: 8 }} />
                      <span>团队: </span>
                      <span>{project.teams.join(', ')}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="metric-item">
                      <UserOutlined style={{ marginRight: 8 }} />
                      <span>负责人: </span>
                      <span>{project.lead}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="metric-item">
                      <ClockCircleOutlined style={{ marginRight: 8 }} />
                      <span>开始: </span>
                      <span>{project.startDate}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="metric-item">
                      <ClockCircleOutlined style={{ marginRight: 8 }} />
                      <span>结束: </span>
                      <span>{project.endDate}</span>
                    </div>
                  </Col>
                </Row>
                
                <Divider style={{ margin: '8px 0 16px 0' }} />
                
                <Row gutter={[8, 8]}>
                  <Col span={8}>
                    <Tooltip title="部署频率">
                      <Statistic 
                        title="部署频率" 
                        value={project.metrics.deployFrequency} 
                        suffix="/月" 
                        valueStyle={{ fontSize: '14px' }}
                      />
                    </Tooltip>
                  </Col>
                  <Col span={8}>
                    <Tooltip title="变更前置时间">
                      <Statistic 
                        title="前置时间" 
                        value={project.metrics.leadTime} 
                        suffix="天" 
                        valueStyle={{ fontSize: '14px' }}
                      />
                    </Tooltip>
                  </Col>
                  <Col span={8}>
                    <Tooltip title="变更失败率">
                      <Statistic 
                        title="失败率" 
                        value={project.metrics.failureRate} 
                        suffix="%" 
                        valueStyle={{ fontSize: '14px' }}
                      />
                    </Tooltip>
                  </Col>
                </Row>
                
                <div style={{ marginTop: 16 }}>
                  <Button type="primary" block onClick={() => console.log('查看项目详情', project.id)}>
                    查看详情
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    )
  }

  const renderProjectMetrics = () => {
    if (!projects.length) return null

    // 只显示活跃项目的指标
    const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'completed')

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

    const deploymentData = activeProjects.map(p => ({
      name: p.name,
      value: p.metrics.deployFrequency
    }))

    const leadTimeData = activeProjects.map(p => ({
      name: p.name,
      value: p.metrics.leadTime
    }))

    const failureRateData = activeProjects.map(p => ({
      name: p.name,
      value: p.metrics.failureRate
    }))

    const mttrData = activeProjects.map(p => ({
      name: p.name,
      value: p.metrics.mttr
    }))

    const qualityData = activeProjects.map(p => ({
      name: p.name,
      codeQuality: p.metrics.codeQuality,
      testCoverage: p.metrics.testCoverage,
      techDebt: p.metrics.techDebt,
      bugRate: p.metrics.bugRate
    }))

    return (
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card title="部署频率 (每月)" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deploymentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#8884d8" name="部署频率" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="变更前置时间 (天)" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leadTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#82ca9d" name="前置时间" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card title="变更失败率 (%)" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={failureRateData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {failureRateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="平均恢复时间 (分钟)" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mttrData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#ffc658" name="恢复时间" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="代码质量指标" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={qualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="codeQuality" name="代码质量" fill="#8884d8" />
                  <Bar dataKey="testCoverage" name="测试覆盖率" fill="#82ca9d" />
                  <Bar dataKey="techDebt" name="技术债务" fill="#ffc658" />
                  <Bar dataKey="bugRate" name="缺陷率" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

  const renderProjectTrends = () => {
    if (!projects.length) return null

    // 只显示活跃项目的趋势
    const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'completed')
    
    // 选择一个项目来展示详细趋势
    const selectedProject = activeProjects[0]

    return (
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Select 
                defaultValue={selectedProject.id} 
                style={{ width: 200 }}
                onChange={(value) => console.log('选择项目', value)}
              >
                {activeProjects.map(project => (
                  <Option key={project.id} value={project.id}>{project.name}</Option>
                ))}
              </Select>
              
              <Select
                defaultValue={timeRange}
                style={{ width: 120 }}
                onChange={handleTimeRangeChange}
              >
                <Option value="month">月度</Option>
                <Option value="quarter">季度</Option>
                <Option value="year">年度</Option>
              </Select>
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Card title="团队速度趋势" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selectedProject.trends.velocity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="速度(点/周)" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card title="变更前置时间趋势" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selectedProject.trends.leadTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="前置时间(天)" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="缺陷率趋势" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selectedProject.trends.bugRate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="缺陷率(每千行)" stroke="#ff8042" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="项目总数"
              value={projects.length}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="进行中项目"
              value={projects.filter(p => p.status === 'active').length}
              prefix={<RocketOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="规划中项目"
              value={projects.filter(p => p.status === 'planning').length}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="已完成项目"
              value={projects.filter(p => p.status === 'completed').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="dashboard-card" style={{ marginBottom: 16 }}>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="项目概览" key="1">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showProjectModal()}>
                添加项目
              </Button>
            </div>
            {renderProjectOverview()}
          </TabPane>
          <TabPane tab="项目列表" key="2">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showProjectModal()}>
                添加项目
              </Button>
            </div>
            <Table 
              columns={projectColumns} 
              dataSource={projects} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane tab="DORA指标" key="3">
            {renderProjectMetrics()}
          </TabPane>
          <TabPane tab="趋势分析" key="4">
            {renderProjectTrends()}
          </TabPane>
        </Tabs>
      </Card>

      {/* 添加/编辑项目模态框 */}
      <Modal
        title={currentProject ? '编辑项目' : '添加项目'}
        open={projectModal}
        onOk={handleProjectSubmit}
        onCancel={() => setProjectModal(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="项目名称"
                rules={[{ required: true, message: '请输入项目名称' }]}
              >
                <Input placeholder="请输入项目名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lead"
                label="项目负责人"
                rules={[{ required: true, message: '请选择项目负责人' }]}
              >
                <Select placeholder="请选择项目负责人">
                  <Option value="张三">张三</Option>
                  <Option value="李四">李四</Option>
                  <Option value="王五">王五</Option>
                  <Option value="赵六">赵六</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="项目描述"
            rules={[{ required: true, message: '请输入项目描述' }]}
          >
            <Input.TextArea placeholder="请输入项目描述" rows={3} />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="status"
                label="项目状态"
                rules={[{ required: true, message: '请选择项目状态' }]}
              >
                <Select placeholder="请选择项目状态">
                  <Option value="planning">规划中</Option>
                  <Option value="active">进行中</Option>
                  <Option value="paused">已暂停</Option>
                  <Option value="completed">已完成</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder="请选择优先级">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="teams"
                label="参与团队"
                rules={[{ required: true, message: '请选择参与团队' }]}
              >
                <Select mode="multiple" placeholder="请选择参与团队">
                  <Option value="前端团队">前端团队</Option>
                  <Option value="后端团队">后端团队</Option>
                  <Option value="移动端团队">移动端团队</Option>
                  <Option value="DevOps团队">DevOps团队</Option>
                  <Option value="UI设计团队">UI设计团队</Option>
                  <Option value="数据团队">数据团队</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="开始日期"
                rules={[{ required: true, message: '请选择开始日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="结束日期"
                rules={[{ required: true, message: '请选择结束日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default Projects

// 添加缺失的UserOutlined组件
const UserOutlined = ({ style }) => {
  return <span style={style}>👤</span>
}