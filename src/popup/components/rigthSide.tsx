import { ArrowRigthIcon } from "../icons/arrowIcon.js"

export function RigthSide ({onNext}: { onNext: () => void}){
    return <aside className="ladoDerecho">
            <div className="moveScreen" id="rigthMoveScreen">
                <button className="moveButton" id="rightButton" onClick={onNext}>
                    <ArrowRigthIcon />
                </button>
            </div>
        </aside>
}