
export function novoElemento(tag,style) {
        const elem = document.createElement(tag)
        elem.className = style
        return elem
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
    
export function colidiu(passaro, barreiras){
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
    
export function deslocamentoMovimento(pontuacao, a){
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
