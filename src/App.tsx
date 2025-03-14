import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {/* For the tempo routes */}
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-mix" element={<Home />} />
        <Route path="/track-library" element={<Home />} />
        <Route path="/saved-mixes" element={<Home />} />
        <Route path="/profile" element={<Home />} />
        <Route path="/settings" element={<Home />} />
        <Route path="/analytics" element={<Home />} />
        <Route path="/help" element={<Home />} />
        {/* Add this before the catchall route */}
        {import.meta.env.VITE_TEMPO === "true" && (
          <Route path="/tempobook/*" element={<div />} />
        )}
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
}

export default App;
