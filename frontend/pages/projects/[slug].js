import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

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

  if (loading) return <div className="p-8">Carregando...</div>
  if (!project) return <div className="p-8">Projecto não encontrado.</div>

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/" className="text-sm text-orange-500">&larr; Voltar</Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <div className="text-gray-600 mb-4">{project.client_name && <span>Cliente: {project.client_name} • </span>} {project.category}</div>

      {project.img ? (
        <div className="w-full h-64 relative mb-6 rounded overflow-hidden">
          {/* Use Image if URL is external; unoptimized for simplicity */}
          <Image src={project.img} alt={project.title} layout="fill" objectFit="cover" unoptimized />
        </div>
      ) : null}

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

      {project.tags && project.tags.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold">Tecnologias / Tags</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.map((t) => (
              <span key={t} className="bg-gray-100 text-gray-700 px-3 py-1 rounded">{t}</span>
            ))}
          </div>
        </div>
      )}

      {project.link && (
        <div className="mt-6">
          <a href={project.link} target="_blank" rel="noreferrer" className="text-orange-600 font-semibold">Visitar site</a>
        </div>
      )}
    </div>
  )
}
