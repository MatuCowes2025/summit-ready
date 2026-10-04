import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Header from './components/Header'
import Footer from './components/Footer'

import Inicio from './pages/Inicio'
import ComoJugar from './pages/ComoJugar'
import Ranking from './pages/Ranking'
import SeleccionExpedicion from './pages/SeleccionExpedicion'
import JuegoAconcagua from './pages/JuegoAconcagua'

function App() {

  const [nombreJugador, setNombreJugador] = useState('')

  const [ranking, setRanking] = useState([])

  return (
    <BrowserRouter>

      <Header />

      <Routes>

        <Route
          path="/"
          element={
            <Inicio
              setNombreJugador={setNombreJugador}
            />
          }
        />

        <Route
          path="/como-jugar"
          element={<ComoJugar />}
        />

        <Route
          path="/ranking"
          element={
            <Ranking
              ranking={ranking}
            />
          }
        />

        <Route
          path="/expediciones"
          element={<SeleccionExpedicion />}
        />

        <Route
          path="/juego/aconcagua"
          element={
            <JuegoAconcagua
              nombreJugador={nombreJugador}
              ranking={ranking}
              setRanking={setRanking}
            />
          }
        />

      </Routes>

      <Footer />

    </BrowserRouter>
  )
}

export default App