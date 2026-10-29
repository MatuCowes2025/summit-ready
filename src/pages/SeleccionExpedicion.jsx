
import ExpeditionCard from '../components/ExpeditionCard'

import aconcagua from '../assets/aconcagua.webp'
import kilimanjaro from '../assets/kilimanjaro.webp'
import everest from '../assets/everest.webp'
import montBlanc from '../assets/mont blanc.webp'

import './ProgresoExpediciones.css'

function SeleccionExpedicion({
  progreso,
  desbloqueadas,
  requisitos
}) {
  const montanas = [
    {
      clave: 'aconcagua',
      nombre: 'Aconcagua',
      pais: 'Argentina',
      imagen: aconcagua,
      altura: '6.961 m',
      dificultad: 'Fácil',
      temperatura: '-10°C',
      clima: 'Poco viento',
      objetos: 8,
      elegir: 4,
      tiempo: 45
    },
    {
      clave: 'kilimanjaro',
      nombre: 'Kilimanjaro',
      pais: 'Tanzania',
      imagen: kilimanjaro,
      altura: '5.895 m',
      dificultad: 'Medio',
      temperatura: '5°C',
      clima: 'Nieve ligera',
      objetos: 10,
      elegir: 5,
      tiempo: 35
    },
    {
      clave: 'montblanc',
      nombre: 'Mont Blanc',
      pais: 'Francia / Italia',
      imagen: montBlanc,
      altura: '4.808 m',
      dificultad: 'Medio',
      temperatura: '-15°C',
      clima: 'Nieve moderada',
      objetos: 10,
      elegir: 6,
      tiempo: 35
    },
    {
      clave: 'everest',
      nombre: 'Everest',
      pais: 'Nepal / China',
      imagen: everest,
      altura: '8.848 m',
      dificultad: 'Difícil',
      temperatura: '-30°C',
      clima: 'Viento extremo',
      objetos: 9,
      elegir: 6,
      tiempo: 35,
      destacada: true
    }
  ]

  const anterior = {
    kilimanjaro: 'aconcagua',
    montblanc: 'kilimanjaro',
    everest: 'montblanc'
  }

  const nombreAnterior = {
    kilimanjaro: 'Aconcagua',
    montblanc: 'Kilimanjaro',
    everest: 'Mont Blanc'
  }

  const cumbresConquistadas = montanas.filter(
    (montana) => progreso[montana.clave]?.cumbre
  ).length

  return (
    <main className="seleccion-expedicion">
      <section className="seleccion-contenido">
        <h1>Elegí tu expedición</h1>

        <p>
          Superá desafíos, conseguí puntos y
          desbloqueá nuevas montañas.
        </p>

        <div className="sr-progreso-general">
          <div>
            <span>PROGRESO DE CUMBRES</span>

            <strong>
              {cumbresConquistadas}/4 conquistadas
            </strong>
          </div>

          <div className="sr-progreso-barra">
            <div
              style={{
                width: `${
                  (cumbresConquistadas / 4) * 100
                }%`
              }}
            />
          </div>
        </div>

        <div className="expediciones-grid">
          {montanas.map((montana) => {
            const desbloqueada =
              desbloqueadas[montana.clave]

            const registro =
              progreso[montana.clave] || {}

            const puntosPrevios =
              progreso[anterior[montana.clave]]
                ?.mejorPuntaje || 0

            const requisito =
              requisitos[montana.clave] || 0

            return (
              <div
                key={montana.clave}
                className={`sr-expedicion-item ${
                  !desbloqueada
                    ? 'sr-expedicion-bloqueada'
                    : ''
                }`}
                onClickCapture={
                  !desbloqueada
                    ? (evento) => {
                        evento.preventDefault()
                        evento.stopPropagation()
                      }
                    : undefined
                }
              >
                <ExpeditionCard
                  {...montana}
                  conquistada={
                    desbloqueada &&
                    Boolean(registro.cumbre)
                  }
                />

                {!desbloqueada && (
                  <div className="sr-bloqueo">
                    <span className="sr-bloqueo-icono">
                      BLOQUEADA
                    </span>

                    <strong>
                      Desbloqueá esta expedición
                    </strong>

                    <p>
                      Conseguí {requisito} puntos en{' '}
                      {nombreAnterior[montana.clave]}
                    </p>

                    <small>
                      Progreso:{' '}
                      {Math.min(
                        puntosPrevios,
                        requisito
                      )}
                      /{requisito} pts
                    </small>
                  </div>
                )}

                {desbloqueada &&
                  !registro.cumbre &&
                  registro.mejorPuntaje > 0 && (
                    <div className="sr-cumbre-marca sr-intentada">
                      MEJOR MARCA:{' '}
                      {registro.mejorPuntaje} PTS
                    </div>
                  )}
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default SeleccionExpedicion


