import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import React from 'react';

const InvoiceButton = ({ order }) => {
  const handleDownload = async () => {
    const element = document.getElementById(`invoice-${order.id}`);
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save(`invoice_${order.id}.pdf`);
  };

  return (
    <button onClick={handleDownload} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm">
      Download Invoice
    </button>
  );
};

export default InvoiceButton;