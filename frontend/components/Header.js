import React, { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xl mr-3">NS</div>
          <h1 className="text-xl font-bold text-gray-800">NDEAS <span className="text-orange-500">DIGITAL</span></h1>
        </div>

        <nav className="hidden md:flex space-x-8">
          <a href="#home" className="nav-link text-gray-600 hover:text-orange-500">Início</a>
          <a href="#services" className="nav-link text-gray-600 hover:text-orange-500">Serviços</a>
          <a href="#projects" className="nav-link text-gray-600 hover:text-orange-500">Projetos</a>
          <a href="#simulator" className="nav-link text-gray-600 hover:text-orange-500">Simulador</a>
          <a href="#contact" className="nav-link text-gray-600 hover:text-orange-500">Contactos</a>
        </nav>

        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="text-gray-600 hover:text-orange-500 focus:outline-none" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className={`${open ? 'block' : 'hidden'} md:hidden bg-white py-2 px-4 shadow-md`}>
        <a href="#home" className="block py-2 text-gray-600 hover:text-orange-500">Início</a>
        <a href="#services" className="block py-2 text-gray-600 hover:text-orange-500">Serviços</a>
        <a href="#projects" className="block py-2 text-gray-600 hover:text-orange-500">Projetos</a>
        <a href="#simulator" className="block py-2 text-gray-600 hover:text-orange-500">Simulador</a>
        <a href="#contact" className="block py-2 text-gray-600 hover:text-orange-500">Contactos</a>
      </div>
    </header>
  )
}
