class Monster {
    static active = null; // Propiedad estática para rastrear el objeto activo
    static arrayMonsters = [] //Array con todos los monstruos
    constructor(num, name, maxlife,attack) {
        this.num = num;     // Número identificador del monstruo
        this.name = name;   // Nombre del monstruo
        this.maxlife = maxlife;   // Puntos de vida del monstruo
        this.attack = attack;   // Puntos de ataque del monstruo
        Monster.arrayMonsters[num] = this;
    }

    activate() {
        Monster.active = this; // Establece este objeto como el activo
    }
}

class Hero {
    static active = null;
    constructor(maxlife,attack) {
        this.maxlife = maxlife;   // Puntos de vida del Heroe
        this.attack = attack;   // Puntos de ataque del Heroe
        this.activate();
    }
    
    activate(){
        Hero.active = this;
    }
    
    increaseAttack(n){
        this.attack += n;
    }
}


// Función para guardar datos en una cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const jsonValue = JSON.stringify(value);
    document.cookie = `${name}=${jsonValue}; expires=${date.toUTCString()}; path=/`;
}

// Función para obtener datos de una cookie
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) {
            try {
                return JSON.parse(value);
            } catch {
                return null; // En caso de error en el JSON
            }
        }
    }
    return null;
}

// Inicialización de los valores desde la cookie o desde cero
/**
 * @type {Hero}
 * 
 */
let theHero
const savedData = getCookie('stats') || { lifeMonster: 100,count2: 0, exp: 0, lvl: 1, gold: 0, sword: false,theHero: new Hero(100,10) };
console.log(savedData);
({ lifeMonster,count2, exp, lvl, gold, sword,theHero} = savedData);
theHero = new Hero(theHero.maxlife,theHero.attack)
console.log(theHero);


document.title = "DQ-Clicker LVL: " + lvl;

// Referencias a los elementos del DOM
const image = document.getElementById('clickableImage');
const lifeBarMonster = document.getElementById('lifeBarMonster');
const lifeBarHero = document.getElementById('lifeBarHero');
const counterDisplay2 = document.getElementById('clickCount2');
const expDisplay = document.getElementById('exp');
const lvlDisplay = document.getElementById('lvl');
const goldDisplay = document.getElementById('gold');
const buySwordButton = document.getElementById('buySwordButton');
const lifeBarTextMonster = document.getElementById('lifeBarTextMonster');
const lifeBarTextHero = document.getElementById('lifeBarTextHero');


const slime = new Monster(0, 'Slime', 100,1);
const bat = new Monster(1, 'Bat', 150,2);
const chimaera = new Monster(2,'Chimaera',125,1)

pvec = [400,400,200] //Vector de probabilidad segun la zona
setMonster(slime.num);


lifeMonster = Monster.active.maxlife
lifeHero = 100
updateHealthBars(lifeMonster,lifeHero);
// Actualizar la visualización inicial
counterDisplay2.textContent = count2;
expDisplay.textContent = exp;
lvlDisplay.textContent = lvl;
goldDisplay.textContent = gold;
buySwordButton.disabled = sword || gold < 100;



// Manejar clics en la imagen interactiva (superior)
image.addEventListener('click', () => {
    lifeMonster -= theHero.attack;
    lifeHero -= Monster.active.attack

    // Verificar si la vida del monstruo llega a 0
    if (lifeMonster <= 0) {
        newEnemy(); //Aparece un nuevo enemigo cuando el anterior muere
        exp += Math.floor(Math.random() * 9 + 1); // Incrementar EXP con cada clic
        gold += Math.floor(Math.random() * 5); // Incrementar oro con cada clic
        count2++;   // Incrementa el contador de reinicios
        lifeMonster =Monster.active.maxlife; // Reinicia la barra de vida
    }

    // Verificar si EXP alcanza el límite
    if (exp >= 100) {
        exp -= 100; // Restar EXP al máximo
        lvl++;      // Incrementar nivel
        document.title = "DQ-Clicker LVL: " + lvl;

    }

    

    // Actualizar el botón de comprar espada
    buySwordButton.disabled = sword || gold < 100;

    // Guardar datos en la cookie
    setCookie('stats', { count2, exp, lvl, gold, sword,theHero }, 7); 

    // Actualizar la visualización
    updateHealthBars(lifeMonster,lifeHero);
    
    counterDisplay2.textContent = count2;
    expDisplay.textContent = exp;
    lvlDisplay.textContent = lvl;
    goldDisplay.textContent = gold;
    
    //Verifica si la salud del heroe llega a 0
    if(lifeHero <= 0){
        death();
    }
});

// Manejar clic en el botón de comprar espada
buySwordButton.addEventListener('click', () => {
    if (gold >= 100 && !sword) {
        gold -= 100; 
        sword = true; 
        buySwordButton.disabled = true; 
        theHero.increaseAttack(5);
        setCookie('stats', { lifeMonster, count2, exp, lvl, gold, sword,theHero }, 7); 
        goldDisplay.textContent = gold;
    }
});

function setMonster(num) {

    var subs = image.getElementsByClassName('Monster');

    for (var i = 0; i < subs.length; i++) {
        var a = subs[i];

        i != num ? a.style.display = 'none' : a.style.display = 'block'

    }

    Monster.arrayMonsters[num].activate();
}

function newEnemy(){ //Funcion que genera un nuevo enemigo
    let randNum = Math.ceil((Math.random()*1000))
    
    let acum = 0, i=0
    

    while (acum < randNum){
        acum += pvec[i] 
        i++

    }
    i--;

    setMonster(i);


}


function zoom(){
    lifeMonster = Monster.active.maxlife
    lifeHero = Hero.active.maxlife
    updateHealthBars(lifeMonster,lifeHero);
    
    alert('You managed to escape and rest in the inn')
   
}

function death(){
    lifeMonster = Monster.active.maxlife
    lifeHero = Hero.active.maxlife
    updateHealthBars(lifeMonster,lifeHero);

    alert('You died and lost '+Math.floor(gold/2)+' gold');
    gold -= Math.floor(gold/2)
    goldDisplay.textContent = gold;
}

function updateHealthBars(lifeMonster,lifeHero){
    lifeBarTextMonster.textContent = `Monster HP: ${lifeMonster}/${Monster.active.maxlife}`;
    lifeBarMonster.style.width = `${(lifeMonster / Monster.active.maxlife * 100)}%`;
    lifeBarTextHero.textContent = `Hero HP:${lifeHero}/${Hero.active.maxlife}`;
    lifeBarHero.style.width = `${(lifeHero / Hero.active.maxlife * 100)}%`;
}