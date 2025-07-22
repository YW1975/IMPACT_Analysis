import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Table, Tag, Button, Avatar, Progress, Statistic, Modal, Form, Input, Select, Tabs, Tooltip } from 'antd'
import {
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BarChartOutlined,
  CodeOutlined,
  BugOutlined,
  RocketOutlined
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

const { Option } = Select
const { TabPane } = Tabs

const Teams = () => {
  const [teams, setTeams] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [teamModal, setTeamModal] = useState(false)
  const [memberModal, setMemberModal] = useState(false)
  const [currentTeam, setCurrentTeam] = useState(null)
  const [currentMember, setCurrentMember] = useState(null)
  const [form] = Form.useForm()
  const [memberForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState('1')

  useEffect(() => {
    fetchTeamsData()
  }, [])

  const fetchTeamsData = () => {
    setLoading(true)
    // 模拟数据加载
    setTimeout(() => {
      setTeams([
        {
          id: 1,
          name: '前端团队',
          lead: '张三',
          memberCount: 8,
          efficiency: 85,
          velocity: 32,
          satisfaction: 4.2,
          qualityScore: 88,
          trend: 'up',
          trendValue: 5.2,
          skills: [
            { name: 'React', value: 90 },
            { name: 'Vue', value: 85 },
            { name: 'Angular', value: 70 },
            { name: 'TypeScript', value: 80 },
            { name: 'CSS/SCSS', value: 92 }
          ],
          metrics: {
            deployFrequency: 14.2,
            leadTime: 1.8,
            failureRate: 2.5,
            mttr: 38,
            codeQuality: 88,
            testCoverage: 82
          }
        },
        {
          id: 2,
          name: '后端团队',
          lead: '李四',
          memberCount: 10,
          efficiency: 78,
          velocity: 28,
          satisfaction: 4.0,
          qualityScore: 82,
          trend: 'up',
          trendValue: 3.1,
          skills: [
            { name: 'Java', value: 92 },
            { name: 'Spring', value: 88 },
            { name: 'Node.js', value: 75 },
            { name: 'SQL', value: 85 },
            { name: 'NoSQL', value: 78 }
          ],
          metrics: {
            deployFrequency: 12.5,
            leadTime: 2.3,
            failureRate: 3.2,
            mttr: 45,
            codeQuality: 82,
            testCoverage: 78
          }
        },
        {
          id: 3,
          name: '移动端团队',
          lead: '王五',
          memberCount: 6,
          efficiency: 92,
          velocity: 24,
          satisfaction: 4.5,
          qualityScore: 90,
          trend: 'up',
          trendValue: 8.5,
          skills: [
            { name: 'Swift', value: 88 },
            { name: 'Kotlin', value: 90 },
            { name: 'Flutter', value: 85 },
            { name: 'React Native', value: 82 },
            { name: 'Mobile UX', value: 92 }
          ],
          metrics: {
            deployFrequency: 10.8,
            leadTime: 2.7,
            failureRate: 3.8,
            mttr: 52,
            codeQuality: 90,
            testCoverage: 85
          }
        },
        {
          id: 4,
          name: 'DevOps团队',
          lead: '赵六',
          memberCount: 5,
          efficiency: 88,
          velocity: 18,
          satisfaction: 4.3,
          qualityScore: 86,
          trend: 'up',
          trendValue: 6.8,
          skills: [
            { name: 'Docker', value: 95 },
            { name: 'Kubernetes', value: 92 },
            { name: 'CI/CD', value: 94 },
            { name: 'Cloud', value: 88 },
            { name: '监控', value: 90 }
          ],
          metrics: {
            deployFrequency: 18.5,
            leadTime: 1.5,
            failureRate: 1.8,
            mttr: 32,
            codeQuality: 86,
            testCoverage: 80
          }
        }
      ])

      setMembers([
        { id: 1, name: '张三', team: '前端团队', role: '团队负责人', skills: ['React', 'Vue', 'TypeScript'], efficiency: 92, contribution: 95 },
        { id: 2, name: '李明', team: '前端团队', role: '高级开发', skills: ['React', 'JavaScript', 'CSS'], efficiency: 88, contribution: 85 },
        { id: 3, name: '王芳', team: '前端团队', role: '开发工程师', skills: ['Vue', 'JavaScript', 'HTML'], efficiency: 82, contribution: 78 },
        { id: 4, name: '赵静', team: '前端团队', role: 'UI开发', skills: ['CSS', 'SCSS', 'React'], efficiency: 85, contribution: 80 },
        { id: 5, name: '李四', team: '后端团队', role: '团队负责人', skills: ['Java', 'Spring', 'SQL'], efficiency: 90, contribution: 92 },
        { id: 6, name: '张伟', team: '后端团队', role: '架构师', skills: ['Java', 'Microservices', 'NoSQL'], efficiency: 94, contribution: 90 },
        { id: 7, name: '王五', team: '移动端团队', role: '团队负责人', skills: ['Swift', 'Kotlin', 'Flutter'], efficiency: 91, contribution: 88 },
        { id: 8, name: '赵六', team: 'DevOps团队', role: '团队负责人', skills: ['Docker', 'Kubernetes', 'CI/CD'], efficiency: 93, contribution: 91 }
      ])

      setLoading(false)
    }, 1000)
  }

  const showTeamModal = (team = null) => {
    setCurrentTeam(team)
    form.resetFields()
    if (team) {
      form.setFieldsValue({
        name: team.name,
        lead: team.lead
      })
    }
    setTeamModal(true)
  }

  const showMemberModal = (member = null) => {
    setCurrentMember(member)
    memberForm.resetFields()
    if (member) {
      memberForm.setFieldsValue({
        name: member.name,
        team: member.team,
        role: member.role,
        skills: member.skills
      })
    }
    setMemberModal(true)
  }

  const handleTeamSubmit = () => {
    form.validateFields().then(values => {
      console.log('团队表单提交:', values)
      // 这里应该有保存团队的逻辑
      setTeamModal(false)
    })
  }

  const handleMemberSubmit = () => {
    memberForm.validateFields().then(values => {
      console.log('成员表单提交:', values)
      // 这里应该有保存成员的逻辑
      setMemberModal(false)
    })
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
  }

  const teamColumns = [
    {
      title: '团队名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar icon={<TeamOutlined />} style={{ marginRight: 8, backgroundColor: '#1890ff' }} />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: '负责人',
      dataIndex: 'lead',
      key: 'lead',
    },
    {
      title: '成员数',
      dataIndex: 'memberCount',
      key: 'memberCount',
    },
    {
      title: '效能指数',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value, record) => (
        <div>
          <Progress 
            percent={value} 
            size="small" 
            status={value >= 85 ? 'success' : value >= 70 ? 'normal' : 'exception'} 
          />
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
            {record.trend === 'up' ? (
              <RiseOutlined style={{ color: '#52c41a', marginRight: 4 }} />
            ) : (
              <FallOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />
            )}
            <span>{record.trendValue}%</span>
          </div>
        </div>
      )
    },
    {
      title: '速度',
      dataIndex: 'velocity',
      key: 'velocity',
      render: (value) => `${value} 点/周`
    },
    {
      title: '满意度',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      render: (value) => (
        <div>
          <Rate disabled defaultValue={Math.round(value)} style={{ fontSize: '14px' }} />
          <div style={{ fontSize: '12px' }}>{value}/5.0</div>
        </div>
      )
    },
    {
      title: '质量评分',
      dataIndex: 'qualityScore',
      key: 'qualityScore',
      render: (value) => (
        <Tag color={value >= 85 ? 'green' : value >= 75 ? 'orange' : 'red'}>
          {value}分
        </Tag>
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
            onClick={() => console.log('查看团队详情', record.id)}
          >
            详情
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            style={{ marginRight: 8 }}
            onClick={() => showTeamModal(record)}
          >
            编辑
          </Button>
        </div>
      )
    }
  ]

  const memberColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: '所属团队',
      dataIndex: 'team',
      key: 'team',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '技能',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills) => (
        <div>
          {skills.map(skill => (
            <Tag key={skill}>{skill}</Tag>
          ))}
        </div>
      )
    },
    {
      title: '效能',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value) => (
        <Progress 
          percent={value} 
          size="small" 
          status={value >= 85 ? 'success' : value >= 70 ? 'normal' : 'exception'} 
        />
      )
    },
    {
      title: '贡献度',
      dataIndex: 'contribution',
      key: 'contribution',
      render: (value) => (
        <Progress 
          percent={value} 
          size="small" 
          status={value >= 85 ? 'success' : value >= 70 ? 'normal' : 'exception'} 
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            style={{ marginRight: 8 }}
            onClick={() => showMemberModal(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => console.log('删除成员', record.id)}
          >
            删除
          </Button>
        </div>
      )
    }
  ]

  const renderTeamOverview = () => {
    return (
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {teams.map(team => (
            <Col span={6} key={team.id}>
              <Card className="dashboard-card team-member-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <Avatar size={64} icon={<TeamOutlined />} style={{ backgroundColor: '#1890ff', marginBottom: 16 }} />
                    <h3 style={{ margin: '0 0 8px 0' }}>{team.name}</h3>
                    <div style={{ color: '#666', marginBottom: 8 }}>负责人: {team.lead}</div>
                    <div style={{ color: '#666', marginBottom: 16 }}>成员数: {team.memberCount}</div>
                  </div>
                  <Tag color={team.efficiency >= 85 ? 'green' : team.efficiency >= 75 ? 'orange' : 'red'} className="performance-badge">
                    {team.efficiency >= 85 ? '高效能' : team.efficiency >= 75 ? '良好' : '需改进'}
                  </Tag>
                </div>
                
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Statistic 
                      title="效能指数" 
                      value={team.efficiency} 
                      suffix="/100" 
                      valueStyle={{ fontSize: '18px' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="速度" 
                      value={team.velocity} 
                      suffix="点/周" 
                      valueStyle={{ fontSize: '18px' }}
                    />
                  </Col>
                </Row>
                
                <div style={{ marginTop: 16 }}>
                  <Button type="primary" block onClick={() => console.log('查看团队详情', team.id)}>
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

  const renderTeamPerformance = () => {
    if (!teams.length) return null

    return (
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card title="团队效能对比" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teams}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="efficiency" name="效能指数" fill="#8884d8" />
                  <Bar dataKey="qualityScore" name="质量评分" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="团队DORA指标" className="dashboard-card">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius={90} width={500} height={300} data={teams.map(team => ({
                  name: team.name,
                  deployFrequency: team.metrics.deployFrequency / 20 * 100, // 归一化处理
                  leadTime: (1 / team.metrics.leadTime) * 5 * 100, // 归一化处理，值越小越好
                  failureRate: (1 / team.metrics.failureRate) * 5 * 100, // 归一化处理，值越小越好
                  mttr: (1 / team.metrics.mttr) * 100 * 2, // 归一化处理，值越小越好
                  codeQuality: team.metrics.codeQuality,
                  testCoverage: team.metrics.testCoverage
                }))}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="部署频率" dataKey="deployFrequency" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                  <Radar name="前置时间" dataKey="leadTime" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
                  <Radar name="失败率" dataKey="failureRate" stroke="#ffc658" fill="#ffc658" fillOpacity={0.2} />
                  <Radar name="恢复时间" dataKey="mttr" stroke="#ff8042" fill="#ff8042" fillOpacity={0.2} />
                  <Radar name="代码质量" dataKey="codeQuality" stroke="#00C49F" fill="#00C49F" fillOpacity={0.2} />
                  <Radar name="测试覆盖" dataKey="testCoverage" stroke="#FFBB28" fill="#FFBB28" fillOpacity={0.2} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="团队技能矩阵" className="dashboard-card">
              <Tabs defaultActiveKey="1">
                {teams.map(team => (
                  <TabPane tab={team.name} key={team.id}>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart outerRadius={90} width={500} height={300} data={team.skills}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="技能水平" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </TabPane>
                ))}
              </Tabs>
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
              title="团队总数"
              value={teams.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="成员总数"
              value={members.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="平均效能指数"
              value={teams.reduce((sum, team) => sum + team.efficiency, 0) / teams.length}
              precision={1}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="/100"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="平均满意度"
              value={teams.reduce((sum, team) => sum + team.satisfaction, 0) / teams.length}
              precision={1}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              suffix="/5.0"
            />
          </Card>
        </Col>
      </Row>

      <Card className="dashboard-card" style={{ marginBottom: 16 }}>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="团队概览" key="1">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showTeamModal()}>
                添加团队
              </Button>
            </div>
            {renderTeamOverview()}
          </TabPane>
          <TabPane tab="团队列表" key="2">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showTeamModal()}>
                添加团队
              </Button>
            </div>
            <Table 
              columns={teamColumns} 
              dataSource={teams} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane tab="成员管理" key="3">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showMemberModal()}>
                添加成员
              </Button>
            </div>
            <Table 
              columns={memberColumns} 
              dataSource={members} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane tab="效能分析" key="4">
            {renderTeamPerformance()}
          </TabPane>
        </Tabs>
      </Card>

      {/* 添加/编辑团队模态框 */}
      <Modal
        title={currentTeam ? '编辑团队' : '添加团队'}
        open={teamModal}
        onOk={handleTeamSubmit}
        onCancel={() => setTeamModal(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="团队名称"
            rules={[{ required: true, message: '请输入团队名称' }]}
          >
            <Input placeholder="请输入团队名称" />
          </Form.Item>
          <Form.Item
            name="lead"
            label="团队负责人"
            rules={[{ required: true, message: '请选择团队负责人' }]}
          >
            <Select placeholder="请选择团队负责人">
              {members.map(member => (
                <Option key={member.id} value={member.name}>{member.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加/编辑成员模态框 */}
      <Modal
        title={currentMember ? '编辑成员' : '添加成员'}
        open={memberModal}
        onOk={handleMemberSubmit}
        onCancel={() => setMemberModal(false)}
      >
        <Form form={memberForm} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="team"
            label="所属团队"
            rules={[{ required: true, message: '请选择所属团队' }]}
          >
            <Select placeholder="请选择所属团队">
              {teams.map(team => (
                <Option key={team.id} value={team.name}>{team.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请输入角色' }]}
          >
            <Input placeholder="请输入角色" />
          </Form.Item>
          <Form.Item
            name="skills"
            label="技能"
            rules={[{ required: true, message: '请选择技能' }]}
          >
            <Select mode="tags" placeholder="请输入技能">
              <Option value="React">React</Option>
              <Option value="Vue">Vue</Option>
              <Option value="Angular">Angular</Option>
              <Option value="Java">Java</Option>
              <Option value="Spring">Spring</Option>
              <Option value="Node.js">Node.js</Option>
              <Option value="Python">Python</Option>
              <Option value="Swift">Swift</Option>
              <Option value="Kotlin">Kotlin</Option>
              <Option value="Flutter">Flutter</Option>
              <Option value="Docker">Docker</Option>
              <Option value="Kubernetes">Kubernetes</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Teams

// 添加缺失的Rate组件
const Rate = ({ disabled, defaultValue, style }) => {
  return (
    <div style={style}>
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < defaultValue ? '#faad14' : '#d9d9d9', marginRight: 2 }}>★</span>
      ))}
    </div>
  )
}