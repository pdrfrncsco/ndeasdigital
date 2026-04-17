import React, { useState, useEffect } from 'react'

const makeApiUrl = (p) => {
  const base = process.env.NEXT_PUBLIC_API_BASE
  const b = (base && base.replace(/\/$/, '')) || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : '')
  const sep = b ? (/(\/api)$/.test(b) ? '' : '/api') : ''
  return `${b}${sep}${p}`
}

export default function Simulator() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')

  // Gather checked inputs by id prefix from the given form to avoid relying on global document lookups
  const gatherCheckboxesFromForm = (form, prefix) => {
    if (!form) return []
    const nodes = form.querySelectorAll(`input[id^="${prefix}"]`)
    return Array.from(nodes).filter(n => n.checked).map(n => n.id.replace(new RegExp(`^${prefix}`), ''))
  }

  const handleCalculate = async (e) => {
    e && e.preventDefault()
    setMessage('')
    setLoading(true)
    try {
      const form = document.getElementById('budget-form')
      const formData = new FormData(form)
      const name = formData.get('name') || ''
      const email = formData.get('email') || ''
      const phone = formData.get('phone') || ''
      const system_type = formData.get('system_type') || formData.get('system-type') || 'institutional'

      const platforms = gatherCheckboxesFromForm(form, 'platform-')
      const features = gatherCheckboxesFromForm(form, 'feature-')

      const domainEl = form.querySelector('#domain')
      const hostingEl = form.querySelector('#hosting')
      const supportEl = form.querySelector('#support')
      const domain = domainEl ? domainEl.value : 'none'
      const hosting = hostingEl ? hostingEl.value : 'none'
      const support = supportEl ? supportEl.checked : false

      const payload = { name, email, phone, system_type, platforms, features, domain, hosting, support }

      const res = await fetch(makeApiUrl('/budget/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.text()
        setMessage('Erro ao calcular orçamento: ' + err)
        setResult(null)
      } else {
        const data = await res.json()
        setResult(data)
      }
    } catch (err) {
      setMessage('Erro: ' + err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateInvoice = async () => {
    if (!result) return
    try {
      const payload = {
        client: { name: document.getElementById('name')?.value || '', email: document.getElementById('email')?.value || '' },
        items: [
          { description: 'Desenvolvimento', value: result.development },
          { description: 'Recursos extras', value: result.features },
          { description: 'Hospedagem', value: result.hosting },
        ]
      }

      const res = await fetch(makeApiUrl('/invoice/'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Erro ao gerar fatura')
      const data = await res.json()
      setMessage('Fatura criada: ' + (data.invoice_id || '—'))
      // Optionally show modal — populate modal fields via DOM
      const modal = document.getElementById('invoice-modal')
      if (modal) {
        // Basic header fields
        const setText = (id, value) => {
          const el = document.getElementById(id)
          if (el) el.innerText = value
        }
        setText('invoice-number', data.invoice_id || '')
        setText('invoice-date', new Date().toLocaleDateString())

        // Client info
        const nameVal = document.getElementById('name')?.value || ''
        const emailVal = document.getElementById('email')?.value || ''
        const companyVal = document.getElementById('company')?.value || ''
        const phoneVal = document.getElementById('phone')?.value || ''
        setText('client-name', nameVal)
        setText('client-email', emailVal)
        setText('client-company', companyVal)
        setText('client-phone', phoneVal)

        // Project details
        const systemType = document.querySelector('input[name="system_type"]:checked')?.value || ''
        const platforms = Array.from(document.querySelectorAll('input[id^="platform-"]:checked')).map(n => n.id.replace(/^platform-/, ''))
        const features = Array.from(document.querySelectorAll('input[id^="feature-"]:checked')).map(n => n.id.replace(/^feature-/, ''))
        setText('project-type', `Tipo: ${systemType ? systemType.charAt(0).toUpperCase() + systemType.slice(1) : '—'}`)
        setText('project-platforms', `Plataformas: ${platforms.length ? platforms.join(', ') : 'Nenhuma'}`)
        setText('project-features', `Recursos: ${features.length ? features.join(', ') : 'Nenhum'}`)

        // Items table
        const itemsTbody = document.getElementById('invoice-items')
        if (itemsTbody) {
          itemsTbody.innerHTML = ''
          const pushRow = (desc, value) => {
            const tr = document.createElement('tr')
            tr.innerHTML = `<td class="py-2 px-4 border">${desc}</td><td class="py-2 px-4 border text-right">${value} Kz</td>`
            itemsTbody.appendChild(tr)
          }
          // Add development, features, hosting, domain, support if present
          pushRow('Desenvolvimento', result.development)
          if (result.platforms_cost && result.platforms_cost > 0) pushRow('Custos Plataformas', result.platforms_cost)
          if (result.features && result.features > 0) pushRow('Recursos extras', result.features)
          if (result.hosting && result.hosting > 0) pushRow('Hospedagem', result.hosting)
          if (result.domain && result.domain > 0) pushRow('Domínio', result.domain)
          if (result.support && result.support > 0) pushRow('Suporte', result.support)
        }

        // Totals
        setText('invoice-subtotal', `${result.subtotal} Kz`)
        setText('invoice-iva', `${result.iva} Kz`)
        setText('invoice-total', `${result.total} Kz`)

        // Show modal
        modal.classList.remove('hidden')

        // Wire close buttons (id may be close-invoice-modal and close-invoice-btn)
        const closeButtons = [document.getElementById('close-invoice-modal'), document.getElementById('close-invoice-btn')]
        closeButtons.forEach(btn => {
          if (btn) btn.onclick = () => modal.classList.add('hidden')
        })

        // Wire download and send buttons
        const downloadBtn = document.getElementById('download-invoice-btn')
        const sendBtn = document.getElementById('send-invoice-btn')

        const generatePdfBlob = async () => {
          const preview = document.getElementById('invoice-preview')
          if (!preview) throw new Error('Preview da fatura não encontrado')
          if (!window.html2canvas) throw new Error('html2canvas não carregado')
          if (!window.jspdf && !window.jsPDF && !(window.jspdf && window.jspdf.jsPDF)) throw new Error('jsPDF não carregado')

          const canvas = await window.html2canvas(preview, { scale: 2 })
          const imgData = canvas.toDataURL('image/png')
          const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF || window.jspdf)
          const pdf = new jsPDFClass('p', 'pt', 'a4')
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
          const blob = pdf.output('blob')
          return blob
        }

        if (downloadBtn) {
          downloadBtn.onclick = async () => {
            try {
              downloadBtn.disabled = true
              const blob = await generatePdfBlob()
              const invoiceNumber = document.getElementById('invoice-number')?.innerText || 'invoice'
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${invoiceNumber}.pdf`
              document.body.appendChild(a)
              a.click()
              a.remove()
              URL.revokeObjectURL(url)
            } catch (err) {
              console.error(err)
              setMessage('Erro ao gerar PDF: ' + err.message)
            } finally {
              downloadBtn.disabled = false
            }
          }
        }

        if (sendBtn) {
          sendBtn.onclick = async () => {
            try {
              sendBtn.disabled = true
              setMessage('Enviando fatura por e-mail...')
              const blob = await generatePdfBlob()
              const invoiceNumber = document.getElementById('invoice-number')?.innerText || 'invoice'
              const file = new File([blob], `${invoiceNumber}.pdf`, { type: 'application/pdf' })

              const client = { name: document.getElementById('client-name')?.innerText || document.getElementById('name')?.value || '', email: document.getElementById('client-email')?.innerText || document.getElementById('email')?.value || '' }
              const items = []
              // read rows from invoice-items
              const itemsTbodyLocal = document.getElementById('invoice-items')
              if (itemsTbodyLocal) {
                Array.from(itemsTbodyLocal.children).forEach(tr => {
                  const cols = tr.querySelectorAll('td')
                  if (cols.length >= 2) {
                    items.push({ description: cols[0].innerText, value: cols[1].innerText.replace(/\D/g, '') })
                  }
                })
              }

              const fd = new FormData()
              fd.append('pdf', file)
              fd.append('to_email', client.email)
              fd.append('client', JSON.stringify(client))
              fd.append('items', JSON.stringify(items))

              const res = await fetch(`${API_BASE}/api/invoice/`, { method: 'POST', body: fd })
              if (!res.ok) {
                const err = await res.text()
                throw new Error(err || 'Erro ao enviar fatura')
              }
              const data2 = await res.json()
              setMessage('Fatura enviada: ' + (data2.invoice_id || '') + (data2.email_sent ? ' (e-mail enviado)' : ' (e-mail não enviado)'))
            } catch (err) {
              console.error(err)
              setMessage('Erro ao enviar fatura: ' + (err.message || err))
            } finally {
              sendBtn.disabled = false
            }
          }
        }
      }
    } catch (err) {
      setMessage('Erro ao gerar fatura: ' + err.message)
    }
  }

  // Sync platform checkboxes: when "Todas" is checked, check web/android/ios; when
  // any individual is toggled, update the "Todas" checkbox accordingly.
  useEffect(() => {
    const form = document.getElementById('budget-form')
    if (!form) return

    const allCheckbox = form.querySelector('#platform-all')
    const web = form.querySelector('#platform-web')
    const android = form.querySelector('#platform-android')
    const ios = form.querySelector('#platform-ios')

    const setAll = (checked) => {
      if (web) web.checked = checked
      if (android) android.checked = checked
      if (ios) ios.checked = checked
    }

    const onAllChange = (e) => setAll(e.target.checked)
    const onIndividualChange = () => {
      if (!allCheckbox || !web || !android || !ios) return
      allCheckbox.checked = web.checked && android.checked && ios.checked
    }

    if (allCheckbox) allCheckbox.addEventListener('change', onAllChange)
    ;[web, android, ios].forEach(el => el && el.addEventListener('change', onIndividualChange))

    // Initialize state
    if (allCheckbox && web && android && ios) {
      allCheckbox.checked = web.checked && android.checked && ios.checked
    }

    return () => {
      if (allCheckbox) allCheckbox.removeEventListener('change', onAllChange)
      ;[web, android, ios].forEach(el => el && el.removeEventListener('change', onIndividualChange))
    }
  }, [])

  return (
    <section id="simulator" className="py-24 bg-gray-50 relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#f97316] font-bold tracking-wider uppercase text-sm mb-2 block">Seja Transparente</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Simulador de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#ea580c]">Orçamento</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Preencha os campos abaixo para simular instantaneamente o investimento necessário para o seu projeto e receba uma fatura proforma detalhada por e-mail.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Formulário (2 Colunas) */}
          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <form id="budget-form" onSubmit={handleCalculate}>
              
              {/* Informações Básicas */}
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ea580c] text-sm"><i className="fa-solid fa-user"></i></span>
                  Informações Básicas
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Nome Completo <span className="text-[#ea580c]">*</span></label>
                    <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all duration-200 outline-none" placeholder="João Silva" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">E-mail <span className="text-[#ea580c]">*</span></label>
                    <input type="email" id="email" name="email" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all duration-200 outline-none" placeholder="joao@exemplo.com" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">Telefone <span className="text-[#ea580c]">*</span></label>
                    <input type="tel" id="phone" name="phone" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all duration-200 outline-none" placeholder="+244 9XX XXX XXX" />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-bold text-gray-700 mb-2">Empresa <span className="text-gray-400 font-normal">(opcional)</span></label>
                    <input type="text" id="company" name="company" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all duration-200 outline-none" placeholder="Nome da Empresa" />
                  </div>
                </div>
              </div>

              {/* Tipo de Sistema */}
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ea580c] text-sm"><i className="fa-solid fa-laptop-code"></i></span>
                  Tipo de Sistema
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { id: 'institutional', label: 'Site Institucional', icon: 'fa-globe' },
                    { id: 'ecommerce', label: 'eCommerce', icon: 'fa-store' },
                    { id: 'school', label: 'Sistema Escolar', icon: 'fa-graduation-cap' },
                    { id: 'clinic', label: 'Sistema Clínica', icon: 'fa-notes-medical' },
                    { id: 'saas', label: 'SaaS', icon: 'fa-cloud' },
                    { id: 'custom', label: 'Personalizado', icon: 'fa-wand-magic-sparkles' }
                  ].map((sys, idx) => (
                    <div key={sys.id} className="relative">
                      <input type="radio" id={`system-${sys.id}`} name="system_type" value={sys.id} className="peer sr-only" defaultChecked={idx === 0} />
                      <label htmlFor={`system-${sys.id}`} className="flex flex-col items-center justify-center p-4 border-2 border-gray-100 rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-[#f97316] peer-checked:bg-orange-50 hover:bg-gray-50 group">
                        <i className={`fa-solid ${sys.icon} text-2xl mb-2 text-gray-400 group-hover:text-gray-600 peer-checked:text-[#ea580c] transition-colors`}></i>
                        <span className="text-sm font-semibold text-gray-700 peer-checked:text-gray-900 text-center">{sys.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plataformas */}
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ea580c] text-sm"><i className="fa-solid fa-mobile-screen-button"></i></span>
                  Plataformas
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'web', label: 'Web', icon: 'fa-desktop' },
                    { id: 'android', label: 'Android', icon: 'fa-android', isFab: true },
                    { id: 'ios', label: 'iOS', icon: 'fa-apple', isFab: true },
                    { id: 'all', label: 'Todas', icon: 'fa-layer-group' }
                  ].map((plat, idx) => (
                    <div key={plat.id} className="relative">
                      <input type="checkbox" id={`platform-${plat.id}`} name={`platform_${plat.id}`} className="peer sr-only" defaultChecked={idx === 0} />
                      <label htmlFor={`platform-${plat.id}`} className="flex items-center gap-3 p-4 border-2 border-gray-100 rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-[#f97316] peer-checked:bg-orange-50 hover:bg-gray-50 group">
                        <div className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center peer-checked:bg-[#f97316] peer-checked:border-[#f97316] transition-colors">
                          <i className="fa-solid fa-check text-white text-xs opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all"></i>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className={`${plat.isFab ? 'fab' : 'fa-solid'} ${plat.icon} text-gray-400 group-hover:text-gray-600 peer-checked:text-[#ea580c] transition-colors`}></i>
                          <span className="text-sm font-semibold text-gray-700 peer-checked:text-gray-900">{plat.label}</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recursos Adicionais */}
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ea580c] text-sm"><i className="fa-solid fa-puzzle-piece"></i></span>
                  Recursos Adicionais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 'sms', label: 'SMS (Notificações)' },
                    { id: 'push', label: 'Notificações Push' },
                    { id: 'payment', label: 'Pagamentos Online' },
                    { id: 'multilingual', label: 'Multi-idioma' },
                    { id: 'analytics', label: 'Analytics' },
                    { id: 'crm', label: 'CRM Integrado' }
                  ].map((feat) => (
                    <div key={feat.id} className="relative">
                      <input type="checkbox" id={`feature-${feat.id}`} name={`feature_${feat.id}`} className="peer sr-only" />
                      <label htmlFor={`feature-${feat.id}`} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 peer-checked:border-[#f97316] peer-checked:bg-orange-50 hover:bg-gray-50">
                        <div className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center peer-checked:bg-[#f97316] peer-checked:border-[#f97316] transition-colors">
                          <i className="fa-solid fa-check text-white text-xs opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all"></i>
                        </div>
                        <span className="text-sm font-medium text-gray-700 peer-checked:text-gray-900">{feat.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Serviços Adicionais & Suporte */}
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ea580c] text-sm"><i className="fa-solid fa-server"></i></span>
                  Infraestrutura & Suporte
                </h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="domain" className="block text-sm font-bold text-gray-700 mb-2">Domínio</label>
                    <div className="relative">
                      <select id="domain" name="domain" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 appearance-none transition-all duration-200 outline-none font-medium" defaultValue="none">
                        <option value="none">Não preciso de domínio</option>
                        <option value="ao">.ao (25.000 Kz/ano)</option>
                        <option value="com">.com (35.000 Kz/ano)</option>
                        <option value="org">.org (35.000 Kz/ano)</option>
                        <option value="net">.net (35.000 Kz/ano)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="hosting" className="block text-sm font-bold text-gray-700 mb-2">Hospedagem</label>
                    <div className="relative">
                      <select id="hosting" name="hosting" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 appearance-none transition-all duration-200 outline-none font-medium" defaultValue="none">
                        <option value="none">Já tenho hospedagem</option>
                        <option value="basic">Básica (50.000 Kz/ano)</option>
                        <option value="professional">Profissional (100.000 Kz/ano)</option>
                        <option value="premium">Premium (200.000 Kz/ano)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input type="checkbox" id="support" name="support" className="peer sr-only" />
                      <label htmlFor="support" className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center cursor-pointer peer-checked:bg-[#f97316] peer-checked:border-[#f97316] transition-colors bg-white">
                        <i className="fa-solid fa-check text-white text-xs opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all"></i>
                      </label>
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label htmlFor="support" className="font-bold text-gray-900 cursor-pointer">Incluir Suporte Técnico Especializado</label>
                      <p className="text-gray-500">6 meses de manutenção, correções e suporte prioritário (75.000 Kz).</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div className="mb-10">
                <label htmlFor="notes" className="block text-sm font-bold text-gray-700 mb-2">Observações <span className="text-gray-400 font-normal">(opcional)</span></label>
                <textarea id="notes" name="notes" rows="3" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all duration-200 outline-none resize-none" placeholder="Descreva brevemente o seu projeto, necessidades específicas ou qualquer outra informação relevante..."></textarea>
              </div>

              {/* Submit Area */}
              <div className="pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <i className="fa-solid fa-lock text-gray-400"></i> Seus dados estão seguros
                </div>
                <button 
                  type="submit" 
                  id="calculate-btn" 
                  className={`w-full sm:w-auto flex items-center justify-center gap-3 bg-[#f97316] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#ea580c] transition-all duration-300 shadow-lg shadow-orange-500/30 hover:-translate-y-1 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <><i className="fa-solid fa-circle-notch fa-spin"></i> A calcular...</>
                  ) : (
                    <><i className="fa-solid fa-calculator"></i> Calcular Orçamento</>
                  )}
                </button>
              </div>
              
              {message && (
                <div className={`mt-6 p-4 rounded-lg text-sm font-medium flex items-start gap-3 ${message.includes('Erro') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                  <i className={`fa-solid mt-0.5 ${message.includes('Erro') ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
                  <span>{message}</span>
                </div>
              )}
            </form>
          </div>

          {/* Sidebar / Resumo */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl shadow-gray-900/20 sticky top-32 overflow-hidden relative">
              {/* Background Decor Sidebar */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>
              
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 pb-4 border-b border-gray-800 relative z-10">
                <i className="fa-solid fa-receipt text-[#f97316]"></i> Resumo do Investimento
              </h3>

              {!result ? (
                <div id="budget-summary" className="text-center py-12 relative z-10">
                  <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <i className="fa-solid fa-file-invoice-dollar text-3xl text-gray-500"></i>
                  </div>
                  <h4 className="text-lg font-bold text-gray-300 mb-2">Nenhuma simulação</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Preencha o formulário ao lado e clique em calcular para ver o detalhamento dos custos do seu projeto.
                  </p>
                </div>
              ) : (
                <div id="budget-results" className="relative z-10 animate-[fadeIn_0.5s_ease-out]">
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center gap-2"><i className="fa-solid fa-code w-4"></i> Desenvolvimento</span>
                      <span className="font-bold text-white">{result.development} Kz</span>
                    </div>
                    {result.domain && result.domain !== '0' && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 flex items-center gap-2"><i className="fa-solid fa-globe w-4"></i> Domínio</span>
                        <span className="font-bold text-white">{result.domain} Kz</span>
                      </div>
                    )}
                    {result.hosting && result.hosting !== '0' && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 flex items-center gap-2"><i className="fa-solid fa-server w-4"></i> Hospedagem</span>
                        <span className="font-bold text-white">{result.hosting} Kz</span>
                      </div>
                    )}
                    {result.support && result.support !== '0' && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 flex items-center gap-2"><i className="fa-solid fa-headset w-4"></i> Suporte</span>
                        <span className="font-bold text-white">{result.support} Kz</span>
                      </div>
                    )}
                    {result.features && result.features !== '0' && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 flex items-center gap-2"><i className="fa-solid fa-puzzle-piece w-4"></i> Recursos extras</span>
                        <span className="font-bold text-white">{result.features} Kz</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-b border-gray-800 py-5 mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 font-medium">Subtotal</span>
                      <span className="font-bold">{result.subtotal} Kz</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">IVA (14%)</span>
                      <span className="text-gray-400">{result.iva} Kz</span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Investimento Total</div>
                    <div className="text-3xl font-extrabold text-[#f97316] break-words">{result.total} Kz</div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={handleGenerateInvoice} 
                      id="generate-invoice-btn" 
                      className="w-full flex items-center justify-center gap-2 bg-[#f97316] text-white font-bold px-4 py-3 rounded-xl hover:bg-[#ea580c] transition-colors"
                    >
                      <i className="fa-solid fa-file-pdf"></i> Gerar Fatura Proforma
                    </button>
                    <button 
                      id="send-request-btn" 
                      className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white font-bold px-4 py-3 rounded-xl hover:bg-gray-700 border border-gray-700 transition-colors"
                    >
                      <i className="fa-solid fa-paper-plane"></i> Enviar Pedido à Equipa
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-800 space-y-2">
                    <div className="flex items-start gap-2 text-xs text-gray-500">
                      <i className="fa-solid fa-clock mt-0.5"></i>
                      <span>Este orçamento tem validade de 15 dias úteis.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-500">
                      <i className="fa-solid fa-circle-info mt-0.5"></i>
                      <span>Valores sujeitos a confirmação após análise técnica detalhada.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
