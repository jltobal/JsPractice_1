const canvas = document.getElementById("mi_canvas");
const context = canvas.getContext("2d");
let formas = [];
let keys = []; // crea un arreglo de eventos de teclado
let is_dragging = false;
let forma_actual;
let inicioX;
let inicioY;

class Figura{           //CREO CLASE FIGURA
  
    constructor(posX, posY, ancho, color){
        this.posX = posX;
        this.posY = posY;
        this.ancho = ancho;
        this.color = color;
    }
    dibujarForma(){}
}

class Cuadrado extends Figura{      //CREO LA FIGURA CUADRADO
    constructor(posX, posY, alto, ancho, color){
        super(posX, posY, ancho, color);
        this.alto = alto;
    }

    dibujarForma(){
        context.fillStyle = this.color;
        context.fillRect(this.posX, this.posY, this.ancho, this.alto);
        context.fill();
    }
}

class Circulo extends Figura{       //CREO LA FIGURA CIRCULO
    constructor(posX, posY, ancho, color){
        super(posX, posY, ancho, color);
    }

    dibujarForma(){
        context.fillStyle = this.color;
        context.beginPath()
        context.arc(this.posX, this.posY, this.ancho/2, 0, 2*Math.PI);
        context.closePath();
        context.fill();
    }
}

let crearFormaAleatoria = function(){ //Con Math random genera valores para crear formas aleatoreas.
    const tipo = ["circulo", "cuadrado", "rectangulo","circulo", "cuadrado", "rectangulo"];
    const tipo_forma = tipo[Math.floor(Math.random() * tipo.length)];
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const posX = Math.floor(Math.random()*canvas.width-50);
    const posY = Math.floor(Math.random()*canvas.height-50);
    const ancho = Math.floor(Math.random() * canvas.width/2);
    let alto = Math.floor(Math.random() * canvas.height/2);

    if(alto < 50){
        alto = alto + alto;
    }else if(alto > 200){
        alto = alto/2;
    }

    if(tipo_forma == "circulo"){
        formas.push(new Circulo(posX, posY, alto, color));
    }else if(tipo_forma == "cuadrado"){
        formas.push(new Cuadrado(posX, posY, alto, alto, color));
    }else{
        formas.push(new Cuadrado(posX, posY, alto, ancho*1.1, color));
    }    
}

let mouse_up = function(event){  //Si suelto el mouse, draggin es falso
    if(!is_dragging){
        return;
    }
    event.preventDefault();
    is_dragging = false;
}

let mouse_out = function(event){  //Si el mouse esta fuera de la forma, draggin es falso
    if(!is_dragging){
        return;
    }
    event.preventDefault();
    is_dragging = false;
}

let mouse_move = function(event){  //Si el mouse se mueve genera una accion
    if(!is_dragging){  //Si no es draggin, se corta el codigo.
        return;        
    }else{  //si es draggin true, genero movimiento de la figura
        console.log("mouse move");  //--DEBUG--//
        event.preventDefault();
        let mouseX = parseInt(event.offsetX);  //Leo la posicion X del mouse relativa al canvas
        let mouseY = parseInt(event.offsetY);  //Leo la posicion Y del mouse relativa al canvas
        let dragX = mouseX - inicioX;  //Comparo la posicion del mouse con el inicio del evento mosue_down (CLICK)
        let dragY = mouseY - inicioY;  //Comparo la posicion del mouse con el inicio del evento mosue_down (CLICK)
        let forma_seleccionada = formas[forma_actual];  //Selecciono la forma del arreglo formas que se va a mover

        forma_seleccionada.posY += dragY;  //modifico la posicion Y de la forma clickeada
        forma_seleccionada.posX += dragX;  //modifico la posicion X de la forma clickeada

        dibujarLasFormas();  //Vuelvo a dibujar las formas

        inicioX = mouseX;  //Renuevo el inicio del movimiento.
        inicioY = mouseY;  //Renuevo el inicio del movimiento.
    }
}

let mouse_down = function(event){   //Verifico el puntero al hacer click (mouse_down)
    event.preventDefault();
    inicioX = parseInt(event.offsetX);  //Leo la posicion X del mouse relativa al canvas
    inicioY = parseInt(event.offsetY);  //Leo la posicion Y del mouse relativa al canvas
    let index = 0;                      //Creo un indice temporal para saber cual es la forma clickeada
    for(let forma of formas){           //Recorro el arreglo de formas para buscar la forma clickeada
        if(is_mouse_in_shape(inicioX, inicioY, forma)){  //verifico si el mouse esta en la forma
            forma_actual = index;  //Guardo la posicion de la forma en la cual el mouse esta clickeando
            is_dragging = true;  //Si el mouse esta en la forma al hacer click, puedo arrastarla (dragear)
            console.log("yes");//--DEBUG--//
        }else{
            console.log("no");//--DEBUG--//
        }
        index ++;
    }
}

let is_mouse_in_shape = function(x, y, forma){   //Verifico si el mouse esta dentro de la forma
    if (forma instanceof Circulo) {
        let distancia_al_centro = Math.sqrt((x - forma.posX) ** 2 + (y - forma.posY) ** 2);  //verifico el mouse en un circulo
        return distancia_al_centro <= forma.ancho/2;  //devuelvo true o folse en base al puntero del mouse con el centro del circulo
    } else {
        let forma_izq = forma.posX;   //Busco el inicio de la forma del lado izquierdo
        let forma_der = forma.posX + forma.ancho;  //sumo el valor anterior con el ancho para ubicar la posicion de izquierda a derecha de la forma
        let forma_top = forma.posY;  //Busco el inicio de la forma de la forma superior 
        let forma_bottom = forma.posY + forma.alto; //suma la parte superior con el alto de la forma para ubicar la posicion dela base hasta la parte superior
        if (x > forma_izq && x < forma_der && y > forma_top && y < forma_bottom){  //verifica si el mouse (x, y) esta dentro de los limites de la forma
            return true;
        }
        return false;
    }
}

for(let i = 0; i<12; i++){  //CREA FORMAS ALEATORIAS
    crearFormaAleatoria();
}

let dibujarLasFormas = function(){   //DIBUJA LAS FORMAS EN EL CANVAS
    context.clearRect(0, 0, canvas.width, canvas.height);  //BORRA EL CANVAS
    for(let forma of formas){  //DIBUJA TODAS LAS FORMAS DE A UNA
        forma.dibujarForma();
    }
}

canvas.onmousedown = mouse_down;        //defino el comportamiento del click
canvas.onmouseup = mouse_up;            //defino el comportamiento al soltar el ckicl
canvas.onmouseout = mouse_out;          //defino el comportamiento cuando el mouse esta fuera de algo x
canvas.onmousemove = mouse_move;        //defino el comportamiento del movimiento del mouse
window.addEventListener("keyup", keysReleased, false);//verifica si la tecla se "solto"
window.addEventListener("keydown", keyPressed, false);//Verifica que boton del teclado se presiono

dibujarLasFormas();  //Dibujo las formas por primera vez

function keyPressed(e){ //verifica que tecla se toco
    let forma_seleccionada = formas[forma_actual];
    let moveX = 0;
    let moveY = 0;
    keys[e.keyCode] = true;
    if(e.keyCode == 37){  //flecha izquierda
        moveX -=5;
    }
    else if(e.keyCode == 38){  //flecha arriba
        moveY -=5;
    }
    else if(e.keyCode == 39){  //flecha derecha
        moveX +=5;
    }
    else if(e.keyCode == 40){  //flecha abajo
        moveY +=5;
    }
    forma_seleccionada.posY += moveY;  //modifico la posicion Y de la forma segun las teclas persionadas
    forma_seleccionada.posX += moveX;  //modifico la posicion X de la forma segun las teclas persionadas
}

function keysReleased(e){  //verifica si se solto la tecla
    keys[e.keyCode] = false;
}

function animate(){  //Genero animacion (Sirve para el teclado.)
    context.clearRect(0,0, canvas.width, canvas.height);
    dibujarLasFormas();
    requestAnimationFrame(animate);
}

animate();