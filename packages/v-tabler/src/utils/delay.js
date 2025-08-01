const delay = (ms = 1300) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export default delay