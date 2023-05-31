//Comenzamos escribiendo nuestras variables globales
const API = 'https://pokeapi.co/api/v2/pokemon'; //API principal donde haremos todos nuestros llamados
const pagination = null || document.querySelector('#paginacion');
const content = null || document.querySelector('.content');//El main en donde plasmaremos los datos en el html
const buttons = null || document.querySelector('#buttons');//El div donde se plasmaran los botones de la pagginacion
let btnNext,btnPrevious,btnInicio; // Variables de nuestros botones para asignar valores e imprimirlos en pantalla
const Dexi = null || document.querySelector('.dexi');
const namePoke =document.querySelector('.namePoke');

//Comenzamos con la programacion para obtener los datos de los pokemon mediante async await
const getPokemon = async (urlApi) =>{
    try{
        const response = await fetch(urlApi);
        const results = await response.json();
        console.log(results)//Pasamos los resultados completos de cada pokemon
        //Codigo de nuestros botones para asignarles un url y sepan hacia donde van
        btnNext = results.next ?`<li class="page-item"><a class="page-link" data-url=${results.next}>Siguiente</a></li>` : '';
        btnPrevious=results.previous ? `<li class="page-item"><a class="page-link" data-url=${results.previous}>Anterior</a></li>` : ''
        pagination.innerHTML=btnPrevious + " " + btnNext;
    }catch(e){
        console.error(e);
    }//Utilizamos el try catch para la prueba de errores y ver si la estamos cagando
}

getPokemon(`${API}/?limit=12&offset=0`)

 //Comenzaremos a hacer la funcion para obtener todos los datos del pokemon
 const dataPoke = async(data) => {
    try{

    }catch(error){
        console.error(error);
    }
 }