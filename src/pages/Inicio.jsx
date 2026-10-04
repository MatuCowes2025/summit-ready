import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GameButton from '../components/GameButton'

function Inicio({ setNombreJugador }) {

  const [nombre, setNombre] = useState('')
  const [error, setError] = useState(false)

  const navigate = useNavigate()

  const comenzarJuego = () => {

    if (nombre.trim() === '') {
      setError(true)
      return
    }

    setError(false)

    setNombreJugador(nombre.trim())

    navigate('/expediciones')
  }

  return (
    <main className="inicio">

      <section className="inicio-hero">

        <div className="inicio-panel">

          <h1>SUMMIT READY</h1>

          <p>
            Elegí tu expedición. Prepará tu equipo. Superá el desafío.
          </p>

          <div className="nombre-jugador">

            <input
              type="text"
              placeholder="Ingresá tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            {error && (
              <p className="nombre-error">
                Ingresá tu nombre para comenzar.
              </p>
            )}

          </div>

          <GameButton
            texto="Comenzar expedición"
            onClick={comenzarJuego}
          />

          <button
            className="ranking-button"
            onClick={() => navigate('/ranking')}
          >
            VER RANKING
          </button>

        </div>

      </section>

    </main>
  )
}

export default Inicio