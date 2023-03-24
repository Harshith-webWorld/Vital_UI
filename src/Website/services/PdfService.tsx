import html2canvas from "html2canvas";
import jsPDF from "jspdf";
  export const  Exportpdf = (id:any,PdfName:any,oreintation:any,width:any,height:any) => {
    const input = document.getElementById(id);
    if (input) {
      html2canvas(input).then((canvas: any) => {
        var imgWidth: any = width;
        var pageHeight = height;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        const imgData = canvas.toDataURL("image/png");
        var doc = new jsPDF(oreintation, "mm");
        var position = 0;
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight + 15);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight + 15);
          heightLeft -= pageHeight;
        }
        doc.save(PdfName);
      });
    }
  };