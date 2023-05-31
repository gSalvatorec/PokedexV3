//Comenzamos escribiendo nuestras variables globales
const API = 'https://pokeapi.co/api/v2/pokemon'; //API principal donde haremos todos nuestros llamados
const pagination = null || document.querySelector('#paginacion');//Esta es la variable que utilizamos para los botones de paginacion
const contenedor = null || document.querySelector('#contPokemon')//Variable que utilizamos para imprimir los datos en pantalla
let btnNext,btnPrevious,btnInicio; // Variables de nuestros botones para asignar valores e imprimirlos en pantalla
//Comenzamos con la programacion para obtener los datos de los pokemon mediante async await
const getPokemon = async (urlApi) =>{
    try{
        const response = await fetch(urlApi);
        const results = await response.json();
        console.log(results)//Pasamos los resultados completos de cada pokemon
        dataPoke(results.results);
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
        for(let index of data){//Iteramos sobre la data que nos trae el documento
            const response = await fetch(index.url); // realizamos fetch a cada dato que obtenemos como url
            const result = await response.json();
            console.log(result);
            let {name,id} = result; //Hacemos destructuring a nuestro array para ingresar mas facil a las variables
            let vista = `
                <div class="card col-4 me-2 mb-2" style="width: 18rem;">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" class="card-img-top" alt="Imagen de Pokemon ${name}">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text fs-4"><img class="img-fluid" src="./src/img/icono-pokedex.png" alt="Imagen de Pokebola">${id}</p>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#dataModal">Srobre el</button>
                    </div>
                </div>
            `;
            contenedor.innerHTML += vista;
        }
    }catch(error){
        console.error(error);
    }
 }

 //Añadiendo la funcionalidad a los botones anterior y siguiente
 pagination.addEventListener('click', (e) =>{//Añadimos un evenListener a nuestra pagination para que escuche cuando demos click
    if(e.target.matches('.page-link')){ //Mientras que nuestro objeto contenga una clase llamada page-link sigue
        let value = e.target.dataset.url; //Asignamos el url a value
        contenedor.innerHTML=''; //Vaciamos nuestro contenedor para que quede vacio
        getPokemon(value); //Volvemos a llamar a getPokemon para que nos muestre los siguientes pokemon
    }
 })