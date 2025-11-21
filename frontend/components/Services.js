import React from 'react'

function ServiceCard({ icon, title, children, price, colorClass = '' }) {
  return (
    <div className="service-card bg-white p-8 rounded-xl shadow-sm transition duration-300">
      <div className={`w-14 h-14 gradient-bg rounded-full flex items-center justify-center text-white text-xl mb-6 ${colorClass}`}>
        <i className={icon}></i>
      </div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-6">{children}</p>
      <div className="text-orange-500 font-bold">{price}</div>
    </div>
  )
}

export default function Services() {
  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Nossos Serviços</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard icon="fas fa-globe" title="Desenvolvimento Web" price="A partir de 150.000 Kz">
            Sites institucionais responsivos, blogs e landing pages otimizadas para conversão e performance.
          </ServiceCard>

          <ServiceCard icon="fas fa-shopping-cart" title="eCommerce & Web Apps" price="A partir de 350.000 Kz">
            Lojas virtuais completas e aplicações web progressivas (PWA) com funcionalidades avançadas.
          </ServiceCard>

          <ServiceCard icon="fas fa-server" title="Hospedagem & Domínios" price="Domínios a partir de 25.000 Kz/ano">
            Registo de domínios .ao e hospedagem de alta performance.
          </ServiceCard>

          <ServiceCard icon="fas fa-mobile-alt" title="Aplicativos Móveis" price="A partir de 500.000 Kz">
            Aplicativos nativos para Android e iOS ou soluções híbridas multiplataforma.
          </ServiceCard>

          <ServiceCard icon="fas fa-chart-line" title="Sistemas Personalizados" price="Sob consulta">
            Soluções sob medida para gestão escolar, clínicas, ERP, CRM e outros sistemas empresariais.
          </ServiceCard>

          <ServiceCard icon="fas fa-headset" title="Suporte & Manutenção" price="A partir de 50.000 Kz/mês">
            Pacotes de suporte técnico e manutenção preventiva para garantir o funcionamento contínuo.
          </ServiceCard>
        </div>
      </div>
    </section>
  )
}
