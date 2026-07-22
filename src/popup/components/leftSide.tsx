import { ArrowLeftIcon } from "../icons/arrowIcon.js"

export function LeftSide ({ onPrev }: { onPrev: () => void}){
    return <aside className="ladoIzquierdo">
                <div className="moveScreen" id="leftMoveScreen">
                    <button className="moveButton" id="leftButton" onClick={onPrev}>
                        <ArrowLeftIcon />
                    </button>
                </div>
            </aside>
}
