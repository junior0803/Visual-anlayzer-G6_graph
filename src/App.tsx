import React from 'react';
import 'antd/dist/antd.css';
import Routes from './routes';
import './App.css';
import './css/bootstrap.min.css';
import { initialize } from './customG6';

const App = () => {
  initialize()
  
  return (
    <div className="App">
      <Routes />
    </div>
  );
};

export default App