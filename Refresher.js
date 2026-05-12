// User needs to navigate to the URL on their desktop (not mobile device):
// https://www.instagram.com/your_activity/interactions/comments
// Copy the contents of the Refresher.js javascript file into the web browsers console witin developer settings and press enter.
//
// Try to not adjust any of the settings, leave it at a default of 3 comments and walk away for an hour or two.
// Instagram blocks or throttles access via their API or UI for key reasons when actions are performed to quickly.
// Adjusting these settings may result in being blocked temporarily from their API, so its best to move slow with these requests.

;(async () => {
  const TARGET = 10
  const DELAY = 700
  const CLICK_DELAY = 120
  const LOOP_DELAY = 20000

  const delay = ms => new Promise(r => setTimeout(r, ms))

  const realClick = el => {
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const o = { bubbles: true, clientX: x, clientY: y }

    el.dispatchEvent(new PointerEvent('pointerdown', o))
    el.dispatchEvent(new MouseEvent('mousedown', o))
    el.dispatchEvent(new PointerEvent('pointerup', o))
    el.dispatchEvent(new MouseEvent('mouseup', o))
    el.dispatchEvent(new MouseEvent('click', o))
  }

  const getSelectBtn = () =>
    [...document.querySelectorAll('span')]
      .find(e => e.textContent.toLowerCase().includes('select'))
      ?.closest('div')

  const getCheckboxes = () =>
    [...document.querySelectorAll('[aria-label="Toggle checkbox"]')]

  const getClickableParent = el => {
    let p = el
    while (p && getComputedStyle(p).pointerEvents === 'none') {
      p = p.parentElement
    }
    return p
  }

  const getDeleteBtn = () =>
    [...document.querySelectorAll('span')]
      .find(e => e.textContent.trim() === 'Delete')
      ?.closest('div,button')

  const getConfirmBtn = () =>
    document.querySelector('button._a9--._ap36._a9_1')

  while (true) {
    console.log('New cycle')

    // Step 1: enter select mode
    const selectBtn = getSelectBtn()
    if (!selectBtn) {
      console.log('Select button not found — stopping')
      break
    }

    realClick(selectBtn)
    await delay(DELAY)

    // Step 2: select 10
    const checkboxes = getCheckboxes()
    let selected = 0

    for (let i = 0; i < checkboxes.length && selected < TARGET; i++) {
      const clickable = getClickableParent(checkboxes[i])
      if (!clickable) continue

      realClick(clickable)
      await delay(CLICK_DELAY)

      selected++
    }

    console.log(`Selected ${selected}`)

    if (selected === 0) {
      console.log('Nothing left — done')
      break
    }

    await delay(DELAY)

    // Step 3: delete
    const deleteBtn = getDeleteBtn()
    if (!deleteBtn) {
      console.log('Delete button missing')
      break
    }

    realClick(deleteBtn)
    await delay(DELAY)

    // Step 4: confirm popup
    let confirmBtn = null
    for (let i = 0; i < 20; i++) {
      confirmBtn = getConfirmBtn()
      if (confirmBtn) break
      await delay(150)
    }

    if (!confirmBtn) {
      console.log('Confirm popup not found')
      break
    }

    realClick(confirmBtn)
    console.log('Deleted batch')

    // WAIT 15 SECONDS BEFORE NEXT RUN
    await delay(LOOP_DELAY)
  }

  console.log('Finished all cycles')
})()
