import { Routes, Route } from "react-router-dom";
import ConnectorsPage from "./pages/ConnectorsPage";
import ConnectorDetail from "./pages/ConnectorDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ConnectorsPage />} />
      <Route path="/connector/:slug" element={<ConnectorDetail />} />
    </Routes>
  );
}

export default App;
