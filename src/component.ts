import {
  h,
  ref,
  watch,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  defineComponent,
} from 'vue'
import type { PropType } from 'vue'
import Viewer from 'viewerjs'

export default defineComponent({
  name: 'Viewer',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    images: {
      type: Object as PropType<string | Array<any> | object>,
      default: () => [],
    },
    rebuild: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object as PropType<Viewer.Options>,
      default: () => null,
    },
  },
  emits: ['ready', 'update', 'destroy'],
  setup(props, { slots, emit, expose }) {
    let $viewer: Viewer
    const $root = ref()

    // create or destroy
    const createViewer = () => {
      $viewer = new Viewer($root.value, props.options)
      emit('ready', $viewer)
    }
    const destroyViewer = () => {
      $viewer && $viewer.destroy()
      emit('destroy', $viewer)
    }
    const rebuildViewer = () => {
      destroyViewer()
      createViewer()
    }

    // create or update
    const updateViewer = () => {
      if ($viewer) {
        $viewer.update()
        emit('update', $viewer)
      }
      else {
        createViewer()
      }
    }
    const changeViewer = () => {
      props.rebuild ? rebuildViewer() : updateViewer()
    }

    // watch effect
    // https://v3.cn.vuejs.org/api/computed-watch-api.html
    const imagesComputed = computed(() => props.images)
    const optionsComputed = computed(() => props.images)
    watch(imagesComputed, () => nextTick(() => changeViewer()), { deep: true })
    watch(optionsComputed, () => nextTick(() => rebuildViewer()), { deep: true })

    // lifecycle hooks
    onMounted(() => createViewer())
    onUnmounted(() => destroyViewer())

    // expose value
    // https://github.com/vuejs/rfcs/pull/210
    expose({
      $viewer: () => $viewer,
      destroyViewer,
    })

    // render function
    return () => h(props.tag, { ref: $root }, slots.default && slots.default({ ...props }))
  },
})
