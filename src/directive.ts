import Viewer from 'viewerjs'
import debounce from 'lodash/debounce'
import { App, nextTick } from 'vue'

const install = (app: App, { name = 'viewer', debug = false }) => {
  async function createViewer(el: HTMLElement, options: Viewer.Options, rebuild = false) {
    // console.log(el.innerHTML)
    // el['$oldimg'] =

    // nextTick执行，否则可能漏掉未渲染完的子元素
    await nextTick()
    // @ts-ignore
    if (rebuild || !el[`$${name}`]) {
      destroyViewer(el)
      // @ts-ignore
      el[`$${name}`] = new Viewer(el, options)
      log('viewer created')
    }
    else {
      // @ts-ignore
      el[`$${name}`].update()
      log('viewer updated')
    }
  }
  // @ts-ignore
  function createObserver(el: HTMLElement, options: Viewer.Options, debouncedCreateViewer, rebuild: boolean) {
    destroyObserver(el)
    // @ts-ignore
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    if (!MutationObserver) {
      log('observer not supported')
      return
    }
    // @ts-ignore
    const observer = new MutationObserver((mutations) => {
      // @ts-ignore
      mutations.forEach((mutation) => {
        log(`viewer mutation:${mutation.type}`)

        // 对比新老图片是否变化
        const $newimg = el.innerHTML.match(/<img.*?src=[\"|\']?(.*?)[\"|\']?\s.*?>/img)?.join('__')
        // @ts-ignore
        if ($newimg !== el.$oldimg) {
          // @ts-ignore
          el.$oldimg = $newimg
          debouncedCreateViewer(el, options, rebuild)
        }
      })
    })
    const config = { attributes: true, childList: true, characterData: true, subtree: true }
    observer.observe(el, config)
    // @ts-ignore
    el.$viewerMutationObserver = observer
    log('observer created')
  }

  // @ts-ignore
  function createWatcher(el: HTMLElement, { expression }, vnode, debouncedCreateViewer) {
    const simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/
    if (!expression || !simplePathRE.test(expression)) {
      log('only simple dot-delimited paths can create watcher')
      return
    }
    // @ts-ignore
    el.$viewerUnwatch = vnode.context.$watch(expression, (newVal, oldVal) => {
      log('change detected by watcher: ', expression)
      debouncedCreateViewer(el, newVal, true)
    }, {
      deep: true,
    })
    log('watcher created, expression: ', expression)
  }

  function destroyViewer(el: HTMLElement) {
    // @ts-ignore
    if (!el[`$${name}`])
      return
    // @ts-ignore
    el[`$${name}`].destroy()
    // @ts-ignore
    delete el[`$${name}`]
    log('viewer destroyed')
  }

  function destroyObserver(el: HTMLElement) {
    // @ts-ignore
    if (!el.$viewerMutationObserver)
      return
    // @ts-ignore
    el.$viewerMutationObserver.disconnect()
    // @ts-ignore
    delete el.$viewerMutationObserver
    log('observer destroyed')
  }

  function destroyWatcher(el: HTMLElement) {
    // @ts-ignore
    if (!el.$viewerUnwatch)
      return
    // @ts-ignore
    el.$viewerUnwatch()
    // @ts-ignore
    delete el.$viewerUnwatch
    log('watcher destroyed')
  }

  function log(...args: any[]) {
    debug && console.log(...args)
  }

  app.directive('viewer', {
    mounted(el: HTMLElement, binding, vnode) {
      console.log(binding)
      log('viewer bind')
      const debouncedCreateViewer = debounce(createViewer, 50)
      debouncedCreateViewer(el, binding.value)

      // 创建watch监听options表达式变化
      // @ts-ignore
      createWatcher(el, binding, vnode, debouncedCreateViewer)

      // 是否监听dom变化
      if (!binding.modifiers.static) {
        // 增加dom变化监听
        createObserver(el, binding.value, debouncedCreateViewer, binding.modifiers.rebuild)
      }
    },
    unmounted(el: HTMLElement, binding) {
      log('viewer unbind')
      // 销毁dom变化监听
      destroyObserver(el)
      // 销毁指令表达式监听
      destroyWatcher(el)
      // 销毁viewer
      destroyViewer(el)
    },
  })
}

export default {
  install,
}
