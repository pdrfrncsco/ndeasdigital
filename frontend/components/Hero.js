import React from 'react'
import Image from 'next/image'

export default function Hero() {
  const heroUrl = process.env.NEXT_PUBLIC_HERO_IMAGE || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'

  return (
    <section id="home" className="gradient-bg hero-pattern text-white pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center relative z-10 gap-12 lg:gap-8">
        
        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6 shadow-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm font-medium tracking-wide">Inovação & Tecnologia</span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Soluções Digitais que <br className="hidden lg:block" />
            <span className="text-yellow-300">aceleram</span> o seu negócio
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-lg leading-relaxed font-light">
            Desenvolvemos sistemas personalizados, rápidos e escaláveis que impulsionam os seus resultados na era digital.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <a 
              href="#simulator" 
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-[#f97316] bg-white rounded-xl font-bold transition-all duration-300 hover:bg-gray-50 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Simular Orçamento
              <i className="fa-solid fa-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i>
            </a>
            
            <a 
              href="#contact" 
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-white border-2 border-white/30 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white"
            >
              Fale Connosco
            </a>
          </div>
          
          {/* Social Proof / Mini Stats */}
          <div className="mt-12 flex items-center gap-6 pt-6 border-t border-white/20 w-full max-w-lg">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#f97316] bg-gray-200 overflow-hidden relative shadow-sm">
                  <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Cliente" fill className="object-cover" unoptimized />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#f97316] bg-white flex items-center justify-center text-[#f97316] text-xs font-bold relative shadow-sm">
                +100
              </div>
            </div>
            <div className="text-sm">
              <div className="font-bold flex items-center gap-1 text-white">
                <i className="fa-solid fa-star text-yellow-300 text-xs"></i>
                <i className="fa-solid fa-star text-yellow-300 text-xs"></i>
                <i className="fa-solid fa-star text-yellow-300 text-xs"></i>
                <i className="fa-solid fa-star text-yellow-300 text-xs"></i>
                <i className="fa-solid fa-star text-yellow-300 text-xs"></i>
                <span className="ml-1">5.0</span>
              </div>
              <span className="text-white/80 text-xs">Clientes satisfeitos</span>
            </div>
          </div>
        </div>

        {/* Image / Visual Content */}
        <div className="w-full lg:w-1/2 relative mt-16 lg:mt-0">
          {/* Background decoration for image */}
          <div className="absolute inset-0 bg-white/20 rounded-2xl transform rotate-3 scale-105 z-0 transition-transform duration-500 hover:rotate-6"></div>
          
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-gray-900/5">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={heroUrl}
                alt="Desenvolvimento Web e Sistemas"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized={heroUrl.startsWith('http')}
              />
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-6 -left-6 lg:-left-10 z-20 bg-white text-gray-900 p-4 rounded-xl shadow-xl flex items-center gap-4 animate-[bounce_3s_infinite]">
            <div className="bg-orange-100 w-12 h-12 rounded-lg text-[#f97316] flex items-center justify-center">
              <i className="fa-solid fa-rocket text-xl"></i>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Alta Performance</p>
              <p className="font-extrabold text-base leading-none text-gray-800 mt-1">100% Otimizado</p>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  )
}
