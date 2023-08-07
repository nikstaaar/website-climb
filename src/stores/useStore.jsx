import { create } from "zustand";

export default create((set) =>
{
    return {
        gameMode: false,
        start: () =>
        {
            set(() => {
                return { gameOn: true}
            })
        }
    }
})