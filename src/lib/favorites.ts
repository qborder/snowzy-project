"use client"

const FAVORITES_KEY = 'snowzy_favorites'

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function isFavorite(projectId: string): boolean {
  return getFavorites().includes(projectId)
}

export function addToFavorites(projectId: string): void {
  const favorites = getFavorites()
  if (!favorites.includes(projectId)) {
    favorites.push(projectId)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('favoritesChanged', { 
      detail: { projectId, action: 'add' } 
    }))
  }
}

export function removeFromFavorites(projectId: string): void {
  const favorites = getFavorites()
  const filtered = favorites.filter(id => id !== projectId)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
  
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('favoritesChanged', { 
    detail: { projectId, action: 'remove' } 
  }))
}

export function toggleFavorite(projectId: string): boolean {
  const isCurrentlyFavorite = isFavorite(projectId)
  if (isCurrentlyFavorite) {
    removeFromFavorites(projectId)
    return false
  } else {
    addToFavorites(projectId)
    return true
  }
}

export function getFavoriteCount(): number {
  return getFavorites().length
}

export function clearAllFavorites(): void {
  localStorage.removeItem(FAVORITES_KEY)
  window.dispatchEvent(new CustomEvent('favoritesChanged', { 
    detail: { action: 'clear' } 
  }))
}
