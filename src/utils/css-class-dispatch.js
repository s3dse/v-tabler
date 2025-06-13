
export const getClass = (config, fallback) => (key) => {
    if (config && config[key]) {
        return config[key]
    } else if (fallback && fallback[key]) {
        return fallback[key]
    } else { 
        return ''
    }
}