import { novoElemento } from './global.js'

export function Progresso(){
    this.elemento = novoElemento('span','progresso')

    this.atualizarPonto = x => {
        this.elemento.innerHTML = x
    }

    this.getPonto = () => this.elemento.innerHTML

    this.atualizarPonto(0)
}