import React from 'react'

function TechBadge({ icon, label, color }) {
  return (
    <div className="group flex flex-col items-center justify-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
      {/* Background glow effect on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300`} style={{ backgroundColor: color }}></div>
      
      {/* Icon container */}
      <div 
        className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-inner transition-transform duration-300 group-hover:scale-110"
        style={{ color: color, backgroundColor: `${color}15` }}
      >
        <i className={icon}></i>
      </div>
      
      {/* Label */}
      <div className="text-gray-700 font-bold tracking-wide">{label}</div>
    </div>
  )
}

export default function TechStack() {
  const techs = [
    { icon: 'fab fa-python', label: 'Python', color: '#3776AB' },
    { icon: 'fab fa-flutter', label: 'Flutter', color: '#21759B' },
    { icon: 'fab fa-react', label: 'React.js', color: '#61DAFB' },
    { icon: 'fab fa-node-js', label: 'Node.js', color: '#339933' },
    { icon: 'fas fa-database', label: 'PostgreSQL', color: '#336791' },
    { icon: 'fab fa-aws', label: 'AWS', color: '#FF9900' },
    { icon: 'fab fa-docker', label: 'Docker', color: '#2496ED' },
    { icon: 'fab fa-js', label: 'JavaScript', color: '#F7DF1E' },
    { icon: 'fab fa-git-alt', label: 'Git', color: '#F05032' },
    { icon: 'fab fa-figma', label: 'Figma', color: '#F24E1E' },
    { icon: 'fas fa-mobile-screen', label: 'PWA', color: '#5A0FC8' },
    { icon: 'fab fa-wordpress', label: 'WordPress', color: '#21759B' },
    { icon: 'fas fa-wind', label: 'Tailwind CSS', color: '#06B6D4' },
  ]

  return (
    <section id="tech" className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#f97316] font-bold tracking-wider uppercase text-sm mb-2 block">Nosso Arsenal</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Tecnologias de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#ea580c]">Ponta</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Utilizamos as melhores e mais modernas ferramentas do mercado para garantir que o seu projeto seja seguro, rápido e altamente escalável.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {techs.map((t) => (
            <TechBadge key={t.label} icon={t.icon} label={t.label} color={t.color} />
          ))}
        </div>
      </div>
    </section>
  )
}

