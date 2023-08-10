(App = () => {

    const audio = document.querySelector('#audio')
    let textoAtual = 1
    let expandirlista = '10%'

    const tituloIngles = document.querySelector('h1#titulo')
    const textoIngles = document.querySelector('#texto > p')
    const tituloTraduzido = document.querySelector('h2#titulo')
    const textoTraduzido = document.querySelector('#traducao > p')

    // Evento que muda o que está amarecendo no menu
    document.querySelector('div#expandir').addEventListener('click', (e) => {
        e.preventDefault()
        let info = document.querySelector('div#info')
        let listaHistorias = document.querySelector('div#lista-historias')

        let corInfo = getComputedStyle(info).getPropertyValue('background-color')
        let corListaHistorias = getComputedStyle(listaHistorias).getPropertyValue('background-color')
        info.style.backgroundColor = corListaHistorias
        listaHistorias.style.backgroundColor = corInfo

        listaHistorias.style.width = expandirlista
        expandirlista = expandirlista == '10%' ? '90%' : '10%'
        info.style.width = expandirlista

        let estadoInfo = document.querySelector('div#conteudo-info')
        let estado = !estadoInfo.style.display ? 'none' : estadoInfo.style.display
        let estadoConteutoHistoria = document.querySelector('div#conteuto-historia')

        estadoInfo.style.display = estado == 'none' ? 'block' : 'none'
        estadoConteutoHistoria.style.display = estadoInfo.style.display == 'none' ? 'block' : 'none'
    })

    document.querySelector('li#todos').addEventListener('click', (e) => {
        e.preventDefault()
        let menu = document.querySelector('div.acao-menu')
        let estado = !menu.style.display ? 'none' : menu.style.display
        menu.style.display = estado == 'none' ? 'flex' : 'none'

        listarTextos()
    })

    function listarTextos() {
        let elUl = criarElemento('ul')
        elUl.id = 'titulo-historias'

        let container = document.querySelector('div#conteuto-historia')
        container.innerHTML = ""
        container.appendChild(elUl)
        fetch('./assets/data/texts.json')
            .then(response => response.json())
            .then(dado => {
                for (let i = 0; i < dado.textos.length; i++) {
                    let elLi = criarElemento('li')
                    elLi.innerText = `${(i + 1).toString().padStart(2, '0')} - ` + dado.textos[i].titulo
                    elLi.addEventListener('click', () => {
                        textoAtual = i + 1
                        carregarTexto()
                    })
                    elUl.appendChild(elLi)
                }
            })
    }

    function criarElemento(elemento) {
        return document.createElement(elemento)
    }

    document.querySelector('#anterior').addEventListener('click', (e) => {
        e.preventDefault()
        textoAtual -= 1
        carregarTexto()
    })

    document.querySelector('#proximo').addEventListener('click', (e) => {
        e.preventDefault()
        textoAtual += 1
        carregarTexto()
    })

    const reproduzir = () => audio.play()

    document.getElementById("reproduzir").addEventListener('click', e => {
        e.preventDefault()
        reproduzir()
    })

    document.getElementById("pausar").addEventListener('click', e => {
        e.preventDefault()
        audio.pause()
    })

    document.getElementById("diminuir").addEventListener('click', e => {
        e.preventDefault()
        audio.volume -= 0.1
    })

    document.getElementById("aumentar").addEventListener('click', e => {
        e.preventDefault()
        audio.volume += 0.1
    })

    function carregarTexto() {
        fetch('./assets/data/texts.json')
            .then(response => response.json())
            .then(dado => {
                if (textoAtual < 1) textoAtual = dado.textos.length
                if (textoAtual > dado.textos.length) textoAtual = 1

                tituloIngles.innerText = dado.textos[textoAtual - 1].titulo
                textoIngles.innerText = dado.textos[textoAtual - 1].historia
                tituloTraduzido.innerText = dado.textos[textoAtual - 1].traducao.titulo
                textoTraduzido.innerText = dado.textos[textoAtual - 1].traducao.historia
            })
        textoAtual < 10 ?
            audio.src = `./assets/audios/hs0${textoAtual}.ogg` :
            audio.src = `./assets/audios/hs${textoAtual}.ogg`;
    }

    function inicarAplicacao() {
        carregarTexto()
    }

    inicarAplicacao()
})()