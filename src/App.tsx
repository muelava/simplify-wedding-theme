import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <section className="bg-radial from-[#c6a792] to-[#fefefd] bg-fixed">
      <Home />
      <Toaster />
    </section>
  );
}

export default App;
