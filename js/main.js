var novi_zadatak = document.querySelector('#zadatak');
var dodaj_zadatak_forma = document.querySelector('#dodaj_zadatak');
var lista_trenutnih_zadataka = document.querySelector('#tekuci_zadaci');
var lista_gotovih_zadataka = document.querySelector('#gotovi_zadaci');
var filter = document.querySelector('#filter');
var filter_gotovih = document.querySelector('#filter_gotovih');
var btnBrisiSveGotove = document.querySelector('.obrisi_gotove');

function uZadaci(ls){
  return localStorage.getItem(ls) === null ? [] : JSON.parse(localStorage.getItem(ls));
}

function uFilter(filter){
  let fil_polje = document.querySelector(filter);

  if (fil_polje.value.trim() !== '') {
    fil_polje.value = fil_polje.value.trim();
    fil_polje.focus();
  }
  
  if (fil_polje.value.trim() === '') fil_polje.value = '';
}

// Dodavanje zadataka
function dodajZadatak(e) {
  e.preventDefault();
  let unos_zadatka = novi_zadatak.value.trim();
 
  if (unos_zadatka === '') {
    poruke('Polje za unos zadataka ne sme biti prazno!', 'crveno');
    novi_zadatak.focus();
    return false;
  }
  
  // provera da li zadatak već postoji na listi
  if (localStorage.getItem('zadaci') !== null){
    let zadaci = JSON.parse(localStorage.getItem('zadaci'));
    let z_length = zadaci.length;
    for (let i = 0; i < z_length; i++){
      if (zadaci[i].zadatak.toLowerCase() === unos_zadatka.toLowerCase()){
        poruke('Zadatak već postoji na listi, unesite novi zadatak!', 'crveno');
        novi_zadatak.focus();
        return false;
      }
    }
  }

  let li = document.createElement('li');
  li.className = 'collection-item current li_grid';
  li.innerHTML ='<i class="fa fa-arrow-circle-right red-text u-padding-right vert_centriranje"></i>';
  li.innerHTML += '<span class="badge new red u-padding-right vert_centriranje" data-badge-caption="Novo!"></span>';
  li.appendChild(document.createTextNode(unos_zadatka));

  // za dodato
  let span = document.createElement('span');
  span.innerHTML = `<small>Dodato: ${vremeDodavanja(new Date())}</small>`;
  span.className = 'u-padding-right';
  li.appendChild(span);
  lista_trenutnih_zadataka.appendChild(li);


  // za edit dugme
  let edit = document.createElement('a');
  edit.setAttribute('title', 'Izmeni zadatak');
  edit.href = '#modEdit';
  edit.className = 'za_edit modal-trigger';
  edit.innerHTML ='<i class="fas fa-edit"></i>';
  li.appendChild(edit);
  lista_trenutnih_zadataka.appendChild(li);

  // za delete dugme
  let link = document.createElement('a');
  link.setAttribute('title', 'Premesti u listu završenih zadataka');
  link.className = 'delete-item secondary-content deleteCurrent';
  link.innerHTML ='<i class="fa fa-arrow-circle-down green-text"></i>';
  li.appendChild(link);
  lista_trenutnih_zadataka.appendChild(li);
  
  snimiNoviZadatak({ zadatak: unos_zadatka, dodat: vremeDodavanja(new Date()) });
  novi_zadatak.value = '';
  novi_zadatak.focus();
}

//snima novi zadatak
function snimiNoviZadatak(zadatak){
  let zadaci = uZadaci('zadaci');
  zadaci.push(zadatak);
  localStorage.setItem('zadaci', JSON.stringify(zadaci));
  poruke('Zadatak uspešno dodat!', 'zeleno');
}

// prikazuje sve zadatke i tekuće i završene zavisno od argumenata
function prikaziZadatke(zadatak, status, zaBrisanje, lista, ikonica, boja, tooltip, strelica, nov){
  let zadaci = uZadaci(zadatak);
  let z_length = zadaci.length;

  for (let i = 0; i < z_length; i++){
    let li = document.createElement('li');
    li.className = `collection-item ${status} li_grid`;
    li.innerHTML = `<i class="fa fa-${ikonica} ${boja} u-padding-right vert_centriranje"></i><i></i>`;
    li.appendChild(document.createTextNode(zadaci[i].zadatak));

    // za dodato
    let span = document.createElement('span');
    nov === 'nov' ? 
      span.innerHTML = `<small>Dodato: ${zadaci[i].dodat}</small>`: 
      span.innerHTML = `<small>Završen: ${zadaci[i].dodat}</small>`;
    span.className = 'u-padding-right';
    li.appendChild(span);
    lista_trenutnih_zadataka.appendChild(li);
    
    // za edit dugme
    let edit = document.createElement('a');
    edit.setAttribute('title', 'Izmeni zadatak');
    edit.href = '#modEdit';
    edit.className = 'za_edit modal-trigger';
    nov === 'nov' ? 
      edit.innerHTML ='<i class="fas fa-edit"></i>' : 
      edit.innerHTML ='<i></i>';
    li.appendChild(edit);
    lista_trenutnih_zadataka.appendChild(li);

    // za delete dugme
    let link = document.createElement('a');
    tooltip === 'tekuci' ? 
      link.setAttribute('title', 'Premesti u listu završenih zadataka') : 
      link.setAttribute('title', 'Obriši iz liste završenih zadataka');
    link.className = `delete-item secondary-content ${zaBrisanje}`;
    strelica === 'zelena_strelica' ? 
      link.innerHTML ='<i class="fa fa-arrow-circle-down green-text"></i>' : 
      link.innerHTML ='<i class="fa fa-ban red-text"></i>';
    li.appendChild(link);

    if (lista === 'lista_trenutnih_zadataka') lista_trenutnih_zadataka.appendChild(li);
    if (lista === 'lista_gotovih_zadataka') lista_gotovih_zadataka.appendChild(li);
  }
}

// Briše targetovani li element i poziva funkciju da ga premesti u UL gotovih i obriše iz 'zadaci' iz LS
function izbrisiTekuciZadatak(e){
  let tar_element = e.target.parentElement.parentElement;
  
  if (e.target.parentElement.classList.contains('deleteCurrent')){
    if(confirm('Da li ste sigurni da želite da prebacite zadatak u gotove zadatke?')){
      tar_element.remove();
      prebaciIztekucihUGotove(tar_element.childNodes[2].textContent, vremeDodavanja(new Date()));
      skloniIzTekucih(tar_element.childNodes[2]);
    } else {
      uFilter('#filter');
    }
  }
}

// premešta stavku iz tekućih u gotove zadatke bez location.reloada()
function prebaciIztekucihUGotove(txtZaLi, dodat, ){
  let li = document.createElement('li');
  li.className = 'collection-item finished li_grid';
  li.innerHTML ='<i class="fa fa-check green-text u-padding-right vert_centriranje"></i><span></span>';
  li.appendChild(document.createTextNode(txtZaLi));

  // za dodato
  let span = document.createElement('span');
  span.innerHTML = `<small>Završen: ${dodat}</small>`;
  span.className = 'u-padding-right';
  li.appendChild(span);
  lista_trenutnih_zadataka.appendChild(li);

  let edit = document.createElement('a');
  edit.innerHTML ='<i></i>';
  li.appendChild(edit);
  lista_trenutnih_zadataka.appendChild(li);

  let link = document.createElement('a');
  link.setAttribute('title', 'Obriši iz liste završenih zadataka');
  link.className = 'delete-item secondary-content deleteFinished';
  link.innerHTML ='<i class="fa fa-ban red-text"></i>';
  li.appendChild(link);
  lista_gotovih_zadataka.appendChild(li);
}

// za edit (sa modalom)
function otvoriEditModal(e){
  let za_edit = e.target.parentElement.parentElement.childNodes[2].textContent;
  var elem= document.querySelector('.modal');
  var instance = M.Modal.init(elem, {
    dismissible: false,
    onOpenStart: function(){
      document.querySelector('#inp_za_edit').value = za_edit;
    },
    endingTop: '30%'
  });

  document.querySelector('#modEdit').onkeyup = function(ev){
    if(ev.keyCode == 13) {
      let element = e.target.parentElement.parentElement.childNodes[2];
      let tekst = document.querySelector('#inp_za_edit').value;
      editTekucegZadatka(tekst, element);
      instance.close();
    }
    if(ev.keyCode == 27) {
      instance.close();
    } 
  }

  document.querySelector('#modSnimi').onclick = function(){
    let element = e.target.parentElement.parentElement.childNodes[2];
    let tekst = document.querySelector('#inp_za_edit').value;
    editTekucegZadatka(tekst, element);
  }

}

function editTekucegZadatka(tekst, el){
  let zadaci = uZadaci('zadaci');
  let z_length = zadaci.length;
  let promenjeni_zadatak = tekst.trim();
  let ind = -1;


  if (promenjeni_zadatak === '') {
    poruke('Zadatak ne može biti prazno polje!', 'crveno');
    uFilter('#filter');
    return false;
  }
  
  for (let i = 0; i < z_length; i++){
    if (zadaci[i].zadatak.toLowerCase() === promenjeni_zadatak.toLowerCase()){
      poruke('Zadatak već postoji na listi!', 'crveno');
      uFilter('#filter');
      return false;
    }
  }

  for (let i = 0; i < z_length; i++) {
    if (zadaci[i].zadatak === el.textContent){     
      ind = i;
    }
  }

  zadaci[ind].zadatak = promenjeni_zadatak;
  localStorage.setItem('zadaci', JSON.stringify(zadaci));  
  el.textContent = promenjeni_zadatak;
  poruke('Zadatak je uspešno izmenjen!', 'zeleno');

  uFilter('#filter');
}

function skloniIzTekucih(objZadatak){
  let zadaci = uZadaci('zadaci');
  let z_length = zadaci.length;
  let ind = -1;

  for (let i = 0; i < z_length; i++) {
    if (objZadatak.textContent === zadaci[i].zadatak){     
      ind = i;
    }
  }
  
  if (objZadatak.textContent === zadaci[ind].zadatak){
    premestiUZavrsene({ zadatak: zadaci[ind].zadatak, dodat: zadaci[ind].dodat });
    zadaci.splice(ind, 1);
  }

  localStorage.setItem('zadaci', JSON.stringify(zadaci));
  uFilter('#filter');
}

function premestiUZavrsene(zavrseniZadatak){
  let zavrseniZadaci = uZadaci('zavrseniZadaci');
  zavrseniZadatak.dodat = vremeDodavanja(new Date());
  zavrseniZadaci.push(zavrseniZadatak);
  localStorage.setItem('zavrseniZadaci', JSON.stringify(zavrseniZadaci));
  poruke('Zadatak je uspešno prebačen u listu završenih zadataka!', 'zeleno');
}

function obrisiZavrseni(e){
  let tar_element = e.target.parentElement.parentElement;

  if (e.target.parentElement.classList.contains('deleteFinished')){
    if(confirm('Da li ste sigurni da želite da obrišete zadatak?')){
      tar_element.remove();
      obrisiZavrseniIzLS(tar_element);
    } else {
      uFilter('#filter_gotovih');
    }
  }
}

function obrisiZavrseniIzLS(objZadatak){
  let zavrseniZadaci = uZadaci('zavrseniZadaci');
  let z_length = zavrseniZadaci.length;
  let ind = -1;

  for (let i = 0; i < z_length; i++) {
    if (objZadatak.childNodes[2].textContent === zavrseniZadaci[i].zadatak){     
      ind = i;
    }
  }

  if (objZadatak.childNodes[2].textContent === zavrseniZadaci[ind].zadatak){
    zavrseniZadaci.splice(ind, 1);
  }

  localStorage.setItem('zavrseniZadaci', JSON.stringify(zavrseniZadaci));
  poruke('Zadatak je uspešno obrisan!', 'zeleno');
  uFilter('#filter_gotovih');
}

// briše sve gotove zadatke i čisti LS
function obrisiSveGotove(){
  let zavrseniZadaci = uZadaci('zavrseniZadaci');

  if (zavrseniZadaci.length === 0) {
    poruke('Nema zadataka za brisanje!', 'crveno');
    uFilter('#filter_gotovih');
    return false;
  }

  if(confirm('Da li ste sigurni da želite da obrišete sve gotove zadatke?')){
    while(lista_gotovih_zadataka.firstChild){
      lista_gotovih_zadataka.removeChild(lista_gotovih_zadataka.firstChild);
    }
    localStorage.removeItem('zavrseniZadaci');
    poruke('Gotovi zadaci su uspešno obrisani!', 'zeleno');
    uFilter('#filter_gotovih');
  } else {
    uFilter('#filter_gotovih');
  }
}

// filter
function filterZadataka(koji_task, koji_filter){
  var tekst = document.querySelector(koji_filter).value.toLowerCase().trim();
  document.querySelectorAll(koji_task).forEach(
    function(zadatak){
    var item = zadatak.childNodes[2].textContent;
    item.toLowerCase().indexOf(tekst) != -1 ? zadatak.style.display = 'grid' : zadatak.style.display = 'none';
  });
}

function vremeDodavanja(date) {
  var meseci = [
    "Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul",
    "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
  ];

  var dan = date.getDate();
  var mesec = date.getMonth();
  var godina = date.getFullYear();
  var sati = date.getHours();
  var minuti = date.getMinutes();
  if (sati < 10) sati = `0${sati}`;
  if (minuti < 10) minuti = `0${minuti}`;

  return `${dan}. ${meseci[mesec]} ${godina}, u ${sati}:${minuti}`;
}

function poruke(poruka, boja) {
  let div = document.createElement('div');
  div.className = `msg ${boja}`;
  div.appendChild(document.createTextNode(poruka));
  let forma_rod = document.querySelector('.container');
  let el_ispod = document.querySelector('.row');
  forma_rod.insertBefore(div, el_ispod);

  setTimeout(function(){
    document.querySelector('.msg').remove();
  }, 3000);
}

dodaj_zadatak_forma.addEventListener('submit', function(e){
  dodajZadatak(e);
});

document.addEventListener('DOMContentLoaded', function(){
  prikaziZadatke('zadaci', 'current', 'deleteCurrent', 'lista_trenutnih_zadataka','arrow-circle-right', 'red-text', 'tekuci', 'zelena_strelica', 'nov');
  prikaziZadatke('zavrseniZadaci', 'finished', 'deleteFinished', 'lista_gotovih_zadataka','check', 'green-text', '', '', '');
});

lista_trenutnih_zadataka.addEventListener('click', function(e){
  izbrisiTekuciZadatak(e);
  otvoriEditModal(e);
});

btnBrisiSveGotove.addEventListener('click', function(e){
  obrisiSveGotove(e);
});

lista_gotovih_zadataka.addEventListener('click', function(e){
  obrisiZavrseni(e);
});

filter.addEventListener('keyup', function(){
  filterZadataka('.current', '#filter');
});

filter_gotovih.addEventListener('keyup', function(){
  filterZadataka('.finished', '#filter_gotovih');
});