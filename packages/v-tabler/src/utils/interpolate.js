/**
 * Simple interpolation for fallback translations
 */
export function interpolate(str, values = {}) {
    return typeof str === 'string'
        ? str.replace(/\{([^}]+)\}/g, (_, key) =>
              values[key] !== undefined ? values[key] : `{${key}}`
          )
        : str
}
