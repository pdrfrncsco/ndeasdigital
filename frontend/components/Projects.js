import React, { useEffect, useState } from 'react'
import Link from 'next/link'

function ProjectCard({ img, title, category, description, tags }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full transform hover:-translate-y-2">
      <div className="h-56 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <span className="text-white font-medium flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Ver detalhes <i className="fa-solid fa-arrow-right text-sm"></i>
          </span>
        </div>
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute top-4 right-4 z-20">
          <span className="bg-white/90 backdrop-blur-sm text-[#ea580c] font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#ea580c] transition-colors">{title}</h3>
        <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
          {tags.map((t) => (
            <span key={t} className="bg-gray-50 text-gray-600 border border-gray-200 text-[11px] font-semibold px-2.5 py-1 rounded-md">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const makeApiUrl = (p) => {
    const base = process.env.NEXT_PUBLIC_API_BASE
    const b = (base && base.replace(/\/$/, '')) || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : '')
    // Sempre incluir /api quando b está vazio (produção sem API_BASE definido)
    const sep = b ? (/(\/api)$/.test(b) ? '' : '/api') : '/api'
    return `${b}${sep}${p}`
  }
  const fallbackProjects = [
    {
      img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Loja Virtual ModaAngola',
      category: 'eCommerce',
      description: 'Plataforma de eCommerce completa para venda de moda angolana com integração Multicaixa Express.',
      tags: ['React', 'Node.js', 'MongoDB'],
      featured: true,
      slug: 'loja-virtual-modaangola'
    },
    {
      img: 'https://images.unsplash.com/photo-1581092921461-39b2f2c8a352?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Sistema Clínica Vida+',
      category: 'Saúde',
      description: 'Sistema de gestão para clínica médica com agendamento online, prontuário eletrônico e telemedicina.',
      tags: ['Django', 'PostgreSQL', 'React'],
      featured: true,
      slug: 'sistema-clinica-vida'
    },
    {
      img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Plataforma Educativa Eureka',
      category: 'Educação',
      description: 'Sistema de gestão escolar com portal para pais, alunos e professores com aulas online.',
      tags: ['Laravel', 'MySQL', 'Vue.js'],
      featured: true,
      slug: 'plataforma-educativa-eureka'
    }
  ]
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = makeApiUrl('/projects/')
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('fetch error')
        return r.json()
      })
      .then((data) => {
        if (data && data.projects && data.projects.length) {
          setProjects(data.projects)
        } else {
          setProjects(fallbackProjects)
        }
      })
      .catch(() => {
        setProjects(fallbackProjects)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section id="projects" className="py-24 bg-white relative">
        <div className="container mx-auto px-4 text-center py-12">
          <div className="inline-flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-[#ea580c] rounded-full animate-spin"></div>
          </div>
          <div className="mt-4 text-gray-500 font-medium tracking-wide">A carregar portfólio...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-24 bg-white relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#f97316] font-bold tracking-wider uppercase text-sm mb-2 block">Nosso Portfólio</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Casos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#ea580c]">Sucesso</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Conheça algumas das soluções digitais inovadoras que desenvolvemos para impulsionar os negócios dos nossos clientes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(() => {
            const all = projects.length ? projects : fallbackProjects
            const featured = all.filter((p) => p.featured).slice(0, 3)
            const list = featured.length ? featured : all.slice(0, 3)
            return list.map((p) => {
              const slug = p.slug
              const key = p.slug || p.title
              const card = <ProjectCard {...p} />
              
              if (slug) {
                return (
                  <Link key={key} href={`/projects/${slug}`} className="block h-full outline-none">
                    {card}
                  </Link>
                )
              }
              return (
                <div key={key} className="h-full">
                  {card}
                </div>
              )
            })
          })()}
        </div>

        <div className="text-center mt-16">
          <Link 
            href="/projects/todos" 
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold transition-all duration-300 hover:bg-[#ea580c] hover:shadow-lg hover:-translate-y-1"
          >
            Ver Portfólio Completo
            <i className="fa-solid fa-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i>
          </Link>
        </div>
      </div>
    </section>
  )
}
