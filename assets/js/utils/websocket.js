
async function connection(socket, timeout = 10000) {
  const isOpened = () => (socket.readyState === WebSocket.OPEN)

  if (socket.readyState !== WebSocket.CONNECTING) {
    return isOpened()
  }
  else {
    const intrasleep = 100
    const ttl = timeout / intrasleep // time to loop
    let loop = 0
    while (socket.readyState === WebSocket.CONNECTING && loop < ttl) {
      await new Promise(resolve => setTimeout(resolve, intrasleep))
      loop++
    }
    return isOpened()
  }
}

export async function sendLiveSocketEvent(el, event, meta = {}) {
  const {default: LiveSocket } = await import('../live-socket');

  const conn = LiveSocket.socket.conn
  await connection(conn)

  const viewId = el.closest("div[data-phx-session]").id
  const view = LiveSocket.views[viewId]
  view.pushEvent("custom", el, event, meta)
}
