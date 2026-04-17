import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { apiFetch } from '../../lib/api'

export default function ProjectDetail() {
  const router = useRouter()
  const { slug } = router.query
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '' })

  useEffect(() => {
    if (!slug) return
    apiFetch(`/projects/${slug}/`)
      .then((data) => {
        setProject(data.project)
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox({ open: false, src: '', alt: '' })
    }
    if (lightbox.open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox.open])

  if (loading)
    return (
      <>
        <Header />
        <section className="pt-32 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-[#ea580c] rounded-full animate-spin"></div>
            </div>
            <div className="mt-6 text-gray-500 font-medium tracking-wide">A carregar detalhes do projecto...</div>
          </div>
        </section>
        <Footer />
      </>
    )

  if (!project)
    return (
      <>
        <Header />
        <section className="pt-32 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto">
            <div className="text-6xl text-gray-300 mb-6"><i className="fa-solid fa-triangle-exclamation"></i></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Projecto não encontrado</h1>
            <p className="text-gray-600 mb-8">Lamentamos, mas não conseguimos encontrar o projecto que procura. Pode ter sido removido ou o link está incorreto.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                Página inicial
              </Link>
              <Link href="/projects/todos" className="px-6 py-3 bg-[#ea580c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-colors shadow-lg shadow-orange-500/30">
                Ver todos os projectos
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </>
    )

  return (
    <>
      <Header />
      
      {/* Hero Section do Projeto */}
      <section className="pt-32 pb-12 bg-gray-900 text-white relative overflow-hidden">
        {project.img && (
          <div className="absolute inset-0 z-0">
            <Image src={project.img} alt={project.title} layout="fill" objectFit="cover" unoptimized className="opacity-20 blur-sm scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
          </div>
        )}
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-8">
            <Link href="/projects/todos" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
              <i className="fa-solid fa-arrow-left"></i> Voltar ao Portfólio
            </Link>
          </div>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#f97316] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {project.category}
              </span>
              {project.client_name && (
                <span className="text-white/70 text-sm flex items-center gap-2">
                  <i className="fa-solid fa-user-tie text-xs"></i> {project.client_name}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2">
              {project.img && (
                <div className="w-full h-[400px] md:h-[500px] relative mb-12 rounded-2xl overflow-hidden shadow-2xl shadow-gray-200">
                  <Image src={project.img} alt={project.title} layout="fill" objectFit="cover" unoptimized priority />
                </div>
              )}

              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <i className="fa-solid fa-align-left text-[#ea580c]"></i> Sobre o Projecto
                </h2>
                <div className="prose prose-lg prose-orange max-w-none text-gray-600 leading-relaxed">
                  {project.description.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>

              {project.gallery && project.gallery.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <i className="fa-solid fa-images text-[#ea580c]"></i> Galeria
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {project.gallery.map((g, idx) => (
                      <button
                        key={idx}
                        type="button"
                        aria-label="Ver imagem"
                        onClick={() => setLightbox({ open: true, src: g, alt: `${project.title} - Imagem ${idx + 1}` })}
                        className="group w-full h-64 relative overflow-hidden rounded-2xl shadow-sm cursor-zoom-in focus:outline-none focus:ring-4 focus:ring-[#f97316]/50 border border-gray-100 block"
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10 flex items-center justify-center">
                          <i className="fa-solid fa-magnifying-glass-plus text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md"></i>
                        </div>
                        <Image src={g} alt={`${project.title} ${idx + 1}`} layout="fill" objectFit="cover" unoptimized className="transition-transform duration-700 group-hover:scale-105" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar (Detalhes Técnicos) */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm sticky top-32">
                <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Detalhes do Projecto</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                      <i className="fa-solid fa-folder-open w-4"></i> Categoria
                    </div>
                    <div className="font-semibold text-gray-800 text-lg">{project.category}</div>
                  </div>
                  
                  {project.client_name && (
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                        <i className="fa-solid fa-user-tie w-4"></i> Cliente
                      </div>
                      <div className="font-semibold text-gray-800 text-lg">{project.client_name}</div>
                    </div>
                  )}
                  
                  {project.tags && project.tags.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-code w-4"></i> Tecnologias Utilizadas
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((t) => (
                          <span key={t} className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {project.link && (
                  <div className="mt-10 pt-6 border-t border-gray-100">
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="group flex items-center justify-center gap-3 w-full bg-[#ea580c] text-white font-bold px-6 py-4 rounded-xl hover:bg-[#c2410c] hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                    >
                      <i className="fa-solid fa-globe"></i>
                      Visitar Website
                      <i className="fa-solid fa-arrow-up-right-from-square text-xs opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                    </a>
                  </div>
                )}
              </div>
            </aside>
            
          </div>
        </div>
      </section>
      
      {/* Lightbox para Galeria */}
      {lightbox.open && (
        <div
          className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center z-[100] transition-opacity"
          onClick={(e) => { if (e.target === e.currentTarget) setLightbox({ open: false, src: '', alt: '' }) }}
        >
          <div className="relative w-full max-w-6xl mx-4 flex flex-col items-center">
            <button
              type="button"
              aria-label="Fechar galeria"
              onClick={() => setLightbox({ open: false, src: '', alt: '' })}
              className="absolute -top-16 right-0 text-white hover:text-[#f97316] transition-colors flex items-center gap-2 font-bold bg-white/10 px-4 py-2 rounded-full hover:bg-white/20"
            >
              Fechar <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <div className="relative w-full h-[80vh] flex items-center justify-center">
              <img src={lightbox.src} alt={lightbox.alt} className="max-h-full max-w-full object-contain rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}
