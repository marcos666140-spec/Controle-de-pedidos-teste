const setores = [
"Bebidas",
"Frios",
"Mercearia",
"Confeitaria",
"Panificação"
]

let dados = JSON.parse(localStorage.getItem("pedidos_teste")) || {}

setores.forEach(setor=>{
if(!dados[setor]){
dados[setor]={}
}
})

function salvar(){
localStorage.setItem("pedidos_teste",JSON.stringify(dados))
}

function render(){

const container=document.getElementById("setores")

container.innerHTML=""

setores.forEach(setor=>{

const box=document.createElement("div")
box.className="setor"

const header=document.createElement("div")

const titulo=document.createElement("span")
titulo.innerText=setor

header.appendChild(titulo)

box.appendChild(header)

Object.keys(dados[setor])
.sort((a,b)=>a.localeCompare(b))
.forEach(produto=>{

const linha=document.createElement("div")
linha.className="produto"

const nome=document.createElement("span")
nome.innerText=produto

const input=document.createElement("input")
input.type="number"
input.value=dados[setor][produto] || ""

input.oninput=()=>{
dados[setor][produto]=input.value
salvar()
}

const botoes=document.createElement("div")

;[1,5,10].forEach(valor=>{

const b=document.createElement("button")
b.innerText=valor

b.onclick=()=>{

let atual=parseInt(input.value)||0

input.value=atual+valor

dados[setor][produto]=input.value

salvar()

}

botoes.appendChild(b)

})

linha.appendChild(nome)
linha.appendChild(input)
linha.appendChild(botoes)

box.appendChild(linha)

})

const add=document.createElement("button")

add.innerText="+ Produto"

add.onclick=()=>{

let nome=prompt("Nome do produto")

if(!nome) return

dados[setor][nome]=""

salvar()

render()

}

box.appendChild(add)

container.appendChild(box)

})

}

render()

window.onload = ()=>{

const exportar=document.getElementById("exportarBtn")
const importar=document.getElementById("importarBtn")
const arquivo=document.getElementById("importarArquivo")

exportar.onclick=()=>{

const backup=JSON.stringify(dados)

const blob=new Blob([backup],{type:"application/json"})

const url=URL.createObjectURL(blob)

const a=document.createElement("a")

a.href=url
a.download="produtos-backup.json"

a.click()

URL.revokeObjectURL(url)

}

importar.onclick=()=>{

arquivo.click()

}

arquivo.onchange=(e)=>{

const file=e.target.files[0]

if(!file) return

const reader=new FileReader()

reader.onload=(event)=>{

dados=JSON.parse(event.target.result)

salvar()

render()

alert("Produtos importados com sucesso")

}

reader.readAsText(file)

}

}
