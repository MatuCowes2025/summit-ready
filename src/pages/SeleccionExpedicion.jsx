import ExpeditionCard from '../components/ExpeditionCard'
import aconcagua from '../assets/aconcagua.png'
import kilimanjaro from '../assets/kilimanjaro.png'
import everest from '../assets/everest.png'
import montBlanc from '../assets/mont blanc.png'

function SeleccionExpedicion() {
  return (
    <main className="seleccion-expedicion">
      <section className="seleccion-contenido">

        <h1>Elegí tu expedición</h1>
        <p>Seleccioná la montaña que querés enfrentar.</p>

        <div className="expediciones-grid">

          <ExpeditionCard
            nombre="Aconcagua"
            pais="Argentina"
            imagen={aconcagua}
            altura="6.961 m"
            dificultad="Fácil"
            temperatura="-10°C"
            clima="Poco viento"
            objetos={8}
            elegir={4}
            tiempo={45}
          />
          <ExpeditionCard
          nombre="Kilimanjaro"
          pais="Tanzania"
          imagen={kilimanjaro}
          altura="5.895 m"
          dificultad="Medio"
          temperatura="5°C"
          clima="Nieve ligera"
          objetos={10}
          elegir={5}
          tiempo={35}
         />
         <ExpeditionCard
         nombre="Everest"
         pais="Nepal / China"
         imagen={everest}
         altura="8.848 m"
         dificultad="Difícil"
         temperatura="-30°C"
         clima="Viento extremo"
         objetos={12}
         elegir={6}
        tiempo={25}
        destacada={true}
        />
        <ExpeditionCard
        nombre="Mont Blanc"
        pais="Francia / Italia"
        imagen={montBlanc}
        altura="4.808 m"
        dificultad="Medio"
        temperatura="-15°C"
        clima="Nieve moderada"
        objetos={10}
        elegir={5}
        tiempo={35}
        />
        </div>

      </section>
    </main>
  )
}

export default SeleccionExpedicion