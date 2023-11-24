import { novoElemento, deslocamentoMovimento } from './global.js'

export function Passaro(alturaJogo, pontuacao){
    let voando = false

    this.elemento = novoElemento('img','passaro')
    this.elemento.src = 'imgs/passaro.png'

    const meio = alturaJogo/2

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`
    this.getAltura = () => this.elemento.clientHeight

    window.onkeydown = e => {
        voando = true
        this.elemento.style.transform = "rotate(-30deg)"
    } 
    window.onkeyup = e => {
        voando = false
        this.elemento.style.transform = "rotate(0deg)"
    } 

    this.animar = () => {
        const alturaMax = alturaJogo - this.getAltura()

        const movimento = deslocamentoMovimento(pontuacao(),false)
        const newY = this.getY() + (voando ? movimento[0] : movimento[1])

        if(newY <= 0){
            this.setY(0)
        } else if(newY >= alturaMax) {
            this.setY(alturaMax)
        } else {
            this.setY(newY)
        }
    }

    this.setY(meio)
}