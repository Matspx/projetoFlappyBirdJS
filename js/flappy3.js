import {Barreiras} from './components/barreiras.js'
import {Passaro} from './components/passaro.js'
import {Progresso} from './components/progresso.js'
import {Perdeu} from './components/perdeu.js'
import { colidiu } from './components/global.js'


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








