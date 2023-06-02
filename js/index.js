//Comenzamos escribiendo nuestras variables globales
const API = 'https://pokeapi.co/api/v2/pokemon'; //API principal donde haremos todos nuestros llamados
const pagination = null || document.querySelector('#paginacion');//Esta es la variable que utilizamos para los botones de paginacion
const contenedor = null || document.querySelector('#contPokemon')//Variable que utilizamos para imprimir los datos en pantalla
let btnNext,btnPrevious,btnInicio; // Variables de nuestros botones para asignar valores e imprimirlos en pantalla
var obtData=[];//Array donde se guardaran todos los datos de nuestro pokemon cargado
//Comenzamos con la programacion para obtener los datos de los pokemon mediante async await
const Spinner = null || document.querySelector('#Spinner');
const getPokemon = async (urlApi) =>{
    try{
        const response = await fetch(urlApi);
        const results = await response.json();
        // console.log(results)//Pasamos los resultados completos de cada pokemon
        dataPoke(results.results);
        //Codigo de nuestros botones para asignarles un url y sepan hacia donde van
        btnNext = results.next ?`<li class="page-item"><a class="page-link" data-url=${results.next}>Siguiente</a></li>` : '';
        btnPrevious=results.previous ? `<li class="page-item"><a class="page-link" data-url=${results.previous}>Anterior</a></li>` : ''
        pagination.innerHTML=btnPrevious + " " + btnNext;
        pagination.style.cursor = 'pointer';
    }catch(e){
        console.error(e);
    }//Utilizamos el try catch para la prueba de errores y ver si la estamos cagando
}
 //Comenzaremos a hacer la funcion para obtener todos los datos del pokemon
 const dataPoke = async(data) => {
    Spinner.style.visibility = 'visible';//Se muestra el spinner y se oculta el contenedor y la paginacion
    contenedor.style.visibility = 'hidden';
    pagination.style.visibility = 'hidden';
    let Objeto;//Variable que funcionara de objeto para empujar los datos al array
    let contador = 0;
    try{
        for(let index of data){//Iteramos sobre la data que nos trae el documento
            const response = await fetch(index.url); // realizamos fetch a cada dato que obtenemos como url
            const result = await response.json();
            // console.log(result);
            let {name,id,stats,species} = result; //Hacemos destructuring a nuestro array para ingresar mas facil a las variables
            objeto={id,name,stats,species}; // Cargamos a nuestro objeto con nuestros datos
            let vista = `
                <div class="card col-4 me-2 mb-2" style="width: 18rem;">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" class="card-img-top" alt="Imagen de Pokemon ${name}">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text fs-4"><img class="img-fluid" src="./src/img/icono-pokedex.png" alt="Imagen de Pokebola">${id}</p>
                        <button class="btn btn-primary btnCard" data-bs-toggle="modal" data-bs-target="#dataModal" id="${contador}">Srobre el</button>
                    </div>
                </div>
            `;
            contenedor.innerHTML += vista;//Comenzamos a agregar la vista a nuestro contenedor, siempre sumando para que muestre todo
            obtData.push(objeto);//Comenzamos a empujar nuestro objeto a nuestro array antes mencionado
            contador++;
        }
        await Loader();//Una vez cargadas las 12 cards llama a Loader para que muestre todo
        await setLocalStorage();// Una vez cargadas las cards comenzamos llamamos a SetLocalStorage
        //Comenzamos a crear los EventListener de nuestros botones
        let btnModal = null || document.querySelectorAll('.btnCard');
        btnModal.forEach(elem => {
            elem.addEventListener('click',(e)=>{
                btn(e.target.id);
            })
        })
    }catch(error){
        console.error(error);
    }
 }

 //Añadiendo la funcionalidad a los botones anterior y siguiente
 pagination.addEventListener('click', (e) =>{//Añadimos un evenListener a nuestra pagination para que escuche cuando demos click
    if(e.target.matches('.page-link')){ //Mientras que nuestro objeto contenga una clase llamada page-link sigue
        let value = e.target.dataset.url; //Asignamos el url a value
        contenedor.innerHTML=''; //Vaciamos nuestro contenedor para que quede vacio
        obtData=[];
        getPokemon(value); //Volvemos a llamar a getPokemon para que nos muestre los siguientes pokemon
    }
 })
const Loader = async () =>{
    return new Promise((resolve,reject) =>{
        setTimeout(()=>{
            resolve('Resuelto');
            Spinner.style.visibility = 'hidden';//Ocultamos el spinner y MoStramos el contenedor y la paginacion
            contenedor.style.visibility = 'visible';
            pagination.style.visibility = 'visible';
        },1500);
        
    })
}
const setLocalStorage = async () =>{
    for(let i = 0; i<obtData.length;i++){ // Recorrido que hara para saber la longitud de nuestro array
        //console.log(obtData[i]);
        localStorage.setItem(`dataPoke${i}`,JSON.stringify(obtData[i])); //Comenzamos a llenar el LocalStorage con nuestros datos de nuestro objeto
    }
}
function btn(element){
    console.log(element);
    let data = JSON.parse(localStorage.getItem(`dataPoke${element}`));
    let type;
    let text =[],
    textPlane='',
    textito = '';
    const modalInf = null || document.querySelector('#Dexi');
    try {
        fetch(data.species.url)
        .then(response => response.json())
        .then(results =>{
            //console.log(results);
            for(let i =0 ; i < results.genera.length;i++){
                if(results.genera[i].language.name === 'es'){
                    //console.log(data.dataP.genera[i].genus);
                    type = results.genera[i].genus;
                }
            }
            for(let i =0 ; i < results.flavor_text_entries.length;i++){
                if(results.flavor_text_entries[i].language.name === 'es'){
                    text.push(results.flavor_text_entries[i].flavor_text);
                }
            }
            for(let i = 0 ; i<text.length; i++){
                if(text[i] != text[i+1]){
                    //console.log(text[i])
                    textPlane = textPlane+text[i];
                }else{
                    //console.log('es igual');
                }
            }
            //console.log(textPlane);
            textito = textPlane.split("\n").join(' ');
            textito = textito.split(".").join("\n");
            console.log(textito);
            console.log(data);
            let status = {};
            for(let i =0 ; i<data.stats.length; i++){
                //console.log(data.stats[i]);
                if(data.stats[i].stat.name!=='special-attack' && data.stats[i].stat.name!=='special-defense' ){
                    //console.log(data.stats[i]);
                    status[i] = data.stats[i].base_stat;
                }
            }
            console.log(status);
            let vista = `
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="namePoke">${data.name}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="card  w-100 mb-3" style="width: 18rem;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png" class="img-fluid rounded-start" alt="Imagen de Pokemon ${data.name}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">Descripcion</h5>
                            <p class="card-text lead">${textito}</p>
                            <p class="card-text"><small class="text-body-secondary">${type}</small></p>
                            <ul class="list-group list-group-horizontal fs-4 justify-content-center">
                                <li class="list-group-item lead">
                                    <img src="./src/img/heart-solid.svg" alt="">${status[0]}
                                </li>
                                <li class="list-group-item lead">
                                    <img src="./src/img/hand-fist-solid.svg" alt="">
                                    ${status[1]}
                                </li>
                                <li class="list-group-item lead">
                                    <img src="./src/img/shield-solid.svg" alt="">
                                    ${status[2]}
                                </li>
                                <li class="list-group-item lead">
                                    <img src="./src/img/feather-solid.svg" alt="">
                                    ${status[5]}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
            `
            modalInf.innerHTML = vista;
        })
        
    } catch (error) {
        console.error(error);
    }  
}
getPokemon(`${API}/?limit=12&offset=0`)