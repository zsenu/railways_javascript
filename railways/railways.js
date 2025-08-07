//  Készítette: Fiók Nándor, GSTQLI

const menudiv   = document.querySelector('#menuscreen');
const descdiv   = document.querySelector('#descscreen');
const gamediv   = document.querySelector('#gamescreen');
const popup     = document.querySelector('#popup');
const rankField = document.querySelector('#ranklist');
const grid      = document.querySelector('#game');
let playername  = '';
let hard        = false;
let done        = false;
let tiles       = null;
let timer       = null;
let time        = 0;
let firstx      = -1;
let firsty      = -1;
let size, railsToPlace;

const easy =  [[['empty', 'mountain_SW', 'empty', 'empty', 'oasis'],
                ['empty', 'empty', 'empty', 'bridge_V', 'oasis'],
                ['bridge_V', 'empty', 'mountain_NW', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'oasis', 'empty'],
                ['empty', 'empty', 'mountain_NE', 'empty', 'empty']],
               [['oasis', 'empty', 'bridge_H', 'empty', 'empty'],
                ['empty', 'mountain_NW', 'empty', 'empty', 'mountain_NW'],
                ['bridge_V', 'oasis', 'mountain_NE', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'oasis', 'empty'],
                ['empty', 'empty', 'empty', 'empty', 'empty']],
               [['empty', 'empty', 'bridge_H', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'empty', 'bridge_V'],
                ['empty', 'mountain_NW', 'bridge_V', 'empty', 'empty'],
                ['empty', 'oasis', 'empty', 'empty', 'empty'],
                ['empty', 'bridge_H', 'empty', 'empty', 'mountain_NW']],
               [['empty', 'empty', 'empty', 'bridge_H', 'empty'],
                ['empty', 'empty', 'empty', 'empty', 'empty'],
                ['bridge_V', 'empty', 'mountain_SW', 'empty', 'mountain_SW'],
                ['empty', 'empty', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'oasis', 'mountain_NE', 'empty']],
               [['empty', 'empty', 'bridge_H', 'empty', 'empty'],
                ['empty', 'mountain_SE', 'empty', 'empty', 'empty'],
                ['bridge_V', 'empty', 'empty', 'mountain_NE', 'empty'],
                ['empty', 'empty', 'bridge_V', 'oasis', 'empty'],
                ['empty', 'mountain_NW', 'empty', 'empty', 'empty']]];

const diff =  [[['empty', 'mountain_SW', 'oasis', 'oasis', 'empty', 'bridge_H', 'empty'],
                ['bridge_V', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'bridge_V', 'empty', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'mountain_NE', 'empty', 'empty', 'empty'],
                ['mountain_NE', 'empty', 'mountain_SW', 'empty', 'bridge_H', 'empty', 'oasis'],
                ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'bridge_H', 'empty', 'empty', 'empty']],
               [['empty', 'empty', 'oasis', 'empty', 'empty', 'empty', 'empty'],
                ['bridge_V', 'empty', 'bridge_H', 'empty', 'empty', 'mountain_NW', 'empty'],
                ['empty', 'empty', 'bridge_H', 'empty', 'empty', 'empty', 'bridge_V'],
                ['mountain_SE', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
                ['empty', 'oasis', 'empty', 'mountain_SW', 'empty', 'empty', 'empty'],
                ['empty', 'mountain_SE', 'empty', 'empty', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'oasis', 'empty', 'empty', 'empty', 'empty']],
               [['empty', 'empty', 'bridge_H', 'empty', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'bridge_V'],
                ['oasis', 'empty', 'mountain_NE', 'empty', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
                ['empty', 'oasis', 'mountain_NE', 'empty', 'bridge_H', 'empty', 'empty'],
                ['bridge_V', 'empty', 'empty', 'empty', 'empty', 'mountain_SW', 'empty'],
                ['empty', 'empty', 'oasis', 'mountain_NE', 'empty', 'empty', 'empty']],
               [['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'bridge_V', 'empty', 'mountain_NW', 'empty'],
                ['empty', 'empty', 'mountain_NE', 'empty', 'empty', 'empty', 'empty'],
                ['empty', 'bridge_H', 'empty', 'oasis', 'empty', 'bridge_H', 'empty'],
                ['empty', 'empty', 'mountain_NW', 'empty', 'mountain_SW', 'empty', 'empty'],
                ['bridge_V', 'empty', 'empty', 'empty', 'empty', 'mountain_NE', 'empty'],
                ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty']],
               [['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'empty', 'empty', 'mountain_SE', 'empty'],
                ['empty', 'bridge_H', 'bridge_H', 'empty', 'mountain_SW', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'mountain_SE', 'empty', 'oasis', 'empty', 'empty'],
                ['empty', 'mountain_NW', 'empty', 'bridge_V', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty']]];

function writeScore(scoreData)
{
    let timeData = scoreData.elapsedTime;
    let minutes = Math.floor(timeData / 60).toString().padStart(2, '0');
    let seconds = Math.floor(timeData % 60).toString().padStart(2, '0');
    rankField.innerHTML += `<p>${scoreData.name}: ${minutes}:${seconds}</p>`;
}

function gameCompleted()
{
    // ne ellenőrizze többé a megoldást
    done = true;

    // aktuális játékos idejének kiírása
    clearInterval(timer);
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    document.querySelector('#finaltime').textContent = `Eltelt idő: ${minutes}:${seconds}`;

    // külön ranglista a két nehézségi módnak
    if (hard) saveLocation = 'hardSave';
    else saveLocation = 'easySave';

    // mentett adat beolvasása és átalakítása
    let savedData = localStorage.getItem(saveLocation);
    if (savedData == null) savedData = [];
    else  savedData = JSON.parse(savedData);

    // új adat hozzáadása és lista feldolgozása, mentése
    const currentScore = {'name': playername, 'elapsedTime': time};
    savedData.push(currentScore);
    savedData.sort((a, b) => a.elapsedTime - b.elapsedTime);
    savedData = savedData.slice(0, 5);
    localStorage.setItem(saveLocation, JSON.stringify(savedData));

    // toplista kiírása
    rankField.innerText = '';
    savedData.forEach(writeScore);

    popup.style.display = 'block';
    const tomenub = document.querySelector('#backtomenu');
    tomenub.addEventListener('click', function() { location.reload(); });
}

function checkSolution()
{   
    const visited = new Set();              // kezdőcellából egy irányban mozogva meglátogatható cellák
    function dfs(x, y)                      // még jó hogy most tanultam algo 2-ből x_x
    {
        let tile = tiles[x][y];
        if (visited.has(tile)) return;
        visited.add(tile);                  // az első (valid) cella kivételével csak a pályán belüli, sínnel elérhető cellákat ellenőrzi

        if (tile == tiles[firstx][firsty])                                        // kezdőcella
        {
            if (!tile.states[tile.currentState].includes('SE')) return;          // a kezdőcellából kelet felé kell indulni
            target = tiles[x][y + 1].states[tiles[x][y + 1].currentState];
            if (target.includes('W') || target.includes('H')) dfs(x, y + 1);     // a sínt fogadni képes cella legyen jobbra
        }
        else if (tile.states[tile.currentState].includes('V_rail'))              // függőleges sín
        {
            if (x - 1 >= 0)                                                      // pályán belül maradás ellenőrzés
            {
                target = tiles[x - 1][y].states[tiles[x - 1][y].currentState];
                if (target.includes('S') || target.includes('V')) dfs(x - 1, y); // itt is megfelelő szomszéd ellenőrzés, majd látogatás
            }
            if (x + 1 < size)
            {
                target = tiles[x + 1][y].states[tiles[x + 1][y].currentState];
                if (target.includes('N') || target.includes('V')) dfs(x + 1, y);
            }
        }
        else if (tile.states[tile.currentState].includes('H_rail'))               // vízszintes sín
        {
            if (y + 1 < size)
            {
                target = tiles[x][y + 1].states[tiles[x][y + 1].currentState];
                if (target.includes('W') || target.includes('H')) dfs(x, y + 1);
            }
            if (y - 1 >= 0)
            {
                target = tiles[x][y - 1].states[tiles[x][y - 1].currentState];
                if (target.includes('E') || target.includes('H')) dfs(x, y - 1);
            }
        }
        else if (tile.states[tile.currentState].includes('NE_rail'))              // észak-kelet kanyar
        {
            if (x - 1 >= 0)
            {
                target = tiles[x - 1][y].states[tiles[x - 1][y].currentState];
                if (target.includes('S') || target.includes('V'))
                { dfs(x - 1, y); }
            }
            if (y + 1 < size)
            {
                target = tiles[x][y + 1].states[tiles[x][y + 1].currentState];
                if (target.includes('W') || target.includes('H'))
                { dfs(x, y + 1); }
            }
        }
        else if (tile.states[tile.currentState].includes('NW_rail'))              // észak-nyugat kanyar
        {
            if (x - 1 >= 0)
            {
                target = tiles[x - 1][y].states[tiles[x - 1][y].currentState];
                if (target.includes('S') || target.includes('V'))
                { dfs(x - 1, y); }
            }
            if (y - 1 >= 0)
            {
                target = tiles[x][y - 1].states[tiles[x][y - 1].currentState];
                if (target.includes('E') || target.includes('H'))
                { dfs(x, y - 1); }
            }
        }
        else if (tile.states[tile.currentState].includes('SW_rail'))              // dél-nyugat kanyar
        {
            if (x + 1 < size)
            {
                target = tiles[x + 1][y].states[tiles[x + 1][y].currentState];
                if (target.includes('N') || target.includes('V'))
                { dfs(x + 1, y); }
            }
            if (y - 1 >= 0)
            {
                target = tiles[x][y - 1].states[tiles[x][y - 1].currentState];
                if (target.includes('E') || target.includes('H'))
                { dfs(x, y - 1); }
            }
        }
        else if (tile.states[tile.currentState].includes('SE_rail'))              // dél-kelet kanyar
        {
            if (x + 1 < size)
            {
                target = tiles[x + 1][y].states[tiles[x + 1][y].currentState];
                if (target.includes('N') || target.includes('V'))
                { dfs(x + 1, y); }

            }
            if (y + 1 < size)
            {
                target = tiles[x][y + 1].states[tiles[x][y + 1].currentState];
                if (target.includes('W') || target.includes('H'))
                { dfs(x, y + 1); }
            }
        }
    }
    dfs(firstx, firsty);                    // mélységi keresés indítása minden változtatás után

    if (visited.size == railsToPlace) gameCompleted();
}

class Cell
{
    constructor(type, id)
    {
        this.element = document.querySelector(id);
        this.states = [];

        switch (type)
        {
            case 'empty':
                this.states = ['empty', 'empty_H_rail', 'empty_V_rail',
                               'empty_NE_rail', 'empty_NW_rail', 'empty_SW_rail', 'empty_SE_rail'];
                break;
            case 'bridge_H':
                this.states = ['bridge_H', 'bridge_H_rail'];
                break;
            case 'bridge_V':
                this.states = ['bridge_V', 'bridge_V_rail'];
                break;
            case 'mountain_NE':
                this.states = ['mountain_NE', 'mountain_NE_rail'];
                break;
            case 'mountain_NW':
                this.states = ['mountain_NW', 'mountain_NW_rail'];
                break;
            case 'mountain_SW':
                this.states = ['mountain_SW', 'mountain_SW_rail'];
                break;
            case 'mountain_SE':
                this.states = ['mountain_SE', 'mountain_SE_rail'];
                break;
            case 'oasis':
                this.states = ['oasis'];
                break;
            default:
                console.error(`nem ismert mező típus: ${type}`);
        }
    
        this.currentState = 0;
        this.element.style.backgroundImage = `url('media/${this.states[0]}.png')`;
        this.element.addEventListener('click', this.clickEvent.bind(this));
    }
  
    clickEvent()
    {
        if (done || this.states.length == 1) return; // oázisnál semmit ne csináljon
        this.currentState = (this.currentState + 1) % this.states.length; // állapot léptetése a következőre
        this.element.style.backgroundImage = `url('media/${this.states[this.currentState]}.png')`;
        checkSolution();
    }
}
function createGrid(level)
{
    if (hard) { grid.className = 'grid7x7'; size = 7; }
    else      { grid.className = 'grid5x5'; size = 5; }

    tiles = Array.from({ length: size }, () => Array(size).fill(null));
    railsToPlace = size * size;

    for (let i = 0; i < size; i++)
    {
        for (let j = 0; j < size; j++)
        { 
            // html elem elkészítése:
            const cell = document.createElement('div');
            cell.id = `cell-${i}-${j}`;
            cell.className = 'cell';
            grid.appendChild(cell);

            // példányosítás:
            tiles[i][j] = new Cell(level[i][j], `#cell-${i}-${j}`);
            if (level[i][j] == 'oasis') { railsToPlace--; }
            else if (firstx == -1 && firsty == -1) { firstx = i; firsty = j; } // első nem oázis cellánál kezdődik a megoldás
        }
    }
}

function updateTimer()
{
    time += 1;

    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');

    document.querySelector('#time').textContent = `${minutes}:${seconds}`;
}

function startGame()
{
    // játéktér megjelenítése
    menudiv.style.display = 'none';
    gamediv.style.display = 'block';

    // időzítő elindítása, név kiírása
    timer = setInterval(updateTimer, 1000);
    document.querySelector('#name').textContent = playername;

    // nehézségtől függően random pálya választása és kirajzolása
    let level = Math.floor(Math.random() * 5);
    if (hard) createGrid(diff[level]);
    else createGrid(easy[level]);
}

function toggleDescription()
{
    if (descdiv.style.display == 'none')
    {
        menudiv.style.display = 'none';
        descdiv.style.display = 'block';
    }
    else
    {
        menudiv.style.display = 'block';
        descdiv.style.display = 'none';
    }
}
function init()
{   
    menudiv.style.display = 'block';
    descdiv.style.display = 'none';
    gamediv.style.display = 'none';
    popup.style.display   = 'none';
    
    const showdescb = document.querySelector('#showdesc');
    showdescb.addEventListener('click', toggleDescription);

    const hidedescb = document.querySelector('#hidedesc');
    hidedescb.addEventListener('click', toggleDescription);

    const startgameb = document.querySelector('#start');
    startgameb.addEventListener('click', startGame);
    
    const nameinput = document.querySelector('#nameinput');
    nameinput.addEventListener('change', function()
    {
        playername = nameinput.value;
        if (playername == '') startgameb.disabled = true;
        else startgameb.disabled = false;
    });

    const easymodeb = document.querySelector('#easymode');
    const hardmodeb = document.querySelector('#hardmode');
    easymodeb.addEventListener('click', function()
    {
        hard = false;
        hardmodeb.classList.remove('active');
        easymodeb.classList.add('active');
    });
    hardmodeb.addEventListener('click', function()
    {
        hard = true;
        easymodeb.classList.remove('active');
        hardmodeb.classList.add('active');
    });
}
window.addEventListener('load', init, false);