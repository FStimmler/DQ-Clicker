class Monster {
    constructor(num, name,life) {
        this.num = num;     // Número identificador del monstruo
        this.name = name;   // Nombre del monstruo
        this.life = life;   // Puntos de vida del monstruo
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
  const savedData = getCookie('stats') || { count2: 0, exp: 0, lvl: 1, gold: 0, sword: false };
  let {count2, exp, lvl, gold, sword } = savedData;

  document.title = "DQ-Clicker LVL: "+lvl;

  // Referencias a los elementos del DOM
  const image = document.getElementById('clickableImage');
  const lifeBar = document.getElementById('lifeBar');
  const counterDisplay2 = document.getElementById('clickCount2');
  const expDisplay = document.getElementById('exp');
  const lvlDisplay = document.getElementById('lvl');
  const goldDisplay = document.getElementById('gold');
  const buySwordButton = document.getElementById('buySwordButton');
  const lifeBarText = document.getElementById('lifeBarText');

  const slime = new Monster(0,'Slime', 100); 
  const bat = new Monster(1,'Bat', 150);


  setMonster(slime.num)
  actmon=slime;
  life=100
  lifeBarText.textContent = `HP ${life}/${actmon.life}`;
  lifeBar.style.width = `${(life/actmon.life*100)}%`;
  // Actualizar la visualización inicial
  lifeBar.style.width = `${life}%`;
  counterDisplay2.textContent = count2;
  expDisplay.textContent = exp;
  lvlDisplay.textContent = lvl;
  goldDisplay.textContent = gold;
  buySwordButton.disabled = sword || gold < 100;

  // Manejar clics en la imagen interactiva (superior)
  image.addEventListener('click', () => {
    const damage = sword ? 15 : 10; // Daño dependiendo si se tiene espada
    life -= damage;

    // Verificar si la vida llega a 0
    if (life <= 0) {
      setMonster(bat.num)
      actmon=bat;
      exp += Math.floor(Math.random()*9 + 1); // Incrementar EXP con cada clic
      gold += Math.floor(Math.random()*5); // Incrementar oro con cada clic
      count2++;   // Incrementa el contador de reinicios
      life = bat.life; // Reinicia la barra de vida
    }
    lifeBarText.textContent = `HP ${life}/${actmon.life}`;
    // Verificar si EXP alcanza el límite
    if (exp >= 100) {
      exp -= 100; // Restar EXP al máximo
      lvl++;      // Incrementar nivel
      document.title = "DQ-Clicker LVL: "+lvl;
      gold += 50; // Bonus de oro por subir de nivel
    }


    // Actualizar el botón de comprar espada
    buySwordButton.disabled = sword || gold < 100;

    // Guardar datos en la cookie
    setCookie('stats', {count2, exp, lvl, gold, sword }, 7); // Guardar por 7 días

    // Actualizar la visualización
    lifeBar.style.width = `${(life/actmon.life*100)}%`;
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
      setCookie('stats', { life, count2, exp, lvl, gold, sword }, 7); // Guardar estado
      goldDisplay.textContent = gold;
    }
  });

  function setMonster(num){
    var subs = image.getElementsByClassName('Monster');
    console.log(subs)
    console.log(subs.length)
    for(var i = 0; i < subs.length; i++){
      var a = subs[i];
      
      i != num? a.style.display = 'none':a.style.display = 'block'
      
    }
    
  }
