import Nav from "./components/Nav";
import ExplorerPage from "./pages/ExplorerPage";

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-brand-dark text-white">
      <Nav />
      <ExplorerPage />
    </div>
  );
}