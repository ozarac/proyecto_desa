document.getElementById('formMaterial').addEventListener('submit', async (event) => {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const cantidad = document.getElementById('cantidad').value;
    const precio = document.getElementById('precio').value;

    const response = await fetch('/materiales', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, descripcion, cantidad, precio })
    });

    const material = await response.json();
    console.log(material);
    // Actualizar la lista de materiales
});
