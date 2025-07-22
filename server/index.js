const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { Configuration, OpenAIApi } = require('openai');
const { Octokit } = require('@octokit/rest');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// 加载环境变量
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 模拟数据
const mockData = {
  // DORA指标数据
  doraMetrics: {
    deploymentFrequency: [
      { date: '2023-06', value: 8.2 },
      { date: '2023-07', value: 9.5 },
      { date: '2023-08', value: 10.8 },
      { date: '2023-09', value: 12.3 },
      { date: '2023-10', value: 14.5 },
      { date: '2023-11', value: 15.2 }
    ],
    leadTime: [
      { date: '2023-06', value: 3.8 },
      { date: '2023-07', value: 3.5 },
      { date: '2023-08', value: 3.2 },
      { date: '2023-09', value: 2.8 },
      { date: '2023-10', value: 2.5 },
      { date: '2023-11', value: 2.2 }
    ],
    changeFailureRate: [
      { date: '2023-06', value: 4.8 },
      { date: '2023-07', value: 4.5 },
      { date: '2023-08', value: 4.2 },
      { date: '2023-09', value: 3.8 },
      { date: '2023-10', value: 3.5 },
      { date: '2023-11', value: 3.2 }
    ],
    timeToRestore: [
      { date: '2023-06', value: 65 },
      { date: '2023-07', value: 58 },
      { date: '2023-08', value: 52 },
      { date: '2023-09', value: 48 },
      { date: '2023-10', value: 42 },
      { date: '2023-11', value: 38 }
    ]
  },
  
  // 流动效率指标
  flowMetrics: {
    flowEfficiency: [
      { date: '2023-06', value: 52 },
      { date: '2023-07', value: 55 },
      { date: '2023-08', value: 58 },
      { date: '2023-09', value: 62 },
      { date: '2023-10', value: 65 },
      { date: '2023-11', value: 68 }
    ],
    wipTrend: [
      { date: '2023-06', value: 28 },
      { date: '2023-07', value: 26 },
      { date: '2023-08', value: 24 },
      { date: '2023-09', value: 22 },
      { date: '2023-10', value: 20 },
      { date: '2023-11', value: 18 }
    ],
    cycleTime: [
      { date: '2023-06', value: 12.5 },
      { date: '2023-07', value: 11.8 },
      { date: '2023-08', value: 10.5 },
      { date: '2023-09', value: 9.8 },
      { date: '2023-10', value: 9.2 },
      { date: '2023-11', value: 8.5 }
    ],
    throughput: [
      { date: '2023-06', value: 85 },
      { date: '2023-07', value: 92 },
      { date: '2023-08', value: 98 },
      { date: '2023-09', value: 105 },
      { date: '2023-10', value: 112 },
      { date: '2023-11', value: 118 }
    ]
  },
  
  // 团队数据
  teams: [
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
  ],
  
  // 项目数据
  projects: [
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
    }
  ],
  
  // AI洞察数据
  aiInsights: [
    {
      id: 1,
      title: '前端团队代码质量改进机会',
      description: '基于静态代码分析，发现前端团队在错误处理和组件复用方面有改进空间。建议增加错误边界组件和提取更多可复用hooks。',
      type: 'quality',
      severity: 'medium',
      createdAt: '2023-11-25T08:30:00Z',
      relatedTeam: '前端团队',
      relatedProject: '电商平台重构',
      metrics: ['代码质量', '可维护性'],
      status: 'open'
    },
    {
      id: 2,
      title: '部署频率下降预警',
      description: '过去两周部署频率较上月同期下降32%，主要受到测试环境不稳定影响。建议优化测试环境配置并增加自动化测试覆盖率。',
      type: 'process',
      severity: 'high',
      createdAt: '2023-11-26T14:15:00Z',
      relatedTeam: 'DevOps团队',
      relatedProject: '电商平台重构',
      metrics: ['部署频率', '测试覆盖率'],
      status: 'in_progress'
    },
    {
      id: 3,
      title: '移动应用性能优化建议',
      description: '分析显示移动应用在图片加载和列表渲染方面存在性能瓶颈。建议实施图片懒加载和虚拟列表优化，预计可提升应用启动速度约25%。',
      type: 'performance',
      severity: 'medium',
      createdAt: '2023-11-27T10:45:00Z',
      relatedTeam: '移动端团队',
      relatedProject: '移动应用升级',
      metrics: ['性能', '用户体验'],
      status: 'open'
    },
    {
      id: 4,
      title: '后端服务扩展性风险',
      description: '基于当前用户增长趋势和负载分析，预测在春节促销期间现有数据库架构可能面临扩展性挑战。建议提前实施读写分离和分库分表策略。',
      type: 'risk',
      severity: 'high',
      createdAt: '2023-11-28T09:20:00Z',
      relatedTeam: '后端团队',
      relatedProject: '电商平台重构',
      metrics: ['可扩展性', '系统稳定性'],
      status: 'open'
    },
    {
      id: 5,
      title: '团队协作模式优化',
      description: 'AI分析发现前端和后端团队之间的API变更协作流程存在摩擦点，导致平均每周约8小时的等待时间。建议实施API驱动开发和自动化契约测试。',
      type: 'collaboration',
      severity: 'medium',
      createdAt: '2023-11-28T16:10:00Z',
      relatedTeam: '多团队',
      relatedProject: '电商平台重构',
      metrics: ['协作效率', '前置时间'],
      status: 'open'
    }
  ],
  
  // 活动数据
  activities: [
    {
      id: 1,
      type: 'deployment',
      project: '电商平台重构',
      description: '成功部署v2.5.0版本到生产环境',
      user: '赵六',
      timestamp: '2023-11-28T15:30:00Z',
      status: 'success'
    },
    {
      id: 2,
      type: 'code',
      project: '移动应用升级',
      description: '合并了"优化图片加载性能"的PR #128',
      user: '王五',
      timestamp: '2023-11-28T14:45:00Z',
      status: 'success'
    },
    {
      id: 3,
      type: 'incident',
      project: '电商平台重构',
      description: '解决了支付模块的服务中断问题',
      user: '李四',
      timestamp: '2023-11-28T10:15:00Z',
      status: 'resolved'
    },
    {
      id: 4,
      type: 'test',
      project: '数据分析平台',
      description: '完成了数据处理模块的单元测试',
      user: '张明',
      timestamp: '2023-11-28T09:30:00Z',
      status: 'success'
    },
    {
      id: 5,
      type: 'meeting',
      project: '全部项目',
      description: '举行了每周效能回顾会议',
      user: '张三',
      timestamp: '2023-11-27T16:00:00Z',
      status: 'completed'
    }
  ]
};

// 配置OpenAI
let openai;
if (process.env.OPENAI_API_KEY) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  openai = new OpenAIApi(configuration);
}

// 配置GitHub API
let octokit;
if (process.env.GITHUB_TOKEN) {
  octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
}

// API路由

// 获取仪表盘数据
app.get('/api/dashboard', (req, res) => {
  const dashboardData = {
    doraMetrics: {
      deploymentFrequency: mockData.doraMetrics.deploymentFrequency[mockData.doraMetrics.deploymentFrequency.length - 1].value,
      leadTime: mockData.doraMetrics.leadTime[mockData.doraMetrics.leadTime.length - 1].value,
      changeFailureRate: mockData.doraMetrics.changeFailureRate[mockData.doraMetrics.changeFailureRate.length - 1].value,
      timeToRestore: mockData.doraMetrics.timeToRestore[mockData.doraMetrics.timeToRestore.length - 1].value
    },
    flowMetrics: {
      flowEfficiency: mockData.flowMetrics.flowEfficiency[mockData.flowMetrics.flowEfficiency.length - 1].value,
      wipCount: mockData.flowMetrics.wipTrend[mockData.flowMetrics.wipTrend.length - 1].value,
      cycleTime: mockData.flowMetrics.cycleTime[mockData.flowMetrics.cycleTime.length - 1].value,
      throughput: mockData.flowMetrics.throughput[mockData.flowMetrics.throughput.length - 1].value
    },
    deploymentTrend: mockData.doraMetrics.deploymentFrequency,
    leadTimeTrend: mockData.doraMetrics.leadTime,
    teamPerformance: mockData.teams.map(team => ({
      name: team.name,
      efficiency: team.efficiency,
      velocity: team.velocity
    })),
    teamRanking: [...mockData.teams].sort((a, b) => b.efficiency - a.efficiency).map(team => ({
      name: team.name,
      score: team.efficiency,
      trend: team.trend,
      trendValue: team.trendValue
    })),
    recentActivities: mockData.activities
  };
  
  res.json(dashboardData);
});

// 获取分析数据
app.get('/api/analytics', (req, res) => {
  const { timeRange, team, project } = req.query;
  
  // 这里可以根据查询参数过滤数据
  const analyticsData = {
    doraMetrics: mockData.doraMetrics,
    flowMetrics: mockData.flowMetrics,
    qualityMetrics: {
      codeQuality: mockData.teams.map(team => ({
        name: team.name,
        value: team.metrics.codeQuality
      })),
      testCoverage: mockData.teams.map(team => ({
        name: team.name,
        value: team.metrics.testCoverage
      })),
      bugRate: mockData.projects.map(project => ({
        name: project.name,
        value: project.metrics.bugRate
      }))
    },
    teamMetrics: {
      efficiency: mockData.teams.map(team => ({
        name: team.name,
        value: team.efficiency
      })),
      velocity: mockData.teams.map(team => ({
        name: team.name,
        value: team.velocity
      })),
      satisfaction: mockData.teams.map(team => ({
        name: team.name,
        value: team.satisfaction
      }))
    }
  };
  
  res.json(analyticsData);
});

// 获取团队数据
app.get('/api/teams', (req, res) => {
  res.json(mockData.teams);
});

// 获取团队成员数据
app.get('/api/teams/members', (req, res) => {
  const members = [
    { id: 1, name: '张三', team: '前端团队', role: '团队负责人', skills: ['React', 'Vue', 'TypeScript'], efficiency: 92, contribution: 95 },
    { id: 2, name: '李明', team: '前端团队', role: '高级开发', skills: ['React', 'JavaScript', 'CSS'], efficiency: 88, contribution: 85 },
    { id: 3, name: '王芳', team: '前端团队', role: '开发工程师', skills: ['Vue', 'JavaScript', 'HTML'], efficiency: 82, contribution: 78 },
    { id: 4, name: '赵静', team: '前端团队', role: 'UI开发', skills: ['CSS', 'SCSS', 'React'], efficiency: 85, contribution: 80 },
    { id: 5, name: '李四', team: '后端团队', role: '团队负责人', skills: ['Java', 'Spring', 'SQL'], efficiency: 90, contribution: 92 },
    { id: 6, name: '张伟', team: '后端团队', role: '架构师', skills: ['Java', 'Microservices', 'NoSQL'], efficiency: 94, contribution: 90 },
    { id: 7, name: '王五', team: '移动端团队', role: '团队负责人', skills: ['Swift', 'Kotlin', 'Flutter'], efficiency: 91, contribution: 88 },
    { id: 8, name: '赵六', team: 'DevOps团队', role: '团队负责人', skills: ['Docker', 'Kubernetes', 'CI/CD'], efficiency: 93, contribution: 91 }
  ];
  
  res.json(members);
});

// 获取项目数据
app.get('/api/projects', (req, res) => {
  res.json(mockData.projects);
});

// 获取AI洞察数据
app.get('/api/ai/insights', (req, res) => {
  res.json(mockData.aiInsights);
});

// 生成AI洞察
app.post('/api/ai/generate-insight', async (req, res) => {
  const { topic, context } = req.body;
  
  if (!openai) {
    return res.status(400).json({ error: 'OpenAI API未配置' });
  }
  
  try {
    // 构建提示词
    const prompt = `作为一个软件开发效能分析AI，请基于以下上下文数据，生成关于"${topic}"的洞察和改进建议：\n\n${context}\n\n请提供具体、可操作的建议，并尽可能量化预期的改进效果。`;
    
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const insight = response.data.choices[0].text.trim();
    
    res.json({
      topic,
      insight,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('OpenAI API错误:', error);
    res.status(500).json({ error: '生成洞察时出错' });
  }
});

// AI问答接口
app.post('/api/ai/chat', async (req, res) => {
  const { question, history } = req.body;
  
  if (!openai) {
    return res.status(400).json({ error: 'OpenAI API未配置' });
  }
  
  try {
    // 构建对话历史
    let messages = [
      { role: "system", content: "你是一个专注于软件开发效能分析的AI助手。你擅长分析DORA指标、流动效率、团队协作和代码质量等方面的数据，并提供具体的改进建议。" },
    ];
    
    // 添加历史对话
    if (history && history.length > 0) {
      history.forEach(item => {
        messages.push({ role: "user", content: item.question });
        if (item.answer) {
          messages.push({ role: "assistant", content: item.answer });
        }
      });
    }
    
    // 添加当前问题
    messages.push({ role: "user", content: question });
    
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });
    
    const answer = response.data.choices[0].message.content.trim();
    
    res.json({
      question,
      answer,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('OpenAI API错误:', error);
    res.status(500).json({ error: '处理问题时出错' });
  }
});

// 获取GitHub数据
app.get('/api/github/repos/:owner/:repo/stats', async (req, res) => {
  const { owner, repo } = req.params;
  
  if (!octokit) {
    return res.status(400).json({ error: 'GitHub API未配置' });
  }
  
  try {
    // 获取提交统计
    const commitStats = await octokit.repos.getCommitActivityStats({
      owner,
      repo
    });
    
    // 获取代码频率统计
    const codeFrequency = await octokit.repos.getCodeFrequencyStats({
      owner,
      repo
    });
    
    // 获取参与者统计
    const participationStats = await octokit.repos.getParticipationStats({
      owner,
      repo
    });
    
    res.json({
      commitActivity: commitStats.data,
      codeFrequency: codeFrequency.data,
      participation: participationStats.data
    });
  } catch (error) {
    console.error('GitHub API错误:', error);
    res.status(500).json({ error: '获取GitHub数据时出错' });
  }
});

// 实时数据更新
io.on('connection', (socket) => {
  console.log('客户端已连接:', socket.id);
  
  // 每30秒发送一次模拟的实时更新
  const interval = setInterval(() => {
    // 模拟一些实时数据变化
    const realtimeUpdate = {
      timestamp: new Date().toISOString(),
      metrics: {
        deploymentFrequency: mockData.doraMetrics.deploymentFrequency[mockData.doraMetrics.deploymentFrequency.length - 1].value + (Math.random() * 0.5 - 0.25),
        leadTime: mockData.doraMetrics.leadTime[mockData.doraMetrics.leadTime.length - 1].value + (Math.random() * 0.3 - 0.15),
        flowEfficiency: mockData.flowMetrics.flowEfficiency[mockData.flowMetrics.flowEfficiency.length - 1].value + (Math.random() * 2 - 1)
      },
      newActivity: {
        id: Date.now(),
        type: ['deployment', 'code', 'test', 'incident'][Math.floor(Math.random() * 4)],
        project: mockData.projects[Math.floor(Math.random() * mockData.projects.length)].name,
        description: '新的活动更新',
        user: mockData.teams[Math.floor(Math.random() * mockData.teams.length)].lead,
        timestamp: new Date().toISOString(),
        status: 'success'
      }
    };
    
    socket.emit('realtime-update', realtimeUpdate);
  }, 30000);
  
  socket.on('disconnect', () => {
    console.log('客户端已断开连接:', socket.id);
    clearInterval(interval);
  });
});

// 启动服务器
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});