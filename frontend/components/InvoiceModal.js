import React from 'react'

export default function InvoiceModal() {
  return (
    <div id="invoice-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Fatura Proforma</h3>
            <div>
              <button id="close-invoice-modal" className="text-gray-500 hover:text-gray-700 mr-4">
                <i className="fas fa-times"></i>
              </button>
              <button id="download-invoice-btn" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                <i className="fas fa-download mr-2"></i> Baixar PDF
              </button>
            </div>
          </div>

          <div id="invoice-preview" className="p-8 mb-6">
            <div className="flex justify-between mb-12">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">NDEAS DIGITAL - Soluções Digitais</h1>
                <p className="text-gray-600">Municipio do Sequele</p>
                <p className="text-gray-600">Icolo e Bengo, Angola</p>
                <p className="text-gray-600">NIF: 003210480UE036</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-orange-500 mb-2">FATURA PROFORMA</h2>
                <p className="text-gray-600">Nº: <span id="invoice-number">PF20230001</span></p>
                <p className="text-gray-600">Data: <span id="invoice-date">25/06/2023</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">Para</h3>
                <p id="client-name" className="font-medium text-gray-800">Cliente Exemplo</p>
                <p id="client-company" className="text-gray-600">Empresa Exemplo</p>
                <p id="client-email" className="text-gray-600">exemplo@email.com</p>
                <p id="client-phone" className="text-gray-600">+244 912 345 678</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">Detalhes do Projecto</h3>
                <p id="project-type" className="text-gray-600">Tipo: Site Institucional</p>
                <p id="project-platforms" className="text-gray-600">Plataformas: Web</p>
                <p id="project-features" className="text-gray-600">Recursos: Nenhum</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-1">Itens</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="py-2 px-4 border font-medium">Descrição</th>
                    <th className="py-2 px-4 border font-medium text-right">Valor</th>
                  </tr>
                </thead>
                <tbody id="invoice-items">
                  {/* items added dynamically */}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="py-2 px-4 border-t font-medium text-right">Subtotal:</td>
                    <td className="py-2 px-4 border-t text-right font-medium" id="invoice-subtotal">0 Kz</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-t text-right">IVA (14%):</td>
                    <td className="py-2 px-4 border-t text-right" id="invoice-iva">0 Kz</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-t font-bold text-right">Total:</td>
                    <td className="py-2 px-4 border-t text-right font-bold text-orange-500" id="invoice-total">0 Kz</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">Condições de Pagamento</h3>
              <p className="text-gray-600">50% no início do projeto e 50% na entrega.</p>
              <p className="text-gray-600">Pagamento por transferência bancária ou depósito.</p>
            </div>

            <div className="flex justify-between items-center pt-8 border-t">
              <div>
                <p className="text-gray-600 mb-1">Atenciosamente,</p>
                <p className="font-medium text-gray-800">Equipa NDEAS DIGITAL</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 mb-1">Contactos:</p>
                <p className="text-gray-600">financas@ndeias.cloud | +244 955 583 204</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button id="send-invoice-btn" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 mr-4">
              <i className="fas fa-paper-plane mr-2"></i> Enviar por E-mail
            </button>
            <button id="close-invoice-btn" className="border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-100">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
