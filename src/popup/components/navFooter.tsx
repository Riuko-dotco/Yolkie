import { GamesIcon } from "../icons/gamesIcon.js"
import { StoreIcon } from "../icons/storeIcon.js"
export function NavFooter (){
    return <nav className="nav">
        <div className="navJuegos">
            <a href="games.html" id="navJuegosButton">
                <GamesIcon />
            </a>
            <h3>Juegos</h3>
        </div>
        <div className="navBola">
            pelota
        </div>
        <div className="navTienda">
            <button id="navTiendaButton">
                <StoreIcon />
            </button>
            <h3>Tienda</h3>
        </div>
    </nav>
}