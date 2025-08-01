// @unocss-include

const busyClasses = ['busy-text-primary', 'busy-bg-background']
export const busy = (el, binding) => {
    if (binding.value) {
        el.dataset.busy = true
        el.classList.add(...busyClasses)

    } else {
        el.dataset.busy = false
        busyClasses.forEach(cls => el.classList.remove(cls))
    }
}
