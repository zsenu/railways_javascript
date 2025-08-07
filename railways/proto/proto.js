let tiles = null;
let hard = false;
let size, railsToPlace, firstx = -1, firsty = -1;

function checkSolution()
{
    const visited = new Set();              // kezdőcellából egy irányban mozogva meglátogatható cellák
    function dfs(x, y)                      // még jó hogy most tanultam algo 2ből x_x
    {
        let tile = tiles[x][y];
        if (visited.has(tile)) return;
        visited.add(tile);                  // az első (valid) cella kivételével csak a pályán belüli, sínnel elérhető cellákat ellenőrzi

        if (tile == tiles[firstx][firsty])                                        // kezdőcella
        {
            if (!tile.states[tile.currentState].includes('SE')) return;      // a kezdőcellából kelet felé kell indulni
            target = tiles[x][y + 1].states[tiles[x][y + 1].currentState];
            if (target.includes('W') || target.includes('H')) dfs(x, y + 1); // a sínt fogadni képes cella legyen jobbra
        }
        else if (tile.states[tile.currentState].includes('V_rail'))               // függőleges sín
        {
            if (x - 1 >= 0)                                                  // pályán belül maradás ellenőrzés
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

    if (visited.size == railsToPlace)
    {
        // TODO
        console.log("All tiles are connected!");
    }
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
        this.element.style.backgroundImage = `url('${this.states[0]}.png')`;
        this.element.addEventListener('click', this.clickEvent.bind(this));
    }
  
    clickEvent()
    {
        if (this.states.length == 1) return; // oázisnál semmit ne csináljon
        this.currentState = (this.currentState + 1) % this.states.length; // állapot léptetése a következőre
        this.element.style.backgroundImage = `url('${this.states[this.currentState]}.png')`;
        checkSolution();
    }
}
function createGrid(level)
{
    const grid = document.querySelector('#game');
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

const level =  [['oasis', 'empty', 'empty', 'mountain_SE', 'empty'],
                ['empty', 'empty', 'empty', 'empty', 'empty'],
                ['bridge_V', 'empty', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'empty', 'oasis'],
                ['mountain_NE', 'empty', 'bridge_H', 'empty', 'oasis']]

createGrid(level);