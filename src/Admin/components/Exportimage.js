
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
const exportimage = () => {
    let graph = document.getElementById('graph');
    graph &&
        html2canvas(graph).then(function (canvas) {
            canvas.toBlob(function (blob) {
                saveAs(blob, 'Dashboard.png');
            });
        });
};
export default exportimage;