var novi_zadatak = document.querySelector('#zadatak');
var dodaj_zadatak_forma = document.querySelector('#dodaj_zadatak');
var lista_trenutnih_zadataka = document.querySelector('#tekuci_zadaci');
var lista_gotovih_zadataka = document.querySelector('#gotovi_zadaci');
var filter = document.querySelector('#filter');
var filter_gotovih = document.querySelector('#filter_gotovih');
var btnBrisiSveGotove = document.querySelector('.obrisi_gotove');

// var local_storage = localStorage.getItem(zadatak) === null ? [] : JSON.parse(localStorage.getItem(zadatak));

// if (localStorage.getItem('zadaci') === null) localStorage.setItem('zadaci', '[]');
// if (localStorage.getItem('finishedTasks') === null) localStorage.setItem('finishedTasks', '[]');

// Dodavanje zadataka
function dodajZadatak(e) {
  e.preventDefault();
  let unos_zadatka = novi_zadatak.value.trim();
  
  if (unos_zadatka === '') {
    alert('Polje za unos zadataka ne sme biti prazno!');
    novi_zadatak.focus();
    return false;
  }
  
  // provera da li zadatak već postoji na listi
  if ((localStorage.getItem('zadaci') !== null)){
    let zadaci = JSON.parse(localStorage.getItem('zadaci'));
    let z_length = zadaci.length;
    for (let i = 0; i < z_length; i++){
      if (zadaci[i].zadatak.toLowerCase() === unos_zadatka.toLowerCase()){
        alert('Zadatak već postoji na listi, unesite novi zadatak!');
        novi_zadatak.value = '';
        novi_zadatak.focus();
        return false;
      }
    }
  }

  let li = document.createElement('li');
  li.className = 'collection-item current';
  li.innerHTML ='<i class="fa fa-arrow-circle-right red-text u-padding-right"><span class="badge new red u-padding-right" data-badge-caption="Novo!"></span></i>';
  li.appendChild(document.createTextNode(novi_zadatak.value));

  let link = document.createElement('a');
  link.setAttribute('title', 'Premesti u listu završenih zadataka');
  link.className = 'delete-item secondary-content deleteCurrent';
  link.innerHTML ='<i class="fa fa-arrow-circle-down green-text"></i>';
  li.appendChild(link);
  lista_trenutnih_zadataka.appendChild(li);
  
  snimiNoviZadatak({ zadatak: novi_zadatak.value });
  novi_zadatak.value = '';
  novi_zadatak.focus();
}

//snima novi zadatak
function snimiNoviZadatak(zadatak){
  let zadaci;
  zadaci = localStorage.getItem('zadaci') === null ? [] : JSON.parse(localStorage.getItem('zadaci'));
  zadaci.push(zadatak);
  localStorage.setItem('zadaci', JSON.stringify(zadaci));
}

// prikazuje sve zadatke i tekuće i završene zavisno od argumenata
function prikaziZadatke(zadatak, status, zaBrisanje, lista, ikonica, boja, tooltip, strelica){
  let zadaci;
  zadaci = localStorage.getItem(zadatak) === null ? [] : JSON.parse(localStorage.getItem(zadatak));
  let z_length = zadaci.length;
  for (let i = 0; i < z_length; i++){

    let li = document.createElement('li');
    // li.innerHTML ='<i class="fa fa-' + ikonica + ' ' + boja + ' u-padding-right test"></i>';
    li.innerHTML ='<i class="fa fa-' + ikonica + ' ' + boja + ' u-padding-right test"></i>';
    li.className = 'collection-item ' + status;
    li.appendChild(document.createTextNode(zadaci[i].zadatak));

    let link = document.createElement('a');

    tooltip == 'tekuci' ? 
      link.setAttribute('title', 'Premesti u listu završenih zadataka') : 
      link.setAttribute('title', 'Obriši iz liste završenih zadataka');

    link.className = 'delete-item secondary-content ' + zaBrisanje;
    strelica == 'zelena_strelica' ? 
      link.innerHTML ='<i class="fa fa-arrow-circle-down green-text"></i>' : 
      link.innerHTML ='<i class="fa fa-ban red-text"></i>';

    li.appendChild(link);

    if (lista === 'lista_trenutnih_zadataka') lista_trenutnih_zadataka.appendChild(li);
    if (lista === 'lista_gotovih_zadataka') lista_gotovih_zadataka.appendChild(li);
  }
}

// Briše targetovani li element i poziva funkciju da ga premesti u UL gotovih i obriše iz 'zadaci' iz LS
function izbrisiTekuciZadatak(e){
  if (e.target.parentElement.classList.contains('deleteCurrent')){
    if(confirm('Da li ste sigurni da želite da prebacite zadatak u gotove zadatke?')){
      e.target.parentElement.parentElement.remove();
      prebaciIztekucihUGotove(e.target.parentElement.parentElement.textContent);
      skloniIzTekucih(e.target.parentElement.parentElement);
    }
  }
}

// premešta stavku iz tekućih u gotove zadatke bez location.reloada()
function prebaciIztekucihUGotove(txtZaLi){
  let li = document.createElement('li');
  li.className = 'collection-item finished';
  li.innerHTML ='<i class="fa fa-check green-text u-padding-right"></i>';
  li.appendChild(document.createTextNode(txtZaLi));

  let link = document.createElement('a');
  link.setAttribute('title', 'Obriši iz liste završenih zadataka');
  link.className = 'delete-item secondary-content deleteFinished';
  link.innerHTML ='<i class="fa fa-ban red-text"></i>';
  li.appendChild(link);
  lista_gotovih_zadataka.appendChild(li);
}

function skloniIzTekucih(objZadatak){
  // ako ne postoje 'zadaci' u LS pravi prazan niz ako postoje uzima niz i pretvara u niz objekata
  let zadaci = localStorage.getItem('zadaci') === null ? [] : JSON.parse(localStorage.getItem('zadaci'));
  let z_length = zadaci.length;

  // ide kroz niz i proverava da li u nizu postoji objekat sa propertijem zadatak čiji se
  // sadržaj poklapa sa textContentom kliknutog polja
  let ind = -1;
  for (let i = 0; i < z_length; i++) {
    if (objZadatak.textContent === zadaci[i].zadatak){     
      ind = i;
    }
  }
  
  if (objZadatak.textContent === zadaci[ind].zadatak){
    premestiUZavrsene(zadaci[ind].zadatak);
    zadaci.splice(ind, 1);
  }
  if (document.querySelector('#filter').value !== '') document.querySelector('#filter').focus();
  localStorage.setItem('zadaci', JSON.stringify(zadaci));
}

function premestiUZavrsene(zavrseniZadatak){
  let zavrseniZadaci;
  zavrseniZadaci = localStorage.getItem('zavrseniZadaci') === null ? [] : JSON.parse(localStorage.getItem('zavrseniZadaci'));
  zavrseniZadaci.push({zadatak: zavrseniZadatak});
  localStorage.setItem('zavrseniZadaci', JSON.stringify(zavrseniZadaci));
  // location.reload();
}

function obrisiZavrseni(e){
  if (e.target.parentElement.classList.contains('deleteFinished')){
    if(confirm('Da li ste sigurni da želite da obrišete zadatak?')){
      e.target.parentElement.parentElement.remove();
      obrisiZavrseniIzLS(e.target.parentElement.parentElement);
    }
  }
}

function obrisiZavrseniIzLS(objZadatak){
  let zavrseniZadaci;
  zavrseniZadaci = localStorage.getItem('zavrseniZadaci') === null ? [] : JSON.parse(localStorage.getItem('zavrseniZadaci'));
  let z_length = zavrseniZadaci.length;

  // ide kroz niz i proverava da li u nizu postoji objekat sa propertijem zadatak čiji se
  // sadržaj poklapa sa textContentom kliknutog polja
  let ind = -1;
  for (let i = 0; i < z_length; i++) {
    if (objZadatak.textContent === zavrseniZadaci[i].zadatak){     
      ind = i;
    }
  }

  if (objZadatak.textContent === zavrseniZadaci[ind].zadatak){
    zavrseniZadaci.splice(ind, 1);
  }
  if (document.querySelector('#filter_gotovih').value !== '') document.querySelector('#filter_gotovih').focus();
  localStorage.setItem('zavrseniZadaci', JSON.stringify(zavrseniZadaci));
}

// briše sve gotove zadatke i čisti LS
function obrisiSveGotove(){
  if(confirm('Da li ste sigurni da želite da obrišete sve gotove zadatke?')){
    while(lista_gotovih_zadataka.firstChild){
      lista_gotovih_zadataka.removeChild(lista_gotovih_zadataka.firstChild);
    }
    localStorage.removeItem('zavrseniZadaci');
  }
}


dodaj_zadatak_forma.addEventListener('submit', function(e){
  dodajZadatak(e);
});

document.addEventListener('DOMContentLoaded', function(){
  prikaziZadatke('zadaci', 'current', 'deleteCurrent', 'lista_trenutnih_zadataka','arrow-circle-right', 'red-text', 'tekuci', 'zelena_strelica');
  prikaziZadatke('zavrseniZadaci', 'finished', 'deleteFinished', 'lista_gotovih_zadataka','check', 'green-text', '', '');
});

lista_trenutnih_zadataka.addEventListener('click', function(e){
  izbrisiTekuciZadatak(e);
});

btnBrisiSveGotove.addEventListener('click', function(e){
  obrisiSveGotove(e);
});

lista_gotovih_zadataka.addEventListener('click', function(e){
  obrisiZavrseni(e);
});