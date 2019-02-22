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
  if (document.querySelector(filter).value !== '') document.querySelector(filter).focus();
}

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
  if (localStorage.getItem('zadaci') !== null){
    let zadaci = JSON.parse(localStorage.getItem('zadaci'));
    let z_length = zadaci.length;
    for (let i = 0; i < z_length; i++){
      if (zadaci[i].zadatak.toLowerCase() === unos_zadatka.toLowerCase()){
        alert('Zadatak već postoji na listi, unesite novi zadatak!');
        novi_zadatak.focus();
        return false;
      }
    }
  }

  let li = document.createElement('li');
  li.className = 'collection-item current li_grid';
  li.innerHTML ='<i class="fa fa-arrow-circle-right red-text u-padding-right vert_centriranje"></i>';
  li.innerHTML += '<span class="badge new red u-padding-right" data-badge-caption="Novo!"></span>';
  li.appendChild(document.createTextNode(novi_zadatak.value));

  // za edit dugme
  let edit = document.createElement('a');
  edit.setAttribute('title', 'Izmeni zadatak');
  edit.className = 'za_edit';
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
  
  snimiNoviZadatak({ zadatak: novi_zadatak.value });
  novi_zadatak.value = '';
  novi_zadatak.focus();
}

//snima novi zadatak
function snimiNoviZadatak(zadatak){
  let zadaci = uZadaci('zadaci');
  zadaci.push(zadatak);
  localStorage.setItem('zadaci', JSON.stringify(zadaci));
}

// prikazuje sve zadatke i tekuće i završene zavisno od argumenata
function prikaziZadatke(zadatak, status, zaBrisanje, lista, ikonica, boja, tooltip, strelica, nov){
  let zadaci = uZadaci(zadatak);
  let z_length = zadaci.length;

  for (let i = 0; i < z_length; i++){
    let li = document.createElement('li');
    li.className = 'collection-item ' + status + ' li_grid';
    li.innerHTML ='<i class="fa fa-' + ikonica + ' ' + boja + ' u-padding-right vert_centriranje"></i><i></i>';
    li.appendChild(document.createTextNode(zadaci[i].zadatak));
    
    // za edit dugme
    let edit = document.createElement('a');
    edit.setAttribute('title', 'Izmeni zadatak');
    edit.className = 'za_edit';
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
    link.className = 'delete-item secondary-content ' + zaBrisanje;
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
      prebaciIztekucihUGotove(tar_element.textContent);
      skloniIzTekucih(tar_element);
    }
  }
}

// premešta stavku iz tekućih u gotove zadatke bez location.reloada()
function prebaciIztekucihUGotove(txtZaLi){
  let li = document.createElement('li');
  li.className = 'collection-item finished li_grid';
  li.innerHTML ='<i class="fa fa-check green-text u-padding-right vert_centriranje"></i><span></span>';
  li.appendChild(document.createTextNode(txtZaLi));

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

// za edit
function editTekucegZadatka(e){
  let zadaci = uZadaci('zadaci');
  let z_length = zadaci.length;
  let za_edit = e.target.parentElement.parentElement;
  let ind = -1;
  let promenjeni_zadatak;

  if (e.target.parentElement.classList.contains('za_edit')){
    for (let i = 0; i < z_length; i++) {
      if (za_edit.textContent === zadaci[i].zadatak){     
        ind = i;
      }
    }

    promenjeni_zadatak = prompt('Izmenite zadatak', za_edit.textContent).trim();

    if (promenjeni_zadatak !== null) {
      if (promenjeni_zadatak === '') {
        alert('Zadatak ne može biti prazno polje!');
        return false;
      }
      
      for (let i = 0; i < z_length; i++){
        if (zadaci[i].zadatak.toLowerCase() === promenjeni_zadatak.toLowerCase()){
          alert('Zadatak već postoji na listi!');
          return false;
        }
      }
      
      zadaci[ind].zadatak = promenjeni_zadatak;
      localStorage.setItem('zadaci', JSON.stringify(zadaci));  
      za_edit.childNodes[2].textContent = promenjeni_zadatak;
    }
    uFilter('#filter');
  }
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
    premestiUZavrsene(zadaci[ind].zadatak);
    zadaci.splice(ind, 1);
  }

  uFilter('#filter');
  localStorage.setItem('zadaci', JSON.stringify(zadaci));
}

function premestiUZavrsene(zavrseniZadatak){
  let zavrseniZadaci = uZadaci('zavrseniZadaci');

  zavrseniZadaci.push({zadatak: zavrseniZadatak});
  localStorage.setItem('zavrseniZadaci', JSON.stringify(zavrseniZadaci));
}

function obrisiZavrseni(e){
  let tar_element = e.target.parentElement.parentElement;

  if (e.target.parentElement.classList.contains('deleteFinished')){
    if(confirm('Da li ste sigurni da želite da obrišete zadatak?')){
      tar_element.remove();
      obrisiZavrseniIzLS(tar_element);
    }
  }
}

function obrisiZavrseniIzLS(objZadatak){
  let zavrseniZadaci = uZadaci('zavrseniZadaci');
  let z_length = zavrseniZadaci.length;
  let ind = -1;

  for (let i = 0; i < z_length; i++) {
    if (objZadatak.textContent === zavrseniZadaci[i].zadatak){     
      ind = i;
    }
  }

  if (objZadatak.textContent === zavrseniZadaci[ind].zadatak){
    zavrseniZadaci.splice(ind, 1);
  }

  uFilter('#filter_gotovih');
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

// filter
function filterTasks(koji_task, koji_filter){
  var tekst = document.querySelector(koji_filter).value.toLowerCase().trim();
  document.querySelectorAll(koji_task).forEach(
    function(zadatak){
    var item = zadatak.childNodes[2].textContent;
    item.toLowerCase().indexOf(tekst) != -1 ? zadatak.style.display = 'grid' : zadatak.style.display = 'none';
  });
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
  editTekucegZadatka(e);
});

btnBrisiSveGotove.addEventListener('click', function(e){
  obrisiSveGotove(e);
});

lista_gotovih_zadataka.addEventListener('click', function(e){
  obrisiZavrseni(e);
});

filter.addEventListener('keyup', function(){
  filterTasks('.current', '#filter');
});

filter_gotovih.addEventListener('keyup', function(){
  filterTasks('.finished', '#filter_gotovih');
});