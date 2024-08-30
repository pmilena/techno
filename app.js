new Vue({
  el: "#app",
  data: {
    produtos: [],
    item: {},
    itensCarrinho: [],
    mensagemAlerta: "Item adicionado ao carrinho",
    alertaAtivo: false
  },
  filters: {
    moeda(valor) {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  computed: {
    carrinhoTotal() {
      let total = 0;
      if (this.itensCarrinho.length) {
        this.itensCarrinho.forEach(produto => {
          total += produto.preco;
        });
      }
      return total;
    }
  },
  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json")
        .then((r) => r.json())
        .then((r) => {
          this.produtos = r;
        });
    },
    fetchItem(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then((r) => r.json())
        .then((r) => {
          this.item = r;
        });
    },
    abrirModal(id) {
      this.fetchItem(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    fecharModal({ target, currentTarget }) {
      if (target === currentTarget) this.item = false;
    },
    removerItemEstoque() {
      this.item.estoque--;
      const { id, nome, preco } = this.item;
      this.itensCarrinho.push({ id, nome, preco });
      this.ativarAlerta(this.mensagemAlerta);
    },
    removerItem(index) {
      this.itensCarrinho.splice(index, 1);
    },
    checarLocalStorage() {
      if (window.localStorage.itensCarrinho) {
        try {
          const itens = JSON.parse(window.localStorage.itensCarrinho);
          if (Array.isArray(itens)) {
            this.itensCarrinho = itens;
          } else {
            this.itensCarrinho = [];
          }
        } catch (e) {
          console.error("Erro ao carregar itens do LocalStorage:", e);
          this.itensCarrinho = [];
        }
      } else {
        this.itensCarrinho = [];
      }
    },
    ativarAlerta(mensagem) {
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 1500);
    },
  },
  watch: {
    itensCarrinho: {
      handler(novoValor) {
        window.localStorage.itensCarrinho = JSON.stringify(novoValor);
      },
      deep: true
    }
  },
  created() {
    this.fetchProdutos();
    this.checarLocalStorage();
  },
});
