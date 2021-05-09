import { h, render } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import Viewer from 'viewerjs'
import ViewerComponent from './component'

export interface ViewerPreviewOptions {
  images: Array<any>
  options?: Viewer.Options
  onDestroy?: () => void
}

export interface ViewerInstanceExposed {
  $viewer: () => Viewer
  destroyViewer: () => void
}

function ViewerPreview(options: ViewerPreviewOptions) {
  const $container = document.createElement('div')
  $container.style.display = 'none'
  $container.classList.add('__viewer__preview')

  // merge options
  options = {
    ...options,
    onDestroy() {
      render(null, $container)
    },
  }

  // render vnode
  const vm = h(
    ViewerComponent,
    options,
    options.images.map((src) => {
      return typeof src === 'string' ? h('img', { src }) : h('img', { src: src.src })
    }),
  )

  // render component
  render(vm, $container)
  document.body.appendChild($container)

  // return component instance
  return (
    (vm.component as ComponentInternalInstance).exposed as ViewerInstanceExposed
  )
}

export default ViewerPreview
