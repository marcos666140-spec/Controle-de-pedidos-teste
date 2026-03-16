const setores = [
"Bebidas",
"Frios",
"Mercearia",
"Confeitaria",
"Panificação"
]

setores.sort((a,b)=>a.localeCompare(b,"pt-BR"))

let dados = JSON.parse(localStorage.getItem("pedidos")) || {}

let expandidos = {}

let busca=""

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

let produtos = Object.keys(dados[setor])
.sort((a,b)=>a.localeCompare(b,"pt-BR"))

if(busca!==""){
produtos=produtos.filter(p=>
p.toLowerCase().includes(busca)||
setor.toLowerCase().includes(busca)
)
}

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
for(let p in dados[setor]){
dados[setor][p]=""
}
salvar()
render()
}

const finalizar=document.createElement("button")
finalizar.innerText="✅"

finalizar.onclick=()=>{

let texto=setor+"\n\n"

Object.keys(dados[setor])
.sort((a,b)=>a.localeCompare(b,"pt-BR"))
.forEach(p=>{
if(dados[setor][p]>0){
texto+=dados[setor][p]+" "+p+"\n"
}
})

navigator.clipboard.writeText(texto)

alert("Pedido copiado:\n\n"+texto)

}

header.appendChild(titulo)
header.appendChild(limparSetor)
header.appendChild(finalizar)

box.appendChild(header)

let limite=expandidos[setor]?produtos.length:5

produtos.slice(0,limite).forEach(produto=>{

const linha=document.createElement("div")
linha.className="produto"

const nome=document.createElement("span")
nome.className="nomeProduto"
nome.innerText=produto

const input=document.createElement("input")
input.type="number"
input.value=dados[setor][produto]||""

input.oninput=()=>{
dados[setor][produto]=input.value
salvar()
}

const botoes=document.createElement("div")
botoes.className="qtdBtns"

;[1,5,10].forEach(v=>{

const b=document.createElement("button")
b.innerText="+"+v

b.onclick=()=>{
let atual=parseInt(input.value)||0
input.value=atual+v
dados[setor][produto]=input.value
salvar()
}

botoes.appendChild(b)

})

const limpar=document.createElement("button")
limpar.innerText="🧹"
limpar.className="limparQtd"

limpar.onclick=()=>{
input.value=""
dados[setor][produto]=""
salvar()
}

const excluir=document.createElement("button")
excluir.innerText="❌"
excluir.className="excluirProduto"

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

if(produtos.length>5){

const expandir=document.createElement("button")
expandir.className="expandir"

expandir.innerText=expandidos[setor]?"⬆ Mostrar menos":"⬇ Mostrar mais"

expandir.onclick=()=>{
expandidos[setor]=!expandidos[setor]
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

/* busca */

const btnBusca=document.getElementById("btnBusca")
const campoBusca=document.getElementById("campoBusca")

btnBusca.onclick=()=>{

if(campoBusca.style.display==="none"||campoBusca.style.display===""){
campoBusca.style.display="block"
campoBusca.focus()
}else{
campoBusca.style.display="none"
campoBusca.value=""
busca=""
render()
}

}

campoBusca.oninput=()=>{
busca=campoBusca.value.toLowerCase()
render()
}

/* exportar */

document.getElementById("exportarDados").onclick=()=>{

const dadosBackup=localStorage.getItem("pedidos")

const blob=new Blob([dadosBackup],{type:"application/json"})

const url=URL.createObjectURL(blob)

const a=document.createElement("a")

a.href=url
a.download="produtos-backup.json"

a.click()

URL.revokeObjectURL(url)

}

/* importar */

const importarBtn=document.getElementById("importarDados")
const arquivoInput=document.getElementById("arquivoImportar")

importarBtn.onclick=()=>{
arquivoInput.click()
}

arquivoInput.onchange=(e)=>{

const file=e.target.files[0]

if(!file) return

const reader=new FileReader()

reader.onload=function(event){

localStorage.setItem("pedidos",event.target.result)

location.reload()

}

reader.readAsText(file)

}

render()
