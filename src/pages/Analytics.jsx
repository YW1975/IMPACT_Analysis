import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Select, DatePicker, Button, Tabs, Spin, Empty, Radio } from 'antd'
import {
  LineChart,
  Line,
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
  Cell,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts'
import { FilterOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker
const { Option } = Select

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dora')
  const [timeRange, setTimeRange] = useState('month')
  const [selectedTeams, setSelectedTeams] = useState(['all'])
  const [selectedProjects, setSelectedProjects] = useState(['all'])
  const [chartData, setChartData] = useState({})

  useEffect(() => {
    loadAnalyticsData()
  }, [activeTab, timeRange, selectedTeams, selectedProjects])

  const loadAnalyticsData = () => {
    setLoading(true)
    // 模拟数据加载
    setTimeout(() => {
      // 根据不同的tab加载不同的数据
      if (activeTab === 'dora') {
        setChartData({
          deploymentFrequency: [
            { month: '1月', value: 8.2 },
            { month: '2月', value: 9.5 },
            { month: '3月', value: 10.1 },
            { month: '4月', value: 11.3 },
            { month: '5月', value: 12.5 },
            { month: '6月', value: 13.8 }
          ],
          leadTime: [
            { month: '1月', value: 3.8 },
            { month: '2月', value: 3.5 },
            { month: '3月', value: 3.0 },
            { month: '4月', value: 2.7 },
            { month: '5月', value: 2.3 },
            { month: '6月', value: 2.1 }
          ],
          changeFailureRate: [
            { month: '1月', value: 5.8 },
            { month: '2月', value: 5.2 },
            { month: '3月', value: 4.5 },
            { month: '4月', value: 3.9 },
            { month: '5月', value: 3.2 },
            { month: '6月', value: 2.8 }
          ],
          mttr: [
            { month: '1月', value: 65 },
            { month: '2月', value: 58 },
            { month: '3月', value: 52 },
            { month: '4月', value: 48 },
            { month: '5月', value: 45 },
            { month: '6月', value: 42 }
          ],
          teamComparison: [
            { name: '前端团队', deployFreq: 14.2, leadTime: 1.8, failureRate: 2.5, mttr: 38 },
            { name: '后端团队', deployFreq: 12.5, leadTime: 2.3, failureRate: 3.2, mttr: 45 },
            { name: '移动端团队', deployFreq: 10.8, leadTime: 2.7, failureRate: 3.8, mttr: 52 },
            { name: 'DevOps团队', deployFreq: 18.5, leadTime: 1.5, failureRate: 1.8, mttr: 32 }
          ]
        })
      } else if (activeTab === 'flow') {
        setChartData({
          throughput: [
            { week: 'W1', value: 22 },
            { week: 'W2', value: 25 },
            { week: 'W3', value: 28 },
            { week: 'W4', value: 24 }
          ],
          cycleTime: [
            { week: 'W1', value: 4.8 },
            { week: 'W2', value: 4.5 },
            { week: 'W3', value: 4.2 },
            { week: 'W4', value: 4.0 }
          ],
          wip: [
            { day: '周一', value: 12 },
            { day: '周二', value: 15 },
            { day: '周三', value: 18 },
            { day: '周四', value: 16 },
            { day: '周五', value: 14 }
          ],
          flowEfficiency: [
            { stage: '需求分析', value: 72 },
            { stage: '设计', value: 65 },
            { stage: '开发', value: 78 },
            { stage: '测试', value: 58 },
            { stage: '部署', value: 82 }
          ],
          flowDistribution: [
            { name: '价值工作', value: 68 },
            { name: '等待时间', value: 22 },
            { name: '返工', value: 10 }
          ]
        })
      } else if (activeTab === 'quality') {
        setChartData({
          codeQuality: [
            { month: '1月', complexity: 28, duplication: 12, coverage: 78 },
            { month: '2月', complexity: 26, duplication: 10, coverage: 80 },
            { month: '3月', complexity: 24, duplication: 9, coverage: 82 },
            { month: '4月', complexity: 22, duplication: 8, coverage: 85 },
            { month: '5月', complexity: 20, duplication: 7, coverage: 87 },
            { month: '6月', complexity: 18, duplication: 6, coverage: 90 }
          ],
          bugTrend: [
            { month: '1月', critical: 5, major: 12, minor: 28 },
            { month: '2月', critical: 4, major: 10, minor: 25 },
            { month: '3月', critical: 3, major: 9, minor: 22 },
            { month: '4月', critical: 2, major: 8, minor: 20 },
            { month: '5月', critical: 2, major: 7, minor: 18 },
            { month: '6月', critical: 1, major: 6, minor: 15 }
          ],
          techDebt: [
            { component: '前端UI', value: 35 },
            { component: 'API层', value: 28 },
            { component: '数据库', value: 18 },
            { component: '认证服务', value: 12 },
            { component: '部署流程', value: 7 }
          ]
        })
      } else if (activeTab === 'team') {
        setChartData({
          productivity: [
            { team: '前端团队', value: 85 },
            { team: '后端团队', value: 78 },
            { team: '移动端团队', value: 92 },
            { team: 'DevOps团队', value: 88 }
          ],
          satisfaction: [
            { month: '1月', value: 3.8 },
            { month: '2月', value: 3.9 },
            { month: '3月', value: 4.0 },
            { month: '4月', value: 4.1 },
            { month: '5月', value: 4.2 },
            { month: '6月', value: 4.3 }
          ],
          collaboration: [
            { team1: '前端', team2: '后端', value: 85 },
            { team1: '前端', team2: '移动端', value: 72 },
            { team1: '前端', team2: 'DevOps', value: 68 },
            { team1: '后端', team2: '移动端', value: 78 },
            { team1: '后端', team2: 'DevOps', value: 82 },
            { team1: '移动端', team2: 'DevOps', value: 65 }
          ],
          skillGrowth: [
            { skill: '前端技术', current: 85, target: 95 },
            { skill: '后端技术', current: 82, target: 90 },
            { skill: '云原生', current: 75, target: 90 },
            { skill: 'AI/ML', current: 65, target: 85 },
            { skill: '安全', current: 70, target: 85 }
          ]
        })
      }
      setLoading(false)
    }, 1000)
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
  }

  const handleTimeRangeChange = (value) => {
    setTimeRange(value)
  }

  const handleTeamChange = (value) => {
    setSelectedTeams(value)
  }

  const handleProjectChange = (value) => {
    setSelectedProjects(value)
  }

  const exportData = () => {
    console.log('导出数据')
  }

  const renderDoraMetrics = () => {
    if (!chartData.deploymentFrequency) return <Empty description="暂无数据" />

    return (
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card title="部署频率趋势" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.deploymentFrequency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name="部署频率(次/天)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="变更前置时间趋势" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.leadTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" name="前置时间(天)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card title="变更失败率趋势" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.changeFailureRate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#ff7300" name="失败率(%)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="平均恢复时间趋势" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.mttr}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#ff4d4f" name="MTTR(分钟)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="团队DORA指标对比" className="dashboard-card">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.teamComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="deployFreq" name="部署频率(次/天)" fill="#8884d8" />
                  <Bar dataKey="leadTime" name="前置时间(天)" fill="#82ca9d" />
                  <Bar dataKey="failureRate" name="失败率(%)" fill="#ff7300" />
                  <Bar dataKey="mttr" name="MTTR(分钟)" fill="#ff4d4f" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

  const renderFlowMetrics = () => {
    if (!chartData.throughput) return <Empty description="暂无数据" />

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

    return (
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card title="吞吐量趋势" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.throughput}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="吞吐量(个/周)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="周期时间趋势" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.cycleTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" name="周期时间(天)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card title="在制品数量" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.wip}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#ff7300" name="WIP(个)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="流动效率分布" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.flowDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.flowDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="各阶段流动效率" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.flowEfficiency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="流动效率(%)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

  const renderQualityMetrics = () => {
    if (!chartData.codeQuality) return <Empty description="暂无数据" />

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

    return (
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Card title="代码质量趋势" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.codeQuality}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="complexity" stroke="#8884d8" name="复杂度" />
                  <Line type="monotone" dataKey="duplication" stroke="#ff7300" name="重复率(%)" />
                  <Line type="monotone" dataKey="coverage" stroke="#82ca9d" name="测试覆盖率(%)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card title="缺陷趋势" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.bugTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="critical" stackId="a" name="严重缺陷" fill="#ff4d4f" />
                  <Bar dataKey="major" stackId="a" name="主要缺陷" fill="#faad14" />
                  <Bar dataKey="minor" stackId="a" name="次要缺陷" fill="#52c41a" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="技术债务分布" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.techDebt}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.techDebt.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

  const renderTeamMetrics = () => {
    if (!chartData.productivity) return <Empty description="暂无数据" />

    return (
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card title="团队生产力" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.productivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="team" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="生产力指数" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="团队满意度趋势" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.satisfaction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" name="满意度(1-5分)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card title="团队协作热力图" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis dataKey="team1" name="团队1" />
                  <YAxis dataKey="team2" name="团队2" />
                  <ZAxis dataKey="value" range={[0, 500]} name="协作指数" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="协作指数" data={chartData.collaboration} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="技能成长" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.skillGrowth} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="skill" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" name="当前水平" fill="#8884d8" />
                  <Bar dataKey="target" name="目标水平" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <Spin size="large" tip="正在加载分析数据..." />
        </div>
      )
    }

    switch (activeTab) {
      case 'dora':
        return renderDoraMetrics()
      case 'flow':
        return renderFlowMetrics()
      case 'quality':
        return renderQualityMetrics()
      case 'team':
        return renderTeamMetrics()
      default:
        return <Empty description="暂无数据" />
    }
  }

  return (
    <div>
      <Card className="dashboard-card" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="选择时间范围"
              value={timeRange}
              onChange={handleTimeRangeChange}
            >
              <Option value="week">最近一周</Option>
              <Option value="month">最近一个月</Option>
              <Option value="quarter">最近一个季度</Option>
              <Option value="year">最近一年</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="选择团队"
              value={selectedTeams}
              onChange={handleTeamChange}
            >
              <Option value="all">所有团队</Option>
              <Option value="frontend">前端团队</Option>
              <Option value="backend">后端团队</Option>
              <Option value="mobile">移动端团队</Option>
              <Option value="devops">DevOps团队</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="选择项目"
              value={selectedProjects}
              onChange={handleProjectChange}
            >
              <Option value="all">所有项目</Option>
              <Option value="project1">电商平台</Option>
              <Option value="project2">CRM系统</Option>
              <Option value="project3">移动应用</Option>
              <Option value="project4">数据分析平台</Option>
            </Select>
          </Col>
          <Col span={4}>
            <RangePicker style={{ width: '100%' }} />
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button icon={<FilterOutlined />} style={{ marginRight: 8 }}>
              高级筛选
            </Button>
            <Button icon={<DownloadOutlined />} style={{ marginRight: 8 }} onClick={exportData}>
              导出数据
            </Button>
            <Button type="primary" icon={<ReloadOutlined />} onClick={loadAnalyticsData}>
              刷新数据
            </Button>
          </Col>
        </Row>
      </Card>

      <Card className="dashboard-card">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={[
            {
              key: 'dora',
              label: 'DORA指标',
              children: null
            },
            {
              key: 'flow',
              label: '流动指标',
              children: null
            },
            {
              key: 'quality',
              label: '质量指标',
              children: null
            },
            {
              key: 'team',
              label: '团队指标',
              children: null
            }
          ]}
        />
        {renderContent()}
      </Card>
    </div>
  )
}

export default Analytics