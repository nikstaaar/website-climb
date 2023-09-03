import { create } from "zustand";

export default create((set) =>
{
    return {
        gameMode: false,
        hasCollided: false,
        start: () =>
        {
            set(() => {
                return { gameOn: true}
            })
        },
        collide: () =>
        {
            set(() => {
                return { hasCollided: true}
            })
        },
        standUp: () =>
        {
            set(() => {
                return { hasStoodUp: true}
            })
        }
    }
})