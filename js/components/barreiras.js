import { novoElemento, deslocamentoMovimento } from './global.js'

function Barreira(inverso = true){
    this.elemento = novoElemento('div','barreira')

    const corpo = novoElemento('div','corpo')
    const borda = novoElemento('div','borda')

    this.elemento.appendChild(inverso ? corpo : borda)
    this.elemento.appendChild(inverso ? borda : corpo)

    this.setAltura = x => corpo.style.height = `${x}px`

    this.setAltura(200)
}

function ParDeBarreiras(altura, abertura, x){
    this.elemento = novoElemento('div','par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0]) 
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortAbertura()
    this.setX(x)
}



export function Barreiras(altura, largura, abertura, espacamento, x, notPonto, pontuacao) {
        this.pares = [
            new ParDeBarreiras(altura, abertura, x),
            new ParDeBarreiras(altura, abertura, x + espacamento),
            new ParDeBarreiras(altura, abertura, x + espacamento * 2),
            new ParDeBarreiras(altura, abertura, x + espacamento * 3),
        ]
    
        this.animar = () => {
            const deslocamento = deslocamentoMovimento(pontuacao(), true)
            this.pares.forEach(par => {
                par.setX(par.getX() - deslocamento)
    
                if(par.getX() < -par.getLargura()){
                    par.setX(par.getX() + largura + espacamento)
                    par.sortAbertura()
                }
    
                const meio = largura/2 - 130
                const cruzou = par.getX() + deslocamento >= meio
                 && par.getX() < meio
                if(cruzou) notPonto()
            })
        }
    }
