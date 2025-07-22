import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, List, Avatar, Typography, Spin, Alert, Divider } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息到AI
  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    setError(null);
    
    try {
      // 构建历史对话（仅包含最近5条）
      const recentMessages = messages.slice(-10);
      const history = recentMessages.map(msg => ({
        question: msg.type === 'user' ? msg.content : '',
        answer: msg.type === 'ai' ? msg.content : ''
      })).filter(item => item.question || item.answer);
      
      // 调用API
      const response = await fetch('http://127.0.0.1:8000/api/v1/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          context: {
            history: history
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('AI响应出错');
      }
      
      const data = await response.json();
      
      // 添加AI回复
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.data?.response || data.response || '抱歉，AI暂时无法回复您的问题。',
        timestamp: data.timestamp || new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('AI聊天错误:', err);
      setError(err.message || '与AI通信时出错');
      
      // 模拟AI回复（仅在开发环境或API未配置时使用）
      setTimeout(() => {
        const mockResponses = [
          '根据您团队的部署频率数据，我建议实施持续集成和自动化测试，这可能会将部署频率提高25-30%。',
          '分析您提供的变更前置时间数据，主要瓶颈似乎在代码审查环节。建议实施结对编程和更小的代码提交单元，可能减少30%的等待时间。',
          '您团队的流动效率为65%，这在行业中处于中等水平。通过减少在制品数量和优化工作流程，有望将其提升到75-80%。',
          '基于您的团队结构和项目类型，我建议采用混合的敏捷方法，结合Scrum的迭代计划和看板的流动控制，这可能会提高团队的整体效能。',
          '您的代码质量指标显示，技术债务正在累积。建议分配20%的开发时间专门用于重构和技术债务清理，长期来看这将提高开发速度。'
        ];
        
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setLoading(false);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 处理按键事件（回车发送）
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card 
      title={<Title level={4}>AI效能助手</Title>}
      className="ai-chat-card"
      bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div className="chat-container" style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {messages.length === 0 ? (
          <div className="empty-chat">
            <RobotOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Text type="secondary">您可以向AI助手询问关于软件开发效能的问题，例如：</Text>
            <List
              size="small"
              style={{ marginTop: 16, maxWidth: 500 }}
              bordered
              dataSource={[
                '如何提高我们团队的部署频率？',
                '我们的变更前置时间过长，有什么改进建议？',
                '如何提高团队的流动效率？',
                '基于我们的团队结构，推荐什么样的敏捷方法？',
                '如何平衡新功能开发和技术债务清理？'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Button 
                    type="link" 
                    onClick={() => {
                      setInputValue(item);
                      setTimeout(() => sendMessage(), 100);
                    }}
                  >
                    {item}
                  </Button>
                </List.Item>
              )}
            />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(message) => (
              <List.Item className={`chat-message ${message.type}`}>
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      icon={message.type === 'ai' ? <RobotOutlined /> : <UserOutlined />}
                      style={{
                        backgroundColor: message.type === 'ai' ? '#1890ff' : '#52c41a'
                      }}
                    />
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong>{message.type === 'ai' ? 'AI助手' : '您'}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatTime(message.timestamp)}
                      </Text>
                    </div>
                  }
                  description={
                    <div className="message-content">
                      {message.type === 'ai' ? (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      ) : (
                        <Text>{message.content}</Text>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
        
        {error && (
          <Alert 
            message="错误" 
            description={error} 
            type="error" 
            showIcon 
            closable 
            style={{ margin: '16px 0' }}
            onClose={() => setError(null)}
          />
        )}
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <Spin tip="AI正在思考中..." />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <Divider style={{ margin: 0 }} />
      
      <div className="chat-input" style={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
        <div style={{ display: 'flex' }}>
          <TextArea
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="输入您的问题，按Enter发送..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={loading}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={sendMessage}
            disabled={!inputValue.trim() || loading}
            style={{ marginLeft: 8 }}
          />
        </div>
        <Text type="secondary" style={{ fontSize: '12px', marginTop: 8 }}>
          提示：按Shift+Enter可以换行
        </Text>
      </div>
    </Card>
  );
};

export default AIChat;