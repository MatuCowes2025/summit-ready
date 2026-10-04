function Ranking({ ranking }) {

  const rankingOrdenado = [...ranking].sort(
    (a, b) => b.puntaje - a.puntaje
  )

  return (
    <main className="ranking-page">

      <section className="ranking-contenido">

        <span className="ranking-etiqueta">
          SUMMIT READY
        </span>

        <h1>Ranking</h1>

        <p className="ranking-subtitulo">
          Los mejores expedicionarios y sus puntajes.
        </p>

        {rankingOrdenado.length === 0 ? (

          <div className="ranking-vacio">
            <h2>Todavía no hay puntajes</h2>
            <p>
              Completá una expedición para aparecer en el ranking.
            </p>
          </div>

        ) : (

          <div className="ranking-tabla">

            <div className="ranking-fila ranking-encabezado">
              <span>POS.</span>
              <span>JUGADOR</span>
              <span>EXPEDICIÓN</span>
              <span>PUNTAJE</span>
            </div>

            {rankingOrdenado.map((jugador, index) => (

              <div
                className="ranking-fila"
                key={`${jugador.nombre}-${jugador.expedicion}`}
              >

                <span className="ranking-posicion">
                  #{index + 1}
                </span>

                <strong>
                  {jugador.nombre}
                </strong>

                <span>
                  {jugador.expedicion}
                </span>

                <strong className="ranking-puntaje">
                  {jugador.puntaje} pts
                </strong>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  )
}

export default Ranking