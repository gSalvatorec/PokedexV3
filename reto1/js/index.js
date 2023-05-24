//*Importando nuestras variables globales
const API = 'https://pokeapi.co/api/v2/pokemon'; //La url de la api que usaremos, incompleta para pasarle parametros
const content = null || document.querySelector('.content');//El main en donde plasmaremos los datos en el html
const buttons = null || document.querySelector('#buttons');//El div donde se plasmaran los botones de la pagginacion
let btnNext,btnPrevious,btnInicio; // Variables de nuestros botones para asignar valores e imprimirlos en pantalla
const spinner = null || document.querySelector('.pokemon'); //Spinner que usaremos para esconder la carga de datos
const Dexi = null || document.querySelector('.dexi');
const namePoke =document.querySelector('.namePoke');
//*Comenzamos mostrando nuestro spinner para que en cada carga se muestre mientras ocultamos nuestro contenido y botones

//Comenzamos con la programacion para obtener los datos de los pokemon mediante async await
const getPokemon = async (urlApi) =>{
    try{
        const response = await fetch(urlApi);
        const results = await response.json();
        dataPoke(results.results);//Pasamos los resultados completos de cada pokemon
        //Codigo de nuestros botones para asignarles un url y sepan hacia donde van
        btnNext = results.next ?`<button class = "btn" data-url=${results.next}>⏩</button>` : '';
        btnPrevious=results.previous ? `<button class="btn" data-url=${results.previous}>⏮</button>` : ''
        btnInicio=results.previous ? `<button class="btn" data-url=${API}/?limit=12&offset=0>Inicio</button>` : ''
        buttons.innerHTML=btnPrevious + " " + btnNext +" "+ btnInicio
    }catch(e){
        console.error(e);
    }//Utilizamos el try catch para la prueba de errores y ver si la estamos cagando
}

//Obteniendo individualmente los datos de los pokemon
const dataPoke = async(data) => {
    spinner.style.display = 'block';
    buttons.style.visibility = 'hidden';
    content.style.visibility = 'hidden';
    try{
        for(let index of data){//Iteramos sobre data que nos trae el fetch individual de cada pokemon, asi extraemos la url individual para obtener sus datos
            const response = await fetch(index.url);//Realizamos otra consulta ahora a la url individual
            const result = await response.json();//Obtenemos los datos individuales de cada pokemon
            //Creamos una variable llamada vista donde imprimimos el html iterando sobre todos los datos obtenidos
            let vista = `
                <div class="card border-dark" style="width: 18rem;">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${result.id}.png" class="card-img-top" alt="Imagen de pokemon ${result.name}">
                    <div class="card-body">
                        <h5 class="card-title">${result.name}</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item lead">${result.id}</li>
                    </ul>
                    <div class="card-body">
                        <button type="button" class="btn btn-outline-primary btn-lg" id="${result.id}" data-bs-toggle="modal" data-bs-target="#dataModal">Obtener Datos</button>
                    </div>
                </div>
            `
            content.innerHTML+=vista;//Agregamos a nuestro html la vista sobre el contenido sumando cada vez para que se muestren toodos los datos correctamente
            
        }
        await loader();
        
    }catch(e){
        console.error(e);
    }//Utilizamos de nuevo Try Catch para capturar los errores y ver donde fallamos
}
getPokemon(`${API}/?limit=12&offset=0`)

//Fuincionalidad del Paginador
buttons.addEventListener('click',(e)=>{
    if(e.target.matches('.btn')){
        let value=e.target.dataset.url//a value le damos el valor del url al que le daran click a nuestro boton
        content.innerHTML='';//Vaciamos nuestro content para que en cada click que le den muestre los siguientes 12 pokemon
        getPokemon(value)//llamamos de nuevo a nuestra funcion getPokemon pero esta vez le pasamos el valor de nuestra variable value que contiene el link del paginador
        //localStorage.setItem('url',value);
        //console.log(value);
    }
})
const loader = async () =>{
    return new Promise((resolve,reject) =>{
        setTimeout(()=>{
            resolve('Resuelto');
            spinner.style.display = 'none';
            content.style.visibility = 'visible';
            buttons.style.visibility = 'visible';
        },1500);
        
    })
}
//Comenzamos con la programacion para obtener los datos de los pokemon mediante async await

content.addEventListener('click',(e)=>{
    if(e.target.matches('.btn')){
        e.preventDefault();
        //console.log(e.target.id);
        var dataPokedex = {};
        fetch(`${API}-species/${e.target.id}`)
        .then(response => response.json())
        .then(dataP => {
            ///console.log(dataP);
            dataPokedex = {...dataPokedex,dataP};
            return fetch(`${API}/${e.target.id}`)
        }).then(response => response.json())
           .then(data => {
            //console.log(data);
            dataPokedex= {...dataPokedex,data};
           }).catch(e =>{
            console.error(e);
        }).finally(()=>{
            innerHtml(dataPokedex);  
            console.log('Consulta Finalizada')
        })
    }
})
function innerHtml(data){
    //console.log(data);
    let type;
    let text =[],
    textPlane='',
    contador=1;
    for(let i =0 ; i < data.dataP.genera.length;i++){
        if(data.dataP.genera[i].language.name === 'es'){
            //console.log(data.dataP.genera[i].genus);
            type = data.dataP.genera[i].genus;
        }
    }
    for(let i =0 ; i < data.dataP.flavor_text_entries.length;i++){
        if(data.dataP.flavor_text_entries[i].language.name === 'es'){
            text.push(data.dataP.flavor_text_entries[i].flavor_text);
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
    let textito = textPlane.split("\n").join(' ');
    textito = textito.split(".").join("\n");
    //console.log(textito);
    const hablar = new SpeechSynthesisUtterance(textito);
    hablar.lang = 'es-MX'
    speechSynthesis.speak(hablar);
    //Verificamos url para hacer que la voz deje de sonar
    let vista=`
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="namePoke">${data.data.name}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="card  w-100 mb-3" style="width: 18rem;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.data.id}.png" class="img-fluid rounded-start" alt="Imagen de Pokemon ${data.data.name}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">Descripcion</h5>
                            <p class="card-text lead">${textito}</p>
                            <p class="card-text"><small class="text-body-secondary">${type}</small></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>     
    `
    Dexi.innerHTML=vista;
    let close = document.querySelector('.btn-secondary'),
        tachesito= document.querySelector('.btn-close');
    close.addEventListener('click',()=>{
        //console.log('Le has picado a close');
        speechSynthesis.cancel();
    })
    tachesito.addEventListener('click',()=>{
        //console.log('Le has picado a tachesito');
        speechSynthesis.cancel();
    })
}
let modal = document.querySelector('.modal');
// Si el usuario hace clic fuera de la ventana, se cierra.
window.addEventListener("click",function(event) {
    if (event.target == modal) {
      //console.log('Has clikeado fuera del modal')
      speechSynthesis.cancel();
    }
});