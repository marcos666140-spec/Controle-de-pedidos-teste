const setores = [
"Bebidas",
"Frios",
"Mercearia",
"Confeitaria",
"Panificação"
]

let dados = JSON.parse(localStorage.getItem("pedidos")) || {}

/* MIGRAR SETOR ANTIGO AUTOMATICAMENTE */

if(dados["Bebidas / Frios / Mercearia"]){

if(!dados["Bebidas"]) dados["Bebidas"]={}
if(!dados["Frios"]) dados["Frios"]={}
if(!dados["Mercearia"]) dados["Mercearia"]={}

const lista = dados["Bebidas / Frios / Mercearia"]

for(let produto in lista){

const nome = produto.toLowerCase()

/* BEBIDAS */

if(
nome.includes("coca") ||
nome.includes("pepsi") ||
nome.includes("fanta") ||
nome.includes("guarana") ||
nome.includes("dolly") ||
nome.includes("tubaina") ||
nome.includes("refrigerante") ||
nome.includes("suco") ||
nome.includes("del valle") ||
nome.includes("maguary") ||
nome.includes("natural one") ||
nome.includes("agua") ||
nome.includes("água") ||
nome.includes("h2o") ||
nome.includes("gatorade") ||
nome.includes("powerade") ||
nome.includes("chá") ||
nome.includes("cha") ||
nome.includes("mate") ||
nome.includes("toddy") ||
nome.includes("nescau") ||
nome.includes("leite") ||
nome.includes("achocolatado")
){

dados["Bebidas"][produto] = lista[produto]

}

/* FRIOS */

else if(
nome.includes("presunto") ||
nome.includes("mussarela") ||
nome.includes("muçarela") ||
nome.includes("queijo") ||
nome.includes("mortadela") ||
nome.includes("calabresa") ||
nome.includes("peito de peru") ||
nome.includes("salame") ||
nome.includes("blanquet") ||
nome.includes("bacon") ||
nome.includes("salsicha") ||
nome.includes("linguiça") ||
nome.includes("linguica") ||
nome.includes("lombo")
){

dados["Frios"][produto] = lista[produto]

}

/* MERCEARIA */

else{

dados["Mercearia"][produto] = lista[produto]

}

}

/* remove setor antigo */

delete dados["Bebidas / Frios / Mercearia"]

localStorage.setItem("pedidos",JSON.stringify(dados))

}

/* garantir setores */

setores.forEach(setor=>{
if(!dados[setor]){
dados[setor]={}
}
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
finalizar.title="Finalizar setor"

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

for(let produto in dados[setor]){

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

/* limpar quantidade */

const limparItem=document.createElement("button")
limparItem.innerText="🧹"
limparItem.className="limparQtd"

limparItem.onclick=()=>{

input.value=""

dados[setor][produto]=""

salvar()

}

/* excluir produto */

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
