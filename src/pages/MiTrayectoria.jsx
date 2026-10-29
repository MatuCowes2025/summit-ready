
import { useNavigate } from 'react-router-dom'

import aconcagua from '../assets/aconcagua.png'
import kilimanjaro from '../assets/kilimanjaro.png'
import montblanc from '../assets/mont blanc.png'
import everest from '../assets/everest.png'

import {
  calcularPerfilGlobal,
  medallaDe,
  ORDEN_MONTANAS,
  NOMBRES_MONTANAS
} from '../utils/trayectoria'

import './MiTrayectoria.css'

const IMAGENES = {
  aconcagua,
  kilimanjaro,
  montblanc,
  everest
}

function MiTrayectoria({
  nombreJugador,
  progreso
}) {
  const navigate = useNavigate()

  const cumbres = ORDEN_MONTANAS.filter(
    (clave) => progreso?.[clave]?.cumbre
  ).length

  const puntajeAcumulado = ORDEN_MONTANAS.reduce(
    (total, clave) =>
      total +
      (
        progreso?.[clave]?.mejorCumbre?.puntaje ||
        (
          progreso?.[clave]?.cumbre
            ? progreso?.[clave]?.mejorPuntaje || 0
            : 0
        )
      ),
    0
  )

  const intentos = ORDEN_MONTANAS.reduce(
    (total, clave) =>
      total + (progreso?.[clave]?.intentos || 0),
    0
  )

  const perfilFinal = calcularPerfilGlobal(progreso)

  const completo = cumbres === 4

  const medallas = ORDEN_MONTANAS.map(
    (clave) => {
      const registro = progreso?.[clave]

      return (
        registro?.medalla ||
        medallaDe(
          clave,
          registro?.mejorCumbre?.puntaje ||
            registro?.mejorPuntaje ||
            0,
          registro?.cumbre
        )
      )
    }
  )

  return (
    <main className="trayectoria-page">
      <section className="trayectoria-contenido">
        <span className="trayectoria-etiqueta">
          SUMMIT READY / HISTORIAL DE EXPEDICIONES
        </span>

        <h1>Mi trayectoria</h1>

        <p className="trayectoria-intro">
          {nombreJugador
            ? `${nombreJugador}, este es tu camino hacia las cuatro cumbres.`
            : 'Tu camino hacia las cuatro cumbres comienza acá.'}
        </p>

        <div className="trayectoria-estadisticas">
          <div>
            <span>CUMBRES CONQUISTADAS</span>
            <strong>
              {cumbres}
              <small>/4</small>
            </strong>
          </div>

          <div>
            <span>PUNTOS DE CUMBRES</span>
            <strong>
              {puntajeAcumulado.toLocaleString('es-AR')}
            </strong>
          </div>

          <div>
            <span>INTENTOS REGISTRADOS</span>
            <strong>{intentos}</strong>
          </div>

          <div>
            <span>MEDALLAS CONSEGUIDAS</span>
            <strong>
              {medallas.filter(Boolean).length}
              <small>/4</small>
            </strong>
          </div>
        </div>

        <div className="trayectoria-avance">
          <div>
            <strong>
              CAMINO A LAS CUATRO CUMBRES
            </strong>

            <span>
              {Math.round((cumbres / 4) * 100)}%
            </span>
          </div>

          <div className="trayectoria-barra">
            <div
              style={{
                width: `${cumbres * 25}%`
              }}
            />
          </div>
        </div>

        <div className="trayectoria-montanas">
          {ORDEN_MONTANAS.map(
            (clave, indice) => {
              const registro =
                progreso?.[clave] || {}

              const cumbre =
                Boolean(registro.cumbre)

              const medalla =
                medallas[indice]

              return (
                <article
                  key={clave}
                  className={`trayectoria-montana ${
                    cumbre ? 'conquistada' : ''
                  }`}
                >
                  <img
                    src={IMAGENES[clave]}
                    alt={NOMBRES_MONTANAS[clave]}
                  />

                  <div className="trayectoria-montana-cuerpo">
                    <span className="trayectoria-nivel">
                      EXPEDICIÓN 0{indice + 1}
                    </span>

                    <h2>
                      {NOMBRES_MONTANAS[clave]}
                    </h2>

                    <p className="trayectoria-estado">
                      {cumbre
                        ? '✓ CUMBRE CONQUISTADA'
                        : registro.mejorPuntaje > 0
                          ? 'EXPEDICIÓN INTENTADA'
                          : 'PENDIENTE'}
                    </p>

                    <div className="trayectoria-montana-datos">
                      <span>
                        Mejor marca
                        <strong>
                          {registro.mejorPuntaje || 0} pts
                        </strong>
                      </span>

                      <span>
                        Medalla
                        <strong
                          className={
                            medalla
                              ? `trayectoria-medalla ${medalla.toLowerCase()}`
                              : ''
                          }
                        >
                          {medalla || '—'}
                        </strong>
                      </span>
                    </div>

                    {cumbre &&
                      registro.perfil && (
                        <p className="trayectoria-perfil-individual">
                          {registro.perfil}
                        </p>
                      )}
                  </div>
                </article>
              )
            }
          )}
        </div>

        <section
          className={`trayectoria-revelacion ${
            completo ? 'completa' : ''
          }`}
        >
          <span className="trayectoria-etiqueta">
            TU IDENTIDAD COMO EXPEDICIONARIO
          </span>

          {perfilFinal ? (
            <>
              <span className="trayectoria-estrella">
                ★
              </span>

              <h2>
                {perfilFinal.nombre}
              </h2>

              <p>
                {perfilFinal.descripcion}
              </p>

              <strong>
                LAS CUATRO CUMBRES · DESAFÍO COMPLETADO
              </strong>
            </>
          ) : completo ? (
            <>
              <h2>
                ¡Conquistaste las cuatro cumbres!
              </h2>

              <p>
                Tu progreso anterior está guardado.
                Para revelar un perfil basado en todas
                tus decisiones, volvé a conquistar
                las montañas que todavía no tienen
                estadísticas detalladas.
              </p>
            </>
          ) : (
            <>
              <h2>
                Tu perfil definitivo está por descubrirse
              </h2>

              <p>
                Conquistá las cuatro cumbres para revelar
                el perfil que refleja tu preparación,
                tus decisiones y la forma en que
                administraste los recursos.
              </p>

              <strong>
                TE FALTAN {4 - cumbres}{' '}
                {4 - cumbres === 1
                  ? 'CUMBRE'
                  : 'CUMBRES'}
              </strong>
            </>
          )}

          <button
            onClick={() =>
              navigate('/expediciones')
            }
          >
            {completo
              ? 'VOLVER A LAS EXPEDICIONES'
              : 'CONTINUAR MI AVENTURA'}
          </button>
        </section>
      </section>
    </main>
  )
}

export default MiTrayectoria
