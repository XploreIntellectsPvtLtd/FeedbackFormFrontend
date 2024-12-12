import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StudentFeedBackIndex from './Studen Master/StudentFeedBackForm/StudentFeedBackIndex';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentFeedBackIndex/>}/>
      </Routes>
     
    </BrowserRouter>
  );
};

export default App;
