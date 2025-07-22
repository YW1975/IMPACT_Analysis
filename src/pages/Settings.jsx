import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Form, Input, Button, Select, Switch, Tabs, Divider, Upload, message, Space, Alert, List, Typography, Tag, Tooltip } from 'antd'
import {
  SettingOutlined,
  SaveOutlined,
  SyncOutlined,
  ApiOutlined,
  GithubOutlined,
  GitlabOutlined,
  RobotOutlined,
  TeamOutlined,
  ProjectOutlined,
  BarChartOutlined,
  BellOutlined,
  CloudOutlined,
  LockOutlined,
  UserOutlined,
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  RocketOutlined,
  MailOutlined
} from '@ant-design/icons'

const { Option } = Select
const { TabPane } = Tabs
const { Title, Paragraph, Text } = Typography

const Settings = () => {
  const [generalForm] = Form.useForm()
  const [integrationForm] = Form.useForm()
  const [notificationForm] = Form.useForm()
  const [aiForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState('1')
  const [loading, setLoading] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [integrations, setIntegrations] = useState([])
  const [webhooks, setWebhooks] = useState([])

  useEffect(() => {
    // 模拟加载设置数据
    setTimeout(() => {
      generalForm.setFieldsValue({
        platformName: 'AI DevOps 效能管理平台',
        companyName: '示例科技有限公司',
        adminEmail: 'admin@example.com',
        dataRetentionPeriod: '365',
        timezone: 'Asia/Shanghai',
        language: 'zh-CN',
        theme: 'light'
      })

      integrationForm.setFieldsValue({
        githubEnabled: true,
        githubUrl: 'https://api.github.com',
        githubToken: '******************************',
        jiraEnabled: true,
        jiraUrl: 'https://example.atlassian.net',
        jiraUsername: 'jira_user',
        jiraToken: '**************',
        jenkinsEnabled: false,
        sonarqubeEnabled: true
      })

      notificationForm.setFieldsValue({
        emailEnabled: true,
        emailServer: 'smtp.example.com',
        emailPort: '587',
        emailUsername: 'notifications@example.com',
        slackEnabled: true,
        slackWebhook: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
        wechatEnabled: false
      })

      aiForm.setFieldsValue({
        openaiEnabled: true,
        aiProvider: 'openai',
        openaiModel: 'gpt-4o',
        insightGeneration: true,
        codeAnalysis: true,
        predictiveAnalytics: true,
        automatedReporting: true,
        analysisFrequency: 'daily',
        insightCategories: ['performance', 'quality', 'process'],
        maxTokensPerRequest: '4000'
      })

      setIntegrations([
        { id: 1, name: 'GitHub', type: 'git', status: 'connected', lastSync: '2023-11-28 14:30:22' },
        { id: 2, name: 'Jira', type: 'issue', status: 'connected', lastSync: '2023-11-28 15:45:10' },
        { id: 3, name: 'SonarQube', type: 'quality', status: 'connected', lastSync: '2023-11-28 12:15:33' },
        { id: 4, name: 'Jenkins', type: 'ci', status: 'disconnected', lastSync: '2023-11-25 09:22:45' }
      ])

      setWebhooks([
        { id: 1, name: '代码提交通知', url: 'https://example.com/webhook/code', events: ['push', 'pull_request'], active: true },
        { id: 2, name: '构建状态通知', url: 'https://example.com/webhook/build', events: ['build_success', 'build_failure'], active: true },
        { id: 3, name: '部署通知', url: 'https://example.com/webhook/deploy', events: ['deploy_start', 'deploy_success', 'deploy_failure'], active: true }
      ])
    }, 1000)
  }, [])

  const handleTabChange = (key) => {
    setActiveTab(key)
  }

  const handleGeneralSubmit = (values) => {
    setLoading(true)
    console.log('提交通用设置:', values)
    
    // 模拟API调用
    setTimeout(() => {
      message.success('通用设置已保存')
      setLoading(false)
    }, 1000)
  }

  const handleIntegrationSubmit = (values) => {
    setLoading(true)
    console.log('提交集成设置:', values)
    
    // 模拟API调用
    setTimeout(() => {
      message.success('集成设置已保存')
      setLoading(false)
    }, 1000)
  }

  const handleNotificationSubmit = (values) => {
    setLoading(true)
    console.log('提交通知设置:', values)
    
    // 模拟API调用
    setTimeout(() => {
      message.success('通知设置已保存')
      setLoading(false)
    }, 1000)
  }

  const handleAISubmit = (values) => {
    setLoading(true)
    console.log('提交AI设置:', values)
    
    // 模拟API调用
    setTimeout(() => {
      message.success('AI设置已保存')
      setLoading(false)
    }, 1000)
  }

  const testConnection = (type) => {
    setTestingConnection(true)
    console.log(`测试${type}连接`)
    
    // 模拟API调用
    setTimeout(() => {
      message.success(`${type}连接测试成功`)
      setTestingConnection(false)
    }, 2000)
  }

  const handleProviderChange = (provider) => {
    // 清除其他提供商的模型选择
    const fieldsToReset = [
      'openaiModel', 'anthropicModel', 'googleModel', 'localModel',
      'azureEndpoint', 'azureModel', 'azureApiVersion', 'localEndpoint'
    ]
    const resetValues = {}
    fieldsToReset.forEach(field => {
      resetValues[field] = undefined
    })
    aiForm.setFieldsValue(resetValues)
    
    // 根据提供商设置默认模型
    switch (provider) {
      case 'openai':
        aiForm.setFieldsValue({ openaiModel: 'gpt-4o' })
        break
      case 'anthropic':
        aiForm.setFieldsValue({ anthropicModel: 'claude-3-5-sonnet-20241022' })
        break
      case 'google':
        aiForm.setFieldsValue({ googleModel: 'gemini-1.5-pro' })
        break
      case 'azure':
        aiForm.setFieldsValue({ 
          azureModel: 'gpt-4o-deployment',
          azureApiVersion: '2024-08-01-preview'
        })
        break
      case 'local':
        aiForm.setFieldsValue({ 
          localModel: 'llama-3.1-70b',
          localEndpoint: 'http://localhost:11434'
        })
        break
    }
  }

  const renderGeneralSettings = () => {
    return (
      <Form
        form={generalForm}
        layout="vertical"
        onFinish={handleGeneralSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="platformName"
              label="平台名称"
              rules={[{ required: true, message: '请输入平台名称' }]}
            >
              <Input placeholder="请输入平台名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="companyName"
              label="公司名称"
              rules={[{ required: true, message: '请输入公司名称' }]}
            >
              <Input placeholder="请输入公司名称" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="adminEmail"
              label="管理员邮箱"
              rules={[
                { required: true, message: '请输入管理员邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入管理员邮箱" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dataRetentionPeriod"
              label="数据保留期限(天)"
              rules={[{ required: true, message: '请输入数据保留期限' }]}
            >
              <Input placeholder="请输入数据保留期限" type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="timezone"
              label="时区"
              rules={[{ required: true, message: '请选择时区' }]}
            >
              <Select placeholder="请选择时区">
                <Option value="Asia/Shanghai">中国标准时间 (UTC+8)</Option>
                <Option value="America/New_York">美国东部时间 (UTC-5)</Option>
                <Option value="Europe/London">格林威治标准时间 (UTC+0)</Option>
                <Option value="Europe/Paris">中欧时间 (UTC+1)</Option>
                <Option value="Asia/Tokyo">日本标准时间 (UTC+9)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="language"
              label="语言"
              rules={[{ required: true, message: '请选择语言' }]}
            >
              <Select placeholder="请选择语言">
                <Option value="zh-CN">简体中文</Option>
                <Option value="en-US">English (US)</Option>
                <Option value="ja-JP">日本語</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="theme"
              label="主题"
              rules={[{ required: true, message: '请选择主题' }]}
            >
              <Select placeholder="请选择主题">
                <Option value="light">浅色</Option>
                <Option value="dark">深色</Option>
                <Option value="auto">跟随系统</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
            保存设置
          </Button>
        </Form.Item>
      </Form>
    )
  }

  const renderIntegrationSettings = () => {
    return (
      <div>
        <Alert
          message="数据集成配置"
          description="连接您的开发工具，以便自动收集和分析软件开发效能数据。所有API令牌和密钥都将被安全加密存储。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Tabs defaultActiveKey="1" tabPosition="left" style={{ minHeight: 500 }}>
          <TabPane 
            tab={
              <span>
                <GithubOutlined />
                GitHub
              </span>
            } 
            key="1"
          >
            <Form
              form={integrationForm}
              layout="vertical"
              onFinish={handleIntegrationSubmit}
            >
              <Form.Item
                name="githubEnabled"
                valuePropName="checked"
                label="启用GitHub集成"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.githubEnabled !== currentValues.githubEnabled}
              >
                {({ getFieldValue }) => (
                  getFieldValue('githubEnabled') ? (
                    <>
                      <Row gutter={16}>
                        <Col span={16}>
                          <Form.Item
                            name="githubUrl"
                            label="GitHub API URL"
                            rules={[{ required: true, message: '请输入GitHub API URL' }]}
                          >
                            <Input placeholder="例如: https://api.github.com" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={16}>
                          <Form.Item
                            name="githubToken"
                            label="GitHub 访问令牌"
                            rules={[{ required: true, message: '请输入GitHub访问令牌' }]}
                          >
                            <Input.Password placeholder="请输入GitHub访问令牌" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        name="githubRepos"
                        label="要监控的仓库"
                      >
                        <Select
                          mode="tags"
                          placeholder="请输入仓库名称，例如: owner/repo"
                          style={{ width: '100%' }}
                        >
                          <Option value="org/repo1">org/repo1</Option>
                          <Option value="org/repo2">org/repo2</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item>
                        <Space>
                          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                            保存设置
                          </Button>
                          <Button 
                            onClick={() => testConnection('GitHub')} 
                            icon={<SyncOutlined />} 
                            loading={testingConnection}
                          >
                            测试连接
                          </Button>
                        </Space>
                      </Form.Item>
                    </>
                  ) : null
                )}
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <ApiOutlined />
                Jira
              </span>
            } 
            key="2"
          >
            <Form
              form={integrationForm}
              layout="vertical"
              onFinish={handleIntegrationSubmit}
            >
              <Form.Item
                name="jiraEnabled"
                valuePropName="checked"
                label="启用Jira集成"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.jiraEnabled !== currentValues.jiraEnabled}
              >
                {({ getFieldValue }) => (
                  getFieldValue('jiraEnabled') ? (
                    <>
                      <Row gutter={16}>
                        <Col span={16}>
                          <Form.Item
                            name="jiraUrl"
                            label="Jira URL"
                            rules={[{ required: true, message: '请输入Jira URL' }]}
                          >
                            <Input placeholder="例如: https://your-domain.atlassian.net" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="jiraUsername"
                            label="Jira 用户名/邮箱"
                            rules={[{ required: true, message: '请输入Jira用户名' }]}
                          >
                            <Input placeholder="请输入Jira用户名或邮箱" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="jiraToken"
                            label="Jira API令牌"
                            rules={[{ required: true, message: '请输入Jira API令牌' }]}
                          >
                            <Input.Password placeholder="请输入Jira API令牌" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        name="jiraProjects"
                        label="要监控的项目"
                      >
                        <Select
                          mode="tags"
                          placeholder="请输入Jira项目键"
                          style={{ width: '100%' }}
                        >
                          <Option value="PROJ1">PROJ1</Option>
                          <Option value="PROJ2">PROJ2</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item>
                        <Space>
                          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                            保存设置
                          </Button>
                          <Button 
                            onClick={() => testConnection('Jira')} 
                            icon={<SyncOutlined />} 
                            loading={testingConnection}
                          >
                            测试连接
                          </Button>
                        </Space>
                      </Form.Item>
                    </>
                  ) : null
                )}
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <ApiOutlined />
                Jenkins
              </span>
            } 
            key="3"
          >
            <Form
              form={integrationForm}
              layout="vertical"
              onFinish={handleIntegrationSubmit}
            >
              <Form.Item
                name="jenkinsEnabled"
                valuePropName="checked"
                label="启用Jenkins集成"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.jenkinsEnabled !== currentValues.jenkinsEnabled}
              >
                {({ getFieldValue }) => (
                  getFieldValue('jenkinsEnabled') ? (
                    <>
                      <Row gutter={16}>
                        <Col span={16}>
                          <Form.Item
                            name="jenkinsUrl"
                            label="Jenkins URL"
                            rules={[{ required: true, message: '请输入Jenkins URL' }]}
                          >
                            <Input placeholder="例如: https://jenkins.example.com" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="jenkinsUsername"
                            label="Jenkins 用户名"
                            rules={[{ required: true, message: '请输入Jenkins用户名' }]}
                          >
                            <Input placeholder="请输入Jenkins用户名" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="jenkinsToken"
                            label="Jenkins API令牌"
                            rules={[{ required: true, message: '请输入Jenkins API令牌' }]}
                          >
                            <Input.Password placeholder="请输入Jenkins API令牌" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item>
                        <Space>
                          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                            保存设置
                          </Button>
                          <Button 
                            onClick={() => testConnection('Jenkins')} 
                            icon={<SyncOutlined />} 
                            loading={testingConnection}
                          >
                            测试连接
                          </Button>
                        </Space>
                      </Form.Item>
                    </>
                  ) : null
                )}
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <ApiOutlined />
                SonarQube
              </span>
            } 
            key="4"
          >
            <Form
              form={integrationForm}
              layout="vertical"
              onFinish={handleIntegrationSubmit}
            >
              <Form.Item
                name="sonarqubeEnabled"
                valuePropName="checked"
                label="启用SonarQube集成"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.sonarqubeEnabled !== currentValues.sonarqubeEnabled}
              >
                {({ getFieldValue }) => (
                  getFieldValue('sonarqubeEnabled') ? (
                    <>
                      <Row gutter={16}>
                        <Col span={16}>
                          <Form.Item
                            name="sonarqubeUrl"
                            label="SonarQube URL"
                            rules={[{ required: true, message: '请输入SonarQube URL' }]}
                          >
                            <Input placeholder="例如: https://sonarqube.example.com" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={16}>
                          <Form.Item
                            name="sonarqubeToken"
                            label="SonarQube 访问令牌"
                            rules={[{ required: true, message: '请输入SonarQube访问令牌' }]}
                          >
                            <Input.Password placeholder="请输入SonarQube访问令牌" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item>
                        <Space>
                          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                            保存设置
                          </Button>
                          <Button 
                            onClick={() => testConnection('SonarQube')} 
                            icon={<SyncOutlined />} 
                            loading={testingConnection}
                          >
                            测试连接
                          </Button>
                        </Space>
                      </Form.Item>
                    </>
                  ) : null
                )}
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <Divider orientation="left">已连接的集成</Divider>
        
        <List
          itemLayout="horizontal"
          dataSource={integrations}
          renderItem={item => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => console.log('同步', item.id)} icon={<SyncOutlined />}>同步</Button>,
                <Button type="link" onClick={() => console.log('编辑', item.id)} icon={<SettingOutlined />}>编辑</Button>,
                <Button type="link" danger onClick={() => console.log('断开', item.id)} icon={<DeleteOutlined />}>断开</Button>
              ]}
            >
              <List.Item.Meta
                avatar={getIntegrationIcon(item.type)}
                title={
                  <div>
                    {item.name} 
                    {item.status === 'connected' ? 
                      <Tag color="success" style={{ marginLeft: 8 }}><CheckCircleOutlined /> 已连接</Tag> : 
                      <Tag color="error" style={{ marginLeft: 8 }}><ExclamationCircleOutlined /> 已断开</Tag>
                    }
                  </div>
                }
                description={`上次同步: ${item.lastSync}`}
              />
            </List.Item>
          )}
        />
      </div>
    )
  }

  const renderNotificationSettings = () => {
    return (
      <div>
        <Alert
          message="通知设置"
          description="配置系统事件的通知方式，包括邮件、Slack和微信等渠道。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Tabs defaultActiveKey="1" tabPosition="left">
          <TabPane 
            tab={
              <span>
                <MailOutlined />
                邮件通知
              </span>
            } 
            key="1"
          >
            <Form
              form={notificationForm}
              layout="vertical"
              onFinish={handleNotificationSubmit}
            >
              <Form.Item
                name="emailEnabled"
                valuePropName="checked"
                label="启用邮件通知"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.emailEnabled !== currentValues.emailEnabled}
              >
                {({ getFieldValue }) => (
                  getFieldValue('emailEnabled') ? (
                    <>
                      <Row gutter={16}>
                        <Col span={16}>
                          <Form.Item
                            name="emailServer"
                            label="SMTP服务器"
                            rules={[{ required: true, message: '请输入SMTP服务器' }]}
                          >
                            <Input placeholder="例如: smtp.example.com" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name="emailPort"
                            label="SMTP端口"
                            rules={[{ required: true, message: '请输入SMTP端口' }]}
                          >
                            <Input placeholder="例如: 587" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="emailUsername"
                            label="邮箱用户名"
                            rules={[{ required: true, message: '请输入邮箱用户名' }]}
                          >
                            <Input placeholder="请输入邮箱用户名" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="emailPassword"
                            label="邮箱密码"
                            rules={[{ required: true, message: '请输入邮箱密码' }]}
                          >
                            <Input.Password placeholder="请输入邮箱密码" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        name="emailSender"
                        label="发件人"
                        rules={[{ required: true, message: '请输入发件人' }]}
                      >
                        <Input placeholder="例如: DevOps平台 <devops@example.com>" />
                      </Form.Item>

                      <Form.Item>
                        <Space>
                          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                            保存设置
                          </Button>
                          <Button 
                            onClick={() => testConnection('邮件')} 
                            icon={<SyncOutlined />} 
                            loading={testingConnection}
                          >
                            测试连接
                          </Button>
                        </Space>
                      </Form.Item>
                    </>
                  ) : null
                )}
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <SlackOutlined />
                Slack通知
              </span>
            } 
            key="2"
          >
            <Form
              form={notificationForm}
              layout="vertical"
              onFinish={handleNotificationSubmit}
            >
              <Form.Item
                name="slackEnabled"
                valuePropName="checked"
                label="启用Slack通知"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.slackEnabled !== currentValues.slackEnabled}
              >
                {({ getFieldValue }) => (
                  getFieldValue('slackEnabled') ? (
                    <>
                      <Form.Item
                        name="slackWebhook"
                        label="Slack Webhook URL"
                        rules={[{ required: true, message: '请输入Slack Webhook URL' }]}
                      >
                        <Input.Password placeholder="请输入Slack Webhook URL" />
                      </Form.Item>

                      <Form.Item
                        name="slackChannel"
                        label="默认频道"
                      >
                        <Input placeholder="例如: #devops-alerts" />
                      </Form.Item>

                      <Form.Item>
                        <Space>
                          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                            保存设置
                          </Button>
                          <Button 
                            onClick={() => testConnection('Slack')} 
                            icon={<SyncOutlined />} 
                            loading={testingConnection}
                          >
                            测试连接
                          </Button>
                        </Space>
                      </Form.Item>
                    </>
                  ) : null
                )}
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <WechatOutlined />
                微信通知
              </span>
            } 
            key="3"
          >
            <Form
              form={notificationForm}
              layout="vertical"
              onFinish={handleNotificationSubmit}
            >
              <Form.Item
                name="wechatEnabled"
                valuePropName="checked"
                label="启用微信通知"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.wechatEnabled !== currentValues.wechatEnabled}
              >
                {({ getFieldValue }) => (
                  getFieldValue('wechatEnabled') ? (
                    <>
                      <Form.Item
                        name="wechatCorpId"
                        label="企业微信CorpID"
                        rules={[{ required: true, message: '请输入企业微信CorpID' }]}
                      >
                        <Input placeholder="请输入企业微信CorpID" />
                      </Form.Item>

                      <Form.Item
                        name="wechatCorpSecret"
                        label="企业微信Secret"
                        rules={[{ required: true, message: '请输入企业微信Secret' }]}
                      >
                        <Input.Password placeholder="请输入企业微信Secret" />
                      </Form.Item>

                      <Form.Item
                        name="wechatAgentId"
                        label="企业微信AgentID"
                        rules={[{ required: true, message: '请输入企业微信AgentID' }]}
                      >
                        <Input placeholder="请输入企业微信AgentID" />
                      </Form.Item>

                      <Form.Item>
                        <Space>
                          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                            保存设置
                          </Button>
                          <Button 
                            onClick={() => testConnection('微信')} 
                            icon={<SyncOutlined />} 
                            loading={testingConnection}
                          >
                            测试连接
                          </Button>
                        </Space>
                      </Form.Item>
                    </>
                  ) : null
                )}
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <ApiOutlined />
                Webhook
              </span>
            } 
            key="4"
          >
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => console.log('添加Webhook')}>
                添加Webhook
              </Button>
            </div>

            <List
              itemLayout="horizontal"
              dataSource={webhooks}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Switch checked={item.active} onChange={(checked) => console.log('切换状态', item.id, checked)} />,
                    <Button type="link" onClick={() => console.log('编辑', item.id)} icon={<EditOutlined />}>编辑</Button>,
                    <Button type="link" danger onClick={() => console.log('删除', item.id)} icon={<DeleteOutlined />}>删除</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={
                      <div>
                        <div>URL: {item.url}</div>
                        <div>
                          事件: {item.events.map(event => (
                            <Tag key={event}>{event}</Tag>
                          ))}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </div>
    )
  }

  const renderAISettings = () => {
    return (
      <div>
        <Alert
          message="AI功能设置"
          description="配置AI分析和自动化功能，包括OpenAI集成、智能洞察生成、代码分析和预测性分析等。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={aiForm}
          layout="vertical"
          onFinish={handleAISubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Card title="OpenAI集成" className="settings-card">
                <Form.Item
                  name="openaiEnabled"
                  valuePropName="checked"
                  label="启用OpenAI集成"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => prevValues.openaiEnabled !== currentValues.openaiEnabled}
                >
                  {({ getFieldValue }) => (
                    getFieldValue('openaiEnabled') ? (
                      <>
                        <Form.Item
                          name="openaiApiKey"
                          label="OpenAI API密钥"
                          rules={[{ required: true, message: '请输入OpenAI API密钥' }]}
                        >
                          <Input.Password placeholder="请输入OpenAI API密钥" />
                        </Form.Item>

                        <Form.Item
                          name="openaiModel"
                          label="默认模型"
                          rules={[{ required: true, message: '请选择默认模型' }]}
                        >
                          <Select placeholder="请选择默认模型">
                            <Option value="gpt-4o">GPT-4o (推荐)</Option>
                            <Option value="gpt-4o-mini">GPT-4o Mini</Option>
                            <Option value="o1-preview">o1-preview (推理模型)</Option>
                            <Option value="o1-mini">o1-mini (推理模型)</Option>
                            <Option value="gpt-4-turbo">GPT-4 Turbo (传统)</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item
                          name="aiProvider"
                          label="AI服务提供商"
                          rules={[{ required: true, message: '请选择AI服务提供商' }]}
                        >
                          <Select placeholder="请选择AI服务提供商" onChange={(value) => handleProviderChange(value)}>
                            <Option value="openai">OpenAI</Option>
                            <Option value="anthropic">Anthropic (Claude)</Option>
                            <Option value="google">Google (Gemini)</Option>
                            <Option value="azure">Azure OpenAI</Option>
                            <Option value="local">本地模型</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) => prevValues.aiProvider !== currentValues.aiProvider}
                        >
                          {({ getFieldValue }) => {
                            const provider = getFieldValue('aiProvider');
                            if (provider === 'anthropic') {
                              return (
                                <Form.Item
                                  name="anthropicModel"
                                  label="Claude模型"
                                  rules={[{ required: true, message: '请选择Claude模型' }]}
                                >
                                  <Select placeholder="请选择Claude模型">
                                    <Option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (最新)</Option>
                                    <Option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (快速)</Option>
                                    <Option value="claude-3-opus-20240229">Claude 3 Opus (强大)</Option>
                                  </Select>
                                </Form.Item>
                              );
                            }
                            if (provider === 'google') {
                              return (
                                <Form.Item
                                  name="googleModel"
                                  label="Gemini模型"
                                  rules={[{ required: true, message: '请选择Gemini模型' }]}
                                >
                                  <Select placeholder="请选择Gemini模型">
                                    <Option value="gemini-1.5-pro">Gemini 1.5 Pro</Option>
                                    <Option value="gemini-1.5-flash">Gemini 1.5 Flash</Option>
                                    <Option value="gemini-1.0-pro">Gemini 1.0 Pro</Option>
                                  </Select>
                                </Form.Item>
                              );
                            }
                            if (provider === 'azure') {
                               return (
                                 <>
                                   <Form.Item
                                     name="azureEndpoint"
                                     label="Azure OpenAI 端点"
                                     rules={[{ required: true, message: '请输入Azure OpenAI端点' }]}
                                   >
                                     <Input placeholder="例如: https://your-resource.openai.azure.com/" />
                                   </Form.Item>
                                   <Form.Item
                                     name="azureModel"
                                     label="Azure模型部署名称"
                                     rules={[{ required: true, message: '请输入模型部署名称' }]}
                                   >
                                     <Input placeholder="例如: gpt-4o-deployment" />
                                   </Form.Item>
                                   <Form.Item
                                     name="azureApiVersion"
                                     label="API版本"
                                     rules={[{ required: true, message: '请选择API版本' }]}
                                   >
                                     <Select placeholder="请选择API版本">
                                       <Option value="2024-08-01-preview">2024-08-01-preview (最新)</Option>
                                       <Option value="2024-06-01">2024-06-01</Option>
                                       <Option value="2024-02-01">2024-02-01</Option>
                                     </Select>
                                   </Form.Item>
                                 </>
                               );
                             }
                             if (provider === 'local') {
                               return (
                                 <>
                                   <Form.Item
                                     name="localEndpoint"
                                     label="本地模型端点"
                                     rules={[{ required: true, message: '请输入本地模型端点' }]}
                                   >
                                     <Input placeholder="例如: http://localhost:11434" />
                                   </Form.Item>
                                   <Form.Item
                                     name="localModel"
                                     label="本地模型"
                                     rules={[{ required: true, message: '请选择本地模型' }]}
                                   >
                                     <Select placeholder="请选择本地模型">
                                       <Option value="llama-3.1-70b">Llama 3.1 70B</Option>
                                       <Option value="llama-3.1-8b">Llama 3.1 8B</Option>
                                       <Option value="qwen2.5-72b">Qwen2.5 72B</Option>
                                       <Option value="deepseek-v2.5">DeepSeek V2.5</Option>
                                       <Option value="custom">自定义模型</Option>
                                     </Select>
                                   </Form.Item>
                                 </>
                               );
                             }
                             return null;
                          }}
                        </Form.Item>
                      </>
                    ) : null
                  )}
                </Form.Item>
              </Card>
            </Col>

            <Col span={12}>
              <Card title="AI功能配置" className="settings-card">
                <Form.Item
                  name="insightGeneration"
                  valuePropName="checked"
                  label="智能洞察生成"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="codeAnalysis"
                  valuePropName="checked"
                  label="代码智能分析"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="predictiveAnalytics"
                  valuePropName="checked"
                  label="预测性分析"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="automatedReporting"
                  valuePropName="checked"
                  label="自动报告生成"
                >
                  <Switch />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="AI分析配置" className="settings-card">
                <Form.Item
                  name="analysisFrequency"
                  label="分析频率"
                >
                  <Select placeholder="请选择分析频率">
                    <Option value="hourly">每小时</Option>
                    <Option value="daily">每天</Option>
                    <Option value="weekly">每周</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="insightCategories"
                  label="洞察类别"
                >
                  <Select mode="multiple" placeholder="请选择洞察类别">
                    <Option value="performance">性能问题</Option>
                    <Option value="quality">质量问题</Option>
                    <Option value="process">流程优化</Option>
                    <Option value="team">团队协作</Option>
                    <Option value="risk">风险预警</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="maxTokensPerRequest"
                  label="每次请求最大Token数"
                >
                  <Input type="number" placeholder="例如: 4000" />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 16 }}>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
              保存AI设置
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }

  return (
    <div>
      <Card className="dashboard-card" style={{ marginBottom: 16 }}>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane 
            tab={
              <span>
                <SettingOutlined />
                通用设置
              </span>
            } 
            key="1"
          >
            {renderGeneralSettings()}
          </TabPane>
          <TabPane 
            tab={
              <span>
                <ApiOutlined />
                集成设置
              </span>
            } 
            key="2"
          >
            {renderIntegrationSettings()}
          </TabPane>
          <TabPane 
            tab={
              <span>
                <BellOutlined />
                通知设置
              </span>
            } 
            key="3"
          >
            {renderNotificationSettings()}
          </TabPane>
          <TabPane 
            tab={
              <span>
                <RobotOutlined />
                AI设置
              </span>
            } 
            key="4"
          >
            {renderAISettings()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default Settings

// 添加缺失的图标组件
const SlackOutlined = ({ style }) => <span style={style}>💬</span>
const WechatOutlined = ({ style }) => <span style={style}>💬</span>

// 获取集成图标
const getIntegrationIcon = (type) => {
  switch (type) {
    case 'git':
      return <GithubOutlined style={{ fontSize: 24, color: '#1890ff' }} />
    case 'issue':
      return <ApiOutlined style={{ fontSize: 24, color: '#1890ff' }} />
    case 'ci':
      return <RocketOutlined style={{ fontSize: 24, color: '#1890ff' }} />
    case 'quality':
      return <BarChartOutlined style={{ fontSize: 24, color: '#1890ff' }} />
    default:
      return <ApiOutlined style={{ fontSize: 24, color: '#1890ff' }} />
  }
}