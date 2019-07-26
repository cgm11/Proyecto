socket = io()

//socket.on('mensaje', (informacion) => {
//    console.log(informacion)
//})

//socket.emit('mensaje', 'Estoy conectado')

socket.emit('contador')

socket.on('contador', (contador) => {
    console.log(contador)
})

var param = new URLSearchParams(window.location.search);
var usuario = param.get('nombreUsuario')

socket.on('connect', () => {
    console.log(usuario)
    socket.emit('usuarioNuevo', usuario)
})

socket.on('nuevoUsuario', (texto) => {
    console.log(texto)
    chat.innerHTML = chat.innerHTML + texto +'\n'
})

const formulario = document.querySelector('#formulario')
const mensaje = formulario.querySelector('#texto')
const chat = document.querySelector('#chat')

document.querySelector('#formulario').addEventListener('submit', (datos) => {
    datos.preventDefault()
    const texto = datos.target.elements.texto.value
    const nombre = datos.target.elements.nombre.value
    socket.emit('texto', {
        nombre: nombre,
        mensaje: texto}, () => {
            
            mensaje.value = ''
            mensaje.focus()
        })
})

socket.on('texto', (text) => {
    chat.innerHTML = chat.innerHTML + text.nombre+ ': ' + text.mensaje + '\n'
})
