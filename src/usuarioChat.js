class UsuariosChat{
    constructor(){
        this.usuariosChat = [];
    }

    agregarUsuario(id, nombre){
        let usuario = {id, nombre}
        this.usuariosChat.push(usuario)
        return this.usuariosChat
    }

    getUsuarios (){
        return this.usuariosChat
    }

    getUsuario(id){
        let usuario = this.usuariosChat.filter(user => user.id == id)[0]
        return usuario
    }

    borrarUsuario(id){
        let usuarioBorrado = this.getUsuario(id)
        this.usuariosChat = this.usuariosChat.filter(user => user.id != id)
        return usuarioBorrado
    }

    getDestinatario(nombre){
        let destinatario = this.usuariosChat.filter(user => user.nombre == nombre)[0]
        return destinatario
    }
}

module.exports = {
    UsuariosChat
}