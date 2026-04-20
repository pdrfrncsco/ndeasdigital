import React, { useState } from 'react'
import { makeApiUrl } from '../lib/api'

export default function Contact() {
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: 'loading', message: 'Enviando...' })

    const form = e.target
    const formData = new FormData(form)
    const payload = {
      name: formData.get('contact-name') || '',
      email: formData.get('contact-email') || '',
      phone: formData.get('contact-phone') || '',
      subject: formData.get('contact-subject') || '',
      message: formData.get('contact-message') || '',
      newsletter: formData.get('contact-newsletter') === 'on'
    }

    try {
      const res = await fetch(makeApiUrl('/contact/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || 'Erro ao enviar a mensagem')
      }

      setStatus({ type: 'success', message: 'Mensagem enviada com sucesso! Entraremos em contacto brevemente.' })
      form.reset()
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Erro ao enviar a mensagem' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#f97316] font-bold tracking-wider uppercase text-sm mb-2 block">Estamos Aqui para Si</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Fale <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#ea580c]">Connosco</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tem dúvidas ou quer saber mais sobre nossos serviços? Entre em contacto através do formulário abaixo ou pelos nossos canais de atendimento.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Formulário */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-xl font-bold mb-8 text-gray-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ea580c] text-sm">
                <i className="fa-solid fa-paper-plane"></i>
              </span>
              Envie-nos uma Mensagem
            </h3>

            <form id="contact-form" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-bold text-gray-700 mb-2">
                    Nome Completo <span className="text-[#ea580c]">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="contact-name"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all duration-200 outline-none"
                    placeholder="João Silva"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-bold text-gray-700 mb-2">
                    E-mail <span className="text-[#ea580c]">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="contact-email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all duration-200 outline-none"
                    placeholder="joao@exemplo.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-bold text-gray-700 mb-2">
                    Telefone <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="contact-phone"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all duration-200 outline-none"
                    placeholder="+244 9XX XXX XXX"
                  />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-bold text-gray-700 mb-2">
                    Assunto <span className="text-[#ea580c]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="contact-subject"
                      name="contact-subject"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 appearance-none transition-all duration-200 outline-none font-medium"
                      defaultValue=""
                    >
                      <option value="" disabled>Seleccione um assunto</option>
                      <option value="orcamento">Solicitar Orçamento</option>
                      <option value="suporte">Suporte Técnico</option>
                      <option value="parceria">Parcerias</option>
                      <option value="emprego">Oportunidades de Emprego</option>
                      <option value="outro">Outro</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                      <i className="fa-solid fa-chevron-down text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="contact-message" className="block text-sm font-bold text-gray-700 mb-2">
                  Mensagem <span className="text-[#ea580c]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="contact-message"
                  rows="5"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all duration-200 outline-none resize-none"
                  placeholder="Descreva a sua necessidade ou dúvida..."
                ></textarea>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8">
                <div className="flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      type="checkbox"
                      id="contact-newsletter"
                      name="contact-newsletter"
                      className="peer sr-only"
                    />
                    <label
                      htmlFor="contact-newsletter"
                      className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center cursor-pointer peer-checked:bg-[#f97316] peer-checked:border-[#f97316] transition-colors bg-white"
                    >
                      <i className="fa-solid fa-check text-white text-xs opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all"></i>
                    </label>
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="contact-newsletter" className="font-medium text-gray-700 cursor-pointer">
                      Desejo receber informações por e-mail
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 bg-[#f97316] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#ea580c] transition-all duration-300 shadow-lg shadow-orange-500/30 hover:-translate-y-1 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i> Enviando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i> Enviar Mensagem
                  </>
                )}
              </button>

              {status.message && (
                <div className={`mt-6 p-4 rounded-lg text-sm font-medium flex items-start gap-3 ${status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-50 text-gray-600 border border-gray-100'}`}>
                  <i className={`fa-solid mt-0.5 ${status.type === 'error' ? 'fa-circle-exclamation' : status.type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}`}></i>
                  <span>{status.message}</span>
                </div>
              )}
            </form>
          </div>

          {/* Informações de Contacto */}
          <div className="space-y-8">
            {/* Card de Contactos */}
            <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl shadow-gray-900/20 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>

              <h3 className="text-xl font-bold mb-8 flex items-center gap-3 pb-4 border-b border-gray-800 relative z-10">
                <i className="fa-solid fa-address-book text-[#f97316]"></i> Nossos Contactos
              </h3>

              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-[#f97316] flex-shrink-0">
                    <i className="fa-solid fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Endereço</h4>
                    <p className="text-gray-400 text-sm">AO-LUA-VIA-KUID</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-[#f97316] flex-shrink-0">
                    <i className="fa-solid fa-phone-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Telefone</h4>
                    <p className="text-gray-400 text-sm">+244 945 149 978</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-[#f97316] flex-shrink-0">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">E-mail</h4>
                    <p className="text-gray-400 text-sm">geral@ndeas.cloud</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de Redes Sociais */}
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ea580c] text-sm">
                  <i className="fa-solid fa-share-nodes"></i>
                </span>
                Siga-nos nas Redes Sociais
              </h3>

              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#f97316] hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <i className="fab fa-facebook-f text-lg"></i>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#f97316] hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <i className="fab fa-linkedin-in text-lg"></i>
                </a>
                <a
                  href="https://github.com/pdrfrncsco/ndeasdigital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#f97316] hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <i className="fab fa-github text-lg"></i>
                </a>
              </div>

              <p className="mt-6 text-sm text-gray-500 leading-relaxed">
                Acompanhe as nossas novidades, dicas de tecnologia e projetos em destaque através das nossas redes sociais.
              </p>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f97316] flex items-center justify-center text-white flex-shrink-0">
                  <i className="fa-solid fa-lightbulb"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Resposta Rápida</h4>
                  <p className="text-sm text-gray-600">Normalmente respondemos em até 24 horas úteis. Para urgências, ligue diretamente para o nosso telefone.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}