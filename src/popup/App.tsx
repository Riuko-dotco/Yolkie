import { StatsHeader } from "./components/statsHeader.js"
import { Main } from "./components/main.js"
import { NavFooter } from "./components/navFooter.js"
import { LeftSide } from "./components/leftSide.js"
import { RigthSide } from "./components/rigthSide.js"
import { Options } from "./components/optionButton.js"
import { useBackgroundChanger } from "./hooks/backgroundChanger.js"



export default function App() {
    const {backgroundImage, prev, next } = useBackgroundChanger()
    

    return (
        <>
            <Options />
            <div className="app" id="appWrapper" style={{ backgroundImage }}>
                <StatsHeader/>
                <LeftSide onPrev={prev} />
                <Main />
                <RigthSide onNext={next}/>
                <NavFooter />
            </div>
        </>
    );
}