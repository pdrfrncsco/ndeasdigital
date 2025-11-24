import React from 'react'
import Image from 'next/image'

export default function Hero() {
  const heroUrl = process.env.NEXT_PUBLIC_HERO_IMAGE || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'

  return (
    <section id="home" className="gradient-bg hero-pattern text-white py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="hero-title md:text-5xl font-bold mb-4">Soluções Digitais que aceleram o seu negócio</h1>
          <p className="hero-subtitle mb-8">Desenvolvemos sistemas personalizados que impulsionam o seu negócio na era digital.</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="#simulator" className="btn-primary text-center">Simular Orçamento</a>
            <a href="#contact" className="btn-outline text-center">Fale Connosco</a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="hero-image rounded-xl shadow-2xl max-w-full w-full">
            <Image
              src={heroUrl}
              alt="Desenvolvimento Web"
              fill
              priority
              className="object-cover"
              unoptimized={heroUrl.startsWith('http')}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
