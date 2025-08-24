import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import { SebarUndangan } from "./pages/Undangan";

function App() {
  return (
    <section className="bg-radial from-[#c6a792] to-[#fefefd] bg-fixed min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/undangan" element={<SebarUndangan />} />
        </Routes>
      </Router>
      <Toaster />
    </section>
  );
}

export default App;
