import { toBlob } from 'html-to-image'
import { SEASON_LABEL } from '../data/teams'

function waitForImages(node: HTMLElement) {
  const images = [...node.querySelectorAll('img')]
  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve()
            return
          }
          img.addEventListener('load', () => resolve(), { once: true })
          img.addEventListener('error', () => resolve(), { once: true })
        }),
    ),
  )
}

export async function captureShareCard(node: HTMLElement) {
  await document.fonts.ready
  await waitForImages(node)
  const options = {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: '#0b0714',
  }
  await toBlob(node, options)
  const blob = await toBlob(node, options)
  if (!blob) throw new Error('Could not create image')
  return blob
}

export async function shareOrDownload(blob: Blob) {
  const filename = `pl-prediction-${SEASON_LABEL.replace('/', '-')}.png`
  const file = new File([blob], filename, { type: 'image/png' })

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: `My ${SEASON_LABEL} Premier League prediction`,
    })
    return
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
