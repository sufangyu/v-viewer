import type { App } from 'vue'
import Viewer from 'viewerjs'
import ViewerComponent from './component'
import ViewerPreview from './preview'
import ViewerDirective from './directive'
import type { ViewerPreviewOptions, ViewerInstanceExposed } from './preview'

interface InstallOptions {
  name?: string
  debug?: boolean
  defaultOptions?: Viewer.Options
}

export {
  InstallOptions,
  ViewerPreviewOptions,
  ViewerInstanceExposed,
}

export {
  Viewer,
  ViewerPreview,
  ViewerComponent,
}

export default {
  install: (app: App, { name = 'viewer', debug = false, defaultOptions = {} }: InstallOptions = {}) => {
    Viewer.setDefaults(defaultOptions)

    app.component(name, ViewerComponent)
    app.use(ViewerDirective, { name, debug })
  },
  setDefaults(defaultOptions: Viewer.Options) {
    Viewer.setDefaults(defaultOptions)
  },
}
