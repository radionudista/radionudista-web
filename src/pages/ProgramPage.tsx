import React from 'react';

/**
 * AboutPage Component
 *
 * Displays information about RadioNudista including:
 * - Company story and mission
 * - Services offered to listeners and artists
 * - Team information
 *
 * Follows glass morphism design pattern with proper content structure
 */
const ProgramPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">


        <div className="space-y-8">
          <div className="glass-card">
            <h3 className="text-2xl font-bold text-white mb-6"></h3>
            <p className="text-gray-200 text-justify">
              radio<strong>nudista</strong> es un club social experimental para personas honestas, curiosas, apasionadas e inclusivas.
              <br/><br/>
              Fundado en 2020, nació con una premisa simple pero poderosa: crear un espacio donde las voces diversas puedan encontrarse sin filtros. Aquí, la diferencia no es una barrera, sino un puente. La honestidad, un valor. Y la curiosidad, una brújula.
              <br/><br/>
              Desde Barcelona y São Paulo, radionudista opera como una <strong>radio online, un club social y un laboratorio creativo</strong> para artistas independientes. Es un lugar para quienes buscan formas nuevas de habitar el sonido, la conversación, el deseo y la comunidad.
              <br/><br/>
              Además de nuestra emisión continua las 24 horas, organizamos eventos conceptuales, fiestas, lanzamientos, encuentros y NakedTalks: espacios de micrófono abierto que suceden cada jueves en redes, donde hablamos sin máscaras en un ambiente íntimo, sin grabaciones, sin espectáculo. Sólo presencia.
              <br/><br/>
              En radionudista, la experimentación no es sólo estética: es política. Abrimos espacio para el error, la duda, el cuerpo, el ruido, el saber popular y lo inclasificable. Aquí se comparten proyectos, experiencias, ideas… y nudes. Aquí no se juzga: se escucha.
              <br/><br/>
              Somos una comunidad viva, colaborativa y siempre abierta a nuevas propuestas. Si quieres difundir tu obra, proponer un programa o ser parte de esta frecuencia compartida, escríbenos a correonudista@gmail.com
              <br/><br/><br/>
              <strong>Curaduría musical:</strong> Gustavo Perez (@gustavodesnudo) y Lucho Milazzo (@luchomy).<br/> 
              <strong>Diseño web:</strong> Felipe Laboren (@felipelabo) y Lemys Lopez (@lemysKaman)<br/>
              <strong>Diseño de audio:</strong> Manuel Aular (@hardlinemanu).<br/>
              <strong>Visuales:</strong> Andres Ramírez (@Gachapon3000).<br/>
              <strong>Voiceovers:</strong> Diana Hung, Gustavo Perez, Lucho Milazzo, Samira Moura, Gabriel Rodrigues,  Laura Sepulveda, Adrian Sanchez, Melanie Chab, Eloisa Colina, Julio Quintana, Paola Agrafojo, Ismelda Armada,  Alberto Flores Solano y Karlis Chirino. <br/>
              <br/><br/>
              Esta radio suena gracias a Wendys Rodriguez, Daniel Salas, Leonardo Dávila, Carlos Eduardo Parra, Nelson Parra, David Jimenez, Daniel Villamizar, Edgar Cabrera, Clared Navarro, Felipe Laboren, LemysKaman, Carlos Pinto, Isaac Varzim, Elio Araujo, Carlos Ignacio Hernández y a toda nuestra red de colaboradores alrededor del mundo.
              <br/><br/>
            </p>
          </div>


        </div>
      </div>
    </div>
  );
};

export default AboutPage;
