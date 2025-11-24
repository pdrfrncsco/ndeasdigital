import React from 'react'

function TechBadge({ icon, label }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200">
      <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center text-white text-xl">
        <i className={icon}></i>
      </div>
      <div className="text-gray-800 font-semibold">{label}</div>
    </div>
  )
}

export default function TechStack() {
  const techs = [
    { icon: 'fab fa-python', label: 'Python' },
    { icon: 'fas fa-leaf', label: 'Django' },
    { icon: 'fab fa-react', label: 'React.js' },
    { icon: 'fas fa-circle-nodes', label: 'Next.js' },
    { icon: 'fab fa-js', label: 'JavaScript' },
    { icon: 'fas fa-mobile-screen', label: 'PWA' },
    { icon: 'fab fa-wordpress', label: 'WordPress' },
    { icon: 'fas fa-database', label: 'PostgreSQL' },
    { icon: 'fas fa-wind', label: 'Tailwind CSS' },
    { icon: 'fab fa-ubuntu', label: 'Ubuntu/Debian' },
    { icon: 'fas fa-code', label: 'VS Code' },
    { icon: 'fas fa-terminal', label: 'TRAE' },
    { icon: 'fas fa-brain', label: 'Claude Code' },
    { icon: 'fas fa-robot', label: 'ChatGPT' },
    { icon: 'fas fa-code-branch', label: 'Git' },
    { icon: 'fas fa-code', label: 'GitHub' },
  ]

  return (
    <section id="tech" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Tecnologias de Trabalho</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">Principais tecnologias e ferramentas que utilizamos para construir soluções robustas e modernas.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {techs.map((t) => (
            <TechBadge key={t.label} icon={t.icon} label={t.label} />
          ))}
        </div>
      </div>
    </section>
  )
}

