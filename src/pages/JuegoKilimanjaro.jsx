
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  crearMetricas,
  calcularPerfilExpedicion
} from '../utils/trayectoria'

import personaje from '../assets/personaje.png'
import fondoKilimanjaro from '../assets/kilimanjaro.png'
import camperaImpermeable from '../assets/Campera impermeable.png'
import camperaAbrigo from '../assets/Campera de abrigo.png'
import zapatillasTrail from '../assets/Zapatillas de trail.png'
import botella from '../assets/Botella.png'
import bebidaEnergetica from '../assets/Bebida energetica.png'
import linternaFrontal from '../assets/Linterna frontal.png'
import linternaMano from '../assets/Linterna de mano.png'
import bolsoDeportivo from '../assets/Bolso deportivo.png'
import mochila from '../assets/mochila.png'
import botas from '../assets/botas montaña.png'

import './AventuraKilimanjaro.css'

const TIEMPO_INICIAL = 35
const CANTIDAD_OBJETOS = 5

const equipamiento = [
  { id: 'impermeable', nombre: 'Campera impermeable', imagen: camperaImpermeable, correcto: false },
  { id: 'abrigo', nombre: 'Campera de abrigo', imagen: camperaAbrigo, correcto: true },
  { id: 'botas', nombre: 'Botas de trekking', imagen: botas, correcto: true },
  { id: 'trail', nombre: 'Zapatillas de trail', imagen: zapatillasTrail, correcto: false },
  { id: 'agua', nombre: 'Botella de agua', imagen: botella, correcto: true },
  { id: 'energetica', nombre: 'Bebida energética', imagen: bebidaEnergetica, correcto: false },
  { id: 'frontal', nombre: 'Linterna frontal', imagen: linternaFrontal, correcto: true },
  { id: 'linterna', nombre: 'Linterna de mano', imagen: linternaMano, correcto: false },
  { id: 'mochila', nombre: 'Mochila de trekking', imagen: mochila, correcto: true },
  { id: 'bolso', nombre: 'Bolso deportivo', imagen: bolsoDeportivo, correcto: false }
]

const capitulos = [
  {
    numero: 1,
    titulo: 'El bosque de montaña',
    lugar: 'Inicio del ascenso',
    descripcion:
      'Comenzás a subir por los senderos del Kilimanjaro. El terreno está húmedo y aparecen sectores con piedras y barro. Tenés que decidir cómo avanzar.',
    opciones: [
      {
        titulo: 'Avanzar por el sendero rocoso',
        estilo: 'audaz',
        descripcion: 'Es una ruta más directa, pero necesitás buen calzado.',
        objeto: 'botas',
        puntosBien: 270,
        puntosMal: 40,
        energiaBien: -16,
        energiaMal: -23,
        mensajeBien:
          'Tus botas de trekking te permiten avanzar con estabilidad. Superás el terreno sin grandes dificultades.',
        mensajeMal:
          'El calzado que llevás no ofrece suficiente protección. Resbalás varias veces y gastás mucha energía.'
      },
      {
        titulo: 'Tomar el sendero más largo',
        estilo: 'prudente',
        descripcion:
          'Es menos exigente técnicamente, pero requiere más esfuerzo.',
        objeto: null,
        puntosBien: 135,
        puntosMal: 135,
        energiaBien: -5,
        energiaMal: -5,
        mensajeBien:
          'Elegís un camino más seguro. Tardás más, pero conseguís atravesar el bosque sin accidentes.',
        mensajeMal:
          'Elegís un camino más seguro. Tardás más, pero conseguís atravesar el bosque sin accidentes.'
      }
    ]
  },
  {
    numero: 2,
    titulo: 'La altura empieza a sentirse',
    lugar: 'Zona de aclimatación',
    descripcion:
      'El aire es cada vez más fino. Sentís cansancio y una leve molestia de cabeza. Todavía queda bastante camino por delante.',
    opciones: [
      {
        titulo: 'Descansar e hidratarte',
        estilo: 'prudente',
        descripcion: 'Hacés una pausa para recuperarte antes de seguir.',
        objeto: 'agua',
        puntosBien: 160,
        puntosMal: 70,
        energiaBien: 18,
        energiaMal: -14,
        mensajeBien:
          'Te hidratás, descansás y recuperás fuerzas. La pausa ayuda a continuar con mejor ritmo.',
        mensajeMal:
          'Intentás recuperarte, pero no llevás suficiente agua. La pausa no alcanza para reponer tus fuerzas.'
      },
      {
        titulo: 'Continuar sin detenerte',
        estilo: 'audaz',
        descripcion: 'Ganás tiempo, pero exigís más a tu cuerpo.',
        objeto: null,
        puntosBien: 300,
        puntosMal: 300,
        energiaBien: -28,
        energiaMal: -28,
        mensajeBien:
          'Avanzás rápidamente, pero el esfuerzo en altura te deja muy cansado. Ignorar la aclimatación tiene consecuencias.',
        mensajeMal:
          'Avanzás rápidamente, pero el esfuerzo en altura te deja muy cansado. Ignorar la aclimatación tiene consecuencias.'
      }
    ]
  },
  {
    numero: 3,
    titulo: 'El frío de la montaña',
    lugar: 'Campamento de altura',
    descripcion:
      'La temperatura desciende bruscamente al caer la tarde. El viento aumenta y necesitás conservar el calor corporal.',
    opciones: [
      {
        titulo: 'Prepararte para el frío',
        estilo: 'prudente',
        descripcion: 'Usás el abrigo que elegiste durante la preparación.',
        objeto: 'abrigo',
        puntosBien: 165,
        puntosMal: 40,
        energiaBien: 2,
        energiaMal: -25,
        mensajeBien:
          'Tu campera de abrigo conserva el calor. Podés continuar sin perder demasiada energía.',
        mensajeMal:
          'Tu equipamiento no ofrece suficiente aislamiento térmico. El frío te obliga a gastar mucha energía.'
      },
      {
        titulo: 'Cruzar una zona expuesta para ganar altura',
        estilo: 'audaz',
        descripcion:
          'Es una ruta rápida, pero el viento te exige un esfuerzo mayor.',
        objeto: null,
        puntosBien: 255,
        puntosMal: 255,
        energiaBien: -22,
        energiaMal: -22,
        mensajeBien:
          'Atravesás un sector expuesto al viento y ganás altura rápidamente. La maniobra funciona, aunque consume bastante energía.',
        mensajeMal:
          'Atravesás un sector expuesto al viento y ganás altura rápidamente. La maniobra funciona, aunque consume bastante energía.'
      }
    ]
  },
  {
    numero: 4,
    titulo: 'El ataque a la cumbre',
    lugar: 'Tramo final',
    descripcion:
      'Son las últimas horas de la expedición. El ascenso final comienza de madrugada y todavía está oscuro. La cima está cerca.',
    opciones: [
      {
        titulo: 'Ascender antes del amanecer',
        estilo: 'audaz',
        descripcion:
          'Aprovechás la salida nocturna con iluminación adecuada.',
        objeto: 'frontal',
        puntosBien: 390,
        puntosMal: 40,
        energiaBien: -22,
        energiaMal: -30,
        mensajeBien:
          'La linterna frontal ilumina el camino y te deja las manos libres. Superás el último tramo con seguridad.',
        mensajeMal:
          'No tenés iluminación adecuada para moverte con las manos libres. El ascenso se vuelve lento y agotador.'
      },
      {
        titulo: 'Esperar hasta que haya luz',
        estilo: 'prudente',
        descripcion:
          'Evitás avanzar a oscuras, pero gastás parte de tus reservas.',
        objeto: null,
        puntosBien: 165,
        puntosMal: 165,
        energiaBien: -6,
        energiaMal: -6,
        mensajeBien:
          'Esperás el amanecer y avanzás con mejor visibilidad. El esfuerzo adicional te deja con menos energía.',
        mensajeMal:
          'Esperás el amanecer y avanzás con mejor visibilidad. El esfuerzo adicional te deja con menos energía.'
      }
    ]
  }
]

function obtenerMedalla(puntaje, llegoCumbre) {
  if (!llegoCumbre) {
    return { nombre: 'SIN MEDALLA', clase: 'sin-medalla', simbolo: '–' }
  }
  if (puntaje >= 1600) {
    return { nombre: 'MEDALLA DE ORO', clase: 'oro', simbolo: '★' }
  }
  if (puntaje >= 1100) {
    return { nombre: 'MEDALLA DE PLATA', clase: 'plata', simbolo: '★' }
  }
  return { nombre: 'MEDALLA DE BRONCE', clase: 'bronce', simbolo: '★' }
}

function IconoMontana() {
  return (
    <svg viewBox="0 0 64 64" width="40" height="40" fill="none" aria-hidden="true">
      <path
        d="M7 49L25 18L35 33L42 24L57 49H7Z"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M19 28L25 18L32 28L27 26L24 30L19 28Z"
        fill="currentColor"
      />
      <path
        d="M37 31L42 24L48 33L43 30L40 33L37 31Z"
        fill="currentColor"
      />
    </svg>
  )
}

function JuegoKilimanjaro({
  registrarResultado,
  montBlancDesbloqueado = false,
  puntosDesbloqueo = 800
}) {
  const navigate = useNavigate()

  const [fase, setFase] = useState('preparacion')
  const [seleccionados, setSeleccionados] = useState([])
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_INICIAL)

  const [capituloActual, setCapituloActual] = useState(0)
  const [energia, setEnergia] = useState(100)
  const [puntajeAventura, setPuntajeAventura] = useState(0)

  const [mensajeEvento, setMensajeEvento] = useState(null)
  const [decisionTomada, setDecisionTomada] = useState(false)
  const [terminado, setTerminado] = useState(false)
  const [resultadoGuardado, setResultadoGuardado] = useState(false)
  const [historialDecisiones, setHistorialDecisiones] = useState([])

  const aciertos = seleccionados.filter(objeto => objeto.correcto).length
  const puntajePreparacion = aciertos * 200
  const puntajeTotal = puntajePreparacion + puntajeAventura

  const tieneObjeto = id =>
    seleccionados.some(objeto => objeto.id === id)

  const capitulo = capitulos[capituloActual]

  const llegoCumbre =
    fase === 'resultado' &&
    !terminado &&
    capituloActual === capitulos.length - 1 &&
    decisionTomada &&
    energia > 0

  const metricas = crearMetricas({
    aciertos,
    totalCorrectos: 5,
    decisiones: historialDecisiones,
    recursosFinales: [energia]
  })

  const perfilBase = calcularPerfilExpedicion(metricas)

  const perfil = {
    titulo: perfilBase.nombre,
    descripcion: perfilBase.descripcion
  }

  const medalla = obtenerMedalla(puntajeTotal, llegoCumbre)

  const montBlancDisponible =
    montBlancDesbloqueado ||
    puntajeTotal >= puntosDesbloqueo

  useEffect(() => {
    if (fase !== 'preparacion' || tiempoRestante <= 0) return

    const temporizador = setTimeout(() => {
      setTiempoRestante(anterior => anterior - 1)
    }, 1000)

    return () => clearTimeout(temporizador)
  }, [fase, tiempoRestante])

  // Al agotarse el tiempo, empieza con el equipamiento seleccionado.
  // Si no eligió ningún objeto, puede reiniciar la selección.
  useEffect(() => {
    if (
      fase === 'preparacion' &&
      tiempoRestante === 0 &&
      seleccionados.length > 0
    ) {
      setFase('ascenso')
    }
  }, [fase, tiempoRestante, seleccionados.length])

  const tiempoAgotado = tiempoRestante === 0

  useEffect(() => {
    if (fase !== 'resultado' || resultadoGuardado) return

    registrarResultado?.('kilimanjaro', {
      puntaje: puntajeTotal,
      cumbre: llegoCumbre,
      perfil: perfil.titulo,
      metricas
    })

    setResultadoGuardado(true)
  }, [
    fase,
    resultadoGuardado,
    puntajeTotal,
    llegoCumbre,
    perfil.titulo,
    registrarResultado
  ])

  const seleccionarObjeto = objeto => {
    if (fase !== 'preparacion' || tiempoAgotado) return

    const existe = seleccionados.some(item => item.id === objeto.id)

    if (existe) {
      setSeleccionados(anterior =>
        anterior.filter(item => item.id !== objeto.id)
      )
      return
    }

    if (seleccionados.length >= CANTIDAD_OBJETOS) return

    setSeleccionados(anterior => [...anterior, objeto])
  }

  const comenzarAscenso = () => {
    if (seleccionados.length !== CANTIDAD_OBJETOS || tiempoAgotado) return
    setFase('ascenso')
  }

  const reiniciarSeleccion = () => {
    setSeleccionados([])
    setTiempoRestante(TIEMPO_INICIAL)
  }

  const tomarDecision = opcion => {
    if (decisionTomada || terminado) return

    const equipoAdecuado =
      opcion.objeto === null || tieneObjeto(opcion.objeto)

    const cambioEnergia = equipoAdecuado
      ? opcion.energiaBien
      : opcion.energiaMal

    const puntosGanados = equipoAdecuado
      ? opcion.puntosBien
      : opcion.puntosMal

    const energiaNueva = Math.max(
      0,
      Math.min(100, energia + cambioEnergia)
    )

    setHistorialDecisiones(anterior => [
      ...anterior,
      {
        estilo: opcion.estilo,
        respaldada: opcion.objeto !== null && equipoAdecuado,
        sinEquipo: opcion.objeto !== null && !equipoAdecuado
      }
    ])

    setEnergia(energiaNueva)
    setPuntajeAventura(anterior => anterior + puntosGanados)

    setMensajeEvento({
      texto: equipoAdecuado
        ? opcion.mensajeBien
        : opcion.mensajeMal,
      puntos: puntosGanados,
      energia: cambioEnergia
    })

    setDecisionTomada(true)

    if (energiaNueva === 0) setTerminado(true)
  }

  const siguienteCapitulo = () => {
    if (!decisionTomada) return

    if (terminado || capituloActual === capitulos.length - 1) {
      setFase('resultado')
      return
    }

    setCapituloActual(anterior => anterior + 1)
    setMensajeEvento(null)
    setDecisionTomada(false)
  }

  const reintentar = () => {
    setFase('preparacion')
    setSeleccionados([])
    setTiempoRestante(TIEMPO_INICIAL)
    setCapituloActual(0)
    setEnergia(100)
    setPuntajeAventura(0)
    setMensajeEvento(null)
    setDecisionTomada(false)
    setTerminado(false)
    setResultadoGuardado(false)
    setHistorialDecisiones([])
  }

  if (fase === 'resultado') {
    return (
      <main className="juego-kilimanjaro">
        <section className="kilimanjaro-final">
          <span className="kilimanjaro-final-etiqueta">
            KILIMANJARO · RESULTADO FINAL
          </span>

          <div className="kilimanjaro-final-montana">
            <IconoMontana />
          </div>

          <h1>
            {llegoCumbre
              ? '¡Cumbre alcanzada con éxito!'
              : 'Expedición interrumpida'}
          </h1>

          <p className="kilimanjaro-final-descripcion">
            {llegoCumbre
              ? energia >= 70
                ? 'Tomaste buenas decisiones y administraste muy bien tus recursos.'
                : 'Conseguiste llegar a la cima después de un ascenso exigente.'
              : 'No pudiste completar el ascenso. Revisá tu equipamiento y tus decisiones para volver a intentarlo.'}
          </p>

          <div className="kilimanjaro-final-estadisticas">
            <div>
              <span>PREPARACIÓN</span>
              <strong>{puntajePreparacion} pts</strong>
            </div>
            <div>
              <span>ASCENSO</span>
              <strong>{puntajeAventura} pts</strong>
            </div>
            <div>
              <span>ENERGÍA FINAL</span>
              <strong>{energia}%</strong>
            </div>
            <div>
              <span>PUNTAJE FINAL</span>
              <strong>{puntajeTotal} pts</strong>
            </div>
          </div>

          <div className="kilimanjaro-final-reconocimientos">
            <div className="kilimanjaro-final-perfil">
              <span>TU PERFIL DE ESCALADOR</span>
              <h2>{perfil.titulo}</h2>
              <p>{perfil.descripcion}</p>
            </div>

            <div className="kilimanjaro-final-medalla">
              <span>RECONOCIMIENTO</span>
              <div className={`kilimanjaro-medalla-icono ${medalla.clase}`}>
                {medalla.simbolo}
              </div>
              <strong>{medalla.nombre}</strong>
            </div>
          </div>

          {montBlancDisponible ? (
            <div className="kilimanjaro-final-desbloqueo">
              <strong>¡Mont Blanc desbloqueado!</strong>
              <p>Ya podés continuar con la siguiente expedición.</p>
            </div>
          ) : (
            <div className="kilimanjaro-final-pendiente">
              <strong>Tu próximo desafío: Mont Blanc</strong>
              <p>
                Conseguí {puntosDesbloqueo} puntos en Kilimanjaro
                para desbloquearlo. Tu resultado: {puntajeTotal} pts.
              </p>
            </div>
          )}

          {montBlancDisponible && (
            <button
              type="button"
              className="kilimanjaro-final-continuar"
              onClick={() => navigate('/juego/montblanc')}
            >
              CONTINUAR A MONT BLANC →
            </button>
          )}

          <div className="kilimanjaro-final-botones">
            <button
              type="button"
              onClick={() => navigate('/expediciones')}
            >
              ELEGIR EXPEDICIÓN
            </button>

            <button type="button" onClick={reintentar}>
              VOLVER A JUGAR
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main
      className={`juego-aconcagua juego-kilimanjaro ${
        fase === 'preparacion'
          ? 'kilimanjaro-vista-preparacion'
          : 'kilimanjaro-vista-ascenso'
      }`}
    >
      <header className="kilimanjaro-portada">
          <div>
            <span className="kilimanjaro-portada-etiqueta">
              SUMMIT READY / NIVEL 02
            </span>

            <h1>KILIMANJARO</h1>
            <p>5.895 m · Alta montaña · Dificultad media</p>
          </div>

          <button
            type="button"
            className="kilimanjaro-volver-expediciones"
            onClick={() => navigate('/expediciones')}
          >
            Volver a expediciones
          </button>
        </header>

      <section className="juego-aconcagua-contenido">
        <div className="juego-superior">
          <div>
            <span className="juego-etiqueta">
              KILIMANJARO · DIFICULTAD MEDIA
            </span>

            <h1>
              {fase === 'preparacion'
                ? 'Prepará tu equipo'
                : 'Fase 2 — La aventura'}
            </h1>

            {fase === 'ascenso' && (
              <p>
                Tus decisiones y el equipamiento elegido determinarán
                cómo termina el ascenso.
              </p>
            )}
          </div>

          <div className="juego-datos">
            {fase === 'preparacion' ? (
              <>
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
                  5 °C
                </span>

                <span className="condition-item">
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
                    <path d="M9 3v2M8 4h2M15 4v4M13 6h4M12 11v2M11 12h2" />
                  </svg>
                  Nieve ligera
                </span>

                <strong>
                  EQUIPO {seleccionados.length}/5
                </strong>

                {tiempoAgotado ? (
                  <strong
                    className="cronometro cronometro-urgente"
                    role="status"
                  >
                    ¡Tiempo agotado! Reiniciá
                  </strong>
                ) : (
                  <span
                    className={
                      tiempoRestante <= 10
                        ? 'cronometro cronometro-urgente'
                        : 'cronometro'
                    }
                  >
                    {tiempoRestante} SEG
                  </span>
                )}
              </>
            ) : (
              <>
                <strong>ENERGÍA {energia}%</strong>
                <strong>
                  CAPÍTULO {capituloActual + 1}/{capitulos.length}
                </strong>
              </>
            )}
          </div>
        </div>

        {fase === 'preparacion' && (
          <div className="juego-principal">
            <div className="personaje-zona">
              <h2>Tu expedicionario</h2>

              <div
                className="personaje-contenedor"
                style={{
                  backgroundImage: `url(${fondoKilimanjaro})`
                }}
              >
                <img
                  src={personaje}
                  alt="Expedicionario"
                  className="personaje-imagen"
                />
              </div>

              <div className="inventario-slots">
                {Array.from(
                  { length: CANTIDAD_OBJETOS },
                  (_, indice) => {
                    const objeto = seleccionados[indice]

                    return (
                      <div className="inventario-slot" key={indice}>
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
                  }
                )}
              </div>
            </div>

            <div className="equipamiento-zona">
              <h2>Equipamiento disponible</h2>

              <div className="kilimanjaro-consejo">
                <strong>CONDICIONES DE LA EXPEDICIÓN</strong>
                <p>
                  El recorrido incluye senderos rocosos,
                  cambios de temperatura, grandes alturas
                  y un ascenso final durante la madrugada.
                </p>
              </div>

              <div className="equipamiento-grid">
                {equipamiento.map(objeto => {
                  const seleccionado = seleccionados.some(
                    item => item.id === objeto.id
                  )

                  return (
                    <button
                      type="button"
                      key={objeto.id}
                      className={`equipamiento-card ${
                        seleccionado ? 'seleccionada' : ''
                      }`}
                      onClick={() => seleccionarObjeto(objeto)}
                      disabled={tiempoAgotado}
                      aria-pressed={seleccionado}
                    >
                      <img
                        src={objeto.imagen}
                        alt={objeto.nombre}
                      />
                      <span>{objeto.nombre}</span>
                    </button>
                  )
                })}

                <div className="kilimanjaro-acciones-grilla">
                  <button
                    type="button"
                    className="confirmar-equipo kilimanjaro-boton-grilla"
                    disabled={
                      seleccionados.length !== CANTIDAD_OBJETOS ||
                      tiempoAgotado
                    }
                    onClick={comenzarAscenso}
                  >
                    COMENZAR EXPEDICIÓN
                  </button>

                  <button
                    type="button"
                    className="kilimanjaro-boton-reiniciar"
                    onClick={reiniciarSeleccion}
                  >
                    Reiniciar selección
                  </button>
                </div>
              </div>

              <p className="kilimanjaro-aviso">
                Los resultados de tu elección se descubrirán
                durante el ascenso.
              </p>
            </div>
          </div>
        )}

        {fase === 'ascenso' && (
          <div className="kilimanjaro-aventura">
            <div className="kilimanjaro-escenario">
              <h3 className="kilimanjaro-personaje-titulo">
                Tu expedicionario
              </h3>

              <div
                className="kilimanjaro-personaje"
                style={{
                  backgroundImage: `url(${fondoKilimanjaro})`
                }}
              >
                <img src={personaje} alt="Tu expedicionario" />
              </div>

              <div className="kilimanjaro-estado">
                <div className="kilimanjaro-estado-titulo">
                  <span>ENERGÍA</span>
                  <strong>{energia}%</strong>
                </div>

                <div className="kilimanjaro-barra">
                  <div
                    className={
                      energia <= 30
                        ? 'kilimanjaro-barra-relleno peligro'
                        : 'kilimanjaro-barra-relleno'
                    }
                    style={{ width: `${energia}%` }}
                  />
                </div>
              </div>

              <h3 className="kilimanjaro-inventario-titulo">
                Tu equipamiento
              </h3>

              <div className="kilimanjaro-inventario">
                {seleccionados.map(objeto => (
                  <div
                    className="kilimanjaro-item"
                    key={objeto.id}
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

            <div className="kilimanjaro-evento">
              <div className="kilimanjaro-progreso">
                <span>
                  CAPÍTULO {capitulo.numero} DE {capitulos.length}
                </span>
              </div>

              <h2>{capitulo.titulo}</h2>

              <p className="kilimanjaro-descripcion">
                {capitulo.descripcion}
              </p>

              {!decisionTomada ? (
                <div className="kilimanjaro-decision-zona">
                  <h3>¿Qué decidís hacer?</h3>

                  <div className="kilimanjaro-opciones">
                    {capitulo.opciones.map((opcion, indice) => (
                      <button
                        type="button"
                        key={opcion.titulo}
                        className="kilimanjaro-opcion"
                        onClick={() => tomarDecision(opcion)}
                      >
                        <span className="kilimanjaro-opcion-letra">
                          {indice === 0 ? 'A' : 'B'}
                        </span>

                        <span className="kilimanjaro-opcion-texto">
                          <strong>{opcion.titulo}</strong>
                          <small>{opcion.descripcion}</small>
                        </span>

                        <span className="kilimanjaro-opcion-flecha">
                          →
                        </span>
                      </button>
                    ))}
                  </div>

                  <p className="kilimanjaro-ayuda">
                    El equipamiento que elegiste modifica
                    las consecuencias de cada decisión.
                  </p>
                </div>
              ) : (
                <div className="kilimanjaro-consecuencia">
                  <span className="kilimanjaro-consecuencia-label">
                    CONSECUENCIA DE TU DECISIÓN
                  </span>

                  <p>{mensajeEvento?.texto}</p>

                  <div className="kilimanjaro-recompensas">
                    <strong>
                      +{mensajeEvento?.puntos} PTS
                    </strong>

                    <strong
                      className={
                        mensajeEvento?.energia >= 0
                          ? 'energia-positiva'
                          : 'energia-negativa'
                      }
                    >
                      {mensajeEvento?.energia > 0 ? '+' : ''}
                      {mensajeEvento?.energia}% ENERGÍA
                    </strong>
                  </div>

                  {terminado && (
                    <p className="kilimanjaro-alerta">
                      Te quedaste sin energía para continuar.
                    </p>
                  )}

                  <button
                    type="button"
                    className="confirmar-equipo"
                    onClick={siguienteCapitulo}
                  >
                    {terminado ||
                    capituloActual === capitulos.length - 1
                      ? 'VER RESULTADO'
                      : 'CONTINUAR ASCENSO'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default JuegoKilimanjaro

