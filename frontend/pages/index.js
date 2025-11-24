import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import TechStack from '../components/TechStack'
import Simulator from '../components/Simulator'
import Footer from '../components/Footer'
import Projects from '../components/Projects'
import Contact from '../components/Contact'
import InvoiceModal from '../components/InvoiceModal'

export default function Home() {
  return (
    <>
      <Head>
        <meta name="description" content="NDEAS SOLUÇÕES DIGITAIS" />
      </Head>
      <Header />
      <Hero />
      <main>
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Quem Somos</h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
              <p className="text-gray-600 max-w-2xl mx-auto mt-4">A NDEAS SOLUÇÕES é uma startup angolana dedicada a impulsionar a transformação digital de negócios com soluções modernas e acessíveis. 
                Actuamos em desenvolvimento de aplicações web, e-Commerce, hospedagem e gestão de domínios, design gráfico e gestão de conteúdos. 
                Com foco em qualidade, transparência e resultados, ajudamos marcas a crescer no ambiente digital, combinando tecnologia de ponta com conhecimento do mercado local.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto"><i className="fas fa-bullseye"></i></div>
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">Missão</h3>
                <p className="text-gray-600 text-center">Fornecer soluções tecnológicas inovadoras e acessíveis que impulsionem o crescimento digital de empresas angolanas, contribuindo para a transformação digital do país.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto"><i className="fas fa-eye"></i></div>
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">Visão</h3>
                <p className="text-gray-600 text-center">Ser reconhecida como a statup que impulsiona as soluções digitais em Angola, capacitando negócios a prosperar na era digital através de tecnologia de ponta e atendimento excepcional.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto"><i className="fas fa-handshake"></i></div>
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">Valores</h3>
                <p className="text-gray-600 text-center">Inovação, Qualidade, Transparência, Compromisso com o Cliente, Responsabilidade Social e Desenvolvimento de Talentos Angolanos.</p>
              </div>
              {/* other about cards could be added here as components */}
            </div>
          </div>
        </section>

        <Services />
        <Projects />
        <TechStack />
        <Simulator />
        <Contact />
      </main>

      <Footer />
      <InvoiceModal />
    </>
  )
}
