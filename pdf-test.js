const { jsPDF } = require('jspdf')
const { XLSX } = require('xlsx')

const ProductsCategory = [
    '/eletrodomesticos/geladeiras-e-refrigeiradores/adega%initial',
    '/eletrodomesticos/geladeiras-e-refrigeiradores/geladeira%initial,Cor:Transparente,Voltagem:110V'
  ]

  let wb = XLSX.utils.book_new()
  
  console.log(wb)