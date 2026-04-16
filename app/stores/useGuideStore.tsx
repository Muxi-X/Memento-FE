import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type GuideStore = {
  currentStep: number;
  hasHydrated: boolean;
  isFinished: boolean;
  complete: () => void;
  nextStep: (totalSteps: number) => void;
  reset: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

const guideStorage = {
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);

    return value ?? null;
  },
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
  setItem: (name: string, value: string) =>
    SecureStore.setItemAsync(name, value),
};

export const useGuideStore = create<GuideStore>()(
  persist(
    (set) => ({
      currentStep: 0,
      hasHydrated: false,
      isFinished: false,
      complete: () =>
        set(() => ({
          currentStep: 0,
          isFinished: true,
        })),
      nextStep: (totalSteps) =>
        set((state) => {
          if (state.currentStep >= totalSteps - 1) {
            return {
              currentStep: 0,
              isFinished: true,
            };
          }

          return {
            currentStep: state.currentStep + 1,
          };
        }),
      reset: () =>
        set(() => ({
          currentStep: 0,
          isFinished: false,
        })),
      setHasHydrated: (hasHydrated) =>
        set(() => ({
          hasHydrated,
        })),
    }),
    {
      name: "home-guide-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        currentStep: state.currentStep,
        isFinished: state.isFinished,
      }),
      storage: createJSONStorage(() => guideStorage),
    },
  ),
);
