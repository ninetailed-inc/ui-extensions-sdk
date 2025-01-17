import { ConnectMessage, KnownSDK } from './types'
import connect, { Channel } from './channel'

export default function createInitializer(
  currentWindow: Window,
  apiCreator: (channel: Channel, data: ConnectMessage, window: Window) => KnownSDK
) {
  const connectDeferred =
    createDeferred<[channel: Channel, message: ConnectMessage, messageQueue: unknown[]]>()

  connectDeferred.promise.then(([channel]) => {
    const { document } = currentWindow
    document.addEventListener('focus', () => channel.send('setActive', true), true)
    document.addEventListener('blur', () => channel.send('setActive', false), true)
  })

  // We need to connect right away so we can record incoming
  // messages before `init` is called.
  connect(currentWindow, (...args) => connectDeferred.resolve(args))

  let initializedSdks: Promise<[sdk: KnownSDK, customSdk: any]> | undefined
  return function init(
    initCb: (sdk: KnownSDK, customSdk: any) => any,
    {
      makeCustomApi,
      supressIframeWarning,
    }: { makeCustomApi?: Function; supressIframeWarning?: boolean } = {
      supressIframeWarning: false,
    }
  ) {
    if (!supressIframeWarning && currentWindow.self === currentWindow.top) {
      console.error(`Cannot use ui-extension-sdk outside of Contenful:

In order for the ui-extension-sdk to function correctly, your app needs to be run in an iframe in the Contentful Web App.

Learn more about local development with the ui-extension-sdk here:
  https://www.contentful.com/developers/docs/extensibility/ui-extensions/faq/#how-can-i-use-the-ui-extension-sdk-locally`)
    }

    if (!initializedSdks) {
      initializedSdks = connectDeferred.promise.then(([channel, params, messageQueue]) => {
        const api = apiCreator(channel, params, currentWindow)

        let customApi
        if (typeof makeCustomApi === 'function') {
          customApi = makeCustomApi(channel, params)
        }

        // Handle pending incoming messages.
        // APIs are created before so handlers are already
        // registered on the channel.
        messageQueue.forEach((m) => {
          // TODO Expose private handleMessage method
          ;(channel as any)._handleMessage(m)
        })

        return [api, customApi]
      })
    }

    initializedSdks.then(([sdk, customSdk]) =>
      // Hand over control to the developer.
      initCb(sdk, customSdk)
    )
  }
}

function createDeferred<T = any>() {
  const deferred: {
    promise: Promise<T>
    resolve: (value: T | PromiseLike<T>) => void
  } = {
    promise: null as any,
    resolve: null as any,
  }

  deferred.promise = new Promise<T>((resolve) => {
    deferred.resolve = resolve
  })

  return deferred
}
