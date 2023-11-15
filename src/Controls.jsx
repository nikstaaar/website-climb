import useStore from "./stores/useStore"
import { useControls } from "leva"
import { useEffect, useState } from "react"

export default function Controls() {
    const setLevel = useStore((state) => {return state.setLevel})
    const setStage = useStore((state) => {return state.setStage})
    const setMoveSpeed = useStore((state) => {return state.setMoveSpeed})
    const setJumpHeight = useStore((state) => {return state.setJumpHeight})
    const setDebug = useStore((state) => {return state.setDebug})
    const debug = useStore((state) => {return state.debug})

    const [isInitialRender, setIsInitialRender] = useState(true);

    const controls = useControls({
        level: "level_0",
        stage: "website",
        jumpHeight: 0.27,
        moveSpeed: 0.15,
        debug: debug,
     })

     useEffect(() => {
        setLevel(controls.level)
      },[controls.level]) 
  
      useEffect(() => {
        setStage(controls.stage)
      }, [controls.stage])

      useEffect(() => {
        setMoveSpeed(controls.moveSpeed)
      }, [controls.moveSpeed])

      useEffect(() => {
        setJumpHeight(controls.jumpHeight)
      }, [controls.jumpHeight])

      useEffect(() => {
        if (isInitialRender) {
          setIsInitialRender(false);
          return
        }
        setDebug()
      }, [controls.debug])
}