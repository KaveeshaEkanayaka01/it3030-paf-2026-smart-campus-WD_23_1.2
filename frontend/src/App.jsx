import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminPanelPage } from './pages/adminpanel'
import { CreateTicketPage } from './pages/createticket'
import { MyTicketsPage } from './pages/myticket'
import { TechnicianPanelPage } from './pages/technicianpanel'
import { TicketDetailsPage } from './pages/ticketDetails'

function App() {
  return (
    <div className="min-h-screen font-sans text-slate-100">
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/my-tickets" replace />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="/technician" element={<TechnicianPanelPage />} />
          <Route path="/create-ticket" element={<CreateTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
