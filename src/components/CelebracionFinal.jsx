
import { useNavigate } from 'react-router-dom'

import {
  calcularPerfilGlobal,
  medallaDe,
  ORDEN_MONTANAS,
  NOMBRES_MONTANAS
} from '../utils/trayectoria'

import './CelebracionFinal.css'

function CelebracionFinal({
  nombreJugador,
  progreso,
  resultadoEverest
}) {
  const navigate = useNavigate()

  const anteriorEverest =
    progreso?.everest?.mejorCumbre

  const mejorEverest =
    !anteriorEverest ||
    resultadoEverest.puntaje >
      anteriorEverest.puntaje
      ? {
          ...resultadoEverest,
          medalla: medallaDe(
            'everest',
            resultadoEverest.puntaje,
            true
          )
        }
      : anteriorEverest

  const completo = {
    ...progreso,

    everest: {
      ...(progreso?.everest || {}),
      cumbre: true,
      mejorCumbre: mejorEverest
    }
  }

  const perfilFinal =
    calcularPerfilGlobal(completo)

  const puntajeTotal = ORDEN_MONTANAS.reduce(
    (total, clave) => {
      const registro = completo[clave]

      return total +
        (
          registro?.mejorCumbre?.puntaje ||
          registro?.mejorPuntaje ||
          0
        )
    },
    0
  )

  return (
    <section
      className="sr-celebracion-final"
      aria-label="Desafío Summit Ready completado"
    >
      <div
        className="sr-celebracion-destellos"
        aria-hidden="true"
      >
        ✦ ✧ ★ ✦ ✧
      </div>

      <span className="sr-celebracion-kicker">
        THE NORTH FACE · SUMMIT READY
      </span>

      <div
        className="sr-celebracion-trofeo"
        aria-hidden="true"
      >
        ★
      </div>

      <span className="sr-celebracion-sello">
        DESAFÍO DEFINITIVO COMPLETADO
      </span>

      <h2>
        ¡CONQUISTASTE LAS CUATRO CUMBRES!
      </h2>

      <p className="sr-celebracion-intro">
        {nombreJugador?.trim()
          ? `${nombreJugador.trim()}, lo lograste.`
          : 'Lo lograste.'}{' '}

        Desde el Aconcagua hasta el Everest:
        superaste las cuatro expediciones
        y escribiste tu propia historia
        en la montaña.
      </p>

      <div className="sr-celebracion-ruta">
        {ORDEN_MONTANAS.map(
          (clave, indice) => {
            const registro = completo[clave]

            const medalla =
              registro?.mejorCumbre?.medalla ||
              medallaDe(
                clave,
                registro?.mejorPuntaje || 0,
                true
              )

            return (
              <div
                className="sr-celebracion-hito"
                key={clave}
              >
                <span className="sr-celebracion-numero">
                  0{indice + 1}
                </span>

                <strong>
                  {NOMBRES_MONTANAS[clave]}
                </strong>

                <span className="sr-celebracion-check">
                  ✓ CUMBRE
                </span>

                <small>
                  {medalla
                    ? `★ ${medalla}`
                    : 'CONQUISTADA'}
                </small>
              </div>
            )
          }
        )}
      </div>

      <div className="sr-celebracion-marca">
        <span>
          PUNTOS ACUMULADOS EN LAS CUATRO CUMBRES
        </span>

        <strong>
          {puntajeTotal.toLocaleString('es-AR')}
        </strong>
      </div>

      <div className="sr-celebracion-perfil">
        <span>
          SE REVELÓ TU PERFIL DEFINITIVO
        </span>

        {perfilFinal ? (
          <>
            <h3>
              {perfilFinal.nombre}
            </h3>

            <p>
              {perfilFinal.descripcion}
            </p>
          </>
        ) : (
          <>
            <h3>
              Tu perfil definitivo está pendiente
            </h3>

            <p>
              Conservamos tus cumbres anteriores.
              Para calcular un perfil a partir de
              todas tus decisiones, completá de
              nuevo las expediciones que no
              registraron estadísticas.
            </p>
          </>
        )}
      </div>

      <button
        type="button"
        className="sr-celebracion-boton"
        onClick={() =>
          navigate('/mi-trayectoria')
        }
      >
        DESCUBRIR MI TRAYECTORIA →
      </button>

      <p className="sr-celebracion-rejugar">
        El desafío termina acá.
        Tu próxima marca, no.
      </p>
    </section>
  )
}

export default CelebracionFinal
