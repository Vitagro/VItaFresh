(function(){
  'use strict';
  var button=document.createElement('button');
  button.id='shop-rewards';button.type='button';button.textContent='Récompenses Vita Fresh';button.hidden=true;
  document.getElementById('promos').prepend(button);
  var config;
  function text(id,value){document.getElementById(id).textContent=value;}
  function session(){try{return JSON.parse(localStorage.getItem('fl_session')||'null');}catch(_){return null;}}
  function show(){
    document.getElementById('vf-lot').classList.add('on');
    document.getElementById('vf-step-wheel').style.display='block';
    document.getElementById('vf-step-scratch').style.display='none';
    text('vf-lot-t','Récompenses Vita Fresh');
    text('vf-lot-s','Offre activée par Vita Fresh. Une participation par compte. Seuil : '+config.seuilCible+' DH.');
    var wheel=document.getElementById('vf-wheel');wheel.style.cssText='height:auto;min-height:120px;border:0;border-radius:12px;background:#eff6ef;padding:20px;transform:none;color:#163c26';
    wheel.textContent=config.rewards.map(function(r){return r.type==='reduction'?r.montant+' DH de réduction':r.type==='pourcentage'?r.montant+' % de réduction':r.label;}).join(' · ');
    var spin=document.getElementById('vf-lot-spin');spin.disabled=false;
    spin.textContent=session()?.token?'Participer':'Me connecter pour participer';
    spin.onclick=async function(){
      var s=session();
      if(!s?.token){document.getElementById('vf-lot').classList.remove('on');window.openLogin();return;}
      spin.disabled=true;spin.textContent='Vérification de votre participation…';
      try{
        var r=await fetch('/api/ext/loterie',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+s.token},body:JSON.stringify({action:'claim'}),signal:AbortSignal.timeout(25000)});
        var data=await r.json();if(!r.ok)throw Error(data.error||'Participation indisponible.');
        var reward=data.reward;
        text('vf-lot-s',reward.type==='reduction'?reward.montant+' DH de réduction':reward.type==='pourcentage'?reward.montant+' % de réduction':reward.label);
        wheel.textContent='Votre code : '+data.coupon.code;
        text('vf-lot-terms','Minimum '+data.coupon.minCommande+' DH. Réduction plafonnée au montant éligible du panier. Conditions vérifiées à la commande.');
        document.getElementById('vf-step-scratch').style.display='block';
        document.querySelector('.vf-scratch-wrap').style.display='none';
        text('vf-scratch-hint','Conservez ce code pour votre panier.');
        spin.textContent='Récompense enregistrée';
      }catch(e){text('vf-lot-s',e.message);spin.disabled=false;spin.textContent='Réessayer';}
    };
  }
  button.onclick=show;
  async function refresh(){
    try{var r=await fetch('/api/ext/loterie',{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error();config=await r.json();button.hidden=!(config.active&&config.rewards?.length);}
    catch(_){button.hidden=true;}
  }
  refresh();document.addEventListener('visibilitychange',function(){if(!document.hidden)refresh();});
})();
