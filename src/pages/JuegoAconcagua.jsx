import { useState, useEffect } from 'react'

import personaje from '../assets/personaje.png'
import campera from '../assets/campera termica.png'
import mochila from '../assets/mochila.png'
import guantes from '../assets/guantes.png'
import botas from '../assets/botas montaña.png'
import remera from '../assets/remera.png'
import paraguas from '../assets/paraguas.png'
import gorra from '../assets/gorra.png'
import zapatillas from '../assets/zapatillas.png'
import fondoAconcagua from '../assets/fondo aconcagua.png'

function JuegoAconcagua({ nombreJugador, ranking, setRanking }) {

  const [seleccionados, setSeleccionados] = useState([])
  const [confirmado, setConfirmado] = useState(false)
  const [tiempoRestante, setTiempoRestante] = useState(45)

  const equipamiento = [
    { nombre: 'Campera térmica', imagen: campera, correcto: true },
    { nombre: 'Paraguas', imagen: paraguas, correcto: false },
    { nombre: 'Mochila', imagen: mochila, correcto: true },
    { nombre: 'Zapatillas urbanas', imagen: zapatillas, correcto: false },
    { nombre: 'Gorra', imagen: gorra, correcto: false },
    { nombre: 'Guantes térmicos', imagen: guantes, correcto: true },
    { nombre: 'Remera de algodón', imagen: remera, correcto: false },
    { nombre: 'Botas de montaña', imagen: botas, correcto: true }
  ]

  const seleccionarObjeto = (objeto) => {

    if (confirmado) {
      return
    }

    const yaSeleccionado = seleccionados.some(
      (seleccionado) => seleccionado.nombre === objeto.nombre
    )

    if (yaSeleccionado) {

      setSeleccionados(
        seleccionados.filter(
          (seleccionado) => seleccionado.nombre !== objeto.nombre
        )
      )

      return
    }

    if (seleccionados.length >= 4) {
      return
    }

    setSeleccionados([...seleccionados, objeto])
  }

  const aciertos = seleccionados.filter(
    (objeto) => objeto.correcto
  ).length

  const puntaje = aciertos * 250

  const guardarPuntaje = () => {

    if (!nombreJugador) {
      return
    }

    const jugadorExistente = ranking.find(
      (jugador) =>
        jugador.nombre.toLowerCase() === nombreJugador.toLowerCase()
    )

    if (jugadorExistente) {

      if (puntaje > jugadorExistente.puntaje) {

        const rankingActualizado = ranking.map((jugador) => {

          if (
            jugador.nombre.toLowerCase() === nombreJugador.toLowerCase()
          ) {

            return {
              nombre: nombreJugador,
              expedicion: 'Aconcagua',
              puntaje: puntaje
            }

          }

          return jugador
        })

        setRanking(rankingActualizado)
      }

    } else {

      const nuevoJugador = {
        nombre: nombreJugador,
        expedicion: 'Aconcagua',
        puntaje: puntaje
      }

      setRanking([...ranking, nuevoJugador])
    }
  }

  useEffect(() => {

    if (confirmado) {
      return
    }

    if (tiempoRestante === 0) {
      setConfirmado(true)
      guardarPuntaje()
      return
    }

    const temporizador = setTimeout(() => {
      setTiempoRestante(tiempoRestante - 1)
    }, 1000)

    return () => clearTimeout(temporizador)

  }, [tiempoRestante, confirmado])

  const confirmarEquipo = () => {

    if (seleccionados.length === 4) {
      setConfirmado(true)
      guardarPuntaje()
    }

  }

  const reintentar = () => {
    setSeleccionados([])
    setConfirmado(false)
    setTiempoRestante(45)
  }

  return (
    <main className="juego-aconcagua">

      <section className="juego-aconcagua-contenido">

        <div className="juego-superior">

          <div>

            <span className="juego-etiqueta">
              ACONCAGUA
            </span>

            <h1>Prepará tu equipo</h1>

            <p>
              Elegí 4 elementos para enfrentar la expedición.
            </p>

          </div>

          <div className="juego-datos">

            <span className="condition-item">

              <svg
                className="temperature-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >

                <path
                  d="M14 14.76V5a4 4 0 0 0-8 0v9.76a6 6 0 1 0 8 0Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <line
                  x1="10"
                  y1="6"
                  x2="10"
                  y2="17"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

              </svg>

              -10°C

            </span>

            <span className="condition-item">

              <svg
                className="weather-icon aconcagua-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >

                <circle
                  cx="8"
                  cy="8"
                  r="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M8 2V3.5 M8 12.5V14 M2 8H3.5 M12.5 8H14 M3.8 3.8L4.9 4.9 M11.1 11.1L12.2 12.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <path
                  d="M8 17.5H18A3 3 0 0 0 18 11.5A4.5 4.5 0 0 0 9.7 10A3.8 3.8 0 0 0 8 17.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>

              Poco viento

            </span>

            <span
              className={
                tiempoRestante <= 10
                  ? 'cronometro cronometro-urgente'
                  : 'cronometro'
              }
            >
              {tiempoRestante} SEG
            </span>

            <strong>
              EQUIPO {seleccionados.length}/4
            </strong>

          </div>

        </div>

        <div className="juego-principal">

          <div className="personaje-zona">

            <h2>Tu expedicionario</h2>

            <div
              className="personaje-contenedor"
              style={{
                backgroundImage: `url(${fondoAconcagua})`
              }}
            >

              <img
                src={personaje}
                alt="Expedicionario"
                className="personaje-imagen"
              />

            </div>

            <div className="inventario-slots">

              {[0, 1, 2, 3].map((numero) => {

                const objeto = seleccionados[numero]

                return (

                  <div
                    className="inventario-slot"
                    key={numero}
                  >

                    {objeto ? (

                      <img
                        src={objeto.imagen}
                        alt={objeto.nombre}
                      />

                    ) : (

                      '+'

                    )}

                  </div>

                )
              })}

            </div>

          </div>

          <div className="equipamiento-zona">

            <h2>Equipamiento disponible</h2>

            <div className="equipamiento-grid">

              {equipamiento.map((objeto) => {

                const seleccionado = seleccionados.some(
                  (item) => item.nombre === objeto.nombre
                )

                let claseResultado = ''

                if (confirmado && seleccionado) {

                  claseResultado = objeto.correcto
                    ? 'correcta'
                    : 'incorrecta'

                }

                return (

                  <button
                    className={`equipamiento-card ${
                      seleccionado ? 'seleccionada' : ''
                    } ${claseResultado}`}
                    key={objeto.nombre}
                    onClick={() => seleccionarObjeto(objeto)}
                  >

                    <img
                      src={objeto.imagen}
                      alt={objeto.nombre}
                    />

                    <span>
                      {objeto.nombre}
                    </span>

                  </button>

                )
              })}

            </div>

            {!confirmado ? (

              <button
                className="confirmar-equipo"
                disabled={seleccionados.length !== 4}
                onClick={confirmarEquipo}
              >
                CONFIRMAR EQUIPO
              </button>

            ) : (

              <div className="resultado-final">

                <div className="resultado-equipo">

                  <div>

                    <span>RESULTADO</span>

                    <strong>
                      {aciertos}/4 correctos
                    </strong>

                  </div>

                  <div>

                    <span>PUNTAJE</span>

                    <strong>
                      {puntaje} pts
                    </strong>

                  </div>

                </div>

                <button
                  className="boton-reintentar"
                  onClick={reintentar}
                >
                  REINTENTAR
                </button>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  )
}

export default JuegoAconcagua