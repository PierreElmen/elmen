import { writable } from 'svelte/store';

// Using Svelte 5 runes for global state
export const layoutState = $state({
    isModalOpen: false,
    activeModalId: null as string | null,
    theme: 'beige', // default theme
    
    openModal(id: string) {
        this.isModalOpen = true;
        this.activeModalId = id;
    },
    
    closeModal() {
        this.isModalOpen = false;
        setTimeout(() => {
            if (!this.isModalOpen) this.activeModalId = null;
        }, 300);
    },
    
    toggleModal(id: string) {
        if (this.isModalOpen && this.activeModalId === id) {
            this.closeModal();
        } else {
            this.openModal(id);
        }
    },

    setTheme(newTheme: string) {
        this.theme = newTheme;
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    }
});
