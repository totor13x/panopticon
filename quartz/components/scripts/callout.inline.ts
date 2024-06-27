function toggleCallout(this: HTMLElement) {
  const outerBlock = this.parentElement!
  outerBlock.classList.toggle(`is-collapsed`)
  const collapsed = outerBlock.classList.contains(`is-collapsed`)
  const height = collapsed ? this.scrollHeight : outerBlock.scrollHeight
  outerBlock.style.maxHeight = height + `px`

  // walk and adjust height of all parents
  let current = outerBlock
  let parent = outerBlock.parentElement
  while (parent) {
    if (!parent.classList.contains(`callout`)) {
      return
    }

    const collapsed = parent.classList.contains(`is-collapsed`)
    const height = collapsed ? parent.scrollHeight : parent.scrollHeight + current.scrollHeight
    parent.style.maxHeight = height + `px`

    current = parent
    parent = parent.parentElement
  }
}

function setupCallout() {
  const collapsible = document.getElementsByClassName(
    `callout is-collapsible`,
  ) as HTMLCollectionOf<HTMLElement>
  for (const div of collapsible) {
    const title = div.firstElementChild

    if (title) {
      title.removeEventListener(`click`, toggleCallout)
      title.addEventListener(`click`, toggleCallout)

      const collapsed = div.classList.contains(`is-collapsed`)
      const height = collapsed ? title.scrollHeight : div.scrollHeight
      div.style.maxHeight = height + `px`
    }
  }
}

document.addEventListener(`nav`, setupCallout)
window.addEventListener(`resize`, setupCallout)


function randomizeTextCapitalizationAndColor(text: string) {
  return text.split(``).map(char => {
    const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    const transformedChar = Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
    const createSpan = document.createElement(`span`);
    createSpan.style.color = randomColor;
    createSpan.textContent = transformedChar;
    
    return createSpan.outerHTML;
  }).join(``);
}
let bulkaInterval: number | null = null;
const setupBulkaEffect = () => {
  if (bulkaInterval) {
    clearInterval(bulkaInterval);
  }
  var bulkaEffect = document.querySelector(`[data-callout='promarderbulka']  .callout-title-inner p`);

  if (bulkaEffect) {
    const originalText = bulkaEffect.textContent!;
    bulkaInterval = setInterval(() => {
      if (bulkaEffect) {
        bulkaEffect.innerHTML = randomizeTextCapitalizationAndColor(originalText);
      } else {
        clearInterval(bulkaInterval);
      }
    }, 100);
  }
}


document.addEventListener(`nav`, setupBulkaEffect)
window.addEventListener(`resize`, setupBulkaEffect)