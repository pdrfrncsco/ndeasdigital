import React from 'react'

function ProjectCard({ img, title, category, description, tags }) {
  return (
    <div className="project-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img src={img} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">{category}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex space-x-2">
          {tags.map((t) => (
            <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const projects = [
    {
      img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Loja Virtual ModaAngola',
      category: 'eCommerce',
      description: 'Plataforma de eCommerce completa para venda de moda angolana com integração Multicaixa Express.',
      tags: ['React', 'Node.js', 'MongoDB']
    },
    {
      img: 'https://images.unsplash.com/photo-1581092921461-39b2f2c8a352?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Sistema Clínica Vida+',
      category: 'Saúde',
      description: 'Sistema de gestão para clínica médica com agendamento online, prontuário eletrônico e telemedicina.',
      tags: ['Django', 'PostgreSQL', 'React']
    },
    {
      img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Plataforma Educativa Eureka',
      category: 'Educação',
      description: 'Sistema de gestão escolar com portal para pais, alunos e professores com aulas online.',
      tags: ['Laravel', 'MySQL', 'Vue.js']
    }
  ]

  return (
    <section id="projects" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Nossos Projetos</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">Alguns dos projetos que desenvolvemos para clientes em diversos setores em Angola.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="border-2 border-orange-500 text-orange-500 font-semibold px-6 py-3 rounded-lg hover:bg-orange-500 hover:text-white transition duration-300">
            Ver Mais Projetos
          </button>
        </div>
      </div>
    </section>
  )
}
