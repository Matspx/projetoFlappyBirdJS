function novoElemento(tag,style){
    const elem = document.createElement(tag)
    elem.className = style

    return elem
}

function Barreira(reverse = true){
    this.elemento = novoElemento('div','barreira')

    const corpo = novoElemento('div','corpo')
    const borda = novoElemento('div','borda')

    this.elemento.appendChild(reverse ? corpo : borda)
    this.elemento.appendChild(reverse ? borda : corpo)

    this.setAltura = x => {
        corpo.style.height = `${x}px`
    }

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

    this.setX(x)
    this.sortAbertura()
}

function Barreiras(altura, largura, abertura, espaco, notPonto, pontuacao){
    this.pares =  [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]


    this.animar = () => {
        let pontuacoes = [0,500,1000,1500]
        let deslocamentos = [3,4,5,6]
        let deslocamento 

        for(let i=0; i < pontuacoes.length; i++){
            if(pontuacao() >= pontuacoes[i]) deslocamento = deslocamentos[i]
        }

        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            if(par.getX() <= -par.getLargura()){
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortAbertura()
            }

            const meio = largura/2 - 130
            const cruzou = par.getX() + deslocamento >= meio 
                && par.getX() < meio
            if(cruzou) notPonto()
        })
    }

}

function Passaro(alturaJogo,pontuacao){
    let voando = false

    this.elemento = novoElemento('img','passaro')
    this.elemento.src = "imgs/passaro.png"

    const meio = alturaJogo/2

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`
    this.getAltura = () => this.elemento.clientHeight

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {

        let pontuacoes = [0,500,1000,1500]
        let movimentos = [[6,-4],[7,-5],[8,-6],[9,-7]]
        let movimento 

        for(let i=0; i < pontuacoes.length; i++){
            if(pontuacao() >= pontuacoes[i]) movimento = movimentos[i]
        }


        const newY = this.getY() + (voando ? movimento[0] : movimento[1])
        const alturaMax = alturaJogo - this.getAltura()
        if(newY <= 0){
            this.setY(0)
        } else if(newY >= alturaMax){
            this.setY(alturaMax)
        } else {
            this.setY(newY)
        }
        
    }

    this.setY(meio)
}

function Progresso(){
    this.elemento = novoElemento('span','progresso')

    this.pontuacao = () => this.elemento.innerHTML

    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }

    this.atualizarPontos(0)
}

function sobrepostas(elemA, elemB){
    const a = elemA.getBoundingClientRect()
    const b = elemB.getBoundingClientRect()

    const horizontal = a.width + a.left >= b.left
        && b.left + b.width >= a.left

    const vertical = a.height + a.top >= b.top
        && b.top + b.height >= a.top    

    return horizontal && vertical
}

function colidiu(passaro, barreiras){
    let colidiu = false
    barreiras.pares.forEach(par => {
        if(!colidiu){
            const superior = par.superior.elemento
            const inferior = par.inferior.elemento
    
            colidiu = sobrepostas(passaro.elemento, superior) || sobrepostas(passaro.elemento, inferior)
        }
    })
    
    return colidiu
}

function Perdeu(){
    this.elemento = novoElemento('div','perdeu')

    this.pontuacao = () => this.elemento.innerHTML

    this.atualizarPerdeu = () => {
        this.elemento.innerHTML = 'perdeu'
    }

    this.atualizarPerdeu()
}

function FlappyBird(){

    const areaJogo = document.querySelector('[wm-flappy]')
    let pontos = 0

    const altura = areaJogo.clientHeight
    const largura = areaJogo.clientWidth

    const progresso = new Progresso()
    const passaro = new Passaro(altura,() => progresso.pontuacao())
    const barreiras = new Barreiras(altura,largura,250,largura/3,() => {
        progresso.atualizarPontos(pontos += 100)
    }, () => progresso.pontuacao())

    areaJogo.appendChild(passaro.elemento)
    areaJogo.appendChild(progresso.elemento)
    barreiras.pares.forEach(par => areaJogo.appendChild(par.elemento))

    this.start = () => {
        const timer = setInterval(() => {
            barreiras.animar()
            passaro.animar()

            if(colidiu(passaro, barreiras)){
                clearInterval(timer)
                areaJogo.appendChild(new Perdeu().elemento)
                document.addEventListener('keydown', () => {
                    location.reload()
                })
            } 
        },20)
        
    }

}

new FlappyBird().start()




