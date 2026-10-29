

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  crearMetricas,
  calcularPerfilExpedicion
} from '../utils/trayectoria'

import personaje from '../assets/personaje.webp'
import './AventuraMontBlanc.css'

const imagenes = import.meta.glob('../assets/*.webp', {
  eager: true,
  query: '?url',
  import: 'default'
})

function buscarImagen(...nombres) {
  for (const nombre of nombres) {
    const imagen = Object.entries(imagenes).find(
      ([ruta]) =>
        ruta.split('/').pop().toLowerCase() === nombre.toLowerCase()
    )

    if (imagen) return imagen[1]
  }

  return ''
}

const fondoMontBlanc = buscarImagen(
  'mont blanc.webp',
  'Mont Blanc.webp',
  'montblanc.png',
  'MontBlanc.png'
)

const EQUIPAMIENTO = [
  {
    id: 'botas',
    nombre: 'Botas de montaña',
    correcto: true,
    imagen: buscarImagen('botas montaña.webp')
  },
  {
    id: 'crampones',
    nombre: 'Crampones',
    correcto: true,
    imagen: buscarImagen('Crampones.webp')
  },
  {
    id: 'guantes',
    nombre: 'Guantes',
    correcto: true,
    imagen: buscarImagen('guantes.webp')
  },
  {
    id: 'impermeable',
    nombre: 'Campera impermeable',
    correcto: true,
    imagen: buscarImagen('Campera impermeable.webp')
  },
  {
    id: 'termica',
    nombre: 'Campera térmica',
    correcto: true,
    imagen: buscarImagen('campera termica.webp')
  },
  {
    id: 'frontal',
    nombre: 'Linterna frontal',
    correcto: true,
    imagen: buscarImagen('Linterna frontal.webp')
  },
  {
    id: 'trail',
    nombre: 'Zapatillas de trail',
    correcto: false,
    imagen: buscarImagen('Zapatillas de trail.webp')
  },
  {
    id: 'trekking',
    nombre: 'Campera de trekking',
    correcto: false,
    imagen: buscarImagen('Campera de trekking.webp')
  },
  {
    id: 'mascarilla',
    nombre: 'Mascarilla deportiva',
    correcto: false,
    imagen: buscarImagen('Mascarilla.webp')
  },
  {
    id: 'bolso',
    nombre: 'Bolso deportivo',
    correcto: false,
    imagen: buscarImagen('Bolso deportivo.webp')
  }
]

const MAX_SELECCION = 6
const TIEMPO_INICIAL = 35

const limitar = valor =>
  Math.max(0, Math.min(100, valor))

const RECURSOS_INICIALES = {
  energia: 100,
  temperatura: 100,
  seguridad: 100
}

const CAPITULOS = [
  {
    titulo: 'Salida del refugio',
    subtitulo: 'El ascenso comienza',
    historia:
      'Todavía es de madrugada. El equipo se prepara para comenzar la subida al Mont Blanc. La temperatura es baja y el camino está cubierto de nieve.',
    opciones: [
      {
        titulo: 'Salir temprano y avanzar con precaución',
        estilo: 'prudente',
        descripcion:
          'Aprovechás las primeras horas del día y conservás la seguridad.',
        cambios: {
          energia: -7,
          temperatura: -10,
          seguridad: -5
        },
        puntos: 155,
        mensaje:
          'Comenzaste la expedición con un ritmo controlado.'
      },
      {
        titulo: 'Avanzar rápido para ganar tiempo',
        estilo: 'audaz',
        descripcion:
          'Ganás velocidad, pero exigís más al cuerpo.',
        cambios: {
          energia: -24,
          temperatura: -8,
          seguridad: -14
        },
        puntos: 265,
        mensaje:
          'Avanzaste rápidamente, pero el esfuerzo inicial fue importante.'
      }
    ]
  },
  {
    titulo: 'Travesía del glaciar',
    subtitulo: 'Nieve y hielo',
    historia:
      'El recorrido atraviesa una zona de hielo y nieve compacta. Cada paso requiere estabilidad y una buena elección del equipamiento.',
    opciones: [
      {
        titulo: 'Cruzar utilizando los crampones',
        estilo: 'audaz',
        descripcion:
          'Mejorás la tracción y reducís el riesgo de resbalones.',
        cambios: {
          energia: -21,
          temperatura: -10,
          seguridad: -5
        },
        requiere: 'crampones',
        puntos: 295,
        mensaje:
          'Atravesaste el tramo helado con mayor estabilidad.'
      },
      {
        titulo: 'Buscar un recorrido menos inclinado',
        estilo: 'prudente',
        descripcion:
          'Evitás la pendiente más pronunciada, pero caminás más.',
        cambios: {
          energia: -10,
          temperatura: -15,
          seguridad: -4
        },
        puntos: 175,
        mensaje:
          'Elegiste un recorrido más largo y gastaste más energía.'
      }
    ]
  },
  {
    titulo: 'La arista nevada',
    subtitulo: 'Terreno expuesto',
    historia:
      'La montaña se vuelve más exigente. El sendero se estrecha y el viento comienza a sentirse con fuerza.',
    opciones: [
      {
        titulo: 'Mantener un ritmo lento y estable',
        estilo: 'prudente',
        descripcion:
          'Priorizás el equilibrio y la seguridad en el terreno expuesto.',
        cambios: {
          energia: -14,
          temperatura: -18,
          seguridad: 3
        },
        puntos: 170,
        mensaje:
          'Superaste la arista manteniendo el control de tus movimientos.'
      },
      {
        titulo: 'Acelerar para salir de la zona expuesta',
        estilo: 'audaz',
        descripcion:
          'Reducís el tiempo bajo el viento, pero asumís más riesgos.',
        cambios: {
          energia: -23,
          temperatura: -10,
          seguridad: -22
        },
        puntos: 295,
        mensaje:
          'Conseguiste avanzar, pero la velocidad aumentó el riesgo.'
      }
    ]
  },
  {
    titulo: 'Cambio repentino del clima',
    subtitulo: 'Viento y nieve',
    historia:
      'Las condiciones empeoran. Aparecen ráfagas intensas y la visibilidad disminuye. Tenés que decidir cómo protegerte.',
    opciones: [
      {
        titulo: 'Protegerte y esperar una mejora',
        estilo: 'prudente',
        descripcion:
          'Reducís la exposición al viento, aunque consumís tiempo y energía.',
        cambios: {
          energia: -8,
          temperatura: -10,
          seguridad: -5
        },
        requiere: 'impermeable',
        puntos: 185,
        mensaje:
          'La protección adecuada te permitió resistir el cambio de clima.'
      },
      {
        titulo: 'Continuar atravesando el temporal',
        estilo: 'audaz',
        descripcion:
          'Seguís avanzando, pero el frío y la baja visibilidad aumentan el peligro.',
        cambios: {
          energia: -18,
          temperatura: -30,
          seguridad: -22
        },
        puntos: 320,
        mensaje:
          'El temporal afectó tu temperatura corporal y tu seguridad.'
      }
    ]
  },
  {
    titulo: 'La cumbre del Mont Blanc',
    subtitulo: 'La decisión final',
    historia:
      'La cima está cerca. El cansancio acumulado empieza a sentirse y todavía queda el descenso. Tenés que decidir si continuar o regresar.',
    opciones: [
      {
        titulo: 'Intentar la cumbre y comenzar el descenso',
        estilo: 'audaz',
        descripcion:
          'Buscás completar la expedición, administrando tus últimos recursos.',
        cambios: {
          energia: -18,
          temperatura: -15,
          seguridad: -12
        },
        puntos: 430,
        mensaje:
          'Llegaste al tramo final. Tus recursos determinarán si completaste la expedición.'
      },
      {
        titulo: 'Descender antes de alcanzar la cima',
        estilo: 'prudente',
        descripcion:
          'Priorizás la seguridad y evitás exponerte a un mayor desgaste.',
        cambios: {
          energia: -8,
          temperatura: -6,
          seguridad: -5
        },
        puntos: 120,
        retirada: true,
        mensaje:
          'Decidiste regresar antes de que las condiciones fueran más exigentes.'
      }
    ]
  }
]

const DATOS_RECURSOS = [
  { clave: 'energia', nombre: 'Energía' },
  { clave: 'temperatura', nombre: 'Protección térmica' },
  { clave: 'seguridad', nombre: 'Seguridad' }
]

function JuegoMontBlanc({
  nombreJugador,
  registrarResultado,
  everestDesbloqueado = false,
  puntosDesbloqueo = 1200
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
  const [decisionTomada, setDecisionTomada] = useState(false)
  const [final, setFinal] = useState(null)
  const [decisiones, setDecisiones] = useState([])

  const resultadoGuardado = useRef(false)

  const tiene = id => seleccionados.includes(id)

  const aciertos = EQUIPAMIENTO.filter(
    objeto => objeto.correcto && tiene(objeto.id)
  ).length

  const puntajePreparacion = aciertos * 200
  const puntajeTotal = puntajePreparacion + puntos

  const capituloActual = CAPITULOS[capitulo]
  const cumbreAlcanzada = final === 'cumbre'

  const puedeContinuar =
    everestDesbloqueado ||
    puntajeTotal >= puntosDesbloqueo

  const metricas = crearMetricas({
    aciertos,
    totalCorrectos: 6,
    decisiones,
    recursosFinales: recursos
  })

  const perfilBase = calcularPerfilExpedicion(metricas)
  const perfil = perfilBase.nombre
  const descripcionPerfil = perfilBase.descripcion

  const medalla = !cumbreAlcanzada
    ? null
    : puntajeTotal >= 2000
      ? 'oro'
      : puntajeTotal >= 1500
        ? 'plata'
        : 'bronce'

  useEffect(() => {
    if (fase !== 'preparacion' || tiempo <= 0) return

    const intervalo = setInterval(() => {
      setTiempo(anterior => Math.max(0, anterior - 1))
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
    ) return

    resultadoGuardado.current = true

    registrarResultado?.('montblanc', {
      puntaje: puntajeTotal,
      cumbre: cumbreAlcanzada,
      perfil,
      metricas
    })
  }, [
    fase,
    puntajeTotal,
    cumbreAlcanzada,
    perfil,
    registrarResultado
  ])

  function elegirObjeto(id) {
    if (fase !== 'preparacion' || tiempo === 0) return

    setSeleccionados(anteriores => {
      if (anteriores.includes(id)) {
        return anteriores.filter(item => item !== id)
      }

      if (anteriores.length >= MAX_SELECCION) {
        return anteriores
      }

      return [...anteriores, id]
    })
  }

  function iniciarAscenso() {
    if (seleccionados.length === 0) return
    if (tiempo > 0 && seleccionados.length !== MAX_SELECCION) return

    const iniciales = { ...RECURSOS_INICIALES }

    if (!tiene('botas')) iniciales.seguridad -= 20
    if (!tiene('crampones')) iniciales.seguridad -= 25
    if (!tiene('guantes')) iniciales.temperatura -= 15
    if (!tiene('impermeable')) iniciales.temperatura -= 20
    if (!tiene('termica')) iniciales.temperatura -= 20
    if (!tiene('frontal')) iniciales.seguridad -= 15

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

    for (const [recurso, cambio] of Object.entries(opcion.cambios)) {
      nuevos[recurso] = limitar(nuevos[recurso] + cambio)
    }

    let ganancia = opcion.puntos
    let explicacion = opcion.mensaje

    if (opcion.requiere && !tiene(opcion.requiere)) {
      nuevos.seguridad = limitar(nuevos.seguridad - 15)
      ganancia = Math.round(ganancia * 0.4)

      explicacion +=
        ' No llevabas el equipamiento adecuado para esta situación.'
    }

    if (nuevos.temperatura < 25) {
      nuevos.energia = limitar(nuevos.energia - 10)
      explicacion += ' El frío redujo tu resistencia.'
    }

    if (nuevos.seguridad < 25) {
      nuevos.energia = limitar(nuevos.energia - 10)
      explicacion +=
        ' Las condiciones del terreno aumentaron el desgaste.'
    }

    setDecisiones(anteriores => [
      ...anteriores,
      {
        estilo: opcion.estilo,
        respaldada: Boolean(
          opcion.requiere && tiene(opcion.requiere)
        ),
        sinEquipo: Boolean(
          opcion.requiere && !tiene(opcion.requiere)
        )
      }
    ])

    setRecursos(nuevos)
    setPuntos(anterior => anterior + ganancia)
    setMensaje(explicacion)
    setDecisionTomada(true)

    const sinRecursos =
      nuevos.energia <= 0 ||
      nuevos.temperatura <= 0 ||
      nuevos.seguridad <= 0

    if (sinRecursos) {
      setFinal('interrumpida')
    } else if (opcion.retirada) {
      setFinal('retirada')
    } else if (capitulo === CAPITULOS.length - 1) {
      const regresoSeguro =
        nuevos.energia >= 15 &&
        nuevos.temperatura >= 15 &&
        nuevos.seguridad >= 15

      setFinal(
        regresoSeguro ? 'cumbre' : 'interrumpida'
      )
    }
  }

  function continuar() {
    if (final !== null) {
      setFase('resultado')
      return
    }

    if (capitulo < CAPITULOS.length - 1) {
      setCapitulo(anterior => anterior + 1)
      setDecisionTomada(false)
      setMensaje('')
    }
  }

  function reiniciar() {
    setFase('preparacion')
    setSeleccionados([])
    setTiempo(TIEMPO_INICIAL)
    setCapitulo(0)
    setRecursos({ ...RECURSOS_INICIALES })
    setPuntos(0)
    setMensaje('')
    setDecisionTomada(false)
    setFinal(null)
    setDecisiones([])

    resultadoGuardado.current = false
  }

  return (
    <main className="juego-aconcagua juego-montblanc">
      <div className="juego-aconcagua-contenido">

        <div className="montblanc-encabezado">
          <div>
            <span className="montblanc-etiqueta">
              SUMMIT READY / NIVEL 03
            </span>

            <h1>MONT BLANC</h1>

            <p>
              4.808 m · Nieve y hielo · Dificultad alta
            </p>
          </div>

          <button
            type="button"
            className="montblanc-boton-secundario"
            onClick={() => navigate('/expediciones')}
          >
            Volver a expediciones
          </button>
        </div>

        {fase === 'preparacion' && (
          <section className="montblanc-preparacion">

            <div className="montblanc-preparacion-cabecera">
              <div>
                <h2>Prepará tu expedición</h2>
              </div>

              <div className="montblanc-contadores">

                <span className="montblanc-clima">
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
                  −15 °C
                </span>

                <span className="montblanc-clima">
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
                    <path d="M20 16.5A4.5 4.5 0 0 0 11.3 15 3.5 3.5 0 1 0 8.5 21H19a3 3 0 0 0 1-4.5Z" />
                    <path d="M9 3v2M8 4h2M15 4v4M13 6h4" />
                  </svg>
                  Nieve y hielo
                </span>

                <strong>
                  {seleccionados.length}/{MAX_SELECCION} objetos
                </strong>

                {tiempo === 0 ? (
                  <strong className="alerta" role="status">
                    ¡Tiempo agotado! Reiniciá
                  </strong>
                ) : (
                  <strong className={tiempo <= 10 ? 'alerta' : ''}>
                    {tiempo} s
                  </strong>
                )}
              </div>
            </div>

            <div className="montblanc-columnas">

              <div className="montblanc-panel-personaje">
                <h3>Tu expedicionario</h3>

                <div
                  className="montblanc-personaje-fondo"
                  style={{
                    backgroundImage: fondoMontBlanc
                      ? `url("${fondoMontBlanc}")`
                      : 'none'
                  }}
                >
                  <img
                    src={personaje}
                    alt="Tu expedicionario"
                  />
                </div>

                <div className="montblanc-personaje-nombre">
                  {nombreJugador || 'Expedicionario'}
                </div>

                <div className="montblanc-slots">
                  {Array.from(
                    { length: MAX_SELECCION },
                    (_, indice) => {
                      const id = seleccionados[indice]

                      const objeto = EQUIPAMIENTO.find(
                        item => item.id === id
                      )

                      return (
                        <div
                          className="montblanc-slot"
                          key={indice}
                        >
                          {objeto?.imagen ? (
                            <img
                              src={objeto.imagen}
                              alt={objeto.nombre}
                              title={objeto.nombre}
                            />
                          ) : (
                            <span>+</span>
                          )}
                        </div>
                      )
                    }
                  )}
                </div>
              </div>

              <div className="montblanc-panel-equipo">
                <h3>Equipamiento disponible</h3>

                <div className="montblanc-condiciones">
                  <strong>
                    CONDICIONES DE LA EXPEDICIÓN
                  </strong>

                  <p>
                    Terreno alpino con nieve y hielo,
                    bajas temperaturas, viento y
                    tramos de ascenso técnico.
                  </p>
                </div>

                <div className="montblanc-grid">
                  {EQUIPAMIENTO.map(objeto => (
                    <button
                      key={objeto.id}
                      type="button"
                      className={`montblanc-tarjeta ${
                        tiene(objeto.id) ? 'seleccionada' : ''
                      }`}
                      onClick={() => elegirObjeto(objeto.id)}
                      disabled={tiempo === 0}
                      aria-pressed={tiene(objeto.id)}
                    >
                      {objeto.imagen ? (
                        <img
                          src={objeto.imagen}
                          alt={objeto.nombre}
                        />
                      ) : (
                        <span className="montblanc-sin-imagen">
                          Imagen pendiente
                        </span>
                      )}

                      <span>{objeto.nombre}</span>
                    </button>
                  ))}

                  <div className="montblanc-acciones-preparacion">
                    <button
                      type="button"
                      className="montblanc-boton-principal"
                      disabled={
                        seleccionados.length !== MAX_SELECCION || tiempo === 0
                      }
                      onClick={iniciarAscenso}
                    >
                      CONFIRMAR EQUIPO Y ASCENDER
                    </button>

                    <button
                      type="button"
                      className="montblanc-boton-secundario"
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
          <div className="montblanc-aventura">

            <aside className="montblanc-escenario">
              <div
                className="montblanc-escenario-personaje"
                style={{
                  backgroundImage: fondoMontBlanc
                    ? `url("${fondoMontBlanc}")`
                    : 'none'
                }}
              >
                <img
                  src={personaje}
                  alt="Expedicionario"
                />
              </div>

              <h3>Estado de la expedición</h3>

              <div className="montblanc-recursos">
                {DATOS_RECURSOS.map(recurso => (
                  <div
                    className="montblanc-recurso"
                    key={recurso.clave}
                  >
                    <div className="montblanc-recurso-texto">
                      <span>{recurso.nombre}</span>

                      <strong>
                        {recursos[recurso.clave]}%
                      </strong>
                    </div>

                    <div className="montblanc-barra">
                      <div
                        className={
                          recursos[recurso.clave] < 30
                            ? 'critico'
                            : ''
                        }
                        style={{
                          width: `${recursos[recurso.clave]}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <h3>Tu equipamiento</h3>

              <div className="montblanc-inventario">
                {EQUIPAMIENTO.filter(objeto =>
                  tiene(objeto.id)
                ).map(objeto => (
                  <div
                    key={objeto.id}
                    className="montblanc-inventario-item"
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

            <section className="montblanc-evento">
              <div className="montblanc-progreso">
                <span>
                  CAPÍTULO {capitulo + 1} DE {CAPITULOS.length}
                </span>

                <span>{puntajeTotal} PTS</span>
              </div>

              <div className="montblanc-pasos">
                {CAPITULOS.map((item, indice) => (
                  <div
                    key={item.titulo}
                    className={`montblanc-paso ${
                      indice <= capitulo ? 'activo' : ''
                    }`}
                  />
                ))}
              </div>

              <span className="montblanc-etiqueta">
                {capituloActual.subtitulo}
              </span>

              <h2>{capituloActual.titulo}</h2>

              <p className="montblanc-descripcion">
                {capituloActual.historia}
              </p>

              {!decisionTomada ? (
                <>
                  <h3>¿Qué vas a hacer?</h3>

                  <div className="montblanc-decisiones">
                    {capituloActual.opciones.map(
                      (opcion, indice) => (
                        <button
                          key={opcion.titulo}
                          type="button"
                          className="montblanc-decision"
                          onClick={() => tomarDecision(opcion)}
                        >
                          <strong>
                            {String.fromCharCode(65 + indice)}.{' '}
                            {opcion.titulo}
                          </strong>

                          <span>{opcion.descripcion}</span>
                        </button>
                      )
                    )}
                  </div>
                </>
              ) : (
                <div className="montblanc-consecuencia">
                  <span className="montblanc-etiqueta">
                    CONSECUENCIAS DE TU DECISIÓN
                  </span>

                  <p>{mensaje}</p>

                  {final === 'interrumpida' && (
                    <p className="montblanc-aviso">
                      Tus recursos no alcanzaron para continuar.
                    </p>
                  )}

                  <button
                    type="button"
                    className="montblanc-boton-principal"
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
        )}

        {fase === 'resultado' && (
          <section className="montblanc-resultado-final">

            <span className="montblanc-etiqueta">
              MONT BLANC · RESULTADO FINAL
            </span>

            <div
              className="montblanc-resultado-simbolo"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 48 48"
                width="32"
                height="32"
                fill="none"
              >
                <path
                  d="M5 37 19 13l8 13 5-8 11 19H5Z"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                <path
                  d="m14 22 5 6 5-5"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2>
              {cumbreAlcanzada
                ? '¡Cumbre alcanzada con éxito!'
                : final === 'retirada'
                  ? 'La expedición terminó antes de la cumbre'
                  : 'No pudiste completar la expedición'}
            </h2>

            <p className="montblanc-resultado-intro">
              {cumbreAlcanzada
                ? 'Conquistaste el Mont Blanc. Tu preparación y tus decisiones hicieron posible el ascenso.'
                : final === 'retirada'
                  ? 'Elegiste regresar antes de alcanzar la cima. Podés volver a intentarlo con otra estrategia.'
                  : 'Los recursos se agotaron durante el ascenso. Revisá tu equipamiento y probá otras decisiones.'}
            </p>

            <div className="montblanc-estadisticas">
              <div>
                <span>PREPARACIÓN</span>
                <strong>{puntajePreparacion} pts</strong>
              </div>

              <div>
                <span>ASCENSO</span>
                <strong>{puntos} pts</strong>
              </div>

              <div>
                <span>ENERGÍA FINAL</span>
                <strong>{recursos.energia}%</strong>
              </div>

              <div>
                <span>PUNTAJE FINAL</span>
                <strong>{puntajeTotal} pts</strong>
              </div>
            </div>

            <div className="montblanc-reconocimientos">

              <div className="montblanc-perfil">
                <span>TU PERFIL DE ESCALADOR</span>

                <h3>{perfil}</h3>

                <p>{descripcionPerfil}</p>
              </div>

              <div className="montblanc-medalla-panel">
                <span>RECONOCIMIENTO</span>

                <div
                  className={`montblanc-medalla-icono ${
                    medalla
                      ? `montblanc-medalla-${medalla}`
                      : 'montblanc-sin-medalla'
                  }`}
                >
                  {medalla ? '★' : '—'}
                </div>

                <strong>
                  {medalla
                    ? `MEDALLA DE ${medalla.toUpperCase()}`
                    : 'CUMBRE PENDIENTE'}
                </strong>
              </div>

            </div>

            <div
              className={`montblanc-desbloqueo ${
                puedeContinuar ? 'logrado' : ''
              }`}
            >
              <strong>
                {puedeContinuar
                  ? '¡Everest desbloqueado!'
                  : `Te faltan ${Math.max(
                      0,
                      puntosDesbloqueo - puntajeTotal
                    )} puntos para desbloquear Everest`}
              </strong>

              <p>
                {puedeContinuar
                  ? 'Ya podés continuar con la última expedición.'
                  : `Necesitás ${puntosDesbloqueo} puntos en Mont Blanc. ¡Volvé a intentarlo!`}
              </p>
            </div>

            <div className="montblanc-acciones-resultado">

              {puedeContinuar && (
                <button
                  type="button"
                  className="montblanc-boton-principal"
                  onClick={() => navigate('/juego/everest')}
                >
                  CONTINUAR A EVEREST →
                </button>
              )}

              <div className="montblanc-acciones-secundarias">

                <button
                  type="button"
                  className="montblanc-boton-secundario"
                  onClick={() => navigate('/expediciones')}
                >
                  ELEGIR EXPEDICIÓN
                </button>

                <button
                  type="button"
                  className="montblanc-boton-secundario"
                  onClick={reiniciar}
                >
                  VOLVER A JUGAR
                </button>

              </div>
            </div>

          </section>
        )}

      </div>
    </main>
  )
}

export default JuegoMontBlanc
