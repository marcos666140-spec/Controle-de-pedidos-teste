const setores = [
"Bebidas",
"Frios",
"Mercearia",
"Confeitaria",
"Panificação"
]

let dados = JSON.parse(localStorage.getItem("pedidos_teste")) || {}

/* MIGRAR SETOR ANTIGO */

if(dados["Bebidas / Frios / Mercearia"]){

if(!dados["Bebidas"]) dados["Bebidas"]={}
if(!dados["Frios"]) dados["Frios"]={}
if(!dados["Mercearia"]) dados["Mercearia"]={}

const lista = dados["Bebidas / Frios / Mercearia"]

for(let produto in lista){

const nome = produto.toLowerCase()

if(
nome.includes("coca") ||
nome.includes("pepsi") ||
nome.includes("fanta") ||
nome.includes("guarana") ||
nome.includes("refrigerante") ||
nome.includes("suco") ||
nome.includes("del valle") ||
nome.includes("agua") ||
nome.includes("água")
){
dados["Bebidas"][produto] = lista[produto]
}

else if(
nome.includes("presunto") ||
nome.includes("mussarela") ||
nome.includes("muçarela") ||
nome.includes("queijo") ||
nome.includes("mortadela") ||
nome.includes("calabresa")
){
dados["Frios"][produto] = lista[produto]
}

else{
dados["Mercearia"][produto] = lista[produto]
}

}

delete dados["Bebidas / Frios / Mercearia"]

localStorage.setItem("pedidos_teste",JSON.stringify(dados))

}

/* garantir setores */

setores.forEach(setor=>{
if(!dados[setor]){
dados[setor]={}
}
})

function salvar(){
localStorage.setItem("pedidos_teste",JSON.stringify(dados))
}

/* RENDER */

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

const limpar=document.createElement("button")
limpar.innerText="🧹"

limpar.onclick=()=>{
input.value=""
dados[setor][produto]=""
salvar()
}

/* excluir */

const excluir=document.createElement("button")
excluir.innerText="❌"

excluir.onclick=()=>{

if(confirm("Excluir produto?")){

delete dados[setor][produto]

salvar()
render()

}

}

linha.appendChild(nome)
linha.appendChild(input)
linha.appendChild(botoes)
linha.appendChild(limpar)
linha.appendChild(excluir)

box.appendChild(linha)

})

/* adicionar produto */

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

/* EXPORTAR */

document.getElementById("exportarBtn").onclick = ()=>{

const backup = JSON.stringify(dados)

const blob = new Blob([backup],{type:"application/json"})

const url = URL.createObjectURL(blob)

const a=document.createElement("a")

a.href=url
a.download="produtos-backup.json"

a.click()

URL.revokeObjectURL(url)

}

/* IMPORTAR */

document.getElementById("importarBtn").onclick=()=>{

document.getElementById("importarArquivo").click()

}

document.getElementById("importarArquivo").onchange=(e)=>{

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
