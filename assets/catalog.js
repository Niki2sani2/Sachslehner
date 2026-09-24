const basket=document.querySelector('.basket-dialog');
const basketItems=document.querySelector('.basket-items');
const basketCount=document.querySelector('.basket-count');
const toast=document.querySelector('.catalog-toast');
const preview=document.querySelector('.preview-dialog');
const catalogGrid=document.querySelector('.catalog-grid');
const interestGrid=document.querySelector('.interest-grid');
let products=[];
let selected=[];

const byId=id=>products.find(product=>product.id===id);
const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const imageUrl=value=>/^(https?:|data:)/.test(value)?value:'../'+String(value).replace(/^(\.\/|\/)+/,'');

function persist(){localStorage.setItem('sachslehner-auswahl',JSON.stringify(selected))}
function announce(message){toast.textContent=message;toast.classList.add('show');clearTimeout(window.catalogToast);window.catalogToast=setTimeout(()=>toast.classList.remove('show'),2200)}
function actionLabel(product,added){
  if(added)return product.kind==='category'?'Interesse vorgemerkt <span>✓</span>':'Ausgewählt <span>✓</span>';
  return product.kind==='category'?'Interesse vormerken <span>＋</span>':'Verfügbarkeit anfragen <span>＋</span>';
}
function cardMarkup(product){
  const interest=product.kind==='category';
  const classes=['product-card',interest?'interest-card':'',product.wide&&!interest?'wide':''].filter(Boolean).join(' ');
  return `<article class="${classes}" id="${escapeHtml(product.id)}"><button class="product-image" type="button" data-preview="${escapeHtml(product.id)}" aria-label="${escapeHtml(product.title)} vergrößern"><img src="${escapeHtml(imageUrl(product.image))}" alt="${escapeHtml(product.title)}" loading="lazy" decoding="async"></button><div class="product-copy"><p class="product-number">${escapeHtml(product.tag)}</p><h3>${escapeHtml(product.title)}</h3><p class="product-price">${escapeHtml(product.note)}</p><button class="select-product" type="button" data-add="${escapeHtml(product.id)}">${actionLabel(product,false)}</button></div></article>`;
}
function renderCatalog(){
  const items=products.filter(product=>product.kind==='item');
  const categories=products.filter(product=>product.kind==='category');
  catalogGrid.innerHTML=items.length?items.map(cardMarkup).join(''):'<p class="catalog-loading">Derzeit sind keine Einzelstücke eingetragen.</p>';
  interestGrid.innerHTML=categories.length?categories.map(cardMarkup).join(''):'<p class="catalog-loading">Derzeit sind keine Sortimentsbereiche eingetragen.</p>';
  document.querySelector('.item-count').textContent=items.length;
  document.querySelector('.category-count').textContent=categories.length;
}
function render(){
  basketCount.textContent=selected.length;
  basket.classList.toggle('has-items',selected.length>0);
  basketItems.innerHTML=selected.map(id=>{const product=byId(id);return product?`<div class="basket-row"><img src="${escapeHtml(imageUrl(product.image))}" alt=""><div><h3>${escapeHtml(product.title)}</h3><p>${escapeHtml(product.tag)}</p></div><button type="button" data-remove="${escapeHtml(product.id)}">Entfernen</button></div>`:''}).join('');
  document.querySelectorAll('[data-add]').forEach(button=>{const product=byId(button.dataset.add);if(!product)return;const added=selected.includes(product.id);button.disabled=added;button.innerHTML=actionLabel(product,added)});
  persist();
}
function add(id){if(!selected.includes(id)&&byId(id)){selected.push(id);render();announce('Zur Auswahl hinzugefügt')}}
function bindCatalog(){
  document.querySelectorAll('[data-add]').forEach(button=>button.addEventListener('click',()=>add(button.dataset.add)));
  document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>{
    const product=byId(button.dataset.preview),previewAdd=preview.querySelector('.preview-add');
    if(!product)return;
    const added=selected.includes(product.id);
    preview.querySelector('img').src=imageUrl(product.image);
    preview.querySelector('img').alt=product.title;
    preview.querySelector('.product-number').textContent=product.tag;
    preview.querySelector('h2').textContent=product.title;
    preview.querySelector('.preview-description').textContent=product.description||product.note;
    previewAdd.dataset.addPreview=product.id;
    previewAdd.disabled=added;
    previewAdd.innerHTML=actionLabel(product,added);
    preview.showModal();
  }));
}

basket.querySelector('.basket-close').addEventListener('click',()=>basket.close());
document.querySelector('.basket-trigger').addEventListener('click',()=>basket.showModal());
basket.addEventListener('click',event=>{if(event.target===basket)basket.close();const remove=event.target.closest('[data-remove]');if(remove){selected=selected.filter(id=>id!==remove.dataset.remove);render()}});
preview.querySelector('.preview-close').addEventListener('click',()=>preview.close());
preview.addEventListener('click',event=>{if(event.target===preview)preview.close()});
preview.querySelector('.preview-add').addEventListener('click',event=>{add(event.currentTarget.dataset.addPreview);preview.close();basket.showModal()});

const deliveryFields=document.querySelectorAll('.delivery-detail');
const locationField=document.querySelector('[name="location"]');
function updateDeliveryFields(){const delivery=document.querySelector('input[name="handover"]:checked').value==='Lieferung anfragen';deliveryFields.forEach(field=>{field.hidden=!delivery;field.querySelector('input').disabled=!delivery});locationField.required=delivery}
document.querySelectorAll('input[name="handover"]').forEach(input=>input.addEventListener('change',updateDeliveryFields));

function requestText(form){
  const data=new FormData(form),handover=data.get('handover'),location=data.get('location'),access=data.get('access'),name=data.get('name'),contact=data.get('contact'),message=data.get('message')||'Ich freue mich über nähere Informationen zu meiner Auswahl.',items=selected.map(id=>{const product=byId(id);return product?'• '+product.tag+' – '+product.title:''}).filter(Boolean).join('\n');
  return `Guten Tag,\n\n${message}\n\nMeine Auswahl:\n${items}\n\nGewünschte Übergabe: ${handover}${location?'\nLieferort/PLZ: '+location:''}${access?'\nStockwerk/Aufzug/Zufahrt: '+access:''}\n\nName: ${name}\nKontakt: ${contact}\n\nFreundliche Grüße\n${name}`;
}
const form=document.querySelector('.request-form');
form.addEventListener('submit',event=>{event.preventDefault();const body=encodeURIComponent(requestText(form));window.location.href=`mailto:doris@sachslehner.at?subject=${encodeURIComponent('Anfrage zu Sachslehner Sammlungsstücken')}&body=${body}`});
document.querySelector('.copy-request').addEventListener('click',async()=>{if(!form.reportValidity())return;try{await navigator.clipboard.writeText(requestText(form));announce('Anfrage wurde kopiert')}catch{announce('Kopieren ist hier nicht möglich')}});

async function init(){
  updateDeliveryFields();
  try{
    const response=await fetch('../data/catalog.json',{cache:'no-store'});
    if(!response.ok)throw new Error('Katalog konnte nicht geladen werden');
    const data=await response.json();
    products=Array.isArray(data.products)?data.products.filter(product=>product&&product.id&&product.title&&product.image&&product.visible!==false):[];
    try{const stored=JSON.parse(localStorage.getItem('sachslehner-auswahl')||'[]');selected=Array.isArray(stored)?stored.filter(id=>byId(id)):[]}catch{selected=[]}
    renderCatalog();
    bindCatalog();
    render();
    if(location.hash){requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView())}
  }catch(error){
    catalogGrid.innerHTML='<p class="catalog-loading">Der Katalog ist momentan nicht erreichbar. Bitte versuchen Sie es später erneut.</p>';
    interestGrid.innerHTML='';
    console.error(error);
  }
}
init();
