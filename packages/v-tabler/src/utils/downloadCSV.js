const convertToCSV = (data, columns) => {
    const csvData = data
        .map(item => {
            return columns.map(col => item[col.key]).join(',')
        })
        .join('\n')
    const csvHeader = columns.map(col => col.label).join(',') + '\n'
    return csvHeader + csvData
}

const createDownloadLink = (filename, csvData) => {
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    return a
}

const cleanupDownloadLink = link => {
    URL.revokeObjectURL(link.href)
}

export const downloadCSV = ({ filename = '', data = [] } = {}) => {
    if (data.length === 0) return
    const columns = Object.keys(data[0]).map(key => ({ key, label: key }))
    if (columns.length === 0) return
    const csvData = convertToCSV(data, columns)

    const downloadLink = createDownloadLink(filename, csvData)
    downloadLink.click()
    cleanupDownloadLink(downloadLink)
}

export const downloadCSVWithSchema = ({ filename = '', data = [], schema = [] } = {}) => {
    if (data.length === 0) return
    const columns = schema.map(field => ({ key: field.key, label: field.label }))
    if (columns.length === 0) return
    const csvData = convertToCSV(data, columns)

    const downloadLink = createDownloadLink(filename, csvData)
    downloadLink.click()
    cleanupDownloadLink(downloadLink)
}
