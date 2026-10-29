const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
require('../site-vitrine/shop-scenarios.js');
test('service scenarios stay outside product AI and preserve safeguards',()=>{
 for(const [q,intent] of [['suivre ma commande','suivi'],['modifier ma commande','suivi'],['livraison demain','livraison'],['devis professionnel','professionnel'],['produit abîmé','reclamation'],['produit moisi','qualite'],['paiement carte bancaire','paiement'],['petit budget','budget'],['conserver les tomates','conservation'],['rupture de stock','alternative'],['mot de passe oublié','compte']])assert.equal(ShopScenarios.route(q).intent,intent,q);
 assert.match(ShopScenarios.route('suivre ma commande').message,/ne consulte pas/);
 assert.match(ShopScenarios.route('remboursement').message,/Aucun remboursement/);
 assert.equal(ShopScenarios.route('Bghit maticha'),null);
 assert.equal(ShopScenarios.route('légumes pour une salade'),null);
});
test('all deployed inline scripts parse',()=>{
 const html=fs.readFileSync('site-vitrine/index.html','utf8');
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi))if(!/src=|application\/ld\+json/.test(m[1]))new vm.Script(m[2]);
 assert.ok(html.includes('/shop-scenarios.js'));
 assert.ok(!html.includes('IA Claude'));
});
