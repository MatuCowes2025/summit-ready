

import { useCallback, useEffect, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from 'react-router-dom'

import './App.css'

import Header from './components/Header'
import Footer from './components/Footer'

import Inicio from './pages/Inicio'
import ComoJugar from './pages/ComoJugar'
import MiTrayectoria from './pages/MiTrayectoria'
import SeleccionExpedicion from './pages/SeleccionExpedicion'

import JuegoAconcagua from './pages/JuegoAconcagua'
import JuegoKilimanjaro from './pages/JuegoKilimanjaro'
import JuegoMontBlanc from './pages/JuegoMontBlanc'
import JuegoEverest from './pages/JuegoEverest'

import {
  medallaDe,
  ORDEN_MONTANAS
} from './utils/trayectoria'

const PROGRESO_INICIAL = Object.fromEntries(
  ORDEN_MONTANAS.map((clave) => [
    clave,
    {
      mejorPuntaje: 0,
      cumbre: false,
      perfil: '',
      medalla: null,
      intentos: 0,
      mejorCumbre: null,
      ultimaPartida: null
    }
  ])
)

const REQUISITOS = {
  kilimanjaro: 500,
  montblanc: 800,
  everest: 1200
}

function leerGuardado(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave)
    return guardado
      ? JSON.parse(guardado)
      : valorInicial
  } catch {
    return valorInicial
  }
}

function App() {
  const [nombreJugador, setNombreJugador] = useState(() =>
    leerGuardado('summit_nombre', '')
  )

  const [progreso, setProgreso] = useState(() => {
    const guardado = leerGuardado('summit_progreso', {})

    return Object.fromEntries(
      ORDEN_MONTANAS.map((clave) => [
        clave,
        {
          ...PROGRESO_INICIAL[clave],
          ...(guardado?.[clave] || {})
        }
      ])
    )
  })

  useEffect(() => {
    localStorage.setItem(
      'summit_nombre',
      JSON.stringify(nombreJugador)
    )
  }, [nombreJugador])

  useEffect(() => {
    localStorage.setItem(
      'summit_progreso',
      JSON.stringify(progreso)
    )
  }, [progreso])

  const registrarResultado = useCallback(
    (montana, resultado) => {
      if (!ORDEN_MONTANAS.includes(montana)) return

      setProgreso((anterior) => {
        const previo =
          anterior[montana] || PROGRESO_INICIAL[montana]

        const puntaje = Math.max(
          0,
          Number(resultado.puntaje) || 0
        )

        const cumbre = Boolean(resultado.cumbre)

        const partida = {
          puntaje,
          cumbre,
          perfil: resultado.perfil || '',
          medalla: medallaDe(montana, puntaje, cumbre),
          metricas: resultado.metricas || null,
          fecha: new Date().toISOString()
        }

        const mejorarCumbre =
          cumbre &&
          (
            !previo.mejorCumbre ||
            puntaje > (previo.mejorCumbre.puntaje || 0)
          )

        const mejorCumbre = mejorarCumbre
          ? partida
          : previo.mejorCumbre

        return {
          ...anterior,
          [montana]: {
            ...previo,

            mejorPuntaje: Math.max(
              previo.mejorPuntaje || 0,
              puntaje
            ),

            cumbre: Boolean(previo.cumbre || cumbre),

            perfil:
              mejorCumbre?.perfil ||
              previo.perfil ||
              '',

            medalla:
              mejorCumbre?.medalla ||
              previo.medalla ||
              null,

            intentos: (previo.intentos || 0) + 1,

            mejorCumbre,

            ultimaPartida: partida
          }
        }
      })
    },
    []
  )

  const desbloqueadas = {
    aconcagua: true,

    kilimanjaro:
      (progreso.aconcagua?.mejorPuntaje || 0) >=
      REQUISITOS.kilimanjaro,

    montblanc:
      (progreso.kilimanjaro?.mejorPuntaje || 0) >=
      REQUISITOS.montblanc,

    everest:
      (progreso.montblanc?.mejorPuntaje || 0) >=
      REQUISITOS.everest
  }

  const protegerExpedicion = (montana, componente) =>
    desbloqueadas[montana]
      ? componente
      : <Navigate to="/expediciones" replace />

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <Inicio
              nombreJugador={nombreJugador}
              setNombreJugador={setNombreJugador}
            />
          }
        />

        <Route
          path="/como-jugar"
          element={<ComoJugar />}
        />

        <Route
          path="/mi-trayectoria"
          element={
            <MiTrayectoria
              nombreJugador={nombreJugador}
              progreso={progreso}
            />
          }
        />

        <Route
          path="/ranking"
          element={
            <Navigate
              to="/mi-trayectoria"
              replace
            />
          }
        />

        <Route
          path="/expediciones"
          element={
            <SeleccionExpedicion
              progreso={progreso}
              desbloqueadas={desbloqueadas}
              requisitos={REQUISITOS}
            />
          }
        />

        <Route
          path="/juego/aconcagua"
          element={
            <JuegoAconcagua
              nombreJugador={nombreJugador}
              registrarResultado={registrarResultado}
              kilimanjaroDesbloqueado={
                desbloqueadas.kilimanjaro
              }
              puntosDesbloqueo={
                REQUISITOS.kilimanjaro
              }
            />
          }
        />

        <Route
          path="/juego/kilimanjaro"
          element={protegerExpedicion(
            'kilimanjaro',
            <JuegoKilimanjaro
              nombreJugador={nombreJugador}
              registrarResultado={registrarResultado}
              montBlancDesbloqueado={
                desbloqueadas.montblanc
              }
              puntosDesbloqueo={
                REQUISITOS.montblanc
              }
            />
          )}
        />

        <Route
          path="/juego/montblanc"
          element={protegerExpedicion(
            'montblanc',
            <JuegoMontBlanc
              nombreJugador={nombreJugador}
              registrarResultado={registrarResultado}
              everestDesbloqueado={
                desbloqueadas.everest
              }
              puntosDesbloqueo={
                REQUISITOS.everest
              }
            />
          )}
        />

        <Route
          path="/juego/everest"
          element={protegerExpedicion(
            'everest',
            <JuegoEverest
              nombreJugador={nombreJugador}
              registrarResultado={registrarResultado}
              progreso={progreso}
            />
          )}
        />

        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App
