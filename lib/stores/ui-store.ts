import { create } from 'zustand';

interface UIState {
  // Cart Drawer
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;

  // Item Detail Modal
  isItemModalOpen: boolean;
  selectedItemId: string | null;
  openItemModal: (itemId: string) => void;
  closeItemModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Cart Drawer State
  isCartDrawerOpen: false,
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

  // Item Detail Modal State
  isItemModalOpen: false,
  selectedItemId: null,
  openItemModal: (itemId: string) => {
    console.log(' UIStore.openItemModal called with:', itemId);
    set({ isItemModalOpen: true, selectedItemId: itemId });
    console.log(' UIStore state updated');
  },
  closeItemModal: () => {
    console.log(' UIStore.closeItemModal called');
    set({ isItemModalOpen: false, selectedItemId: null });
  },
}));