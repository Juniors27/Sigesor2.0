import { AUTH_STORAGE_KEYS } from "@/constants/auth"

const isBrowser = typeof window !== "undefined"

export function getStorageItem(key) {
  if (!isBrowser) {
    return null
  }

  return window.localStorage.getItem(key)
}

export function setStorageItem(key, value) {
  if (!isBrowser) {
    return
  }

  window.localStorage.setItem(key, value)
}

export function saveAuthSession({ access, rol, nombres, apellido_paterno }) {
  setStorageItem(AUTH_STORAGE_KEYS.token, access)
  setStorageItem(AUTH_STORAGE_KEYS.role, rol)
  setStorageItem(AUTH_STORAGE_KEYS.name, `${nombres} ${apellido_paterno}`)
}

export function getAuthToken() {
  return getStorageItem(AUTH_STORAGE_KEYS.token)
}
