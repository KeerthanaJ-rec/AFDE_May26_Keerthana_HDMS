import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CreateTicket from "./pages/CreateTicket";
import TicketList from "./pages/TicketList";
import TicketDetail from "./pages/TicketDetail";
import EditTicket from "./pages/EditTicket";
import SearchTickets from "./pages/SearchTickets";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", background: "#eef2ff", paddingBottom: "2rem" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/tickets/:id/edit" element={<EditTicket />} />
          <Route path="/create" element={<CreateTicket />} />
          <Route path="/search" element={<SearchTickets />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
