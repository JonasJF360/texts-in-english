(App = () => {

    let textoAtual = 1
    let expandirlista = '10%'
    
    function criarElemento(elemento) {
        return document.createElement(elemento)
    }
    
    const audio = document.querySelector('#audio')
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
        abrirFecharMenu()
        listarTextos()
    })

    function abrirFecharMenu() {
        let menu = document.querySelector('div.menu-conteudo')
        let estado = !menu.style.display ? 'none' : menu.style.display
        menu.style.display = estado == 'none' ? 'flex' : 'none'
    }

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
                        abrirFecharMenu()
                    })
                    elUl.appendChild(elLi)
                }
            })
    }

    document.querySelector('#anterior').addEventListener('click', (e) => {
        e.preventDefault()
        textoAtual -= 1
        if (textoAtual < 1) textoAtual = parseInt(JSON.parse(localStorage.getItem('AccessTextsInEnglish')).total)
        carregarTexto()
    })

    document.querySelector('#proximo').addEventListener('click', (e) => {
        e.preventDefault()
        textoAtual += 1
        if (textoAtual > parseInt(JSON.parse(localStorage.getItem('AccessTextsInEnglish')).total))
            textoAtual = 1
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

    document.getElementById("parar").addEventListener('click', e => {
        e.preventDefault()
        audio.pause()
        audio.currentTime = 0
    })

    function atualizarDadoLocal(atual, total) {
        const dadosSalvos = JSON.parse(localStorage.getItem('AccessTextsInEnglish'))
        dadosSalvos.atual = atual
        dadosSalvos.total = total

        const jsonData = JSON.stringify(dadosSalvos)
        localStorage.setItem('AccessTextsInEnglish', jsonData)
    }

    function carregarTexto() {
        fetch('./assets/data/texts.json')
            .then(response => response.json())
            .then(dado => {
                atualizarDadoLocal(textoAtual, dado.textos.length)

                const numTextoAtual = textoAtual.toString().padStart(2, '0')

                tituloIngles.innerText = `${numTextoAtual}. ${dado.textos[textoAtual - 1].titulo}`
                textoIngles.innerText = dado.textos[textoAtual - 1].historia
                tituloTraduzido.innerText = `${numTextoAtual}. ${dado.textos[textoAtual - 1].traducao.titulo}`
                textoTraduzido.innerText = dado.textos[textoAtual - 1].traducao.historia

                document.title = `Text ${numTextoAtual} - ${dado.textos[textoAtual - 1].titulo}`
            })

        audio.src = `./assets/audios/hs${textoAtual.toString().padStart(2, '0')}.ogg`
    }

    function criarBase() {
        const BaseDados = {
            total: 0,
            atual: 0
        }
        const jsonData = JSON.stringify(BaseDados)
        localStorage.setItem('AccessTextsInEnglish', jsonData)
    }

    function inicarAplicacao() {
        if (!localStorage.AccessTextsInEnglish) {
            criarBase()
        } else {
            textoAtual = parseInt(JSON.parse(localStorage.getItem('AccessTextsInEnglish')).atual)
        }
        carregarTexto()
    }

    inicarAplicacao()
})()