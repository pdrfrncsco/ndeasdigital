import React, { useEffect, useState } from 'react'
import Link from 'next/link'

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
  const makeApiUrl = (p) => {
    const base = process.env.NEXT_PUBLIC_API_BASE
    const b = (base && base.replace(/\/$/, '')) || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : '')
    const sep = b ? (/(\/api)$/.test(b) ? '' : '/api') : ''
    return `${b}${sep}${p}`
  }
  const fallbackProjects = [
    {
      img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Loja Virtual ModaAngola',
      category: 'eCommerce',
      description: 'Plataforma de eCommerce completa para venda de moda angolana com integração Multicaixa Express.',
      tags: ['React', 'Node.js', 'MongoDB'],
      featured: true
    },
    {
      img: 'https://images.unsplash.com/photo-1581092921461-39b2f2c8a352?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Sistema Clínica Vida+',
      category: 'Saúde',
      description: 'Sistema de gestão para clínica médica com agendamento online, prontuário eletrônico e telemedicina.',
      tags: ['Django', 'PostgreSQL', 'React'],
      featured: true
    },
    {
      img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      title: 'Plataforma Educativa Eureka',
      category: 'Educação',
      description: 'Sistema de gestão escolar com portal para pais, alunos e professores com aulas online.',
      tags: ['Laravel', 'MySQL', 'Vue.js'],
      featured: true
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
      <section id="projects" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center py-12">
          <div className="inline-flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
          </div>
          <div className="mt-4 text-gray-600">Carregando projectos...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Nossos Projectos</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">Alguns dos projectos que desenvolvemos para clientes em diversos setores em Angola.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Link key={key} href={`/projects/${slug}`}>
                  {card}
                </Link>
              )
            }
            return (
              <div key={key}>
                {card}
              </div>
            )
            })
          })()}
        </div>

        <div className="text-center mt-12">
          <Link href="/projects/todos" className="inline-block border-2 border-orange-500 text-orange-500 font-semibold px-6 py-3 rounded-lg hover:bg-orange-500 hover:text-white transition duration-300">
            Ver Mais Projectos
          </Link>
        </div>
      </div>
    </section>
  )
}
