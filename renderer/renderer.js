const api = window.widgetAPI;
let focusMinutes = 25
let breakMinutes = 5
let time = 1
let currentMin = focusMinutes - 1
let currentSec = 59
let modo = "focus"
let abortProcess = false
let pausado = false

const btnClose = document.getElementById('btn-close')
const btnMin = document.getElementById('btn-min')
const btnMax = document.getElementById('btn-max')
const btnStart = document.getElementById('btn-start')
const btnCancel = document.getElementById('btn-cancel')
const btnStop = document.getElementById('btn-stop')
const foco = document.getElementById('foco')
const timer = document.getElementById('timer')
const alertaBateria = document.getElementById('alerta-bateria')
const msg = document.getElementById('mensagem')
const minutes = document.getElementById('minutes')
const times = document.getElementById('times')
const theme = document.getElementById('theme')

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

function atualizarTimer(){
    const s = currentSec < 10 ? `0${currentSec}` : currentSec
    timer.innerText = `${currentMin}:${s}`
}

function resetarTimer(){
    currentMin = focusMinutes - 1
    currentSec = 59
    modo = "focus"
}

function resetarInterface(){

    abortProcess = true
    pausado = false

    btnStart.disabled = false
    btnCancel.disabled = true
    btnStop.disabled = true

    btnStart.innerText = "Iniciar Sessão de Foco"

    timer.classList.remove('running')

    foco.innerText = ""
    msg.innerText = ""

    resetarTimer()

    timer.innerText = `${focusMinutes}:00`
}

async function runTimer(){

    while(currentMin >= 0){

        while(currentSec >= 0){

            atualizarTimer()

            await sleep(1000)

            if(abortProcess){
                pausado = true
                return false
            }

            currentSec--
        }

        currentSec = 59
        currentMin--
    }

    return true
}

btnClose.addEventListener('click', () => {
    api.pararSessao()
    api.fechar()
})

btnMin.addEventListener('click', () => api.minimizar())
btnMax.addEventListener('click', () => api.maximizar())

theme.addEventListener("change", (event) => {
    document.body.className = event.target.value
})

times.addEventListener("change", (event) => {
   time = parseInt(event.target.value) || 1
})

minutes.addEventListener("change", (event) => {

    const values = event.target.value.split(":")

    focusMinutes = parseInt(values[0])
    breakMinutes = parseInt(values[1])

    resetarTimer()

    timer.innerHTML = `${focusMinutes}:00`
})

btnStart.addEventListener('click', async () => {

    const sucesso = await api.iniciarSessao()
    if(!sucesso) return

    abortProcess = false
    pausado = false

    btnStart.disabled = true
    btnCancel.disabled = false
    btnStop.disabled = false

    timer.classList.add('running')

    for(let ciclo = 0; ciclo < time; ciclo++){

        if(modo === "focus"){

            foco.innerText = "Foco ativo"
            msg.innerText = "Foco iniciado!"

            const ok = await runTimer()
            if(!ok) return

            modo = "break"
            currentMin = breakMinutes - 1
            currentSec = 59
        }

        if(modo === "break"){

            foco.innerText = "Descanso"
            msg.innerText = "Descanso iniciado!"

            const ok = await runTimer()
            if(!ok) return

            modo = "focus"
            currentMin = focusMinutes - 1
            currentSec = 59
        }
    }

    msg.innerText = "Processo completo!"
    foco.innerText = "Finalizado"

    btnStart.disabled = false
    btnStop.disabled = true
})

btnStop.addEventListener('click', async () => {

    const sucesso = await api.pararSessao()
    if(!sucesso) return

    abortProcess = true

    btnStart.disabled = false
    btnStop.disabled = true

    timer.classList.remove('running')

    foco.innerText = "Foco pausado"
    btnStart.innerText = "Continuar Sessão de Foco"
})

btnCancel.addEventListener('click', async () => {

    abortProcess = true

    try{
        await api.pararSessao()
    }catch(e){}

    resetarInterface()
})

api.onMudancaEnergia((event, modo) => {

    if(modo === 'bateria'){
        alertaBateria.innerText = "Modo Economia Ativado"
        alertaBateria.style.display = 'block'
    }
    else{
        alertaBateria.style.display = 'none'
    }

})
