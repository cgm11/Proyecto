class UsuariosChat{
    constructor(){
        this.usuariosChat = [];
        this.usuarioCurso = "";
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

    usuarioCurso(id, nombre){
        this.usuarioCurso = nombre;
    }

    getusuarioCurso(id){
        return this.usuarioCurso
    }
}

module.exports = {
    UsuariosChat
}