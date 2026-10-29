(function(root){
  'use strict';
  function route(question){
    var q=String(question).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    var rules=[
      [/allerg|intoxic|moisi|pourri|malade|حساسية/, 'qualite', 'Pour votre sécurité, ne consommez pas un produit suspect. Conservez la référence de commande et une photo du produit, puis contactez notre équipe. Une photo seule ne permet pas de certifier la qualité sanitaire.'],
      [/reclam|abim|rembours|manquant|retour|qualite/, 'reclamation', 'Un produit abîmé ou manquant ? Préparez la référence de commande, le produit concerné et une photo si utile. Transmettez-les directement à notre équipe pour examen. Aucun remboursement n’est confirmé automatiquement.'],
      [/suivi|suivre|tracking|where.*order|فين.*طلب|commande.*(arriv|retard|statut)|annul|modifier.*commande/, 'suivi', 'Pour suivre, modifier ou annuler une commande, contactez notre équipe avec sa référence. Cet assistant public ne consulte pas vos commandes privées et ne confirme pas leur statut.'],
      [/livrai|livre|delai|delivery|توصيل|frais.*transport/, 'livraison', 'La zone, le créneau et les frais doivent être confirmés pour votre commande. Consultez les conditions affichées au panier, puis faites confirmer votre quartier et votre créneau par notre équipe avant de commander.'],
      [/profession|\bchr\b|restaurant|hotel|grossiste|tarif.*pro|devis|factur/, 'professionnel', 'Pour un approvisionnement professionnel, préparez les produits, volumes, fréquence et quartier de livraison. Notre équipe peut établir un devis adapté. Les tarifs négociés et modalités de facturation nécessitent sa confirmation.'],
      [/paiement|payer|carte bancaire|cash|payment|خلص/, 'paiement', 'Consultez les moyens de paiement proposés à la validation du panier. Ne communiquez jamais votre numéro de carte, code bancaire ou mot de passe dans ce chat. Notre équipe peut préciser les modalités applicables.'],
      [/compte|connexion|connecter|password|mot de passe/, 'compte', 'Utilisez « Mon espace » pour vous connecter ou créer votre compte. En cas de mot de passe oublié, utilisez la récupération proposée dans le formulaire. Ne partagez aucun identifiant secret dans le chat.'],
      [/conserv|stocker|frigo|fraicheur/, 'conservation', 'Conservez les produits selon leurs indications et leur état à réception. Séparez les produits abîmés et surveillez température et humidité. Indiquez le produit à notre équipe pour un conseil adapté ; une durée de conservation ne peut pas être garantie ici.'],
      [/budget|econom|moins cher|pas cher/, 'budget', 'Pour maîtriser votre budget, comparez les prix du catalogue à unité identique (kg, pièce ou caisse), puis vérifiez le total du panier. Le conditionnement et les frais peuvent changer le montant final. Aucun panier automatique n’est ajouté.'],
      [/rupture|remplac|alternative|indisponible/, 'alternative', 'Si un article est indisponible, cherchez une variété similaire dans le catalogue. Notre équipe doit confirmer toute substitution, son prix et son conditionnement avant validation. Aucun remplacement n’est effectué automatiquement.']
    ];
    for(var r of rules)if(r[0].test(q))return {intent:r[1],message:r[2]};
    return null;
  }
  root.ShopScenarios={route:route, suggestions:[
    ['Produits disponibles','Quels produits sont disponibles ?'],
    ['Idée de repas','Quels légumes choisir pour une salade ?'],
    ['Petit budget','Comment choisir avec un petit budget ?'],
    ['Livraison','Quelles sont les conditions de livraison ?'],
    ['Suivre une commande','Comment suivre ma commande ?'],
    ['Achats professionnels','Je souhaite un devis professionnel'],
    ['Produit abîmé','Signaler un produit abîmé'],
    ['Paiement','Quels moyens de paiement ?'],
    ['Conservation','Comment conserver mes produits ?'],
    ['Remplacement','Que faire en cas de rupture ?']
  ]};
})(typeof window==='undefined'?globalThis:window);
