import { OptionsIcon } from "../icons/optionsIcon.js"

function OptionSection() {
    return <section id="optionsMenu" className="hidden">
        <label className="switch">
            <div id="iconSwitchWrapper">
                <span id="iconSwitch">🌙</span>
            </div>

            <input className="toggle" id="ligthToggle" type="checkbox" />
            <span className="slider"></span>
            <span className="card-side"></span>
        </label>
    </section>
}

function OptionButton() {
    return <div className="moveScreen" id="optionsWrapper">
        <button className="moveButton" id="optionsToggle">
            <OptionsIcon />
        </button>
    </div>
}

export function Options (){
    return <div> 
        <OptionSection />
        <OptionButton />
    </div>
}