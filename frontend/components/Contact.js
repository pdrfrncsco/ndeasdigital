import React, { useState } from 'react'

export default function Contact() {
  const [status, setStatus] = useState({ type: '', message: '' });
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Fale Connosco</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">Tem dúvidas ou quer saber mais sobre nossos serviços? Entre em contacto através do formulário abaixo ou pelos nossos canais de atendimento.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Envie-nos uma Mensagem</h3>
            <form id="contact-form" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const formData = new FormData(form);
                const payload = {
                  name: formData.get('contact-name') || '',
                  email: formData.get('contact-email') || '',
                  phone: formData.get('contact-phone') || '',
                  subject: formData.get('contact-subject') || '',
                  message: formData.get('contact-message') || '',
                  newsletter: formData.get('contact-newsletter') === 'on'
                };

                setStatus({ type: 'loading', message: 'Enviando...' });
                const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

                try {
                  const res = await fetch(`${API_BASE}/api/contact/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });

                  if (!res.ok) {
                    const err = await res.text();
                    throw new Error(err || 'Erro ao enviar a mensagem');
                  }

                  setStatus({ type: 'success', message: 'Mensagem enviada com sucesso. Obrigado!' });
                  form.reset();
                } catch (error) {
                  setStatus({ type: 'error', message: error.message || 'Erro ao enviar a mensagem' });
                }
              }}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo*</label>
                  <input type="text" id="contact-name" name="contact-name" required className="w-full px-4 py-2 rounded-lg input-field" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">E-mail*</label>
                  <input type="email" id="contact-email" name="contact-email" required className="w-full px-4 py-2 rounded-lg input-field" />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input type="tel" id="contact-phone" name="contact-phone" className="w-full px-4 py-2 rounded-lg input-field" />
              </div>

              <div className="mb-6">
                <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">Assunto*</label>
                <select id="contact-subject" name="contact-subject" required className="w-full px-4 py-2 rounded-lg input-field">
                  <option value="" disabled defaultValue>Selecione um assunto</option>
                  <option value="orcamento">Solicitar Orçamento</option>
                  <option value="suporte">Suporte Técnico</option>
                  <option value="parceria">Parcerias</option>
                  <option value="emprego">Oportunidades de Emprego</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem*</label>
                <textarea id="contact-message" name="contact-message" rows="5" required className="w-full px-4 py-2 rounded-lg input-field" placeholder="Descreva a sua necessidade ou dúvida..."></textarea>
              </div>

              <div className="flex items-center mb-6">
                <input type="checkbox" id="contact-newsletter" name="contact-newsletter" className="checkbox-custom" />
                <label htmlFor="contact-newsletter" className="ml-2 text-gray-700 cursor-pointer">Desejo receber novidades e promoções por e-mail</label>
              </div>

              <button type="submit" className="w-full bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition duration-300">Enviar Mensagem</button>
              <div className="mt-4" id="contact-status">
                {status.type === 'loading' && <p className="text-sm text-gray-600">{status.message}</p>}
                {status.type === 'success' && <p className="text-sm text-green-600">{status.message}</p>}
                {status.type === 'error' && <p className="text-sm text-red-600">{status.message}</p>}
              </div>
            </form>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Nossos Contactos</h3>

            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mr-4 mt-1"><i className="fas fa-map-marker-alt"></i></div>
                <div>
                  <h4 className="font-medium text-gray-800">Endereço</h4>
                  <p className="text-gray-600">Av. 21 de Janeiro, Edifício Exemplo, 3º Andar, Luanda, Angola</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mr-4 mt-1"><i className="fas fa-phone-alt"></i></div>
                <div>
                  <h4 className="font-medium text-gray-800">Telefone</h4>
                  <p className="text-gray-600">+244 923 456 789</p>
                  <p className="text-gray-600">+244 945 678 901</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mr-4 mt-1"><i className="fas fa-envelope"></i></div>
                <div>
                  <h4 className="font-medium text-gray-800">E-mail</h4>
                  <p className="text-gray-600">geral@ndeias.ao</p>
                  <p className="text-gray-600">suporte@ndeias.ao</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mr-4 mt-1"><i className="fas fa-clock"></i></div>
                <div>
                  <h4 className="font-medium text-gray-800">Horário de Funcionamento</h4>
                  <p className="text-gray-600">Segunda a Sexta: 8h00 - 18h00</p>
                  <p className="text-gray-600">Sábado: 9h00 - 13h00</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-6 text-gray-800">Siga-nos</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition duration-300"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition duration-300"><i className="fab fa-twitter"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition duration-300"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition duration-300"><i className="fab fa-instagram"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition duration-300"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
