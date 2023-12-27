const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
const currentTheme = localStorage.getItem("theme") ?? 'auto'

document.documentElement.setAttribute("current-theme", currentTheme)
document.documentElement.setAttribute("saved-theme", currentTheme)

document.addEventListener("nav", () => {
  const switchTheme = (e: any) => {
    const nextColor = e.currentTarget.dataset.next
    
    document.documentElement.setAttribute("current-theme", nextColor)
    document.documentElement.setAttribute("saved-theme", nextColor)
    localStorage.setItem("theme", nextColor)

    if (nextColor === "auto") {
      const currentUserPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
      
      document.documentElement.setAttribute("current-theme", currentUserPref)
    }
  }

  Array.prototype.forEach.call(
    document.querySelectorAll(".darkmode-toggle"),
    function (item: HTMLElement) {
      item.removeEventListener('click', switchTheme)
      item.addEventListener('click', switchTheme, false)
    },
  )

  if (currentTheme === "auto") {
    document.documentElement.setAttribute("current-theme", userPref)
  }

  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  colorSchemeMediaQuery.addEventListener("change", (e) => {
    const currentTheme = localStorage.getItem("theme") ?? 'auto'
    const newTheme = e.matches ? "dark" : "light"
    if (currentTheme === "auto") {
      document.documentElement.setAttribute("current-theme", newTheme)
    }
  })
})
