import './style.css'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url'

let pdfDoc = null,
    canvas = document.getElementById('pdf-canvas'),
    pageRendering = false,
    pageNumPending = null,
    pageNum = 1, 
    ctx = canvas.getContext('2d');

let contPage = 2;    
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

pdfjsLib.getDocument('./src/Bitacora3.pdf').promise.then(pdf => {
  pdfDoc = pdf;
  renderPage(pageNum);
});


function renderPage(num) {
  pageRendering = true;
  pdfDoc.getPage(num).then(function(page) {
    let container = document.getElementById('container');
    let containerWidth = container.clientWidth; 
    let viewport = page.getViewport({ scale: 0.8 });

  // Escala para que el ancho del PDF sea el del contenedor
  let scale = containerWidth / viewport.width;
  viewport = page.getViewport({ scale:scale });
    // Support HiDPI-screens.
    var outputScale = window.devicePixelRatio || 1;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    var renderContext = {
      canvasContext: ctx,
      //transform: transform,
      viewport: viewport
    };
    page.render(renderContext);
  });
}

function changePage(targetPage) {
  if (targetPage < 1 || targetPage > pdfDoc.numPages) return;

    canvas.style.transition = "transform 0s";
    const direction = targetPage > pageNum ? 1 : -1;
    canvas.style.transform = `translateX(${direction * 2}%)`;

    setTimeout(() => {
      pageNum = targetPage;
      renderPage(pageNum)
          canvas.style.transition = "transform 0.3s ease";
          canvas.style.transform = "translateX(0)";
    }, 10);
}


document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft'){
    changePage(pageNum-1);
  } else if (e.key === 'ArrowUp') {
    if (pageNum !== contPage) {
      changePage(contPage);
    }
  } else if (e.key === 'ArrowRight') {
    changePage(pageNum+1);
  }
})

//BOTONES

document.getElementById('next').addEventListener('click', () => {
  changePage(pageNum+1);
});

document.getElementById('cont').addEventListener('click', () => {
  if (pageNum !== contPage) {
    changePage(contPage);
  }
});

document.getElementById('prev').addEventListener('click', () => {
  changePage(pageNum-1);
});

window.addEventListener('resize', () => renderPage(pageNum));