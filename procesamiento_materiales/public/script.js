// Función para enviar los datos del formulario al servidor
async function enviarFormulario(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/materiales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            cargarMateriales(); // Recargar la lista de materiales
        } else {
            console.error('Error al agregar material');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Agregar event listener al formulario
document.getElementById('formMaterial').addEventListener('submit', enviarFormulario);


// Función para cargar y mostrar los materiales
async function cargarMateriales() {
    try {
        const respuesta = await fetch('/api/materiales');
        const materiales = await respuesta.json();

        const listaMateriales = document.getElementById('listaMateriales');
        listaMateriales.innerHTML = '';

        if (materiales.length === 0) {
            document.getElementById('listaMateriales').innerHTML = '<p>No hay materiales disponibles.</p>';
        } else {
            materiales.forEach(material => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <h3>${material.nombre}</h3>
                    <p>Descripción: ${material.descripcion}</p>
                    <p>Cantidad en Inventario: ${material.cantidadInventario}</p>
                    <p>Precio: ${material.precio}</p>
                `;
                listaMateriales.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Error al cargar materiales:', error);
    }
}

// Cargar materiales al cargar la página
document.addEventListener('DOMContentLoaded', cargarMateriales);

