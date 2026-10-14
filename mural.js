document.addEventListener("DOMContentLoaded", () => {
    const galeria = document.getElementById("galeriaMural");
    const modal = document.getElementById("modalDibujo");
    const btnCerrar = document.getElementById("btnCerrarModal");
    
    const imgModal = document.getElementById("modalImagen");
    const tituloModal = document.getElementById("modalTitulo");
    const autorModal = document.getElementById("modalAutor");
    const fechaModal = document.getElementById("modalFecha");
    const descripcionModal = document.getElementById("modalDescripcion");

    // Zoom
    let zoomLevel = 1;
    const btnZoomIn = document.getElementById("btnZoomIn");
    const btnZoomOut = document.getElementById("btnZoomOut");
    const btnZoomReset = document.getElementById("btnZoomReset");

    // 1. Cargar datos de dibujos
    fetch("dibujos/lista_dibujos.json")
        .then(res => res.json())
        .then(carpetas => {
            const promesas = carpetas.map(carpeta => 
                fetch(`dibujos/${carpeta}/info.json`)
                    .then(res => res.json())
                    .then(data => ({
                        ...data,
                        rutaImagen: `dibujos/${carpeta}/${data.archivo}`
                    }))
            );

            return Promise.all(promesas);
        })
        .then(dibujos => {
            // Ordenar de más nuevos a más viejos
            dibujos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

            // Renderizar tarjetas
            dibujos.forEach(dibujo => {
                const tarjeta = document.createElement("div");
                tarjeta.className = "tarjeta-dibujo";
                tarjeta.innerHTML = `
                    <img src="${dibujo.rutaImagen}" alt="${dibujo.titulo}">
                    <div class="info-previa">
                        <h3>${dibujo.titulo}</h3>
                        <p>Por: ${dibujo.autor}</p>
                    </div>
                `;

                // Evento al hacer clic para abrir modal
                tarjeta.addEventListener("click", () => abrirModal(dibujo));
                galeria.appendChild(tarjeta);
            });
        })
        .catch(err => {
            galeria.innerHTML = `<p style="color: #48cae4;">Aún no se han agregado dibujos o error al cargar.</p>`;
        });

    // 2. Control del Modal
    function abrirModal(dibujo) {
        imgModal.src = dibujo.rutaImagen;
        tituloModal.textContent = dibujo.titulo;
        autorModal.textContent = dibujo.autor;
        fechaModal.textContent = dibujo.fecha;
        descripcionModal.textContent = dibujo.descripcion;

        zoomLevel = 1;
        aplicarZoom();

        modal.style.display = "flex";
    }

    btnCerrar.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    // 3. Lógica del Zoom
    function aplicarZoom() {
        imgModal.style.transform = `scale(${zoomLevel})`;
    }

    btnZoomIn.addEventListener("click", () => {
        if (zoomLevel < 3) {
            zoomLevel += 0.25;
            aplicarZoom();
        }
    });

    btnZoomOut.addEventListener("click", () => {
        if (zoomLevel > 0.5) {
            zoomLevel -= 0.25;
            aplicarZoom();
        }
    });

    btnZoomReset.addEventListener("click", () => {
        zoomLevel = 1;
        aplicarZoom();
    });
});
