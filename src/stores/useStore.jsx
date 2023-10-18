import { create } from "zustand";

export default create((set) =>
{
    return {
        stage: "website",
        level: "level_0",
        cycle: 0,
        setStage: (stage) =>
        {
            set(() => {
                return { stage: stage}
            })
        },
        setLevel: (level) =>
        {
            set(() => {
                return { level: level}
            })
        },
        addCycle: () =>
        {
            set(() => {
                return { cycle: cycle+1}
            })
        }
    }
})