import React from 'react'

export default function Hero() {
  return (
    <section id="home" className="gradient-bg hero-pattern text-white py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Soluções Digitais para o Futuro de Angola</h1>
          <p className="text-xl mb-8">Desenvolvemos sistemas personalizados que impulsionam o seu negócio na era digital.</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="#simulator" className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300 text-center">Simular Orçamento</a>
            <a href="#contact" className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition duration-300 text-center">Fale Connosco</a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Desenvolvimento Web" className="rounded-xl shadow-2xl max-w-full h-auto" />
        </div>
      </div>
    </section>
  )
}
