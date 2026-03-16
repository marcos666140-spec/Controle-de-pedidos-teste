const setores = ["Bebidas", "Frios", "Mercearia", "Confeitaria", "Panificação"];
let dados = JSON.parse(localStorage.getItem("pedidos_teste")) || {};
let expandido = {};

setores.forEach(setor => {
  if (!dados[setor]) dados[setor] = {};
});

function salvar() {
  localStorage.setItem("pedidos_teste", JSON.stringify(dados));
}

function render() {
  const container = document.getElementById("setores");
  const busca = document.getElementById("campoBusca").value.toLowerCase();
  container.innerHTML = "";

  setores.forEach(setor => {
    const box = document.createElement("div");
    box.className = "setor";

    const header = document.createElement("div");
    header.className = "setorHeader";

    const titulo = document.createElement("span");
    titulo.innerText = setor;

    const limparSetor = document.createElement("button");
    limparSetor.className = "lixeira";
    limparSetor.innerText = "🗑";
    limparSetor.onclick = () => {
      for (let produto in dados[setor]) dados[setor][produto] = "";
      salvar();
      render();
    };

    const finalizar = document.createElement("button");
    finalizar.innerText = "✅";
    finalizar.onclick = () => {
      let texto = setor + "\n\n";
      for (let produto in dados[setor]) {
        if (dados[setor][produto] > 0) texto += produto + " - " + dados[setor][produto] + "\n";
      }
      if (texto.trim() === setor) { alert("Nenhum item nesse setor"); return; }
      navigator.clipboard.writeText(texto);
      alert("Pedido copiado:\n\n" + texto);
    };

    header.appendChild(titulo);
    header.appendChild(limparSetor);
    header.appendChild(finalizar);
    box.appendChild(header);

    let lista = Object.keys(dados[setor]).sort((a, b) => a.localeCompare(b));
    let limite = 5;
    if (!expandido[setor]) lista = lista.slice(0, limite);

    lista.forEach((produto, index) => {
      if (busca && !produto.toLowerCase().includes(busca)) return;

      const linha = document.createElement("div");
      linha.className = "produto";

      const nome = document.createElement("span");
      nome.className = "nomeProduto";
      nome.innerText = produto;

      const input = document.createElement("input");
      input.type = "number";
      input.value = dados[setor][produto] || "";
      input.oninput = () => { dados[setor][produto] = input.value; salvar(); };

      const botoes = document.createElement("div");
      botoes.className = "qtdBtns";
      [1,5,10].forEach(valor => {
        const b = document.createElement("button");
        b.innerText = valor;
        b.onclick = () => {
          let atual = parseInt(input.value)||0;
          input.value = atual + valor;
          dados[setor][produto] = input.value;
          salvar();
        };
        botoes.appendChild(b);
      });

      const excluir = document.createElement("button");
      excluir.className = "excluirProduto";
      excluir.innerText = "✖";
      excluir.onclick = () => {
        if(confirm("Excluir produto?")){
          delete dados[setor][produto];
          salvar();
          render();
        }
      };

      const limparItem = document.createElement("button");
      limparItem.className = "limparQtd";
      limparItem.innerText = "🧹";
      limparItem.onclick = () => { input.value=""; dados[setor][produto]=""; salvar(); };

      linha.appendChild(nome);
      linha.appendChild(input);
      linha.appendChild(botoes);
      linha.appendChild(excluir);
      linha.appendChild(limparItem);

      box.appendChild(linha);
    });

    if(Object.keys(dados[setor]).length>5){
      const expandir = document.createElement("button");
      expandir.className = "expandir";
      expandir.innerText = expandido[setor]?"▲ Mostrar menos":"▼ Mostrar mais";
      expandir.onclick = () => { expandido[setor] = !expandido[setor]; render(); };
      box.appendChild(expandir);
    }

    const add = document.createElement("button");
    add.className = "addProduto";
    add.innerText = "+ Produto";
    add.onclick = () => {
      let nome = prompt("Nome do produto");
      if(!nome) return;
      dados[setor][nome] = "";
      salvar();
      render();
    };

    box.appendChild(add);
    container.appendChild(box);
  });
}

render();

// Busca
document.getElementById("btnBusca").onclick = () => {
  const campo = document.getElementById("campoBusca");
  campo.style.display = campo.style.display==="block"?"none":"block";
  campo.focus();
};
document.getElementById("campoBusca").oninput = render;

// Backup / Export / Import
window.onload = () => {
  const exportar = document.getElementById("exportarBtn");
  const importar = document.getElementById("importarBtn");
  const arquivo = document.getElementById("importarArquivo");

  exportar.onclick = () => {
    const backup = JSON.stringify(dados);
    const blob = new Blob([backup],{type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download="produtos-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  importar.onclick = () => arquivo.click();

  arquivo.onchange = e => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      dados = JSON.parse(event.target.result);
      salvar();
      render();
      alert("Produtos importados com sucesso");
    };
    reader.readAsText(file);
  };
};
