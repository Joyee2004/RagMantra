import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RAGPage from './pages/RAGPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>} />
        <Route path="/chat" element={<RAGPage></RAGPage>} />
      </Routes>
    </Router>
  );
}

export default App;
