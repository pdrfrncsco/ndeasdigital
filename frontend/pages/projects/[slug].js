import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function ProjectDetail() {
  const router = useRouter()
  const { slug } = router.query
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    const rawBase = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'
    const apiBase = rawBase.replace(/\/$/, '')
    fetch(`${apiBase}/api/projects/${slug}/`)
      .then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then((data) => {
        setProject(data.project)
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading)
    return (
      <>
        <Header />
        <section className="p-8 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
          </div>
          <div className="mt-4 text-gray-600">Carregando projecto...</div>
        </section>
        <Footer />
      </>
    )

  if (!project)
    return (
      <>
        <Header />
        <section className="p-8 text-center">
          <div className="text-xl font-semibold mb-3">Projecto não encontrado.</div>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="text-orange-500">Página inicial</Link>
            <Link href="/projects/todos" className="text-orange-500">Ver todos os projectos</Link>
          </div>
        </section>
        <Footer />
      </>
    )

  return (
    <>
      <Header />
      <section className="bg-white">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4 text-sm">
              <Link href="/projects/todos" className="text-orange-500">&larr; Todos os projectos</Link>
              <Link href="/" className="text-orange-500">Página inicial</Link>
            </div>
          </div>

          {project.img ? (
            <div className="w-full h-64 relative mb-6 rounded overflow-hidden">
              <Image src={project.img} alt={project.title} layout="fill" objectFit="cover" unoptimized />
            </div>
          ) : null}

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <div className="text-gray-600">{project.client_name && <span>Cliente: {project.client_name} • </span>} {project.category}</div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="prose max-w-none mb-6">
                <p>{project.description}</p>
              </div>

              {project.gallery && project.gallery.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Galeria</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {project.gallery.map((g, idx) => (
                      <div key={idx} className="w-full h-40 relative overflow-hidden rounded">
                        <Image src={g} alt={`${project.title} ${idx + 1}`} layout="fill" objectFit="cover" unoptimized />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <aside>
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                <div className="mb-4">
                  <div className="text-sm text-gray-500">Categoria</div>
                  <div className="font-semibold text-gray-800">{project.category}</div>
                </div>
                {project.client_name && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-500">Cliente</div>
                    <div className="font-semibold text-gray-800">{project.client_name}</div>
                  </div>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-500">Tecnologias / Tags</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.map((t) => (
                        <span key={t} className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {project.link && (
                  <div className="mt-2">
                    <a href={project.link} target="_blank" rel="noreferrer" className="inline-block border-2 border-orange-500 text-orange-500 font-semibold px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition">Visitar site</a>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
