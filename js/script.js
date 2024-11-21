class Monster {
    static active = null; // Propiedad estática para rastrear el objeto activo

    constructor(num, name, maxlife,attack) {
        this.num = num;     // Número identificador del monstruo
        this.name = name;   // Nombre del monstruo
        this.maxlife = maxlife;   // Puntos de vida del monstruo
        this.attack = attack;   // Puntos de ataque del monstruo
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



setMonster(slime.num)
slime.activate();

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
    const damage = sword ? 15 : 10; // Daño dependiendo si se tiene espada
    lifeMonster -= theHero.attack;
    lifeHero -= Monster.active.attack

    // Verificar si la vida llega a 0
    if (lifeMonster <= 0) {
        setMonster(bat.num)
        bat.activate();
        exp += Math.floor(Math.random() * 9 + 1); // Incrementar EXP con cada clic
        gold += Math.floor(Math.random() * 5); // Incrementar oro con cada clic
        count2++;   // Incrementa el contador de reinicios
        lifeMonster =Monster.active.maxlife; // Reinicia la barra de vida
    }
    updateHealthBars(lifeMonster,lifeHero);
    // Verificar si EXP alcanza el límite
    if (exp >= 100) {
        exp -= 100; // Restar EXP al máximo
        lvl++;      // Incrementar nivel
        document.title = "DQ-Clicker LVL: " + lvl;

    }


    // Actualizar el botón de comprar espada
    buySwordButton.disabled = sword || gold < 100;

    // Guardar datos en la cookie
    setCookie('stats', { count2, exp, lvl, gold, sword,theHero }, 7); // Guardar por 7 días

    // Actualizar la visualización
    updateHealthBars(lifeMonster,lifeHero);
    
    counterDisplay2.textContent = count2;
    expDisplay.textContent = exp;
    lvlDisplay.textContent = lvl;
    goldDisplay.textContent = gold;
});

// Manejar clic en el botón de comprar espada
buySwordButton.addEventListener('click', () => {
    if (gold >= 100 && !sword) {
        gold -= 100; // Descontar oro
        sword = true; // Adquirir espada
        buySwordButton.disabled = true; // Desactivar el botón
        setCookie('stats', { lifeMonster, count2, exp, lvl, gold, sword,theHero }, 7); // Guardar estado
        goldDisplay.textContent = gold;
    }
});

function setMonster(num) {
    var subs = image.getElementsByClassName('Monster');
    console.log(subs)
    console.log(subs.length)
    for (var i = 0; i < subs.length; i++) {
        var a = subs[i];

        i != num ? a.style.display = 'none' : a.style.display = 'block'

    }
}

function zoom(){
    lifeMonster = Monster.active.maxlife
    lifeHero = Hero.active.maxlife
    updateHealthBars(lifeMonster,lifeHero);
    
    alert('You managed to escape and rest in the inn')
   
}

function updateHealthBars(lifeMonster,lifeHero){
    lifeBarTextMonster.textContent = `Monster HP: ${lifeMonster}/${Monster.active.maxlife}`;
    lifeBarMonster.style.width = `${(lifeMonster / Monster.active.maxlife * 100)}%`;
    lifeBarTextHero.textContent = `Hero HP:${lifeHero}/${Hero.active.maxlife}`;
    lifeBarHero.style.width = `${(lifeHero / Hero.active.maxlife * 100)}%`;
}