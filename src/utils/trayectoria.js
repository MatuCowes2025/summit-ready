
export const ORDEN_MONTANAS = [
  'aconcagua',
  'kilimanjaro',
  'montblanc',
  'everest'
]

export const NOMBRES_MONTANAS = {
  aconcagua: 'Aconcagua',
  kilimanjaro: 'Kilimanjaro',
  montblanc: 'Mont Blanc',
  everest: 'Everest'
}

export const PERFILES = {
  estrategico: {
    nombre: 'Expedicionario estratégico',
    descripcion:
      'Planificás el equipo y elegís cuándo avanzar. Tus decisiones combinan preparación, eficiencia y control de los recursos.'
  },

  audaz: {
    nombre: 'Expedicionario audaz',
    descripcion:
      'Te animás a tomar rutas exigentes y asumir riesgos calculados. Buscás la cumbre sin perder de vista las consecuencias.'
  },

  prudente: {
    nombre: 'Expedicionario prudente',
    descripcion:
      'Priorizás la seguridad, la aclimatación y el regreso. Sabés que una buena expedición no consiste solo en llegar primero.'
  },

  adaptable: {
    nombre: 'Expedicionario adaptable',
    descripcion:
      'Combinás rutas, ritmos y recursos según cada situación. No dependés de una única estrategia para superar la montaña.'
  },

  impulsivo: {
    nombre: 'Expedicionario impulsivo',
    descripcion:
      'Te gusta avanzar y resolver sobre la marcha, aunque a veces asumís riesgos sin el equipo o los recursos suficientes.'
  }
}

const porcentaje = (parte, total) =>
  total > 0 ? parte / total : 0

const acotar = (valor) =>
  Math.max(0, Math.min(100, Number(valor) || 0))

export function crearMetricas({
  aciertos,
  totalCorrectos,
  decisiones = [],
  recursosFinales = []
}) {
  const recursos = Array.isArray(recursosFinales)
    ? recursosFinales
    : Object.values(recursosFinales)

  return {
    preparacion: porcentaje(
      aciertos,
      totalCorrectos
    ),

    decisiones: decisiones.length,

    audaces: decisiones.filter(
      (decision) => decision.estilo === 'audaz'
    ).length,

    prudentes: decisiones.filter(
      (decision) => decision.estilo === 'prudente'
    ).length,

    respaldadas: decisiones.filter(
      (decision) => decision.respaldada
    ).length,

    sinEquipo: decisiones.filter(
      (decision) => decision.sinEquipo
    ).length,

    recursosFinales: recursos.length
      ? recursos.reduce(
          (suma, valor) => suma + acotar(valor),
          0
        ) / recursos.length
      : 0
  }
}

export function calcularPerfilExpedicion(metricas) {
  const m = metricas || {}

  const total = m.decisiones || 0

  const riesgo = porcentaje(
    m.audaces || 0,
    total
  )

  const prudencia = porcentaje(
    m.prudentes || 0,
    total
  )

  const sinEquipo = porcentaje(
    m.sinEquipo || 0,
    total
  )

  const respaldo = porcentaje(
    m.respaldadas || 0,
    total
  )

  if (
    riesgo >= 0.45 &&
    (
      sinEquipo >= 0.3 ||
      m.preparacion < 0.55
    )
  ) {
    return PERFILES.impulsivo
  }

  if (
    m.preparacion >= 0.75 &&
    respaldo >= 0.35 &&
    (m.recursosFinales || 0) >= 35
  ) {
    return PERFILES.estrategico
  }

  if (
    riesgo >= 0.55 &&
    sinEquipo < 0.35
  ) {
    return PERFILES.audaz
  }

  if (
    prudencia >= 0.6 &&
    (m.recursosFinales || 0) >= 25
  ) {
    return PERFILES.prudente
  }

  if (
    m.preparacion < 0.45 &&
    riesgo >= 0.35
  ) {
    return PERFILES.impulsivo
  }

  return PERFILES.adaptable
}

export function calcularPerfilGlobal(progreso) {
  const registros = ORDEN_MONTANAS.map(
    (clave) => progreso?.[clave]
  )

  if (
    !registros.every(
      (registro) => registro?.cumbre
    )
  ) {
    return null
  }

  const metricas = registros.map(
    (registro) => registro.mejorCumbre?.metricas
  )

  if (!metricas.every(Boolean)) {
    return null
  }

  const suma = (campo) =>
    metricas.reduce(
      (total, m) =>
        total + (Number(m[campo]) || 0),
      0
    )

  const decisiones = suma('decisiones')

  const promedio = (campo) =>
    suma(campo) / metricas.length

  const global = {
    preparacion: promedio('preparacion'),
    decisiones,
    audaces: suma('audaces'),
    prudentes: suma('prudentes'),
    respaldadas: suma('respaldadas'),
    sinEquipo: suma('sinEquipo'),
    recursosFinales: promedio('recursosFinales')
  }

  return {
    ...calcularPerfilExpedicion(global),
    metricas: global
  }
}

export function medallaDe(
  montana,
  puntaje,
  cumbre
) {
  if (!cumbre) return null

  const umbrales = {
    aconcagua: [1450, 1050],
    kilimanjaro: [1600, 1100],
    montblanc: [2000, 1500],
    everest: [2050, 1600]
  }

  const [oro, plata] =
    umbrales[montana] || [Infinity, Infinity]

  if (puntaje >= oro) return 'ORO'
  if (puntaje >= plata) return 'PLATA'

  return 'BRONCE'
}
