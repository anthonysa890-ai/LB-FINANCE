// nav-init.js — carrega ANTES de main.js (módulo defer)
// Define funções de navegação como stubs imediatos para evitar ReferenceError
// enquanto o módulo ainda está sendo baixado/avaliado.
// O módulo substituirá window.switchTab etc. pelas implementações reais.

(function () {
  // Fila de chamadas que chegam antes do módulo estar pronto
  var queue = [];

  function makeStub(name) {
    return function () {
      // Se a implementação real já foi carregada, chama diretamente
      if (window.__nav && typeof window.__nav[name] === 'function') {
        window.__nav[name].apply(null, arguments);
      } else {
        queue.push({ name: name, args: arguments });
      }
    };
  }

  window.switchTab       = makeStub('switchTab');
  window.toggleNavGroup  = makeStub('toggleNavGroup');
  window.switchTabGated  = makeStub('switchTabGated');
  window.switchTabMobile = makeStub('switchTabMobile');

  // Expõe a fila para que main.js replaye ao carregar
  window.__navQueue = queue;
})();
