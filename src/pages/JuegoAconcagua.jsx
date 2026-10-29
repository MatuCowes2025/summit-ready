

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './AventuraAconcagua.css'
import './ProgresoExpediciones.css'

import {
  crearMetricas,
  calcularPerfilExpedicion
} from '../utils/trayectoria'

import personaje from '../assets/personaje.webp'
import campera from '../assets/campera termica.webp'
import mochila from '../assets/mochila.webp'
import guantes from '../assets/guantes.webp'
import botas from '../assets/botas montaña.webp'
import remera from '../assets/remera.webp'
import paraguas from '../assets/paraguas.webp'
import gorra from '../assets/gorra.webp'
import zapatillas from '../assets/zapatillas.webp'
import fondoAconcagua from '../assets/fondo aconcagua.webp'

const equipamiento = [
  {
    nombre: 'Campera térmica',
    imagen: campera,
    correcto: true
  },
  {
    nombre: 'Paraguas',
    imagen: paraguas,
    correcto: false
  },
  {
    nombre: 'Mochila',
    imagen: mochila,
    correcto: true
  },
  {
    nombre: 'Zapatillas urbanas',
    imagen: zapatillas,
    correcto: false
  },
  {
    nombre: 'Gorra',
    imagen: gorra,
    correcto: false
  },
  {
    nombre: 'Guantes térmicos',
    imagen: guantes,
    correcto: true
  },
  {
    nombre: 'Remera de algodón',
    imagen: remera,
    correcto: false
  },
  {
    nombre: 'Botas de montaña',
    imagen: botas,
    correcto: true
  }
]

const aventura = {
  tormenta: {
    titulo: 'El clima cambia',
    descripcion:
      'A mitad del ascenso, el viento se intensifica y la temperatura cae. Tenés dos rutas posibles. ¿Qué camino elegís?',
    opciones: [
      {
        texto: 'Seguir por la arista expuesta para ganar tiempo',
        destino: 'arista',
        objeto: 'Campera térmica',
        riesgo: 'alto',
        conEquipo: {
          energia: -18,
          puntos: 240,
          relato:
            'Tu campera térmica te protege del frío. Superás la tormenta y llegás a una arista rocosa.'
        },
        sinEquipo: {
          energia: -38,
          puntos: 15,
          relato:
            'El viento y el frío te debilitan. Llegás a la arista, pero perdés mucha energía.'
        }
      },
      {
        texto: 'Buscar un refugio y reorganizar la expedición',
        destino: 'refugio',
        objeto: 'Mochila',
        riesgo: 'bajo',
        conEquipo: {
          energia: 2,
          puntos: 135,
          relato:
            'Encontrás un lugar protegido y utilizás tu mochila para organizar las provisiones.'
        },
        sinEquipo: {
          energia: -14,
          puntos: 65,
          relato:
            'Encontrás refugio, pero te cuesta reorganizar tus provisiones sin una mochila adecuada.'
        }
      }
    ]
  },

  arista: {
    titulo: 'Terreno peligroso',
    descripcion:
      'La ruta rápida te lleva a una zona de roca congelada. El terreno es irregular y resbaladizo.',
    opciones: [
      {
        texto: 'Cruzar lentamente buscando apoyos firmes',
        destino: 'final_tecnico',
        objeto: 'Botas de montaña',
        riesgo: 'bajo',
        conEquipo: {
          energia: -8,
          puntos: 145,
          relato:
            'Las botas de montaña te proporcionan mejor agarre. Superás el terreno complicado.'
        },
        sinEquipo: {
          energia: -35,
          puntos: 10,
          relato:
            'Sin botas apropiadas resbalás varias veces. Conseguís avanzar, pero terminás agotado.'
        }
      },
      {
        texto: 'Rodear la arista por una travesía larga y exigente',
        destino: 'final_largo',
        objeto: 'Mochila',
        riesgo: 'alto',
        conEquipo: {
          energia: -23,
          puntos: 235,
          relato:
            'El camino alternativo lleva más tiempo, pero tus provisiones te ayudan a mantener las fuerzas.'
        },
        sinEquipo: {
          energia: -32,
          puntos: 45,
          relato:
            'Evitás las rocas peligrosas, pero el camino largo consume gran parte de tu energía.'
        }
      }
    ]
  },

  refugio: {
    titulo: 'Una pausa decisiva',
    descripcion:
      'Encontraste un lugar protegido. Sin embargo, el buen tiempo podría durar poco. Debés decidir cómo continuar.',
    opciones: [
      {
        texto: 'Revisar la ruta y preparar las provisiones',
        destino: 'final_largo',
        objeto: 'Mochila',
        riesgo: 'bajo',
        conEquipo: {
          energia: 8,
          puntos: 125,
          relato:
            'Organizás correctamente tu equipo y elegís una ruta alternativa más controlada.'
        },
        sinEquipo: {
          energia: -16,
          puntos: 45,
          relato:
            'Perdés tiempo organizando tus pertenencias. Finalmente conseguís continuar.'
        }
      },
      {
        texto: 'Salir inmediatamente por el terreno más directo',
        destino: 'final_tecnico',
        objeto: 'Botas de montaña',
        riesgo: 'alto',
        conEquipo: {
          energia: -20,
          puntos: 245,
          relato:
            'Tus botas te permiten avanzar por el terreno irregular. Llegás a la sección técnica.'
        },
        sinEquipo: {
          energia: -40,
          puntos: 20,
          relato:
            'El camino directo resulta más difícil de lo esperado. Perd és mucha energía.'
        }
      }
    ]
  },

  final_tecnico: {
    titulo: 'Los últimos metros',
    descripcion:
      'Ya podés ver la cumbre. Solo falta superar un último tramo de hielo y roca. Tus manos empiezan a perder sensibilidad.',
    opciones: [
      {
        texto: 'Proteger las manos y avanzar con precaución',
        destino: 'fin',
        objeto: 'Guantes térmicos',
        riesgo: 'bajo',
        conEquipo: {
          energia: -8,
          puntos: 165,
          relato:
            'Tus guantes térmicos te protegen del frío. Superás el último obstáculo.'
        },
        sinEquipo: {
          energia: -34,
          puntos: 10,
          relato:
            'El frío dificulta tus movimientos. Terminás el tramo con un desgaste enorme.'
        }
      },
      {
        texto: 'Rodear el hielo por una zona expuesta al viento',
        destino: 'fin',
        objeto: 'Campera térmica',
        riesgo: 'alto',
        conEquipo: {
          energia: -24,
          puntos: 265,
          relato:
            'Tu campera te protege durante el rodeo. Completás el último tramo.'
        },
        sinEquipo: {
          energia: -40,
          puntos: 15,
          relato:
            'El viento te golpea constantemente. Llegás al final muy debilitado.'
        }
      }
    ]
  },

  final_largo: {
    titulo: 'El último esfuerzo',
    descripcion:
      'La ruta alternativa te acerca a la cima, pero llevás mucho tiempo caminando. El frío aumenta.',
    opciones: [
      {
        texto: 'Ajustar el abrigo antes del último tramo',
        destino: 'fin',
        objeto: 'Campera térmica',
        riesgo: 'bajo',
        conEquipo: {
          energia: 0,
          puntos: 160,
          relato:
            'Tu campera térmica te ayuda a conservar el calor. Completás el ascenso.'
        },
        sinEquipo: {
          energia: -32,
          puntos: 10,
          relato:
            'No tenés suficiente protección contra el frío. El último tramo resulta agotador.'
        }
      },
      {
        texto: 'Continuar sin detenerte para ahorrar tiempo',
        destino: 'fin',
        objeto: 'Guantes térmicos',
        riesgo: 'alto',
        conEquipo: {
          energia: -22,
          puntos: 265,
          relato:
            'Tus guantes mantienen las manos protegidas mientras completás el recorrido.'
        },
        sinEquipo: {
          energia: -38,
          puntos: 15,
          relato:
            'El frío y el cansancio te hacen perder mucha energía en los últimos metros.'
        }
      }
    ]
  }
}

function IconoMontana({ exito }) {
  return (
    <svg
      width="46"
      height="46"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 53L25 17L36 35L43 25L59 53H5Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      <path
        d="M17.5 30.5L25 17L33.5 31.5L27.5 28L23.5 33L17.5 30.5Z"
        fill="currentColor"
      />

      <path
        d="M38 34L43 25L49.5 36.5L44 33L41 37L38 34Z"
        fill="currentColor"
      />

      <path
        d="M10 53H54"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {!exito && (
        <path
          d="M13 12L51 50"
          stroke="#E6392F"
          strokeWidth="4"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

function JuegoAconcagua({
  registrarResultado,
  kilimanjaroDesbloqueado,
  puntosDesbloqueo = 500
}) {
  const navigate = useNavigate()

  const [fase, setFase] = useState('preparacion')

  const [seleccionados, setSeleccionados] = useState([])
  const [confirmado, setConfirmado] = useState(false)
  const [tiempoRestante, setTiempoRestante] = useState(45)

  const [energia, setEnergia] = useState(100)
  const [nodoActual, setNodoActual] = useState('tormenta')
  const [capitulo, setCapitulo] = useState(1)
  const [puntajeAscenso, setPuntajeAscenso] = useState(0)

  const [mensajeEvento, setMensajeEvento] = useState('')
  const [respuestaBloqueada, setRespuestaBloqueada] =
    useState(false)

  const [siguienteNodo, setSiguienteNodo] = useState('')

  const [impacto, setImpacto] = useState({
    energia: 0,
    puntos: 0
  })

  const [decisiones, setDecisiones] = useState([])
  const resultadoGuardado = useRef(false)

  const aciertos = seleccionados.filter(
    objeto => objeto.correcto
  ).length

  const puntajePreparacion = aciertos * 250
  const puntajeFinal = puntajePreparacion + puntajeAscenso

  const cumbreAlcanzada =
    fase === 'resultado' &&
    energia >= 40 &&
    siguienteNodo === 'fin'

  const metricas = crearMetricas({
    aciertos,
    totalCorrectos: 4,
    decisiones,
    recursosFinales: [energia]
  })

  const perfil = calcularPerfilExpedicion(metricas)

  const medalla =
    !cumbreAlcanzada
      ? 'SIN MEDALLA'
      : puntajeFinal >= 1450
        ? 'ORO'
        : puntajeFinal >= 1050
          ? 'PLATA'
          : 'BRONCE'

  const puedeContinuar =
    kilimanjaroDesbloqueado ||
    puntajeFinal >= puntosDesbloqueo

  const puntosFaltantes = Math.max(
    0,
    puntosDesbloqueo - puntajeFinal
  )

  const tieneObjeto = nombre =>
    seleccionados.some(
      objeto => objeto.nombre === nombre
    )

  useEffect(() => {
    if (fase !== 'preparacion' || confirmado) return
    if (tiempoRestante <= 0) return

    const temporizador = setTimeout(() => {
      setTiempoRestante(anterior => anterior - 1)
    }, 1000)

    return () => clearTimeout(temporizador)
  }, [fase, confirmado, tiempoRestante])

  const tiempoAgotado = tiempoRestante === 0
  const preparacionTerminada = confirmado || tiempoAgotado

  const seleccionarObjeto = objeto => {
    if (preparacionTerminada) return

    if (tieneObjeto(objeto.nombre)) {
      setSeleccionados(anterior =>
        anterior.filter(
          item => item.nombre !== objeto.nombre
        )
      )
    } else if (seleccionados.length < 4) {
      setSeleccionados(anterior => [
        ...anterior,
        objeto
      ])
    }
  }

  const confirmarEquipo = () => {
    if (seleccionados.length === 4) {
      setConfirmado(true)
    }
  }

  const reiniciarSeleccion = () => {
    setSeleccionados([])
    setConfirmado(false)
    setTiempoRestante(45)
  }

  const comenzarAscenso = () => {
    setFase('ascenso')
    setEnergia(100)
    setNodoActual('tormenta')
    setCapitulo(1)
    setPuntajeAscenso(0)
    setMensajeEvento('')
    setRespuestaBloqueada(false)
    setSiguienteNodo('')
    setImpacto({ energia: 0, puntos: 0 })
    setDecisiones([])
  }

  // Si se acaba el tiempo, empieza con los objetos que haya elegido.
  // Sin objetos, permanece en preparación para poder reiniciar.
  useEffect(() => {
    if (
      fase === 'preparacion' &&
      !confirmado &&
      tiempoRestante === 0 &&
      seleccionados.length > 0
    ) {
      setFase('ascenso')
    }
  }, [fase, confirmado, tiempoRestante, seleccionados.length])

  const responderEvento = opcion => {
    if (respuestaBloqueada) return

    const teniaEquipo = tieneObjeto(opcion.objeto)

    const resultado = teniaEquipo
      ? opcion.conEquipo
      : opcion.sinEquipo

    setEnergia(anterior =>
      Math.max(
        0,
        Math.min(100, anterior + resultado.energia)
      )
    )

    setPuntajeAscenso(anterior =>
      anterior + resultado.puntos
    )

    setMensajeEvento(resultado.relato)

    setImpacto({
      energia: resultado.energia,
      puntos: resultado.puntos
    })

    setDecisiones(anterior => [
      ...anterior,
      {
        riesgo: opcion.riesgo,
        estilo:
          opcion.riesgo === 'alto'
            ? 'audaz'
            : 'prudente',
        respaldada: teniaEquipo,
        sinEquipo: !teniaEquipo,
        teniaEquipo
      }
    ])

    setSiguienteNodo(opcion.destino)
    setRespuestaBloqueada(true)
  }

  const siguienteEvento = () => {
    if (siguienteNodo === 'fin' || energia <= 0) {
      setFase('resultado')
      return
    }

    setNodoActual(siguienteNodo)
    setCapitulo(anterior => anterior + 1)
    setRespuestaBloqueada(false)
    setMensajeEvento('')
    setSiguienteNodo('')
  }

  useEffect(() => {
    if (
      fase !== 'resultado' ||
      resultadoGuardado.current
    ) {
      return
    }

    resultadoGuardado.current = true

    registrarResultado?.('aconcagua', {
      puntaje: puntajeFinal,
      cumbre: cumbreAlcanzada,
      perfil: perfil.nombre,
      metricas
    })
  }, [
    fase,
    registrarResultado,
    puntajeFinal,
    cumbreAlcanzada,
    perfil.nombre
  ])

  const reintentar = () => {
    setFase('preparacion')
    setSeleccionados([])
    setConfirmado(false)
    setTiempoRestante(45)
    setEnergia(100)
    setNodoActual('tormenta')
    setCapitulo(1)
    setPuntajeAscenso(0)
    setMensajeEvento('')
    setRespuestaBloqueada(false)
    setSiguienteNodo('')
    setImpacto({ energia: 0, puntos: 0 })
    setDecisiones([])
    resultadoGuardado.current = false
  }

  const personajeVisual = (
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
  )

  if (fase === 'ascenso') {
    const escena = aventura[nodoActual]

    return (
      <main className="juego-aconcagua sr-ac-ascenso">
        <section className="juego-aconcagua-contenido">
          <header className="sr-ac-encabezado">
            <div>
              <span className="sr-ac-etiqueta">
                SUMMIT READY / NIVEL 01
              </span>
              <h1>ACONCAGUA</h1>
              <p>6.961 m · Alta montaña · Dificultad inicial</p>
            </div>

            <button
              type="button"
              className="sr-ac-boton-secundario"
              onClick={() => navigate('/expediciones')}
            >
              Volver a expediciones
            </button>
          </header>

          <div className="juego-superior">
            <div>
              <span className="juego-etiqueta">
                ACONCAGUA
              </span>

              <h1>Fase 2 — La aventura</h1>

              <p>
                Tus decisiones y tu equipamiento
                determinan el destino de la expedición.
              </p>
            </div>

            <div className="juego-datos">
              <strong>ENERGÍA {energia}%</strong>
              <strong>CAPÍTULO {capitulo}/3</strong>
            </div>
          </div>

          <div className="ascenso-principal">
            <div className="personaje-zona">
              <h2>Tu expedicionario</h2>

              {personajeVisual}

              <div className="barra-energia-contenedor">
                <div className="barra-energia-info">
                  <span>ENERGÍA</span>
                  <strong>{energia}%</strong>
                </div>

                <div className="barra-energia">
                  <div
                    className="barra-energia-nivel"
                    style={{
                      width: `${energia}%`,
                      backgroundColor:
                        energia > 60
                          ? '#2e9d57'
                          : energia > 30
                            ? '#e5a323'
                            : '#e6392f'
                    }}
                  />
                </div>
              </div>

              <div className="aventura-inventario">
                <h3>Tu equipamiento</h3>

                <div className="inventario-slots">
                  {seleccionados.map(objeto => (
                    <div
                      className="inventario-slot"
                      key={objeto.nombre}
                      title={objeto.nombre}
                    >
                      <img
                        src={objeto.imagen}
                        alt={objeto.nombre}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="evento-zona">
              <span className="evento-numero">
                CAPÍTULO {capitulo} DE 3
              </span>

              <h2>{escena.titulo}</h2>

              <p className="evento-descripcion">
                {escena.descripcion}
              </p>

              {!respuestaBloqueada ? (
                <div className="evento-opciones">
                  <h3>¿Qué decidís hacer?</h3>

                  {escena.opciones.map(
                    (opcion, indice) => (
                      <button
                        key={opcion.texto}
                        className="evento-opcion"
                        onClick={() =>
                          responderEvento(opcion)
                        }
                      >
                        <span className="aventura-letra">
                          {indice === 0 ? 'A' : 'B'}
                        </span>

                        <span>{opcion.texto}</span>

                        <span className="aventura-flecha">
                          →
                        </span>
                      </button>
                    )
                  )}

                  <p className="aventura-ayuda">
                    El equipamiento que elegiste
                    modifica las consecuencias
                    de cada decisión.
                  </p>
                </div>
              ) : (
                <div className="evento-resultado">
                  <span className="aventura-subtitulo">
                    ESTO ES LO QUE SUCEDIÓ
                  </span>

                  <p>{mensajeEvento}</p>

                  <div className="aventura-impacto">
                    <span>
                      ENERGÍA {impacto.energia}%
                    </span>

                    <span>
                      +{impacto.puntos} PUNTOS
                    </span>
                  </div>

                  <button
                    className="confirmar-equipo"
                    onClick={siguienteEvento}
                  >
                    {siguienteNodo === 'fin' ||
                    energia <= 0
                      ? 'VER RESULTADO'
                      : 'CONTINUAR LA AVENTURA'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (fase === 'resultado') {
    const finalExcelente =
      cumbreAlcanzada && energia >= 70

    return (
      <main className="juego-aconcagua">
        <section className="juego-aconcagua-contenido">
          <div className="resultado-expedicion sr-resultado">
            <span className="juego-etiqueta">
              ACONCAGUA · RESULTADO FINAL
            </span>

            <div className="sr-resultado-simbolo">
              <IconoMontana
                exito={cumbreAlcanzada}
              />
            </div>

            <h1>
              {finalExcelente
                ? '¡Cumbre alcanzada con éxito!'
                : cumbreAlcanzada
                  ? '¡Llegaste a la cumbre!'
                  : 'Expedición incompleta'}
            </h1>

            <p>
              {finalExcelente
                ? 'Tomaste buenas decisiones y administraste muy bien tus recursos.'
                : cumbreAlcanzada
                  ? 'Conseguiste llegar a la cima, aunque el recorrido te exigió mucho.'
                  : 'Tuviste que abandonar el ascenso. Probá otro equipamiento y otras decisiones.'}
            </p>

            <div className="resultado-resumen">
              <div>
                <span>PREPARACIÓN</span>
                <strong>
                  {puntajePreparacion} pts
                </strong>
              </div>

              <div>
                <span>ASCENSO</span>
                <strong>
                  {puntajeAscenso} pts
                </strong>
              </div>

              <div>
                <span>ENERGÍA FINAL</span>
                <strong>{energia}%</strong>
              </div>

              <div>
                <span>PUNTAJE FINAL</span>
                <strong>
                  {puntajeFinal} pts
                </strong>
              </div>
            </div>

            <div className="sr-reconocimientos">
              <div className="sr-perfil">
                <span>
                  TU PERFIL DE ESCALADOR
                </span>

                <h2>{perfil.nombre}</h2>

                <p>{perfil.descripcion}</p>
              </div>

              <div className="sr-medalla-panel">
                <span>RECONOCIMIENTO</span>

                <div
                  className={`sr-medalla-icono sr-medalla-${medalla.toLowerCase()}`}
                >
                  ★
                </div>

                <strong>
                  {medalla === 'SIN MEDALLA'
                    ? medalla
                    : `MEDALLA DE ${medalla}`}
                </strong>
              </div>
            </div>

            <div
              className={`sr-desbloqueo ${
                puedeContinuar
                  ? 'sr-desbloqueo-logrado'
                  : ''
              }`}
            >
              <strong>
                {puedeContinuar
                  ? '¡Kilimanjaro desbloqueado!'
                  : 'Próximo desafío: Kilimanjaro'}
              </strong>

              <p>
                {puedeContinuar
                  ? 'Ya podés continuar con la siguiente expedición.'
                  : `Te faltan ${puntosFaltantes} puntos para desbloquear Kilimanjaro.`}
              </p>
            </div>

            <div className="sr-botones-resultado">
              {puedeContinuar && (
                <button
                  className="sr-boton-continuar"
                  onClick={() =>
                    navigate('/juego/kilimanjaro')
                  }
                >
                  CONTINUAR A KILIMANJARO →
                </button>
              )}

              <div className="sr-botones-secundarios">
                <button
                  onClick={() =>
                    navigate('/expediciones')
                  }
                >
                  ELEGIR EXPEDICIÓN
                </button>

                <button onClick={reintentar}>
                  VOLVER A JUGAR
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="juego-aconcagua sr-ac-preparacion">
      <div className="juego-aconcagua-contenido">

        <header className="sr-ac-encabezado">
          <div>
            <span className="sr-ac-etiqueta">
              SUMMIT READY / NIVEL 01
            </span>

            <h1>ACONCAGUA</h1>

            <p>
              6.961 m · Alta montaña · Dificultad inicial
            </p>
          </div>

          <button
            type="button"
            className="sr-ac-boton-secundario"
            onClick={() => navigate('/expediciones')}
          >
            Volver a expediciones
          </button>
        </header>

        <section className="sr-ac-panel">

          <div className="sr-ac-cabecera">
            <div>
              <h2>Prepará tu equipo</h2>
            </div>

            <div className="sr-ac-contadores">
              <span className="condition-item">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#e6392f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14 14.76V5a3 3 0 0 0-6 0v9.76a5 5 0 1 0 6 0Z" />
                  <path d="M11 10v7" />
                </svg>
                -10 °C
              </span>

              <span className="condition-item">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f0ad4e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2v2M4.93 4.93l1.42 1.42M2 12h2M19.07 4.93l-1.42 1.42" />
                  <path d="M12 7a5 5 0 0 1 4.9 4" />
                  <path d="M20 16.5a4.5 4.5 0 0 0-8.7-1.5A3.5 3.5 0 1 0 8.5 21H19a3 3 0 0 0 1-4.5Z" />
                </svg>
                Poco viento
              </span>

              <strong>
                EQUIPO {seleccionados.length}/4
              </strong>

              {tiempoAgotado ? (
                <strong className="sr-ac-alerta" role="status">
                ¡Tiempo agotado! Reiniciá
                </strong>
              ) : (
                <strong
                  className={tiempoRestante <= 10 ? 'sr-ac-alerta' : ''}
                >
                  {tiempoRestante} SEG
                </strong>
              )}
            </div>
          </div>

          <div className="sr-ac-columnas">

            <div className="sr-ac-personaje">
              <h3>Tu expedicionario</h3>

              {personajeVisual}

              <div className="sr-ac-slots">
                {[0, 1, 2, 3].map(numero => {
                  const objeto = seleccionados[numero]

                  return (
                    <div
                      className="sr-ac-slot"
                      key={numero}
                    >
                      {objeto ? (
                        <img
                          src={objeto.imagen}
                          alt={objeto.nombre}
                        />
                      ) : (
                        <span>+</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="sr-ac-equipo">
              <h3>Equipamiento disponible</h3>

              <div className="sr-ac-condiciones">
                <strong>
                  CONDICIONES DE LA EXPEDICIÓN
                </strong>

                <p>
                  Ascenso en terreno rocoso de gran altura,
                  con bajas temperaturas y viento. Elegí
                  equipamiento que te proteja del frío y
                  te ayude a avanzar con seguridad.
                </p>
              </div>

              <div className="sr-ac-items">
                {equipamiento.map(objeto => {
                  const seleccionado = tieneObjeto(
                    objeto.nombre
                  )

                  return (
                    <button
                      type="button"
                      key={objeto.nombre}
                      className={`equipamiento-card ${
                        seleccionado ? 'seleccionada' : ''
                      }`}
                      onClick={() =>
                        seleccionarObjeto(objeto)
                      }
                      disabled={preparacionTerminada}
                    >
                      <img
                        src={objeto.imagen}
                        alt={objeto.nombre}
                      />

                      <span>{objeto.nombre}</span>
                    </button>
                  )
                })}

                <div className="sr-ac-acciones">
                  {!confirmado ? (
                    <button
                      type="button"
                      className="sr-ac-boton-principal"
                      disabled={seleccionados.length !== 4 || tiempoAgotado}
                      onClick={confirmarEquipo}
                    >
                      CONFIRMAR EQUIPO
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="sr-ac-boton-principal"
                      onClick={comenzarAscenso}
                    >
                      COMENZAR ASCENSO
                    </button>
                  )}

                  <button
                    type="button"
                    className="sr-ac-boton-secundario"
                    onClick={reiniciarSeleccion}
                  >
                    Reiniciar selección
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  )
}

export default JuegoAconcagua
