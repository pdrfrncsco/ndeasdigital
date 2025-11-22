import React, { useState, useEffect } from 'react'

const envBase = process.env.NEXT_PUBLIC_API_BASE
const API_BASE = (envBase && envBase.replace(/\/$/, '')) || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : '')

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

      const res = await fetch(`${API_BASE ? API_BASE : ''}/api/budget/`, {
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

      const res = await fetch(`${API_BASE ? API_BASE : ''}/api/invoice/`, {
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
    <section id="simulator" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Simulador de Orçamento</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">Preencha os campos abaixo para simular o custo do seu projeto e receber uma fatura proforma por e-mail.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm">
            <form id="budget-form" onSubmit={handleCalculate}>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Informações Básicas</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo*</label>
                    <input type="text" id="name" name="name" required className="w-full px-4 py-2 rounded-lg input-field" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail*</label>
                    <input type="email" id="email" name="email" required className="w-full px-4 py-2 rounded-lg input-field" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone*</label>
                    <input type="tel" id="phone" name="phone" required className="w-full px-4 py-2 rounded-lg input-field" />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Empresa (opcional)</label>
                    <input type="text" id="company" name="company" className="w-full px-4 py-2 rounded-lg input-field" />
                  </div>
                </div>
              </div>

              {/* rest of inputs (radios, checkboxes, selects) remain non-controlled to keep markup simple */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Tipo de Sistema</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <input type="radio" id="system-institutional" name="system_type" value="institutional" className="radio-custom" defaultChecked />
                    <label htmlFor="system-institutional" className="ml-2 text-gray-700 cursor-pointer">Site Institucional</label>
                  </div>
                  <div>
                    <input type="radio" id="system-ecommerce" name="system_type" value="ecommerce" className="radio-custom" />
                    <label htmlFor="system-ecommerce" className="ml-2 text-gray-700 cursor-pointer">eCommerce</label>
                  </div>
                  <div>
                    <input type="radio" id="system-school" name="system_type" value="school" className="radio-custom" />
                    <label htmlFor="system-school" className="ml-2 text-gray-700 cursor-pointer">Sistema Escolar</label>
                  </div>
                  <div>
                    <input type="radio" id="system-clinic" name="system_type" value="clinic" className="radio-custom" />
                    <label htmlFor="system-clinic" className="ml-2 text-gray-700 cursor-pointer">Sistema Clínica</label>
                  </div>
                  <div>
                    <input type="radio" id="system-saas" name="system_type" value="saas" className="radio-custom" />
                    <label htmlFor="system-saas" className="ml-2 text-gray-700 cursor-pointer">SaaS</label>
                  </div>
                  <div>
                    <input type="radio" id="system-custom" name="system_type" value="custom" className="radio-custom" />
                    <label htmlFor="system-custom" className="ml-2 text-gray-700 cursor-pointer">Personalizado</label>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Plataformas</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <input type="checkbox" id="platform-web" name="platform_web" className="checkbox-custom" defaultChecked />
                    <label htmlFor="platform-web" className="ml-2 text-gray-700 cursor-pointer">Web</label>
                  </div>
                  <div>
                    <input type="checkbox" id="platform-android" name="platform_android" className="checkbox-custom" />
                    <label htmlFor="platform-android" className="ml-2 text-gray-700 cursor-pointer">Android</label>
                  </div>
                  <div>
                    <input type="checkbox" id="platform-ios" name="platform_ios" className="checkbox-custom" />
                    <label htmlFor="platform-ios" className="ml-2 text-gray-700 cursor-pointer">iOS</label>
                  </div>
                  <div>
                    <input type="checkbox" id="platform-all" name="platform_all" className="checkbox-custom" />
                    <label htmlFor="platform-all" className="ml-2 text-gray-700 cursor-pointer">Todas</label>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Recursos Adicionais</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <input type="checkbox" id="feature-sms" name="feature_sms" className="checkbox-custom" />
                    <label htmlFor="feature-sms" className="ml-2 text-gray-700 cursor-pointer">SMS (Notificações)</label>
                  </div>
                  <div>
                    <input type="checkbox" id="feature-push" name="feature_push" className="checkbox-custom" />
                    <label htmlFor="feature-push" className="ml-2 text-gray-700 cursor-pointer">Notificações Push</label>
                  </div>
                  <div>
                    <input type="checkbox" id="feature-payment" name="feature_payment" className="checkbox-custom" />
                    <label htmlFor="feature-payment" className="ml-2 text-gray-700 cursor-pointer">Pagamentos Online</label>
                  </div>
                  <div>
                    <input type="checkbox" id="feature-multilingual" name="feature_multilingual" className="checkbox-custom" />
                    <label htmlFor="feature-multilingual" className="ml-2 text-gray-700 cursor-pointer">Multi-idioma</label>
                  </div>
                  <div>
                    <input type="checkbox" id="feature-analytics" name="feature_analytics" className="checkbox-custom" />
                    <label htmlFor="feature-analytics" className="ml-2 text-gray-700 cursor-pointer">Analytics</label>
                  </div>
                  <div>
                    <input type="checkbox" id="feature-crm" name="feature_crm" className="checkbox-custom" />
                    <label htmlFor="feature-crm" className="ml-2 text-gray-700 cursor-pointer">CRM Integrado</label>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Serviços Adicionais</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">Domínio (.ao ou internacional)</label>
                    <select id="domain" name="domain" className="w-full px-4 py-2 rounded-lg input-field" defaultValue="none">
                      <option value="none">Não preciso de domínio</option>
                      <option value="ao">.ao (25.000 Kz/ano)</option>
                      <option value="com">.com (35.000 Kz/ano)</option>
                      <option value="org">.org (35.000 Kz/ano)</option>
                      <option value="net">.net (35.000 Kz/ano)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="hosting" className="block text-sm font-medium text-gray-700 mb-1">Hospedagem</label>
                    <select id="hosting" name="hosting" className="w-full px-4 py-2 rounded-lg input-field" defaultValue="none">
                      <option value="none">Já tenho hospedagem</option>
                      <option value="basic">Básica (50.000 Kz/ano)</option>
                      <option value="professional">Profissional (100.000 Kz/ano)</option>
                      <option value="premium">Premium (200.000 Kz/ano)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Suporte</h3>
                <div className="flex items-center">
                  <input type="checkbox" id="support" name="support" className="checkbox-custom" />
                  <label htmlFor="support" className="ml-2 text-gray-700 cursor-pointer">Incluir suporte por 6 meses (75.000 Kz)</label>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Observações</h3>
                <textarea id="notes" name="notes" rows="4" className="w-full px-4 py-2 rounded-lg input-field" placeholder="Descreva brevemente o seu projeto, necessidades específicas ou qualquer outra informação relevante..."></textarea>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-4 sm:mb-0">
                  <button type="submit" id="calculate-btn" className="bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition duration-300" disabled={loading}>{loading ? 'A calcular...' : 'Calcular Orçamento'}</button>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-gray-500 text-sm">* Campos obrigatórios</div>
                </div>
              </div>
            </form>
            {message && <div className="mt-4 text-sm text-red-600">{message}</div>}
          </div>

          <div className="md:col-span-1">
            <div className="bg-white p-8 rounded-xl shadow-sm sticky top-8">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Resumo do Orçamento</h3>

              {!result && (
                <div id="budget-summary" className="mb-8">
                  <div className="text-center py-10">
                    <i className="fas fa-calculator text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Preencha o formulário ao lado para calcular o orçamento do seu projeto.</p>
                  </div>
                </div>
              )}

              {result && (
                <div id="budget-results" className="mb-4">
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Desenvolvimento:</span>
                      <span className="font-medium">{result.development} Kz</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Domínio:</span>
                      <span className="font-medium">{result.domain} Kz</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Hospedagem:</span>
                      <span className="font-medium">{result.hosting} Kz</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Suporte:</span>
                      <span className="font-medium">{result.support} Kz</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Recursos extras:</span>
                      <span className="font-medium">{result.features} Kz</span>
                    </div>
                  </div>

                  <div className="border-t border-b border-gray-200 py-4 mb-6">
                    <div className="flex justify-between">
                      <span className="font-semibold">Subtotal:</span>
                      <span className="font-semibold">{result.subtotal} Kz</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>IVA (14%):</span>
                      <span>{result.iva} Kz</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-2xl font-bold text-orange-500">{result.total} Kz</span>
                  </div>

                  <div className="mb-6">
                    <button onClick={handleGenerateInvoice} id="generate-invoice-btn" className="w-full bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition duration-300 mb-3">Gerar Fatura Proforma</button>
                    <button id="send-request-btn" className="w-full border border-orange-500 text-orange-500 font-semibold px-6 py-3 rounded-lg hover:bg-orange-500 hover:text-white transition duration-300">Enviar Pedido</button>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>* Este orçamento tem validade de 15 dias.</p>
                    <p>* Valores sujeitos a confirmação após análise detalhada.</p>
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
