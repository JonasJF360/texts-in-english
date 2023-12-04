document.querySelector('li#abrir-info').addEventListener('click', abrirInfo)

async function carregarSobre() {
    const response = await fetch('./assets/data/info.json')
    const dado = await response.json()
    return dado.sobre.map((element, index) => `
        <p>
            <b>${(index + 1).toString().padStart(2, '0')}.</b> ${element}
        </p>
    `).join('')
}

async function carregarObservacoes() {
    const response = await fetch('./assets/data/info.json')
    const dado = await response.json()
    return dado.observacoes.map(element => `<p>${element}</p>`).join('')
}

async function abrirInfo() {
    let conteudo = `
        <div class="texto-info">
            <div id="fechar-info">x</div>
            <h1>Sobre o Projeto</h2>
            <div class="bloco-info">
                ${await carregarSobre()}
                <h2>Observações finais</h2>
                ${await carregarObservacoes()}
            </div>
        </div>
    `
    const containerInfo = document.createElement('div')
    containerInfo.id = "container-info"
    containerInfo.innerHTML = conteudo

    document.querySelector("header").appendChild(containerInfo)
    document.querySelector('div#fechar-info').addEventListener('click', (e) => {
        e.preventDefault()
        document.querySelector('div#container-info').remove()
    })
}