// @unocss-include

const switchToLightClasses = ["i-tabler-sun", "hover:i-tabler-sfilled"]
const switchToDarkClasses = ["i-tabler-moon", "hover:i-tabler-moon-filled"]

function toggleDocDark() {
    const html = document.getElementsByTagName('HTML')[0]
    const settingDark = html.classList.toggle('dark')
    const widget = document.getElementById('darkmodetoggle')
    applyWidgetIcon(widget, settingDark)
    return settingDark
}

function applyWidgetIcon(widget, isDark) {
    if (isDark) {
        switchToDarkClasses.forEach(e => widget.classList.remove(e))
        switchToLightClasses.forEach(e => widget.classList.add(e))
    } else {
        switchToLightClasses.forEach(e => widget.classList.remove(e))
        switchToDarkClasses.forEach(e => widget.classList.add(e))
    }
}

function toggleDarkMode() {
    const settingDark = toggleDocDark()
    window.localStorage.setItem('darkMode', settingDark)
}

function isSystemDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark').matches
}

function isSettingDark() {
    const setting = window.localStorage.getItem('darkMode')
    if (setting === 'true') {
        return true
    } else if (setting === 'false') {
        return false
    } else {
        return null
    }
}

function isDocDark() {
    return document.getElementsByTagName('HTML')[0].classList.contains('dark')
}

function applyDarkMode(darkMode) {
    if (darkMode ===isDocDark()) {
        return
    } else {
        toggleDocDark()
    }
}

function initializeDarkModeSetting() {
    const settingDark = isSettingDark()
    const systemDark = isSystemDark()
    if (settingDark === null) {
        applyDarkMode(systemDark)
    } else {
        applyDarkMode(settingDark)
    }
}
initializeDarkModeSetting()
window.toggleDarkMode = toggleDarkMode