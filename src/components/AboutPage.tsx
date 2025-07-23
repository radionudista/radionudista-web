
import React from 'react';
import PageLayout from './ui/PageLayout';
import { useIdioma } from '@/contexts/IdiomaContext';

const AboutPage = () => {

  const {lang, setLang} = useIdioma()

  return (
    <PageLayout >
      <div className="space-y-8">

        {lang == 'es' && <section>
          <p className="text-gray-200">
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
        </section>}

        {lang == 'pt' && <section>
          <p className="text-gray-200">
            radio<strong>nudista</strong> é um clube social experimental para pessoas honestas, curiosas, apaixonadas e inclusivas.
            <br/><br/>
            Fundado em 2020, nasceu com uma premissa simples, porém poderosa: criar um espaço onde vozes diversas possam se encontrar sem filtros. Aqui, a diferença não é uma barreira, e sim uma ponte. A honestidade, um valor. E a curiosidade, uma bússola.
            <br/><br/>
            De Barcelona e São Paulo, a radionudista funciona como <strong>uma rádio online, um clube social e um laboratório criativo</strong> para artistas independentes. É um lugar para quem busca novas formas de habitar o som, a conversa, o desejo e a comunidade.
            <br/><br/>
            Além da nossa transmissão contínua 24 horas por dia, organizamos eventos conceituais, festas, lançamentos, encontros e NakedTalks: espaços de microfone aberto que acontecem todas as quintas nas redes, onde falamos sem máscaras em um ambiente íntimo, sem gravações, sem espetáculo. Apenas presença.
            <br/><br/>
            Na radionudista, a experimentação não é apenas estética: é política. Abrimos espaço pro erro, a dúvida, o corpo, o ruído, o saber popular e o que não pode ser classificado. Aqui se compartilham projetos, experiências, ideias... e nudes. Aqui não se julga: se escuta.
            <br/><br/>
            Somos uma comunidade viva, colaborativa e sempre aberta a novas propostas. Se quiser divulgar sua obra, propor um programa ou fazer parte desta frequência compartilhada, manda um salve para correonudista@gmail.com
            <br/><br/><br/>
            <strong>Curadoria musical:</strong> Gustavo Perez (@gustavodesnudo) y Lucho Milazzo (@luchomy).<br/> 
            <strong>Design web:</strong> Felipe Laboren (@felipelabo) y Lemys Lopez (@lemysKaman)<br/>
            <strong>Design de áudio:</strong> Manuel Aular (@hardlinemanu).<br/>
            <strong>Visuais:</strong> Andres Ramírez (@Gachapon3000).<br/>
            <strong>Voiceovers:</strong> Diana Hung, Gustavo Perez, Lucho Milazzo, Samira Moura, Gabriel Rodrigues,  Laura Sepulveda, Adrian Sanchez, Melanie Chab, Eloisa Colina, Julio Quintana, Paola Agrafojo, Ismelda Armada,  Alberto Flores Solano y Karlis Chirino. <br/>
            <br/><br/>
            Agradecimentos especiais a Wendys Rodriguez, Daniel Salas, Leonardo Dávila, Carlos Eduardo Parra, Nelson Parra, David Jimenez, Daniel Villamizar, Edgar Cabrera, Clared Navarro, Felipe Laboren, LemysKaman, Carlos Pinto, Isaac Varzim, Elio Araujo, Carlos Ignacio Hernández e a toda a nossa rede de colaboradores ao redor do mundo.
            <br/><br/>
          </p>
        </section>}
        
        {/*<div className="glass-card">
          <h3 className="text-2xl font-bold text-white mb-6">Our Mission</h3>
          <p className="text-gray-200 leading-relaxed">
            To provide a platform for emerging and established artists to showcase their talent 
            while delivering an exceptional listening experience to our global audience. We're 
            committed to promoting diversity in music and supporting independent artists.
          </p>
        </div>
        
        <div className="glass-card">
          <h3 className="text-2xl font-bold text-white mb-6">What We Offer</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-blue-300 mb-3">For Listeners</h4>
              <ul className="text-gray-200 space-y-1">
                <li>• 24/7 live streaming</li>
                <li>• Diverse music genres</li>
                <li>• High-quality audio</li>
                <li>• Interactive community</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-300 mb-3">For Artists</h4>
              <ul className="text-gray-200 space-y-1">
                <li>• Showcase platform</li>
                <li>• Global audience reach</li>
                <li>• Promotional opportunities</li>
                <li>• Community support</li>
              </ul>
            </div>
          </div>
        </div>*/}

      </div>
    </PageLayout>
  );
};

export default AboutPage;
