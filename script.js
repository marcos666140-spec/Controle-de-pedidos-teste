const setores = [
"Bebidas",
"Frios",
"Mercearia",
"Confeitaria",
"Panificação"
]

let dados = JSON.parse(localStorage.getItem("pedidos")) || {}

let expandidos = {}

setores.forEach(setor=>{
if(!dados[setor]){
dados[setor]={}
}
expandidos[setor]=false
})

function salvar(){
localStorage.setItem("pedidos",JSON.stringify(dados))
}

function render(){

const container=document.getElementById("setores")

container.innerHTML=""

setores.forEach(setor=>{

const box=document.createElement("div")
box.className="setor"

const header=document.createElement("div")
header.className="setorHeader"

const titulo=document.createElement("span")
titulo.innerText=setor

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

const finalizar=document.createElement("button")
finalizar.innerText="✅"

finalizar.onclick=()=>{

let texto=setor+"\n\n"

for(let produto in dados[setor]){

if(dados[setor][produto] > 0){

texto+=dados[setor][produto]+" "+produto+"\n"

}

}

if(texto.trim()===setor){
alert("Nenhum item nesse setor")
return
}

navigator.clipboard.writeText(texto).then(()=>{
alert("Pedido copiado:\n\n"+texto)
})

}

header.appendChild(titulo)
header.appendChild(limparSetor)
header.appendChild(finalizar)

box.appendChild(header)

let produtos = Object.keys(dados[setor])

let limite = expandidos[setor] ? produtos.length : 5

produtos.slice(0,limite).forEach(produto=>{

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

const botoes=document.createElement("div")
botoes.className="qtdBtns"

;[1,5,10].forEach(valor=>{

const b=document.createElement("button")
b.innerText="+"+valor

b.onclick=()=>{

let atual=parseInt(input.value)||0

input.value=atual+valor

dados[setor][produto]=input.value

salvar()

}

botoes.appendChild(b)

})

const limparItem=document.createElement("button")
limparItem.innerText="🧹"
limparItem.className="limparQtd"

limparItem.onclick=()=>{

input.value=""
dados[setor][produto]=""
salvar()

}

const excluirItem=document.createElement("button")
excluirItem.innerText="❌"
excluirItem.className="excluirProduto"

excluirItem.onclick=()=>{

if(confirm("Excluir produto?")){

delete dados[setor][produto]

salvar()
render()

}

}

linha.appendChild(nome)
linha.appendChild(input)
linha.appendChild(botoes)
linha.appendChild(limparItem)
linha.appendChild(excluirItem)

box.appendChild(linha)

})

if(produtos.length > 5){

const expandir=document.createElement("button")

expandir.className="expandir"

expandir.innerText = expandidos[setor] ? "⬆ Mostrar menos" : "⬇ Mostrar mais"

expandir.onclick=()=>{

expandidos[setor] = !expandidos[setor]

render()

}

box.appendChild(expandir)

}

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
