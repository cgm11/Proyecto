socket = io()

var param = new URLSearchParams(window.location.search);
var usuario = param.get('nombreUsuario')

socket.on('connect', () => {
    if(usuario == null){

    }else{        
        console.log(usuario)
        socket.emit('usuarioNuevo', usuario)
    }
})

if(usuario != null){

    socket.on('nuevoUsuario', (texto) => {
        console.log(texto)
        chat.innerHTML = chat.innerHTML + texto +'\n'        
    })
    
    socket.on('usuarioDesconectado', (texto) => {
        console.log(texto)
        chat.innerHTML = chat.innerHTML + texto +'\n'
    })

    const formulario = document.querySelector('#formulario')
    const mensaje = formulario.querySelector('#texto')
    const chat = document.querySelector('#chat')

    document.querySelector('#formulario').addEventListener('submit', (datos) => {
    datos.preventDefault()
    socket.emit('texto', mensaje.value, () => {            
            mensaje.value = ''
            mensaje.focus()
        })
    })

    socket.on('texto', (text) => {
        chat.innerHTML = chat.innerHTML + text + '\n'
    })
}

if(usuario == null){
    const nuevoCurso = document.querySelector('#nuevoCurso')
    const nombreCurso = nuevoCurso.querySelector('#nombreCurso')

    document.querySelector('#nuevoCurso').addEventListener('submit', (datos) => {
        datos.preventDefault()
        console.log('LLEGO A SOCKET CUANDO SE CREO NUEVO CURSO')    
        socket.emit('newCurso', nombreCurso.value)
    })
    
    socket.on('newCurso', (nombreCurso) => {
        console.log('LLEGO A SOCKET CUANDO SE CREO NUEVO CURSO xxxxxxx')
    })
}
