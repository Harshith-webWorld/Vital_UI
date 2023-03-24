import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import NewDashboard from '../../../Components/NewDashboard';

const WebDashboard: React.FC = () => {
  return (
    <div className='in-left'>
      {/* <Dashboard /> */}
      <NewDashboard />
    </div>
  );
};

export default WebDashboard;
