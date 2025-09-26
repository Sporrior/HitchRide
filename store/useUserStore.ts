import { create } from "zustand";

type UserState = {
  age: string;
  weight: number;
  unit: "Kg" | "Lbs";
  username: string;
  setAge: (age: string) => void;
  setWeight: (weight: number, unit: "Kg" | "Lbs") => void;
  setUsername: (username: string) => void;
  reset: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  age: "19",
  weight: 62,
  unit: "Kg",
  username: "",
  
  setAge: (age) => set({ age }),
  setWeight: (weight, unit) => set({ weight, unit }),
  setUsername: (username) => set({ username }),

  reset: () => set({ age: "19", weight: 62, unit: "Kg", username: "" }),
}));