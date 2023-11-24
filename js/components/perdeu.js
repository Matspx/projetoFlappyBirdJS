import { novoElemento } from './global.js'


export function Perdeu() {
    this.elemento = novoElemento('div','perdeu')
    this.elemento.innerHTML = 'PERDEU'

    return this.elemento
}