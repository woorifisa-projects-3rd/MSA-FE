export const pdfUtils = {
    downloadPDF(pdfData, fileName) {
        const pdfBlob = new Blob([new Uint8Array(pdfData)], {
            type: "application/pdf"
        });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl); // 메모리 누수 방지
    },

    generateFileName(year, month, type) {
        return `${year}년_${String(month).padStart(2, "0")}월_${type}.pdf`;
    }
};