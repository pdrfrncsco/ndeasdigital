import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

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
          {(tags || []).map((t) => (
            <span key={t} className="bg-gray-50 text-gray-600 border border-gray-200 text-[11px] font-semibold px-2.5 py-1 rounded-md">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TodosProjetos() {
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
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todos')
  const [selectedTags, setSelectedTags] = useState([])

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
      .catch(() => setProjects(fallbackProjects))
      .finally(() => setLoading(false))
  }, [])

  const allData = projects.length ? projects : fallbackProjects

  const categories = useMemo(() => {
    const set = new Set(allData.map((p) => p.category).filter(Boolean))
    return ['Todos', ...Array.from(set)]
  }, [allData])

  const allTags = useMemo(() => {
    const set = new Set()
    allData.forEach((p) => (p.tags || []).forEach((t) => set.add(t)))
    return Array.from(set)
  }, [allData])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return allData.filter((p) => {
      const matchesName = term ? (p.title || '').toLowerCase().includes(term) : true
      const matchesCategory = categoryFilter === 'Todos' ? true : p.category === categoryFilter
      const tags = p.tags || []
      const matchesTags = selectedTags.length === 0 ? true : selectedTags.some((t) => tags.includes(t))
      return matchesName && matchesCategory && matchesTags
    })
  }, [allData, search, categoryFilter, selectedTags])

  function toggleTag(tag) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  function clearFilters() {
    setSearch('')
    setCategoryFilter('Todos')
    setSelectedTags([])
  }

  return (
    <>
      <Header />
      <section className="pt-32 pb-20 bg-gray-50 relative min-h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#f97316] font-bold tracking-wider uppercase text-sm mb-2 block">Nosso Portfólio</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Todos os <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#ea580c]">Projectos</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Explore o nosso portfólio completo. Utilize os filtros abaixo para encontrar projetos por categoria, tecnologia ou nome.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 mb-12 border border-gray-100">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pesquisar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-search text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nome do projeto..."
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 focus:border-[#f97316] transition-all bg-gray-50/50"
                  />
                </div>
              </div>
              
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoria</label>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 focus:border-[#f97316] transition-all bg-gray-50/50"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tecnologias</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {allTags.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                        selectedTags.includes(t) 
                          ? 'bg-[#f97316] text-white border-[#f97316] shadow-md shadow-orange-500/20' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#f97316] hover:text-[#f97316]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Clear Filters */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span className="font-bold text-gray-900">{filtered.length}</span> projecto(s) encontrado(s)
              </div>
              {(search || categoryFilter !== 'Todos' || selectedTags.length > 0) && (
                <button 
                  onClick={clearFilters} 
                  className="text-sm text-gray-500 hover:text-[#ea580c] font-semibold flex items-center gap-2 transition-colors"
                >
                  <i className="fa-solid fa-xmark"></i> Limpar filtros
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-[#ea580c] rounded-full animate-spin"></div>
              </div>
              <div className="mt-4 text-gray-500 font-medium tracking-wide">A carregar projectos...</div>
            </div>
          ) : (
            <>
              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-6xl text-gray-300 mb-4"><i className="fa-solid fa-folder-open"></i></div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum projecto encontrado</h3>
                  <p className="text-gray-500">Tente ajustar os filtros para encontrar o que procura.</p>
                  <button onClick={clearFilters} className="mt-6 px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filtered.map((p) => {
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
                    return <div key={key} className="h-full">{card}</div>
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}