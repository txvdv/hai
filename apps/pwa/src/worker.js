let counter = 1

self.onmessage = (e) => {
  if (e.data === 'ping') {
    self.postMessage({ msg: `Counter - ${counter++}` })
  }
  else if (e.data === 'clear') {
    counter = 1

    self.postMessage({ msg: null, mode: null })
  }
}