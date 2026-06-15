import { create } from 'zustand';
interface ImageStore {
  selectedPhotos: {
    id: number;
    uri: string;
    width: number;
    height: number;
    fileName: string | null | undefined;
  }[];
  takenPhoto: {
    uri: string;
    width: number;
    height: number;
    fileName: string | null | undefined;
  } | null;
  setSelectedPhotos: (photos: ImageStore['selectedPhotos']) => void;
  settakenPhoto: (photo: ImageStore['takenPhoto']) => void;
  clearPhotos: () => void;
}
export const useImageStore = create<ImageStore>((set) => ({
  selectedPhotos: [],
  takenPhoto: null,
  setSelectedPhotos: (photos) => set(() => ({ selectedPhotos: photos })),
  settakenPhoto: (photo) => set(() => ({ takenPhoto: photo })),
  clearPhotos: () => set({ selectedPhotos: [], takenPhoto: null }),
}));
