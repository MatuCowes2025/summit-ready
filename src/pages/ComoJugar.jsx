
import './ComoJugar.css'

function IconoGuia({ tipo }) {
  const iconos = {
    montana: (
      <>
        <path d="m8 3 4 8 3-4 7 14H2L8 3Z" />
        <path d="m6 7 2 2 2-2" />
        <path d="m13 11 2 2 2-2" />
      </>
    ),
    mochila: (
      <>
        <path d="M6 18V8a6 6 0 0 1 12 0v10" />
        <path d="M6 10H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 10h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="8" width="12" height="14" rx="2" />
        <path d="M9 8V5a3 3 0 0 1 6 0v3" />
        <path d="M9 15h6" />
        <path d="M9 18h6" />
      </>
    ),
    brujula: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m16.2 7.8-2.8 5.6-5.6 2.8 2.8-5.6 5.6-2.8Z" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
      </>
    ),
    medalla: (
      <>
        <path d="m8 2 4 7 4-7" />
        <path d="M5 2h4l3 7 3-7h4l-4 9" />
        <circle cx="12" cy="16" r="6" />
        <path d="m12 12 1.2 2.5 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4L12 12Z" />
      </>
    ),
    consejo: (
      <>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.1 14a6 6 0 1 0-6.2 0c.7.6 1.1 1.4 1.1 2v1h4v-1c0-.6.4-1.4 1.1-2Z" />
        <path d="M12 2V1" />
        <path d="m4.9 4.9-.7-.7" />
        <path d="m19.1 4.9.7-.7" />
      </>
    ),
  }

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconos[tipo]}
    </svg>
  )
}

const pasos = [
  {
    numero: '01',
    icono: 'montana',
    titulo: 'Elegí tu montaña',
    descripcion:
      'Seleccioná una de las cuatro expediciones: Aconcagua, Kilimanjaro, Mont Blanc o Everest. Cada una tiene su propia dificultad, condiciones climáticas y desafíos.',
  },
  {
    numero: '02',
    icono: 'mochila',
    titulo: 'Prepará tu equipo',
    descripcion:
      'Elegí los objetos que consideres más adecuados para la montaña. Tenés un tiempo limitado para prepararte y cada elemento puede ayudarte durante el ascenso.',
  },
  {
    numero: '03',
    icono: 'brujula',
    titulo: 'Tomá decisiones',
    descripcion:
      'Durante la aventura vas a enfrentar distintas situaciones. Elegí cómo avanzar: tus decisiones y el equipamiento seleccionado influyen en las consecuencias.',
  },
  {
    numero: '04',
    icono: 'medalla',
    titulo: 'Sumá puntos y progresá',
    descripcion:
      'Completá los capítulos, cuidá tus recursos y conseguí la mayor puntuación posible. Ganá medallas y desbloqueá nuevas expediciones.',
  },
]

function ComoJugar() {
  return (
    <main className="como-jugar">
      <div className="como-jugar-contenedor">

        <section className="como-jugar-hero">
          <span className="como-jugar-etiqueta">
            SUMMIT READY / GUÍA DEL EXPLORADOR
          </span>

          <h1>¿ESTÁS LISTO PARA LA CIMA?</h1>

          <p>
            Cuatro montañas, diferentes desafíos y una misión:
            llegar lo más lejos posible. Conocé cómo funciona
            Summit Ready antes de comenzar tu expedición.
          </p>
        </section>

        <section className="como-jugar-seccion">
          <div className="como-jugar-seccion-encabezado">
            <span className="como-jugar-etiqueta">
              TU CAMINO A LA CIMA
            </span>

            <h2>Cómo funciona el juego</h2>

            <p>
              Seguí estos cuatro pasos para convertirte en
              un verdadero explorador.
            </p>
          </div>

          <div className="como-jugar-pasos">
            {pasos.map((paso) => (
              <article
                className="como-jugar-paso"
                key={paso.numero}
              >
                <div className="como-jugar-paso-superior">
                  <span className="como-jugar-numero">
                    {paso.numero}
                  </span>

                  <span className="como-jugar-icono">
                    <IconoGuia tipo={paso.icono} />
                  </span>
                </div>

                <h3>{paso.titulo}</h3>

                <p>{paso.descripcion}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="como-jugar-consejo">
          <div className="como-jugar-consejo-icono">
            <IconoGuia tipo="consejo" />
          </div>

          <div>
            <span className="como-jugar-etiqueta">
              CONSEJO DEL EXPLORADOR
            </span>

            <h2>La preparación marca la diferencia</h2>

            <p>
              No siempre conviene elegir el camino más rápido.
              Prestá atención al clima, seleccioná bien tu
              equipamiento y pensá cada decisión: una buena
              estrategia puede cambiar el resultado de tu aventura.
            </p>
          </div>
        </section>

        <section className="como-jugar-cierre">
          <span className="como-jugar-etiqueta">
            EL DESAFÍO COMIENZA
          </span>

          <h2>LA MONTAÑA TE ESPERA</h2>

          <p>
            Ahora que conocés las reglas, estás listo para
            comenzar tu próxima expedición.
          </p>
        </section>

      </div>
    </main>
  )
}

export default ComoJugar
