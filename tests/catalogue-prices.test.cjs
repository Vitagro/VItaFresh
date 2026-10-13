const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname, '../site-vitrine/index.html'), 'utf8');
const between = (start, end) => html.slice(html.indexOf(start), html.indexOf(end, html.indexOf(start)));

function fixture(price) {
  const product = {id:'sample', n:'Produit', p:price, u:'kg', dispo:true, tags:[]};
  const elements = {pgrid:{innerHTML:''}};
  const messages = [];
  const context = vm.createContext({
    PRODS:[product], cart:{}, TC:{}, TL:{}, currentFilter:'tous',
    document:{getElementById:id=>elements[id] || null},
    showToast:message=>messages.push(message), updateCartUI:()=>{},
  });
  vm.runInContext(between('function hasCataloguePrice(', 'var PROMO='), context);
  vm.runInContext(between('function renderProds(', 'function updateCatCounts('), context);
  return {context, elements, messages};
}

test('missing or invalid prices show a quote link and cannot enter the cart', () => {
  for (const price of [0, null, undefined, '', -1, NaN, Infinity]) {
    const {context, elements, messages} = fixture(price);
    vm.runInContext('renderProds(); upCart("sample", 1);', context);
    assert.match(elements.pgrid.innerHTML, /Prix sur demande/);
    assert.match(elements.pgrid.innerHTML, /Demander le prix/);
    assert.doesNotMatch(elements.pgrid.innerHTML, /onclick="upCart/);
    assert.equal(Object.keys(context.cart).length, 0);
    assert.match(messages[0], /Prix sur demande/);
  }
});

test('priced products retain their price and normal add/remove controls', () => {
  const {context, elements} = fixture(17);
  vm.runInContext('renderProds(); upCart("sample", 1);', context);
  assert.match(elements.pgrid.innerHTML, /17 MAD/);
  assert.equal(context.cart.sample.qty, 1);
  assert.equal(context.cart.sample.p, 17);
  vm.runInContext('upCart("sample", -1);', context);
  assert.equal(Object.keys(context.cart).length, 0);
});

test('checkout rejects a stale cart with an unknown price before submitting', () => {
  const {context, messages} = fixture(0);
  context.cart.sample = {p:0,qty:1};
  context.getSession = () => null;
  context.document.getElementById = id => {
    if (['f-nom','f-tel','f-adr'].includes(id)) return {value:'test'};
    throw Error('Checkout must stop before accessing ' + id);
  };
  const prefix=between('function submitOrder(){', '  var btn=document.getElementById("submit-btn");');
  vm.runInContext(prefix + '\n}\nsubmitOrder();', context);
  assert.match(messages[0], /attend son tarif/);
});
