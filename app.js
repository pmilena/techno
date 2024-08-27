new Vue({
  el: "#app",
  data: {
    produtos: [],
    item: {},
    carrinhoTotal: 0,
    itensCarrinho: []
  },
  filters: {
    moeda(valor) {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
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
      this.itensCarrinho.push({ id, nome, preco })
    },
    removerItem(index) {
      this.itensCarrinho.splice(index, 1)
    },

  },
  created() {
    this.fetchProdutos();
  },
});
