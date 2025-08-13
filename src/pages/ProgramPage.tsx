
import React from 'react';
import { 
  FormContainer, 
  FormField, 
  FormInput, 
  FormTextarea, 
  FormButton 
} from '@/components/ui/FormComponents';
import PageLayout from '@/components/ui/PageLayout';
import SocialMediaLinks from '@/components/ui/SocialMediaLinks';
import { CONTACT_INFORMATION } from '../constants/contactInfo';
//import { useIdioma } from '@/contexts/IdiomaContext';
import { useIsMobile } from '@/hooks/use-mobile';

const ProgramPage = () => {

  //const {lang, setLang} = useIdioma()
  const isMobile = useIsMobile()

  const showList = [{
      name:'Misterios',
      description:`Rarezas musicales latinoamericanas en clave de archivo paranormal.
  Inspirado en programas como Archivos del Más Allá, Nuestro Insólito Universo y Escalofríos, este viaje sonoro rescata canciones, leyendas sonoras y pistas olvidadas del inconsciente colectivo latinoamericano. Narrado como un expediente secreto, es una cápsula de terror, historia y placer auditivo con mutaciones horripilantes de latin jazz.`,
      schedule:'lunes 22:00 - BRA',
      talent:['Gustavo Perez'],
      social:['@gustavodesnudo'],
      logo:'5.png',
      descriptionPt:`Raridades musicais latino-americanas em um arquivo paranormal.
Inspirada em programas como Archivos del Más Allá, Nuestro Insólito Universo e Escalofríos, esta jornada sonora resgata canções, lendas sonoras e pistas esquecidas do inconsciente coletivo latino-americano. Narrada como um arquivo secreto, é uma cápsula de terror, história e prazer auditivo com toques aterrorizantes de jazz latino.`
  },{
      name:'Checkpoint',
      description:`Un espacio para pensar los lenguajes del anime, los rituales gamer y las dinámicas del fandom como parte de una identidad compartida. Cultura otaku, videojuegos y comunidades geek; una mirada crítica y emocional sobre los mundos que habitamos en la ficción y cómo estos nos reflejan, nos conectan y nos transforman.`,
      schedule:'martes 20:00 - ARG',
      talent:['Julio Quintana'],
      social:['@kingtanatv'],
      logo:'4.png',
      descriptionPt:`Um espaço para considerar as linguagens dos animes, os rituais gamers e as dinâmicas dos fandoms como parte de uma identidade compartilhada. Cultura otaku, videogames e comunidades geek; um olhar crítico e emocional sobre os mundos que habitamos na ficção e como eles nos refletem, nos conectam e nos transformam.`
  },{
      name:'Chicas Malas',
      description:`Conversaciones con mujeres de moral distraída.
  Compositoras, sex workers, madres radicales, artistas y otras rebeldes: aquí se habla sin tabúes y con el deseo por delante. Una oda a la libertad desde lo íntimo.`,
      schedule:'miércoles 20:00 - ESP',
      talent:['Clared Navarro'],
      social:['@memorafilia_'],
      logo:'2.png',
      descriptionPt:`Conversas com mulheres moralmente desafiadas.
Compositoras, profissionais do sexo, mães radicais, artistas e outras rebeldes: aqui falamos sem tabus e com o desejo em primeiro plano. Uma ode à liberdade do íntimo.`
  },{
      name:'Estrella Distante',
      description:`Ciencia sin bata, astronomía sin fórmulas.
  Un programa que aterriza temas complejos del universo en lenguaje pop, sin perder el rigor ni la magia. De agujeros negros a teorías del tiempo, hablamos como si estuviéramos en una sobremesa estelar.`,
      schedule:'viernes 17:00 - ARG',
      talent:['Karlis Chirinos','Juana Rapoport'],
      social:['@karlisalejandra','@juanarapo'],
      logo:'3.png',
      descriptionPt:`Ciência sem jaleco, astronomia sem fórmulas.
Um programa que traz à tona temas complexos do universo em linguagem popular, sem perder o rigor ou a magia. De buracos negros a teorias do tempo, conversamos como se estivéssemos em uma mesa de jantar estelar.`
  },{
      name:'La Otra Puerta',
      description:`Umbral sonoro hacia el arte y sus enigmas.
  Entrevistas, monólogos y piezas híbridas que indagan en el proceso creativo como acto místico. Cada episodio es una entrada a mundos interiores, obsesiones, formas de crear y sobrevivir.`,
      schedule:'sábado 15:00 - ESP',
      talent:['Alberto Flores Solano'],
      social:['@soyfloressolano'],
      logo:'6.png',
      descriptionPt:`Um limiar sonoro em direção à arte e seus enigmas.
Entrevistas, monólogos e peças híbridas que exploram o processo criativo como um ato místico. Cada episódio é uma entrada para mundos interiores, obsessões, formas de criar e sobreviver.`
  },{
      name:'Sordera Selectiva',
      description:`Curaduría musical para oídos inquietos.
  Explora sonidos fuera de lo habitual: ruido, distorsión, errores, texturas y estructuras anómalas. Cada episodio gira en torno a un eje sonoro /del drone al glitch, del pop intervenido a la música espectral/ entrelazando artistas, contextos históricos y detalles de producción.`,
      schedule:'sábado 18:00 - ESP',
      talent:['Lucho Milazzo'],
      social:['@luchomy'],
      logo:'7.png',
      descriptionPt:`Curadoria musical para ouvidos curiosos.
Explora sons inusitados: ruído, distorção, erros, texturas e estruturas anômalas. Cada episódio gira em torno de um eixo sonoro — do drone ao glitch, do pop manipulado à música espectral — entrelaçando artistas, contextos históricos e detalhes de produção.`
  },{
      name:'Pindorama',
      description:`Una hora de música brasileña con alma tropical y una cuidada selección musical. Cada episodio incluye un mixtape temático, creado con sonidos de casetes, el bosque y la memoria. Desde ritmos olvidados hasta instrumentales excepcionales, Pindorama revela la sofisticación natural de un país con una esencia moderna.`,
      schedule:'domingo 12:00 - BRA',
      talent:['Henrique Sanches'],
      social:['@pindoramaradio'],
      logo:'8.png',
      descriptionPt:`Uma hora de música brasileira com alma tropical e curadoria elegante. A cada episódio, uma mixtape temática costurada por sons de fita cassete, da floresta e damemória. Dos grooves esquecidos aos instrumentais raros, Pindorama revela a sofisticação natural de um país moderno por essência.`
  },{
      name:'Volumen',
      description:`Arquitectura que suena. Música que construye.
  Un mapa sonoro que conecta movimientos arquitectónicos con los sonidos que los rodearon. Desde el brutalismo soviético hasta el futurismo tropical, Volumen teje historias entre espacios, épocas y frecuencias.`,
      schedule:'domingo 15:00 - BRA',
      talent:['Diana Hung'],
      social:['@_dianaacarolina'],
      logo:'1.png',
      descriptionPt:`Arquitetura que soa. Música que constrói.
Um mapa sonoro que conecta movimentos arquitetônicos com os sons que os cercavam. Do brutalismo soviético ao futurismo tropical, Volumen tece histórias através de espaços, eras e frequências.`
  }]

  return (
    <div className='container mx-auto px-6 py-12'>
      <div className=" max-w-4xl mx-auto">
        <div className="flex flex-col">

          {/*<div className="glass-card">
            <h3 className="text-2xl font-bold text-white mb-8">Send us a Message</h3>
            <FormButton type="submit" fullWidth>
                Send Message
              </FormButton>
          </div>*/}

          {showList.map((show,index)=>{
              return (
                <div key={`show_${index}`} className="glass-card mb-8" >
                  <div className="flex sm:flex-row flex-col mb-[0.5rem]">
                    <div className="show-name flex-[1_1_0] sm:mb-[0] mb-[1rem] text-white">
                      <h3 className="text-2xl font-bold text-white mb-4">{show.name}</h3>
                      <p className="text-white mb-[2rem] text-justify">{show.description}</p>
                      {/*<p>conducido por:  </p> */}
                      <p className='mb-3'> <b>conducido por:</b> {
                          show.talent.map((t,i)=>{

                              return show.talent.length == i+1 ? <span key={`talent_${i}`}>{t} ({show.social[i]}) </span> : <><span key={`talent_${i}`}>{t} ({show.social[i]})</span><span> - </span></>
                          })
                      }</p>
                      <p className="text-white">{show.schedule}</p>
                    </div>
                    <div className="show-time flex-[1_1_0] flex flex-col items-center justify-center sm:mb-[0] mb-[1rem] text-white">
                      <img 
                        src={`/images/logos/${show.logo}`}
                        style={{width: isMobile ? '100%' : '200px'}}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          
        </div>
      </div>
    </div>
  );
};

export default ProgramPage;
