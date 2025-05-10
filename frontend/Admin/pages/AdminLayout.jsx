import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header.jsx'

const Dashboard = () => {
  return (
     <div>
      <Header />
      <Outlet />
      </div>
  )
}

export default Dashboard