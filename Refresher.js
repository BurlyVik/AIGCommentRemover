// User needs to navigate to the URL on their desktop (not mobile device):
// https://www.instagram.com/your_activity/interactions/comments
// Copy the contents of the Refresher.js javascript file into the web browsers console witin developer settings and press enter.
//
// Try to not adjust any of the settings, leave it at a default of 3 comments and walk away for an hour or two
// Instagram blocks or throttles access via their API or UI for a few key reasons when actions are performed to quickly
// Adjusting these settings may result in being block temporarily from their API, so its best to move slow with these requests.

;(async () => {
  const BATCH = 3, DELAY = 1000, CLICK_DELAY = 300, MAX_RETRIES = 60
  const delay = ms => new Promise(res => setTimeout(res, ms))

  const waitFor = async (selector, timeout = 30000) => {
    const start = Date.now()
    while (Date.now() - start < timeout) {
      const el = document.querySelector(selector)
      if (el) return el
      await delay(100)
    }
    throw new Error(`Timeout: ${selector}`)
  }

  const click = async el => {
    if (!el) throw new Error('Missing element')
    el.click()
  }

  const waitForSelect = async () => {
    for (let i = 0; i < MAX_RETRIES; i++) {
      if (document.querySelectorAll('[role="button"]')?.length > 1) return
      await delay(1000)
    }
    throw new Error('Select button not found')
  }

  const deleteSelected = async () => {
    try {
      const deleteBtn = await waitFor('[aria-label="Delete"][style*="pointer-events: auto"]')
      await click(deleteBtn)
      await delay(DELAY)

      const confirmBtn = await waitFor('button[tabindex="0"]')
      await click(confirmBtn)
    } catch (e) {
      console.error('Delete error:', e.message)
    }
  }

  const deleteAll = async () => {
    try {
      while (true) {
        const [, selectBtn] = document.querySelectorAll('[role="button"]')
        if (!selectBtn) throw new Error('Select button missing')
        await click(selectBtn)
        await delay(DELAY)

        const boxes = document.querySelectorAll('[aria-label="Toggle checkbox"]')
        if (!boxes.length) break

        for (let i = 0; i < Math.min(BATCH, boxes.length); i++) {
          await click(boxes[i])
          await delay(CLICK_DELAY)
        }

        await delay(DELAY)
        await deleteSelected()
        await delay(DELAY)
        await waitForSelect()
        await delay(DELAY)
      }
    } catch (e) {
      console.error('Process error:', e.message)
    }
  }

  try {
    await deleteAll()
    console.log('All comments deleted.')
  } catch (e) {
    console.error('Fatal:', e.message)
  }
})()
