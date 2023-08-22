

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AllTrainsPage from './pages/all';
import SingleTrainPage from './pages/Single';

function App() {
  return (
    <Router>
      <div>
        <Route path="/" exact component={all} />
        <Route path="/train/:trainNumber" component={Single} />
      </div>
    </Router>
  );
}

export default App;
