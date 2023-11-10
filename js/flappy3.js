function novoElemento(tag,style) {
    const elem = document.createElement(tag)
    elem.className = style
    return elem
}

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

function Barreiras(altura, largura, abertura, espacamento, x, notPonto, pontuacao) {
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

function Passaro(alturaJogo, pontuacao){
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

function Progresso(){
    this.elemento = novoElemento('span','progresso')

    this.atualizarPonto = x => {
        this.elemento.innerHTML = x
    }

    this.getPonto = () => this.elemento.innerHTML

    this.atualizarPonto(0)
}

function Perdeu() {
    this.elemento = novoElemento('div','perdeu')
    this.elemento.innerHTML = 'PERDEU'

    return this.elemento
}

function sobrepostas(elemA, elemB){
    const a = elemA.getBoundingClientRect()
    const b = elemB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left

    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top

    return vertical && horizontal
}

function colidiu(passaro, barreiras){
    let colidiu = false
    
    barreiras.pares.forEach(par => {
        if(!colidiu){
            const superior = par.superior.elemento
            const inferior = par.inferior.elemento

            colidiu = sobrepostas(passaro.elemento,superior) || sobrepostas(passaro.elemento,inferior)
        }
    })
    
    return colidiu
}

function deslocamentoMovimento(pontuacao, a){
    const movimentos = [[6,-4],[7,-5],[8,-6]]
    const deslocamentos = [3,4,5,6]
    const pontuacoes = [0,500,1000]

    const b = a ? deslocamentos : movimentos
    let c = null
    
    for(let i=0; i<pontuacoes.length; i++){
        if(pontuacao >= pontuacoes[i]) c = b[i]
    }

    return c
}

function FlappyBird(){
    const areaJogo = document.querySelector('[wm-flappy]')
    let pontos = 0  

    const altura = areaJogo.clientHeight
    const largura = areaJogo.clientWidth

    const progresso = new Progresso()
    const passaro = new Passaro(altura,() => progresso.getPonto())
    const barreiras = new Barreiras(altura,largura,250,largura/3,largura,() => {
        progresso.atualizarPonto(pontos += 100)
    }, () => progresso.getPonto())

    barreiras.pares.forEach(par => areaJogo.appendChild(par.elemento))
    areaJogo.appendChild(passaro.elemento)
    areaJogo.appendChild(progresso.elemento)

    this.start = () => {
        const timer = setInterval(() => {
            barreiras.animar()
            passaro.animar()
            
            if(colidiu(passaro,barreiras)){
                clearInterval(timer)
                areaJogo.appendChild(new Perdeu())
                document.onkeydown = () => location.reload()
            }
        },20)
    }
}

new FlappyBird().start()








