import GameButton from './GameButton'
import { useNavigate } from 'react-router-dom'

function ExpeditionCard({
  nombre,
  imagen,
  altura,
  dificultad,
  temperatura,
  clima,
  objetos,
  elegir,
  tiempo,
  destacada
}) {

  const navigate = useNavigate()

  const seleccionarExpedicion = () => {
    if (nombre === 'Aconcagua') {
      navigate('/juego/aconcagua')
    }
  }

  return (
    <div className={`expedition-card ${destacada ? 'destacada' : ''}`}>

      <div className="expedition-title">
        <h3>{nombre}</h3>
        <span className="expedition-altura">{altura}</span>
      </div>

      <img
        src={imagen}
        alt={nombre}
        className="expedition-image"
      />

      <span className={`difficulty-badge ${dificultad.toLowerCase()}`}>
        {dificultad}
      </span>

      <div className="expedition-info">

        <div className="expedition-conditions">

          {/* TEMPERATURA */}
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

            {temperatura}
          </span>

          {/* CLIMA */}
          <span className="condition-item">

            {/* ACONCAGUA */}
            {nombre === 'Aconcagua' && (
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
            )}

            {/* KILIMANJARO */}
            {nombre === 'Kilimanjaro' && (
              <svg
                className="weather-icon kilimanjaro-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M6 14.5H17.5A3.5 3.5 0 0 0 18 7.6A5 5 0 0 0 8.7 6.4A4.1 4.1 0 0 0 6 14.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M8 18V20 M7 19H9 M12 17V19 M11 18H13 M16 18V20 M15 19H17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            )}

            {/* EVEREST */}
            {nombre === 'Everest' && (
              <svg
                className="weather-icon everest-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M3 8H14C16 8 17 7 17 5.5C17 4.2 16 3.5 15 3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <path
                  d="M3 12H19C21 12 22 13 22 14.5C22 16 21 17 19.5 17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <path
                  d="M3 16H13C15 16 16 17 16 18.5C16 20 15 21 13.5 21"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}

            {/* MONT BLANC */}
            {nombre === 'Mont Blanc' && (
              <svg
                className="weather-icon montblanc-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 2V22
                     M4.5 6.5L19.5 17.5
                     M19.5 6.5L4.5 17.5
                     M9.5 4.5L12 7L14.5 4.5
                     M9.5 19.5L12 17L14.5 19.5
                     M5.5 9L8.5 9.5L8 6.5
                     M18.5 15L15.5 14.5L16 17.5
                     M18.5 9L15.5 9.5L16 6.5
                     M5.5 15L8.5 14.5L8 17.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}

            {clima}
          </span>

        </div>

        <div className="expedition-divider"></div>

        <div className="expedition-game-data">
          <span><strong>{objetos} OBJETOS</strong></span>
          <span>Elegís {elegir}</span>
          <span><strong>{tiempo} SEG</strong></span>
        </div>

        <GameButton
          texto="SELECCIONAR"
          onClick={seleccionarExpedicion}
        />

      </div>

    </div>
  )
}

export default ExpeditionCard