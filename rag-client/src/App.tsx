import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RAGPage from './pages/RAGPage';
import { AboutPage } from './pages/AboutPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>} />
        <Route path="/chat" element={<RAGPage></RAGPage>} />
        <Route path="/about" element={<AboutPage></AboutPage>} />
      </Routes>
    </Router>
  );
}

export default App;
