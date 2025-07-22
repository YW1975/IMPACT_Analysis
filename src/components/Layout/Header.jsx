import React from 'react'
import { Layout, Avatar, Dropdown, Badge, Button, Space } from 'antd'
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  SyncOutlined
} from '@ant-design/icons'

const { Header: AntHeader } = Layout

const Header = () => {
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ]

  const handleSync = () => {
    // 触发数据同步
    console.log('开始同步数据...')
  }

  return (
    <AntHeader 
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 0, // 已在App.jsx中设置Layout的marginLeft
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
        软件开发效能管理平台
      </div>
      
      <Space size="large">
        <Button 
          type="primary" 
          icon={<SyncOutlined />} 
          onClick={handleSync}
          size="small"
        >
          同步数据
        </Button>
        
        <Badge count={5} size="small">
          <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
        </Badge>
        
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
        >
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
            <span>管理员</span>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  )
}

export default Header