const setores = [
"Bebidas",
"Frios",
"Mercearia",
"Confeitaria",
"Panificação"
]

let dados = JSON.parse(localStorage.getItem("pedidos_teste")) || {}

let expandido={}

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

let lista=Object.keys(dados[setor])
.sort((a,b)=>a.localeCompare(b))

let limite=5

if(!expandido[setor]){
lista=lista.slice(0,limite)
}

Object.keys(dados[setor])
.sort((a,b)=>a.localeCompare(b))
.forEach((produto,index)=>{

if(busca && !produto.toLowerCase().includes(busca)) return

if(!expandido[setor] && index>=limite) return

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
b.innerText=valor

b.onclick=()=>{

let atual=parseInt(input.value)||0
input.value=atual+valor

dados[setor][produto]=input.value
salvar()

}

botoes.appendChild(b)

})

/* excluir produto */

const excluir=document.createElement("button")
excluir.innerText="✖"
excluir.className="excluirProduto"

excluir.onclick=()=>{

if(confirm("Excluir produto?")){
delete dados[setor][produto]
salvar()
render()
}

}

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
linha.appendChild(excluir)
linha.appendChild(limparItem)

box.appendChild(linha)

})

/* expandir */

if(Object.keys(dados[setor]).length>5){

const expandir=document.createElement("button")
expandir.className="expandir"

expandir.innerText=expandido[setor]?"▲ Mostrar menos":"▼ Mostrar mais"

expandir.onclick=()=>{

expandido[setor]=!expandido[setor]

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

/* busca */

document.getElementById("btnBusca").onclick=()=>{

const campo=document.getElementById("campoBusca")

campo.style.display=campo.style.display==="block"?"none":"block"

campo.focus()

}

document.getElementById("campoBusca").oninput=render

/* backup */

window.onload=()=>{

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
// --- IMPORTAÇÃO DE PRODUTOS PARA MERCEARIA ---
function importarProdutos(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const conteudo = e.target.result;
    let produtosImportados = [];

    try {
      produtosImportados = JSON.parse(conteudo);
    } catch (err) {
      alert("Arquivo inválido!");
      return;
    }

    produtosImportados.forEach(prod => {
      adicionarProdutoNaMercearia(prod.nome, prod.qtd);
    });
  };
  reader.readAsText(file);
}

// Adiciona produto na aba Mercearia
function adicionarProdutoNaMercearia(nome, qtd) {
  const container = document.getElementById("mercearia");
  if (!container) return;

  const div = document.createElement("div");
  div.classList.add("produto");
  div.dataset.setor = "mercearia";

  div.innerHTML = `
    <span class="nomeProduto">${nome}</span>
    <input type="number" value="${qtd}" />
    <div class="qtdBtns">
      <button class="maisQtd">+</button>
      <button class="menosQtd">-</button>
    </div>
    <button class="lixeira">🗑</button>
    <button class="mover">Mover</button>
  `;

  container.appendChild(div);
  aplicarEventosProduto(div);
}

// --- BOTÃO MOVER PARA OUTRO SETOR ---
const setores = ["bebidas", "frios", "mercearia"];

function aplicarEventosProduto(div) {
  // Eventos quantidade
  const btnMais = div.querySelector(".maisQtd");
  const btnMenos = div.querySelector(".menosQtd");
  const btnLixeira = div.querySelector(".lixeira");
  const btnMover = div.querySelector(".mover");

  if (btnMais) btnMais.addEventListener("click", () => {
    const input = div.querySelector("input");
    input.value = parseInt(input.value) + 1;
  });

  if (btnMenos) btnMenos.addEventListener("click", () => {
    const input = div.querySelector("input");
    if (parseInt(input.value) > 0) input.value = parseInt(input.value) - 1;
  });

  if (btnLixeira) btnLixeira.addEventListener("click", () => {
    div.remove();
  });

  // Evento botão mover
  if (btnMover) btnMover.addEventListener("click", (e) => {
    // Remove menu anterior se existir
    document.querySelectorAll(".menuMover").forEach(m => m.remove());

    const menu = document.createElement("div");
    menu.classList.add("menuMover");

    setores.forEach(setor => {
      const item = document.createElement("div");
      item.textContent = setor.charAt(0).toUpperCase() + setor.slice(1);
      item.addEventListener("click", () => {
        moverProdutoParaSetor(div, setor);
        menu.remove();
      });
      menu.appendChild(item);
    });

    document.body.appendChild(menu);
    const rect = e.target.getBoundingClientRect();
    menu.style.left = rect.left + "px";
    menu.style.top = rect.bottom + "px";

    const fechar = ev => {
      if (!menu.contains(ev.target)) {
        menu.remove();
        document.removeEventListener("click", fechar);
      }
    };
    document.addEventListener("click", fechar);
  });
}

// Função que move o produto para outro setor
function moverProdutoParaSetor(produtoDiv, novoSetor) {
  const setorContainer = document.getElementById(novoSetor);
  if (!setorContainer) return;

  produtoDiv.dataset.setor = novoSetor;
  setorContainer.appendChild(produtoDiv);
}

// --- EVENTO INPUT PARA IMPORTAR ---
const inputArquivo = document.getElementById("arquivoProdutos");
if (inputArquivo) {
  inputArquivo.addEventListener("change", importarProdutos);
}
