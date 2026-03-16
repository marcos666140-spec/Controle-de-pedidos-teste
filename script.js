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
const busca=document.getElementById("campoBusca").value.toLowerCase()

container.innerHTML=""

setores.forEach(setor=>{

const box=document.createElement("div")
box.className="setor"

const header=document.createElement("div")
header.className="setorHeader"

const titulo=document.createElement("span")
titulo.innerText=setor

/* limpar setor */

const limparSetor=document.createElement("button")
limparSetor.innerText="🗑"
limparSetor.className="lixeira"

limparSetor.onclick=()=>{

for(let produto in dados[setor]){
dados[setor][produto]=""
}

salvar()
render()

}

/* finalizar setor */

const finalizar=document.createElement("button")
finalizar.innerText="✅"

finalizar.onclick=()=>{

let texto=setor+"\n\n"

for(let produto in dados[setor]){

if(dados[setor][produto] > 0){

texto+=produto+" - "+dados[setor][produto]+"\n"

}

}

if(texto.trim()===setor){

alert("Nenhum item nesse setor")

return

}

navigator.clipboard.writeText(texto)

alert("Pedido copiado:\n\n"+texto)

}

header.appendChild(titulo)
header.appendChild(limparSetor)
header.appendChild(finalizar)

box.appendChild(header)

/* produtos */

Object.keys(dados[setor])
.sort((a,b)=>a.localeCompare(b))
.forEach(produto=>{

if(busca && !produto.toLowerCase().includes(busca)) return

const linha=document.createElement("div")
linha.className="produto"

const nome=document.createElement("span")
nome.className="nomeProduto"
nome.innerText=produto

const input=document.createElement("input")
input.type="number"
input.value=dados[setor][produto] || ""

input.oninput=()=>{
dados[setor][produto]=input.value
salvar()
}

/* botões quantidade */

const botoes=document.createElement("div")
botoes.className="qtdBtns"

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

/* limpar item */

const limparItem=document.createElement("button")
limparItem.innerText="🧹"
limparItem.className="limparQtd"

limparItem.onclick=()=>{

input.value=""
dados[setor][produto]=""
salvar()

}

linha.appendChild(nome)
linha.appendChild(input)
linha.appendChild(botoes)
linha.appendChild(limparItem)

box.appendChild(linha)

})

/* adicionar produto */

const add=document.createElement("button")

add.innerText="+ Produto"
add.className="addProduto"

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

/* busca */

document.getElementById("btnBusca").onclick=()=>{

const campo=document.getElementById("campoBusca")

campo.style.display=campo.style.display==="block"?"none":"block"

campo.focus()

}

document.getElementById("campoBusca").oninput=render

/* backup */

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
