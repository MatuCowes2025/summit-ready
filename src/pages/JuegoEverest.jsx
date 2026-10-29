
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  crearMetricas,
  calcularPerfilExpedicion
} from '../utils/trayectoria'

import CelebracionFinal from '../components/CelebracionFinal'
import personaje from '../assets/personaje.webp'

import './AventuraEverest.css'

const imagenes = import.meta.glob(
  '../assets/*.webp',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
)

function buscarImagen(...nombres) {
  for (const nombre of nombres) {
    const encontrada = Object.entries(imagenes).find(
      ([ruta]) =>
        ruta.split('/').pop().toLowerCase() ===
        nombre.toLowerCase()
    )

    if (encontrada) return encontrada[1]
  }

  return ''
}

const EQUIPAMIENTO = [
  {
    id: 'traje',
    nombre: 'Traje de expedición',
    correcto: true,
    imagen: buscarImagen('Traje de expedicion.webp')
  },
  {
    id: 'oxigeno',
    nombre: 'Equipo de oxígeno',
    correcto: true,
    imagen: buscarImagen('Oxigeno.webp')
  },
  {
    id: 'guantes-expedicion',
    nombre: 'Guantes de expedición',
    correcto: true,
    imagen: buscarImagen(
      'guantes.webp',
      'Guantes.webp',
      'Guantes de expedicion.png'
    )
  },
  {
    id: 'crampones',
    nombre: 'Crampones',
    correcto: true,
    imagen: buscarImagen('Crampones.webp')
  },
  {
    id: 'frontal',
    nombre: 'Linterna frontal',
    correcto: true,
    imagen: buscarImagen('Linterna frontal.webp')
  },
  {
    id: 'campera',
    nombre: 'Campera de trekking',
    correcto: false,
    imagen: buscarImagen(
      'Campera de trekking.webp',
      'Campera impermeable.webp'
    )
  },
  {
    id: 'botas-trekking',
    nombre: 'Botas de trekking',
    correcto: false,
    imagen: buscarImagen('botas montaña.webp')
  },
  {
    id: 'mascarilla',
    nombre: 'Mascarilla deportiva',
    correcto: false,
    imagen: buscarImagen('Mascarilla.webp')
  },
  {
    id: 'linterna-mano',
    nombre: 'Linterna de mano',
    correcto: false,
    imagen: buscarImagen('Linterna de mano.webp')
  }
]

const MAX_SELECCION = 6
const TIEMPO_INICIAL = 35

const RECURSOS_INICIALES = {
  energia: 100,
  oxigeno: 100,
  calor: 100,
  crampones: 100,
  bateria: 100
}

const limitar = valor =>
  Math.max(0, Math.min(100, valor))

const CAPITULOS = [
  {
    titulo: 'Campamento base',
    subtitulo: 'La aclimatación',
    historia:
      'La expedición comienza. El viento golpea el campamento y varios integrantes sienten los primeros efectos de la altura. Tenés que decidir cómo preparar el ascenso.',

    opciones: [
      {
        titulo: 'Descansar y aclimatarse',
        estilo: 'prudente',
        descripcion:
          'Ganás resistencia, pero gastás suministros y tiempo.',
        cambios: {
          energia: 10,
          oxigeno: -15,
          calor: -5
        },
        puntos: 165,
        mensaje:
          'La aclimatación te ayuda, aunque consumiste parte de tus reservas.'
      },
      {
        titulo: 'Salir antes de que empeore el clima',
        estilo: 'audaz',
        descripcion:
          'Ahorrás oxígeno, pero exigís al cuerpo desde el comienzo.',
        cambios: {
          energia: -26,
          oxigeno: -4,
          calor: -10
        },
        puntos: 265,
        mensaje:
          'Avanzaste rápido, pero el esfuerzo inicial se hace sentir.'
      }
    ]
  },

  {
    titulo: 'Cascada de hielo del Khumbu',
    subtitulo: 'Terreno inestable',
    historia:
      'Una sucesión de bloques de hielo y grietas dificulta el avance. Tus crampones comienzan a desgastarse y necesitás conservar energía.',

    opciones: [
      {
        titulo: 'Cruzar por el tramo técnico',
        estilo: 'audaz',
        descripcion:
          'Es más corto, pero exige mucho al equipamiento.',
        cambios: {
          energia: -12,
          oxigeno: -10,
          crampones: -35
        },
        requiere: 'crampones',
        puntos: 310,
        mensaje:
          'Superaste el hielo, pero los crampones sufrieron un desgaste importante.'
      },
      {
        titulo: 'Buscar un recorrido más largo',
        estilo: 'prudente',
        descripcion:
          'Reducís el desgaste de los crampones, pero gastás energía y oxígeno.',
        cambios: {
          energia: -14,
          oxigeno: -22,
          crampones: -8
        },
        puntos: 175,
        mensaje:
          'El rodeo fue más seguro para el equipo, pero te dejó agotado.'
      }
    ]
  },

  {
    titulo: 'Tormenta en altura',
    subtitulo: 'Frío extremo',
    historia:
      'Una tormenta reduce la visibilidad. La temperatura cae bruscamente y cada minuto en el exterior consume protección térmica.',

    opciones: [
      {
        titulo: 'Refugiarte hasta que pase',
        estilo: 'prudente',
        descripcion:
          'Conservás calor, pero consumís más oxígeno.',
        cambios: {
          energia: 12,
          oxigeno: -25,
          calor: -8
        },
        puntos: 155,
        mensaje:
          'El descanso ayudó, pero tus reservas de oxígeno disminuyeron.'
      },
      {
        titulo: 'Atravesar la tormenta',
        estilo: 'audaz',
        descripcion:
          'Ahorrás oxígeno, pero el frío y el esfuerzo pasan factura.',
        cambios: {
          energia: -18,
          oxigeno: -8,
          calor: -32
        },
        requiere: 'traje',
        puntos: 320,
        mensaje:
          'Lograste avanzar, aunque tu protección térmica quedó comprometida.'
      }
    ]
  },

  {
    titulo: 'La zona de la muerte',
    subtitulo: 'Por encima de los 8.000 metros',
    historia:
      'El aire es extremadamente escaso. La fatiga aumenta y tenés que administrar las reservas antes del ataque final a la cumbre.',

    opciones: [
      {
        titulo: 'Aumentar el flujo de oxígeno',
        estilo: 'prudente',
        descripcion:
          'Protegés tu energía, pero gastás gran parte de la botella.',
        cambios: {
          energia: 14,
          oxigeno: -35,
          calor: -8
        },
        requiere: 'oxigeno',
        puntos: 175,
        mensaje:
          'El oxígeno te permitió recuperarte, pero las reservas están bajando.'
      },
      {
        titulo: 'Reducir el consumo de oxígeno',
        estilo: 'audaz',
        descripcion:
          'Conservás la botella, pero el esfuerzo físico es mucho mayor.',
        cambios: {
          energia: -33,
          oxigeno: -10,
          calor: -12
        },
        puntos: 320,
        mensaje:
          'Ahorraste oxígeno a costa de un desgaste físico considerable.'
      }
    ]
  },

  {
    titulo: 'La cumbre y el descenso',
    subtitulo: 'La decisión definitiva',
    historia:
      'La cima está cerca, pero todavía falta regresar. La luz empieza a desaparecer y el equipo acumula desgaste. ¿Cómo completás la expedición?',

    opciones: [
      {
        titulo:
          'Intentar la cumbre y descender de inmediato',
        estilo: 'audaz',
        descripcion:
          'Buscás completar el objetivo, usando tus últimos recursos.',
        cambios: {
          energia: -18,
          oxigeno: -20,
          calor: -12,
          crampones: -18,
          bateria: -30
        },
        requiere: 'frontal',
        puntos: 430,
        mensaje:
          'Alcanzaste el tramo final. Ahora se evalúa si tus recursos alcanzaron para regresar.'
      },
      {
        titulo: 'Esperar mejores condiciones',
        estilo: 'prudente',
        descripcion:
          'Evitás avanzar a oscuras, pero la espera consume suministros.',
        cambios: {
          energia: -12,
          oxigeno: -30,
          calor: -20,
          crampones: -5,
          bateria: -5
        },
        puntos: 250,
        mensaje:
          'Esperaste una ventana más favorable, pero el tiempo consumió tus reservas.'
      },
      {
        titulo: 'Renunciar a la cumbre y descender',
        estilo: 'prudente',
        descripcion:
          'Priorizás la seguridad y terminás la expedición sin hacer cumbre.',
        cambios: {
          energia: -8,
          oxigeno: -8,
          calor: -6,
          crampones: -8,
          bateria: -10
        },
        puntos: 100,
        retirada: true,
        mensaje:
          'Decidiste regresar antes de que las condiciones fueran demasiado peligrosas.'
      }
    ]
  }
]

const DATOS_RECURSOS = [
  {
    clave: 'energia',
    nombre: 'Energía'
  },
  {
    clave: 'oxigeno',
    nombre: 'Oxígeno'
  },
  {
    clave: 'calor',
    nombre: 'Protección térmica'
  },
  {
    clave: 'crampones',
    nombre: 'Estado de crampones'
  },
  {
    clave: 'bateria',
    nombre: 'Batería de linterna'
  }
]

function obtenerMedalla(puntaje) {
  if (puntaje >= 2050) {
    return {
      nombre: 'ORO',
      clase: 'oro'
    }
  }

  if (puntaje >= 1600) {
    return {
      nombre: 'PLATA',
      clase: 'plata'
    }
  }

  return {
    nombre: 'BRONCE',
    clase: 'bronce'
  }
}

function IconoMontana() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 37L18 16L25 26L31 19L43 37H5Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      <path
        d="M13 24L18 29L22 24"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function JuegoEverest({
  nombreJugador,
  registrarResultado,
  progreso
}) {
  const navigate = useNavigate()

  const [fase, setFase] = useState('preparacion')
  const [seleccionados, setSeleccionados] = useState([])
  const [tiempo, setTiempo] = useState(TIEMPO_INICIAL)
  const [capitulo, setCapitulo] = useState(0)

  const [recursos, setRecursos] = useState({
    ...RECURSOS_INICIALES
  })

  const [puntos, setPuntos] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [decisionTomada, setDecisionTomada] =
    useState(false)

  const [final, setFinal] = useState(null)
  const [decisiones, setDecisiones] = useState([])

  const resultadoGuardado = useRef(false)

  const tiene = id => seleccionados.includes(id)

  const aciertos = EQUIPAMIENTO.filter(
    objeto => objeto.correcto && tiene(objeto.id)
  ).length

  const totalCorrectos = EQUIPAMIENTO.filter(
    objeto => objeto.correcto
  ).length

  const puntajePreparacion = aciertos * 200
  const puntajeTotal = puntajePreparacion + puntos

  const capituloActual = CAPITULOS[capitulo]

  const metricas = crearMetricas({
    aciertos,
    totalCorrectos,
    decisiones,
    recursosFinales: recursos
  })

  const perfil = calcularPerfilExpedicion(metricas)

  const medalla =
    final === 'cumbre'
      ? obtenerMedalla(puntajeTotal)
      : {
          nombre: 'SIN MEDALLA',
          clase: 'sin-medalla'
        }

  const todasLasCumbresAnteriores = [
    'aconcagua',
    'kilimanjaro',
    'montblanc'
  ].every(
    montana => progreso?.[montana]?.cumbre
  )

  const cuatroCumbres =
    final === 'cumbre' &&
    todasLasCumbresAnteriores

  const fondoEverest = buscarImagen(
    'everest.webp',
    'Everest.webp',
    'monte everest.png'
  )

  useEffect(() => {
    if (
      fase !== 'preparacion' ||
      tiempo <= 0
    ) {
      return
    }

    const intervalo = setInterval(() => {
      setTiempo(anterior =>
        Math.max(0, anterior - 1)
      )
    }, 1000)

    return () => clearInterval(intervalo)
  }, [fase, tiempo])

  useEffect(() => {
    if (
      fase === 'preparacion' &&
      tiempo === 0 &&
      seleccionados.length > 0
    ) {
      iniciarAscenso()
    }
  }, [fase, tiempo, seleccionados.length])

  useEffect(() => {
    if (
      fase !== 'resultado' ||
      resultadoGuardado.current
    ) {
      return
    }

    resultadoGuardado.current = true

    registrarResultado?.('everest', {
      puntaje: puntajeTotal,
      cumbre: final === 'cumbre',
      perfil: perfil.nombre,
      metricas
    })
  }, [
    fase,
    puntajeTotal,
    final,
    perfil.nombre,
    registrarResultado
  ])

  function elegirObjeto(id) {
    if (
      fase !== 'preparacion' ||
      tiempo === 0
    ) {
      return
    }

    setSeleccionados(anteriores => {
      if (anteriores.includes(id)) {
        return anteriores.filter(
          item => item !== id
        )
      }

      if (
        anteriores.length >= MAX_SELECCION
      ) {
        return anteriores
      }

      return [...anteriores, id]
    })
  }

  function iniciarAscenso() {
    if (
      seleccionados.length === 0 ||
      (seleccionados.length !== MAX_SELECCION && tiempo > 0)
    ) {
      return
    }

    const iniciales = {
      ...RECURSOS_INICIALES
    }

    if (!tiene('traje')) {
      iniciales.calor = 65
    }

    if (!tiene('oxigeno')) {
      iniciales.oxigeno = 50
    }

    if (!tiene('crampones')) {
      iniciales.crampones = 45
    }

    if (!tiene('frontal')) {
      iniciales.bateria = 30
    }

    if (!tiene('guantes-expedicion')) {
      iniciales.calor -= 15
    }

    if (tiene('botas-trekking')) {
      iniciales.energia -= 10
    }

    setRecursos(iniciales)
    setCapitulo(0)
    setPuntos(0)
    setMensaje('')
    setDecisionTomada(false)
    setFinal(null)
    setDecisiones([])

    resultadoGuardado.current = false

    setFase('ascenso')
  }

  function tomarDecision(opcion) {
    if (decisionTomada) return

    const nuevos = { ...recursos }

    for (
      const [recurso, cambio]
      of Object.entries(opcion.cambios)
    ) {
      nuevos[recurso] = limitar(
        nuevos[recurso] + cambio
      )
    }

    let ganancia = opcion.puntos
    let explicacion = opcion.mensaje

    if (
      opcion.requiere &&
      !tiene(opcion.requiere)
    ) {
      nuevos.energia = limitar(
        nuevos.energia - 15
      )

      ganancia = Math.round(
        ganancia * 0.4
      )

      explicacion +=
        ' No llevabas el equipo especializado necesario.'
    }

    if (
      nuevos.crampones < 25 &&
      capitulo >= 1
    ) {
      nuevos.energia = limitar(
        nuevos.energia - 10
      )

      explicacion +=
        ' Los crampones desgastados dificultaron el avance.'
    }

    if (nuevos.calor < 25) {
      nuevos.energia = limitar(
        nuevos.energia - 10
      )

      explicacion +=
        ' El frío extremo redujo tu resistencia.'
    }

    if (
      nuevos.oxigeno < 20 &&
      capitulo >= 3
    ) {
      nuevos.energia = limitar(
        nuevos.energia - 15
      )

      explicacion +=
        ' La falta de oxígeno agravó el agotamiento.'
    }

    if (
      capitulo === 4 &&
      nuevos.bateria < 20 &&
      !opcion.retirada
    ) {
      nuevos.energia = limitar(
        nuevos.energia - 15
      )

      explicacion +=
        ' La poca batería complicó el descenso.'
    }

    setRecursos(nuevos)

    setPuntos(anterior =>
      anterior + ganancia
    )

    setMensaje(explicacion)
    setDecisionTomada(true)

    setDecisiones(anteriores => [
      ...anteriores,
      {
        estilo: opcion.estilo,

        respaldada: Boolean(
          opcion.requiere &&
          tiene(opcion.requiere)
        ),

        sinEquipo: Boolean(
          opcion.requiere &&
          !tiene(opcion.requiere)
        )
      }
    ])

    const sinRecursos =
      nuevos.energia <= 0 ||
      nuevos.oxigeno <= 0 ||
      nuevos.calor <= 0

    if (sinRecursos) {
      setFinal('interrumpida')
    } else if (opcion.retirada) {
      setFinal('retirada')
    } else if (
      capitulo === CAPITULOS.length - 1
    ) {
      const regresoSeguro =
        nuevos.energia >= 15 &&
        nuevos.oxigeno >= 10 &&
        nuevos.calor >= 10 &&
        nuevos.crampones >= 10 &&
        nuevos.bateria >= 10

      setFinal(
        regresoSeguro
          ? 'cumbre'
          : 'interrumpida'
      )
    }
  }

  function continuar() {
    if (final !== null) {
      setFase('resultado')
      return
    }

    if (
      capitulo < CAPITULOS.length - 1
    ) {
      setCapitulo(anterior =>
        anterior + 1
      )

      setDecisionTomada(false)
      setMensaje('')
    }
  }

  function reiniciar() {
    setFase('preparacion')
    setSeleccionados([])
    setTiempo(TIEMPO_INICIAL)
    setCapitulo(0)

    setRecursos({
      ...RECURSOS_INICIALES
    })

    setPuntos(0)
    setMensaje('')
    setDecisionTomada(false)
    setFinal(null)
    setDecisiones([])

    resultadoGuardado.current = false
  }

  return (
    <main className="juego-everest">
      <div className="everest-contenido">

        {fase !== 'resultado' && (
          <header className="everest-encabezado">
            <div>
              <span className="everest-etiqueta">
                SUMMIT READY · NIVEL 04
              </span>

              <h1>MONTE EVEREST</h1>

              <p>
                8.848 m · −30 °C · Dificultad extrema
              </p>
            </div>

            <button
              type="button"
              className="everest-boton-secundario"
              onClick={() =>
                navigate('/expediciones')
              }
            >
              Volver a expediciones
            </button>
          </header>
        )}

        {fase === 'preparacion' && (
          <section className="everest-preparacion">
            <div className="everest-cabecera">
              <div>
                <span className="everest-etiqueta">
                  FASE 1 · PREPARACIÓN
                </span>
                <h2>Prepará tu expedición</h2>
              </div>

              <div className="everest-contadores">
                <span className="everest-clima">
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
                  −30 °C
                </span>

                <span className="everest-clima">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#75c9f7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 8h12a3 3 0 1 0-3-3" />
                    <path d="M2 12h17a3 3 0 1 1-3 3" />
                    <path d="M4 16h7a3 3 0 1 1-3 3" />
                  </svg>
                  Viento extremo
                </span>

                <strong>
                  {seleccionados.length}/{MAX_SELECCION} OBJETOS
                </strong>

                {tiempo === 0 && seleccionados.length === 0 ? (
                  <strong className="alerta" role="status">
                    ¡Tiempo agotado! Reiniciá
                  </strong>
                ) : (
                  <strong className={tiempo <= 10 ? 'alerta' : ''}>
                    {tiempo} SEG
                  </strong>
                )}
              </div>
            </div>

            <div className="everest-preparacion-columnas">
              <aside className="everest-panel-personaje">
                <h3>Tu expedicionario</h3>

                <div
                  className="everest-personaje-fondo"
                  style={
                    fondoEverest
                      ? {
                          backgroundImage:
                            `url("${fondoEverest}")`
                        }
                      : {}
                  }
                >
                  <img
                    src={personaje}
                    alt="Tu expedicionario"
                  />
                </div>

                <div className="everest-personaje-nombre">
                  {nombreJugador ||
                    'Expedicionario'}
                </div>

                <div className="everest-slots">
                  {Array.from(
                    {
                      length: MAX_SELECCION
                    },
                    (_, indice) => {
                      const id =
                        seleccionados[indice]

                      const objeto =
                        EQUIPAMIENTO.find(
                          item =>
                            item.id === id
                        )

                      return (
                        <div
                          className="everest-slot"
                          key={indice}
                          title={
                            objeto?.nombre ||
                            'Espacio vacío'
                          }
                        >
                          {objeto?.imagen ? (
                            <img
                              src={objeto.imagen}
                              alt={objeto.nombre}
                            />
                          ) : (
                            <span>+</span>
                          )}
                        </div>
                      )
                    }
                  )}
                </div>
              </aside>

              <div className="everest-panel-equipo">
                <h3>
                  Equipamiento disponible
                </h3>

                <div className="everest-condiciones">
                  <strong>
                    CONDICIONES DE LA EXPEDICIÓN
                  </strong>

                  <p>
                    Frío extremo, poco oxígeno,
                    hielo inestable y un descenso
                    que exige conservar los recursos.
                  </p>
                </div>

                <div className="everest-grid-equipo">
                  {EQUIPAMIENTO.map(objeto => {
                    const seleccionado =
                      tiene(objeto.id)

                    return (
                      <button
                        key={objeto.id}
                        type="button"
                        className={`everest-tarjeta ${
                          seleccionado
                            ? 'seleccionada'
                            : ''
                        }`}
                        onClick={() =>
                          elegirObjeto(objeto.id)
                        }
                        disabled={tiempo === 0}
                        aria-pressed={seleccionado}
                      >
                        {objeto.imagen ? (
                          <img
                            src={objeto.imagen}
                            alt={objeto.nombre}
                          />
                        ) : (
                          <span className="everest-sin-imagen">
                            Imagen pendiente
                          </span>
                        )}

                        <span className="everest-tarjeta-nombre">
                          {objeto.nombre}
                        </span>
                      </button>
                    )
                  })}

                  <div className="everest-acciones-preparacion">
                    <button
                      type="button"
                      className="everest-boton-principal"
                      disabled={
                        seleccionados.length !==
                        MAX_SELECCION || tiempo === 0
                      }
                      onClick={iniciarAscenso}
                    >
                      CONFIRMAR Y ASCENDER
                    </button>

                    <button
                      type="button"
                      className="everest-boton-secundario"
                      onClick={reiniciar}
                    >
                      Reiniciar selección
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {fase === 'ascenso' && (
          <>
            <div className="everest-fase-titulo">
              <div>
                <span className="everest-etiqueta">
                  FASE 2 · LA AVENTURA
                </span>

                <h2>
                  El ascenso al Everest
                </h2>
              </div>

              <div className="everest-contadores">
                <span className="everest-clima">
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
                  −30 °C
                </span>

                <span className="everest-clima">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#75c9f7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 8h12a3 3 0 1 0-3-3" />
                    <path d="M2 12h17a3 3 0 1 1-3 3" />
                    <path d="M4 16h7a3 3 0 1 1-3 3" />
                  </svg>
                  Viento extremo
                </span>

                <strong>
                  {seleccionados.length}/{MAX_SELECCION} OBJETOS
                </strong>

                <strong className={tiempo <= 5 ? 'alerta' : ''}>
                  {tiempo} SEG
                </strong>
              </div>
            </div>

            <div className="everest-aventura">
              <aside className="everest-escenario">
                <div
                  className="everest-escenario-personaje"
                  style={
                    fondoEverest
                      ? {
                          backgroundImage:
                            `url("${fondoEverest}")`
                        }
                      : {}
                  }
                >
                  <img
                    src={personaje}
                    alt="Expedicionario"
                  />
                </div>

                <h3>
                  Estado de la expedición
                </h3>

                <div className="everest-recursos">
                  {DATOS_RECURSOS.map(recurso => (
                    <div
                      className="everest-recurso"
                      key={recurso.clave}
                    >
                      <div className="everest-recurso-texto">
                        <span>
                          {recurso.nombre}
                        </span>

                        <strong>
                          {
                            recursos[
                              recurso.clave
                            ]
                          }%
                        </strong>
                      </div>

                      <div className="everest-barra">
                        <div
                          className={
                            recursos[
                              recurso.clave
                            ] < 30
                              ? 'critico'
                              : ''
                          }
                          style={{
                            width: `${
                              recursos[
                                recurso.clave
                              ]
                            }%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <h3>Tu equipamiento</h3>

                <div className="everest-inventario">
                  {EQUIPAMIENTO.filter(
                    objeto =>
                      tiene(objeto.id)
                  ).map(objeto => (
                    <div
                      key={objeto.id}
                      className="everest-inventario-item"
                      title={objeto.nombre}
                    >
                      {objeto.imagen && (
                        <img
                          src={objeto.imagen}
                          alt={objeto.nombre}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </aside>

              <section className="everest-evento">
                <div className="everest-progreso">
                  <span>
                    CAPÍTULO {capitulo + 1} DE{' '}
                    {CAPITULOS.length}
                  </span>

                  <span>
                    {puntajeTotal} PTS
                  </span>
                </div>

                <div className="everest-pasos">
                  {CAPITULOS.map(
                    (item, indice) => (
                      <div
                        key={item.titulo}
                        className={`everest-paso ${
                          indice <= capitulo
                            ? 'activo'
                            : ''
                        }`}
                      />
                    )
                  )}
                </div>

                <span className="everest-etiqueta">
                  {capituloActual.subtitulo}
                </span>

                <h2>
                  {capituloActual.titulo}
                </h2>

                <p className="everest-descripcion">
                  {capituloActual.historia}
                </p>

                {!decisionTomada ? (
                  <>
                    <h3>
                      ¿Qué vas a hacer?
                    </h3>

                    <div className="everest-decisiones">
                      {capituloActual.opciones.map(
                        (opcion, indice) => (
                          <button
                            key={opcion.titulo}
                            type="button"
                            className="everest-decision"
                            onClick={() =>
                              tomarDecision(opcion)
                            }
                          >
                            <span className="everest-letra">
                              {String.fromCharCode(
                                65 + indice
                              )}
                            </span>

                            <span className="everest-decision-texto">
                              <strong>
                                {opcion.titulo}
                              </strong>

                              <small>
                                {opcion.descripcion}
                              </small>
                            </span>

                            <span className="everest-flecha">
                              →
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <div className="everest-consecuencia">
                    <span className="everest-etiqueta">
                      CONSECUENCIAS DE TU DECISIÓN
                    </span>

                    <p>{mensaje}</p>

                    {final ===
                      'interrumpida' && (
                      <p className="everest-aviso">
                        Tus recursos no alcanzaron
                        para continuar.
                      </p>
                    )}

                    <button
                      type="button"
                      className="everest-boton-principal"
                      onClick={continuar}
                    >
                      {final !== null
                        ? 'VER RESULTADO'
                        : 'CONTINUAR EXPEDICIÓN'}
                    </button>
                  </div>
                )}
              </section>
            </div>
          </>
        )}

        {fase === 'resultado' && (
          <section className="everest-resultado">

            {cuatroCumbres && (
              <CelebracionFinal
                nombreJugador={nombreJugador}
                progreso={progreso}
                resultadoEverest={{
                  puntaje: puntajeTotal,
                  cumbre: true,
                  perfil: perfil.nombre,
                  metricas,
                  medalla: medalla.nombre
                }}
              />
            )}

            <span className="everest-etiqueta">
              EVEREST · RESULTADO FINAL
            </span>

            <div className="everest-resultado-simbolo">
              <IconoMontana />
            </div>

            <h1>
              {final === 'cumbre'
                ? '¡Cumbre alcanzada con éxito!'
                : final === 'retirada'
                  ? 'Elegiste regresar a salvo'
                  : 'Expedición interrumpida'}
            </h1>

            <p className="everest-resultado-descripcion">
              {final === 'cumbre'
                ? 'Conquistaste el Everest y completaste el descenso. Tus decisiones te permitieron superar la expedición más exigente.'
                : final === 'retirada'
                  ? 'Priorizaste la seguridad frente a las condiciones extremas. Podés volver a intentarlo.'
                  : 'El desgaste acumulado impidió completar la expedición. Revisá tu equipamiento y tus decisiones para el próximo intento.'}
            </p>

            <div className="everest-resultado-resumen">
              <div>
                <span>PREPARACIÓN</span>

                <strong>
                  {puntajePreparacion} pts
                </strong>
              </div>

              <div>
                <span>ASCENSO</span>

                <strong>
                  {puntos} pts
                </strong>
              </div>

              <div>
                <span>ENERGÍA FINAL</span>

                <strong>
                  {recursos.energia}%
                </strong>
              </div>

              <div>
                <span>PUNTAJE FINAL</span>

                <strong>
                  {puntajeTotal} pts
                </strong>
              </div>
            </div>

            <div className="everest-reconocimientos">
              <div className="everest-perfil">
                <span>
                  TU PERFIL DE ESCALADOR
                </span>

                <h2>
                  {perfil.nombre}
                </h2>

                <p>
                  {perfil.descripcion}
                </p>
              </div>

              <div className="everest-medalla-panel">
                <span>
                  RECONOCIMIENTO
                </span>

                <div
                  className={`everest-medalla-icono ${
                    medalla.clase
                  }`}
                >
                  ★
                </div>

                <strong>
                  {medalla.nombre ===
                  'SIN MEDALLA'
                    ? medalla.nombre
                    : `MEDALLA DE ${
                        medalla.nombre
                      }`}
                </strong>
              </div>
            </div>

            {final === 'cumbre' &&
              !cuatroCumbres && (
                <div className="everest-final-juego">
                  <span className="everest-final-etiqueta">
                    RECONOCIMIENTO ESPECIAL
                  </span>

                  <div className="everest-final-estrella">
                    ★
                  </div>

                  <h2>
                    ¡LLEGASTE AL FINAL DE
                    SUMMIT READY!
                  </h2>

                  <p>
                    Superaste el Everest, la
                    última expedición del
                    recorrido. Podés volver
                    a las montañas anteriores
                    para conquistar todas las
                    cumbres y mejorar tus marcas.
                  </p>

                  <strong>
                    DESAFÍO FINAL SUPERADO
                  </strong>
                </div>
              )}

            {final !== 'cumbre' && (
              <div className="everest-reintento">
                <strong>
                  EL DESAFÍO TODAVÍA NO TERMINÓ
                </strong>

                <p>
                  Volvé a intentarlo,
                  mejorá tu preparación y
                  buscá conquistar la
                  última cumbre.
                </p>
              </div>
            )}

            <div className="everest-botones-resultado">
              <button
                type="button"
                className="everest-boton-principal"
                onClick={() =>
                  navigate('/expediciones')
                }
              >
                ELEGIR EXPEDICIÓN
              </button>

              <button
                type="button"
                className="everest-boton-secundario"
                onClick={reiniciar}
              >
                VOLVER A JUGAR
              </button>

              <button
                type="button"
                className="everest-boton-secundario"
                onClick={() =>
                  navigate('/mi-trayectoria')
                }
              >
                MI TRAYECTORIA
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export default JuegoEverest

