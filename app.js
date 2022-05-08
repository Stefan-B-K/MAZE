const welcome = document.createElement('div')
welcome.innerHTML = `
<div class="background"></div>
<div class="guide">
  <p style="margin: 5px;">Choose Maze Size</p>
  <p id="range" style="margin: 0;">(between 3 and 30)</p>
</div>
<div class="inputs">
  <input type="text" id="start" autocomplete="off">
  <button>START</button>
</div>
`
document.body.append(welcome)
const button = document.querySelector('button')
const input = document.querySelector('input')
const guide = document.querySelector('div.guide')
const range = document.querySelector('#range')
const background = document.querySelector('.background')

const debounce = (callback, delay) => {
  let timeoutID
  return (...args) => {
    if (timeoutID) clearTimeout(timeoutID)
    timeoutID = setTimeout(() => {
      callback.apply(null, args)
    }, delay)
  }
}

const warning = (condition = true) => {
  if (condition) {
    range.classList.add('warning')
    input.classList.add('warning')
  } else {
    range.classList.remove('warning')
    input.classList.remove('warning')
  }
}

const validate = event => {
  const valueInt = parseInt(event.target.value)
  warning(!(valueInt >= 3 && valueInt <= 30) || event.target.value === '')
}

input.addEventListener('input', event => {
  if (![0,1,2,3,4,5,6,7,8,9].includes(Number(event.data))) {
    event.target.value = event.target.value.slice(0, -1)
    warning()
  }
  if (event.target.value === '') warning(false)
  debounce(validate, 500)
})
input.addEventListener('input', debounce(validate, 500))

button.addEventListener('click', event => {
  const valueInt = parseInt(input.value)
  if ( !(valueInt >= 3 && valueInt <= 30)) {
    input.value = ''
    return
  }
  welcome.innerHTML = ''
  setTimeout(() => {maze(valueInt)}, 100)
})


