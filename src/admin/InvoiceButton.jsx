import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import React from 'react';

const InvoiceButton = ({ order }) => {
  const handleDownload = async () => {
    const invoiceId = `invoice-${order.id}`;
    const originalElement = document.getElementById(invoiceId);

    if (!originalElement) {
      alert("Invoice element not found.");
      return;
    }

    // 1. Clone the original invoice content
    const clone = originalElement.cloneNode(true);
    clone.style.display = 'block';
    clone.style.position = 'absolute';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.background = 'white';
    clone.style.zIndex = '-1';

    // 2. Create a container to append to body
    const tempContainer = document.createElement('div');
    tempContainer.id = 'temp-invoice-download';
    tempContainer.style.position = 'fixed';
    tempContainer.style.top = '0';
    tempContainer.style.left = '0';
    tempContainer.style.zIndex = '-9999';
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    try {
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${order.id}.pdf`);
    } catch (err) {
      console.error("Failed to generate invoice:", err);
      alert("Something went wrong while generating the invoice.");
    } finally {
      document.body.removeChild(tempContainer); // Clean up
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm"
    >
      Download Invoice
    </button>
  );
};

export default InvoiceButton;
