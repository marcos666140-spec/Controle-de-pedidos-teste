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

/* produtos */

let produtos = Object.keys(dados[setor])

let limite = expandidos[setor] ? produtos.length : 5

produtos.slice(0,limite).forEach(produto=>{

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

/* botões quantidade */

const botoes=document.createElement("div")
botoes.className="qtdBtns"

;[1,2,5,10,20].forEach(valor=>{

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

/* limpar quantidade */

const limparItem=document.createElement("button")
limparItem.innerText="🧹"

limparItem.onclick=()=>{

input.value=""
dados[setor][produto]=""
salvar()

}

/* excluir produto */

const excluirItem=document.createElement("button")
excluirItem.innerText="❌"

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

/* botão expandir */

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
