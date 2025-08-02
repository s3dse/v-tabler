import {
  injectLocal,
  isClient,
  isIOS,
  isObject,
  noop,
  notNullish,
  onClickOutside,
  promiseTimeout,
  pxValue,
  reactiveOmit,
  toArray,
  toRef,
  tryOnMounted,
  tryOnScopeDispose,
  tryOnUnmounted,
  until,
  useActiveElement,
  useBattery,
  useBrowserLocation,
  useClipboard,
  useDark,
  useDebounceFn,
  useDeviceMotion,
  useDeviceOrientation,
  useDevicePixelRatio,
  useDevicesList,
  useDocumentVisibility,
  useDraggable,
  useElementBounding,
  useElementSize,
  useElementVisibility,
  useEyeDropper,
  useFullscreen,
  useGeolocation,
  useIdle,
  useMouse,
  useMouseInElement,
  useMousePressed,
  useNetwork,
  useNow,
  useObjectUrl,
  useOffsetPagination,
  useOnline,
  usePageLeave,
  usePointer,
  usePointerLock,
  usePreferredColorScheme,
  usePreferredContrast,
  usePreferredDark,
  usePreferredLanguages,
  usePreferredReducedMotion,
  usePreferredReducedTransparency,
  useStorage,
  useThrottleFn,
  useTimeAgo,
  useTimestamp,
  useToggle,
  useVirtualList,
  useWindowFocus,
  useWindowSize,
  watchImmediate,
  watchOnce,
  watchPausable
} from "./chunk-IKJKIJF7.js";
import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  hasInjectionContext,
  nextTick,
  onMounted,
  reactive,
  ref,
  shallowRef,
  toRefs,
  toValue,
  unref,
  watch,
  watchEffect
} from "./chunk-NRD5EZIZ.js";
import "./chunk-OYQD7GAK.js";

// node_modules/@vueuse/components/index.mjs
var OnClickOutside = defineComponent({
  name: "OnClickOutside",
  props: ["as", "options"],
  emits: ["trigger"],
  setup(props, { slots, emit }) {
    const target = shallowRef();
    onClickOutside(target, (e) => {
      emit("trigger", e);
    }, props.options);
    return () => {
      if (slots.default)
        return h(props.as || "div", { ref: target }, slots.default());
    };
  }
});
var defaultWindow = isClient ? window : void 0;
function unrefElement(elRef) {
  var _a;
  const plain = toValue(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
function useEventListener(...args) {
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  const register = (el, event, listener, options) => {
    el.addEventListener(event, listener, options);
    return () => el.removeEventListener(event, listener, options);
  };
  const firstParamTargets = computed(() => {
    const test = toArray(toValue(args[0])).filter((e) => e != null);
    return test.every((e) => typeof e !== "string") ? test : void 0;
  });
  const stopWatch = watchImmediate(
    () => {
      var _a, _b;
      return [
        (_b = (_a = firstParamTargets.value) == null ? void 0 : _a.map((e) => unrefElement(e))) != null ? _b : [defaultWindow].filter((e) => e != null),
        toArray(toValue(firstParamTargets.value ? args[1] : args[0])),
        toArray(unref(firstParamTargets.value ? args[2] : args[1])),
        // @ts-expect-error - TypeScript gets the correct types, but somehow still complains
        toValue(firstParamTargets.value ? args[3] : args[2])
      ];
    },
    ([raw_targets, raw_events, raw_listeners, raw_options]) => {
      cleanup();
      if (!(raw_targets == null ? void 0 : raw_targets.length) || !(raw_events == null ? void 0 : raw_events.length) || !(raw_listeners == null ? void 0 : raw_listeners.length))
        return;
      const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
      cleanups.push(
        ...raw_targets.flatMap(
          (el) => raw_events.flatMap(
            (event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))
          )
        )
      );
    },
    { flush: "post" }
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(cleanup);
  return stop;
}
var _iOSWorkaround = false;
function onClickOutside2(target, handler, options = {}) {
  const { window: window2 = defaultWindow, ignore = [], capture = true, detectIframe = false, controls = false } = options;
  if (!window2) {
    return controls ? { stop: noop, cancel: noop, trigger: noop } : noop;
  }
  if (isIOS && !_iOSWorkaround) {
    _iOSWorkaround = true;
    const listenerOptions = { passive: true };
    Array.from(window2.document.body.children).forEach((el) => el.addEventListener("click", noop, listenerOptions));
    window2.document.documentElement.addEventListener("click", noop, listenerOptions);
  }
  let shouldListen = true;
  const shouldIgnore = (event) => {
    return toValue(ignore).some((target2) => {
      if (typeof target2 === "string") {
        return Array.from(window2.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el));
      } else {
        const el = unrefElement(target2);
        return el && (event.target === el || event.composedPath().includes(el));
      }
    });
  };
  function hasMultipleRoots(target2) {
    const vm = toValue(target2);
    return vm && vm.$.subTree.shapeFlag === 16;
  }
  function checkMultipleRoots(target2, event) {
    const vm = toValue(target2);
    const children = vm.$.subTree && vm.$.subTree.children;
    if (children == null || !Array.isArray(children))
      return false;
    return children.some((child) => child.el === event.target || event.composedPath().includes(child.el));
  }
  const listener = (event) => {
    const el = unrefElement(target);
    if (event.target == null)
      return;
    if (!(el instanceof Element) && hasMultipleRoots(target) && checkMultipleRoots(target, event))
      return;
    if (!el || el === event.target || event.composedPath().includes(el))
      return;
    if ("detail" in event && event.detail === 0)
      shouldListen = !shouldIgnore(event);
    if (!shouldListen) {
      shouldListen = true;
      return;
    }
    handler(event);
  };
  let isProcessingClick = false;
  const cleanup = [
    useEventListener(window2, "click", (event) => {
      if (!isProcessingClick) {
        isProcessingClick = true;
        setTimeout(() => {
          isProcessingClick = false;
        }, 0);
        listener(event);
      }
    }, { passive: true, capture }),
    useEventListener(window2, "pointerdown", (e) => {
      const el = unrefElement(target);
      shouldListen = !shouldIgnore(e) && !!(el && !e.composedPath().includes(el));
    }, { passive: true }),
    detectIframe && useEventListener(window2, "blur", (event) => {
      setTimeout(() => {
        var _a;
        const el = unrefElement(target);
        if (((_a = window2.document.activeElement) == null ? void 0 : _a.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(window2.document.activeElement))) {
          handler(event);
        }
      }, 0);
    }, { passive: true })
  ].filter(Boolean);
  const stop = () => cleanup.forEach((fn) => fn());
  if (controls) {
    return {
      stop,
      cancel: () => {
        shouldListen = false;
      },
      trigger: (event) => {
        shouldListen = true;
        listener(event);
        shouldListen = false;
      }
    };
  }
  return stop;
}
var stopClickOutsideMap = /* @__PURE__ */ new WeakMap();
var vOnClickOutside = {
  mounted(el, binding) {
    const capture = !binding.modifiers.bubble;
    let stop;
    if (typeof binding.value === "function") {
      stop = onClickOutside2(el, binding.value, { capture });
    } else {
      const [handler, options] = binding.value;
      stop = onClickOutside2(el, handler, Object.assign({ capture }, options));
    }
    stopClickOutsideMap.set(el, stop);
  },
  unmounted(el) {
    const stop = stopClickOutsideMap.get(el);
    if (stop && typeof stop === "function") {
      stop();
    } else {
      stop == null ? void 0 : stop.stop();
    }
    stopClickOutsideMap.delete(el);
  }
};
function createKeyPredicate(keyFilter) {
  if (typeof keyFilter === "function")
    return keyFilter;
  else if (typeof keyFilter === "string")
    return (event) => event.key === keyFilter;
  else if (Array.isArray(keyFilter))
    return (event) => keyFilter.includes(event.key);
  return () => true;
}
function onKeyStroke(...args) {
  let key;
  let handler;
  let options = {};
  if (args.length === 3) {
    key = args[0];
    handler = args[1];
    options = args[2];
  } else if (args.length === 2) {
    if (typeof args[1] === "object") {
      key = true;
      handler = args[0];
      options = args[1];
    } else {
      key = args[0];
      handler = args[1];
    }
  } else {
    key = true;
    handler = args[0];
  }
  const {
    target = defaultWindow,
    eventName = "keydown",
    passive = false,
    dedupe = false
  } = options;
  const predicate = createKeyPredicate(key);
  const listener = (e) => {
    if (e.repeat && toValue(dedupe))
      return;
    if (predicate(e))
      handler(e);
  };
  return useEventListener(target, eventName, listener, passive);
}
var vOnKeyStroke = {
  mounted(el, binding) {
    var _a, _b;
    const keys = (_b = (_a = binding.arg) == null ? void 0 : _a.split(",")) != null ? _b : true;
    if (typeof binding.value === "function") {
      onKeyStroke(keys, binding.value, {
        target: el
      });
    } else {
      const [handler, options] = binding.value;
      onKeyStroke(keys, handler, {
        target: el,
        ...options
      });
    }
  }
};
var DEFAULT_DELAY = 500;
var DEFAULT_THRESHOLD = 10;
function onLongPress(target, handler, options) {
  var _a, _b;
  const elementRef = computed(() => unrefElement(target));
  let timeout;
  let posStart;
  let startTimestamp;
  let hasLongPressed = false;
  function clear() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = void 0;
    }
    posStart = void 0;
    startTimestamp = void 0;
    hasLongPressed = false;
  }
  function onRelease(ev) {
    var _a2, _b2, _c;
    const [_startTimestamp, _posStart, _hasLongPressed] = [startTimestamp, posStart, hasLongPressed];
    clear();
    if (!(options == null ? void 0 : options.onMouseUp) || !_posStart || !_startTimestamp)
      return;
    if (((_a2 = options == null ? void 0 : options.modifiers) == null ? void 0 : _a2.self) && ev.target !== elementRef.value)
      return;
    if ((_b2 = options == null ? void 0 : options.modifiers) == null ? void 0 : _b2.prevent)
      ev.preventDefault();
    if ((_c = options == null ? void 0 : options.modifiers) == null ? void 0 : _c.stop)
      ev.stopPropagation();
    const dx = ev.x - _posStart.x;
    const dy = ev.y - _posStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    options.onMouseUp(ev.timeStamp - _startTimestamp, distance, _hasLongPressed);
  }
  function onDown(ev) {
    var _a2, _b2, _c, _d;
    if (((_a2 = options == null ? void 0 : options.modifiers) == null ? void 0 : _a2.self) && ev.target !== elementRef.value)
      return;
    clear();
    if ((_b2 = options == null ? void 0 : options.modifiers) == null ? void 0 : _b2.prevent)
      ev.preventDefault();
    if ((_c = options == null ? void 0 : options.modifiers) == null ? void 0 : _c.stop)
      ev.stopPropagation();
    posStart = {
      x: ev.x,
      y: ev.y
    };
    startTimestamp = ev.timeStamp;
    timeout = setTimeout(
      () => {
        hasLongPressed = true;
        handler(ev);
      },
      (_d = options == null ? void 0 : options.delay) != null ? _d : DEFAULT_DELAY
    );
  }
  function onMove(ev) {
    var _a2, _b2, _c, _d;
    if (((_a2 = options == null ? void 0 : options.modifiers) == null ? void 0 : _a2.self) && ev.target !== elementRef.value)
      return;
    if (!posStart || (options == null ? void 0 : options.distanceThreshold) === false)
      return;
    if ((_b2 = options == null ? void 0 : options.modifiers) == null ? void 0 : _b2.prevent)
      ev.preventDefault();
    if ((_c = options == null ? void 0 : options.modifiers) == null ? void 0 : _c.stop)
      ev.stopPropagation();
    const dx = ev.x - posStart.x;
    const dy = ev.y - posStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance >= ((_d = options == null ? void 0 : options.distanceThreshold) != null ? _d : DEFAULT_THRESHOLD))
      clear();
  }
  const listenerOptions = {
    capture: (_a = options == null ? void 0 : options.modifiers) == null ? void 0 : _a.capture,
    once: (_b = options == null ? void 0 : options.modifiers) == null ? void 0 : _b.once
  };
  const cleanup = [
    useEventListener(elementRef, "pointerdown", onDown, listenerOptions),
    useEventListener(elementRef, "pointermove", onMove, listenerOptions),
    useEventListener(elementRef, ["pointerup", "pointerleave"], onRelease, listenerOptions)
  ];
  const stop = () => cleanup.forEach((fn) => fn());
  return stop;
}
var OnLongPress = defineComponent({
  name: "OnLongPress",
  props: ["as", "options"],
  emits: ["trigger"],
  setup(props, { slots, emit }) {
    const target = shallowRef();
    onLongPress(
      target,
      (e) => {
        emit("trigger", e);
      },
      props.options
    );
    return () => {
      if (slots.default)
        return h(props.as || "div", { ref: target }, slots.default());
    };
  }
});
var vOnLongPress = {
  mounted(el, binding) {
    if (typeof binding.value === "function")
      onLongPress(el, binding.value, { modifiers: binding.modifiers });
    else
      onLongPress(el, ...binding.value);
  }
};
var UseActiveElement = defineComponent({
  name: "UseActiveElement",
  setup(props, { slots }) {
    const data = reactive({
      element: useActiveElement()
    });
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseBattery = defineComponent({
  name: "UseBattery",
  setup(props, { slots }) {
    const data = reactive(useBattery(props));
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseBrowserLocation = defineComponent({
  name: "UseBrowserLocation",
  setup(props, { slots }) {
    const data = reactive(useBrowserLocation());
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseClipboard = defineComponent({
  name: "UseClipboard",
  props: [
    "source",
    "read",
    "navigator",
    "copiedDuring",
    "legacy"
  ],
  setup(props, { slots }) {
    const data = reactive(useClipboard(props));
    return () => {
      var _a;
      return (_a = slots.default) == null ? void 0 : _a.call(slots, data);
    };
  }
});
var _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var globalKey = "__vueuse_ssr_handlers__";
var handlers = getHandlers();
function getHandlers() {
  if (!(globalKey in _global))
    _global[globalKey] = _global[globalKey] || {};
  return _global[globalKey];
}
function getSSRHandler(key, fallback) {
  return handlers[key] || fallback;
}
var ssrWidthSymbol = Symbol("vueuse-ssr-width");
function useSSRWidth() {
  const ssrWidth = hasInjectionContext() ? injectLocal(ssrWidthSymbol, null) : null;
  return typeof ssrWidth === "number" ? ssrWidth : void 0;
}
function useMounted() {
  const isMounted = shallowRef(false);
  const instance = getCurrentInstance();
  if (instance) {
    onMounted(() => {
      isMounted.value = true;
    }, instance);
  }
  return isMounted;
}
function useSupported(callback) {
  const isMounted = useMounted();
  return computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
function useMediaQuery(query, options = {}) {
  const { window: window2 = defaultWindow, ssrWidth = useSSRWidth() } = options;
  const isSupported = useSupported(() => window2 && "matchMedia" in window2 && typeof window2.matchMedia === "function");
  const ssrSupport = shallowRef(typeof ssrWidth === "number");
  const mediaQuery = shallowRef();
  const matches = shallowRef(false);
  const handler = (event) => {
    matches.value = event.matches;
  };
  watchEffect(() => {
    if (ssrSupport.value) {
      ssrSupport.value = !isSupported.value;
      const queryStrings = toValue(query).split(",");
      matches.value = queryStrings.some((queryString) => {
        const not = queryString.includes("not all");
        const minWidth = queryString.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
        const maxWidth = queryString.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
        let res = Boolean(minWidth || maxWidth);
        if (minWidth && res) {
          res = ssrWidth >= pxValue(minWidth[1]);
        }
        if (maxWidth && res) {
          res = ssrWidth <= pxValue(maxWidth[1]);
        }
        return not ? !res : res;
      });
      return;
    }
    if (!isSupported.value)
      return;
    mediaQuery.value = window2.matchMedia(toValue(query));
    matches.value = mediaQuery.value.matches;
  });
  useEventListener(mediaQuery, "change", handler, { passive: true });
  return computed(() => matches.value);
}
function usePreferredDark2(options) {
  return useMediaQuery("(prefers-color-scheme: dark)", options);
}
function guessSerializerType(rawInit) {
  return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
}
var StorageSerializers = {
  boolean: {
    read: (v) => v === "true",
    write: (v) => String(v)
  },
  object: {
    read: (v) => JSON.parse(v),
    write: (v) => JSON.stringify(v)
  },
  number: {
    read: (v) => Number.parseFloat(v),
    write: (v) => String(v)
  },
  any: {
    read: (v) => v,
    write: (v) => String(v)
  },
  string: {
    read: (v) => v,
    write: (v) => String(v)
  },
  map: {
    read: (v) => new Map(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v.entries()))
  },
  set: {
    read: (v) => new Set(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v))
  },
  date: {
    read: (v) => new Date(v),
    write: (v) => v.toISOString()
  }
};
var customStorageEventName = "vueuse-storage";
function useStorage2(key, defaults, storage, options = {}) {
  var _a;
  const {
    flush = "pre",
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow,
    window: window2 = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e);
    },
    initOnMounted
  } = options;
  const data = (shallow ? shallowRef : ref)(typeof defaults === "function" ? defaults() : defaults);
  const keyComputed = computed(() => toValue(key));
  if (!storage) {
    try {
      storage = getSSRHandler("getDefaultStorage", () => {
        var _a2;
        return (_a2 = defaultWindow) == null ? void 0 : _a2.localStorage;
      })();
    } catch (e) {
      onError(e);
    }
  }
  if (!storage)
    return data;
  const rawInit = toValue(defaults);
  const type = guessSerializerType(rawInit);
  const serializer = (_a = options.serializer) != null ? _a : StorageSerializers[type];
  const { pause: pauseWatch, resume: resumeWatch } = watchPausable(
    data,
    () => write(data.value),
    { flush, deep, eventFilter }
  );
  watch(keyComputed, () => update(), { flush });
  let firstMounted = false;
  const onStorageEvent = (ev) => {
    if (initOnMounted && !firstMounted) {
      return;
    }
    update(ev);
  };
  const onStorageCustomEvent = (ev) => {
    if (initOnMounted && !firstMounted) {
      return;
    }
    updateFromCustomEvent(ev);
  };
  if (window2 && listenToStorageChanges) {
    if (storage instanceof Storage)
      useEventListener(window2, "storage", onStorageEvent, { passive: true });
    else
      useEventListener(window2, customStorageEventName, onStorageCustomEvent);
  }
  if (initOnMounted) {
    tryOnMounted(() => {
      firstMounted = true;
      update();
    });
  } else {
    update();
  }
  function dispatchWriteEvent(oldValue, newValue) {
    if (window2) {
      const payload = {
        key: keyComputed.value,
        oldValue,
        newValue,
        storageArea: storage
      };
      window2.dispatchEvent(storage instanceof Storage ? new StorageEvent("storage", payload) : new CustomEvent(customStorageEventName, {
        detail: payload
      }));
    }
  }
  function write(v) {
    try {
      const oldValue = storage.getItem(keyComputed.value);
      if (v == null) {
        dispatchWriteEvent(oldValue, null);
        storage.removeItem(keyComputed.value);
      } else {
        const serialized = serializer.write(v);
        if (oldValue !== serialized) {
          storage.setItem(keyComputed.value, serialized);
          dispatchWriteEvent(oldValue, serialized);
        }
      }
    } catch (e) {
      onError(e);
    }
  }
  function read(event) {
    const rawValue = event ? event.newValue : storage.getItem(keyComputed.value);
    if (rawValue == null) {
      if (writeDefaults && rawInit != null)
        storage.setItem(keyComputed.value, serializer.write(rawInit));
      return rawInit;
    } else if (!event && mergeDefaults) {
      const value = serializer.read(rawValue);
      if (typeof mergeDefaults === "function")
        return mergeDefaults(value, rawInit);
      else if (type === "object" && !Array.isArray(value))
        return { ...rawInit, ...value };
      return value;
    } else if (typeof rawValue !== "string") {
      return rawValue;
    } else {
      return serializer.read(rawValue);
    }
  }
  function update(event) {
    if (event && event.storageArea !== storage)
      return;
    if (event && event.key == null) {
      data.value = rawInit;
      return;
    }
    if (event && event.key !== keyComputed.value)
      return;
    pauseWatch();
    try {
      if ((event == null ? void 0 : event.newValue) !== serializer.write(data.value))
        data.value = read(event);
    } catch (e) {
      onError(e);
    } finally {
      if (event)
        nextTick(resumeWatch);
      else
        resumeWatch();
    }
  }
  function updateFromCustomEvent(event) {
    update(event.detail);
  }
  return data;
}
var CSS_DISABLE_TRANS = "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}";
function useColorMode(options = {}) {
  const {
    selector = "html",
    attribute = "class",
    initialValue = "auto",
    window: window2 = defaultWindow,
    storage,
    storageKey = "vueuse-color-scheme",
    listenToStorageChanges = true,
    storageRef,
    emitAuto,
    disableTransition = true
  } = options;
  const modes = {
    auto: "",
    light: "light",
    dark: "dark",
    ...options.modes || {}
  };
  const preferredDark = usePreferredDark2({ window: window2 });
  const system = computed(() => preferredDark.value ? "dark" : "light");
  const store = storageRef || (storageKey == null ? toRef(initialValue) : useStorage2(storageKey, initialValue, storage, { window: window2, listenToStorageChanges }));
  const state = computed(() => store.value === "auto" ? system.value : store.value);
  const updateHTMLAttrs = getSSRHandler(
    "updateHTMLAttrs",
    (selector2, attribute2, value) => {
      const el = typeof selector2 === "string" ? window2 == null ? void 0 : window2.document.querySelector(selector2) : unrefElement(selector2);
      if (!el)
        return;
      const classesToAdd = /* @__PURE__ */ new Set();
      const classesToRemove = /* @__PURE__ */ new Set();
      let attributeToChange = null;
      if (attribute2 === "class") {
        const current = value.split(/\s/g);
        Object.values(modes).flatMap((i) => (i || "").split(/\s/g)).filter(Boolean).forEach((v) => {
          if (current.includes(v))
            classesToAdd.add(v);
          else
            classesToRemove.add(v);
        });
      } else {
        attributeToChange = { key: attribute2, value };
      }
      if (classesToAdd.size === 0 && classesToRemove.size === 0 && attributeToChange === null)
        return;
      let style;
      if (disableTransition) {
        style = window2.document.createElement("style");
        style.appendChild(document.createTextNode(CSS_DISABLE_TRANS));
        window2.document.head.appendChild(style);
      }
      for (const c of classesToAdd) {
        el.classList.add(c);
      }
      for (const c of classesToRemove) {
        el.classList.remove(c);
      }
      if (attributeToChange) {
        el.setAttribute(attributeToChange.key, attributeToChange.value);
      }
      if (disableTransition) {
        window2.getComputedStyle(style).opacity;
        document.head.removeChild(style);
      }
    }
  );
  function defaultOnChanged(mode) {
    var _a;
    updateHTMLAttrs(selector, attribute, (_a = modes[mode]) != null ? _a : mode);
  }
  function onChanged(mode) {
    if (options.onChanged)
      options.onChanged(mode, defaultOnChanged);
    else
      defaultOnChanged(mode);
  }
  watch(state, onChanged, { flush: "post", immediate: true });
  tryOnMounted(() => onChanged(state.value));
  const auto = computed({
    get() {
      return emitAuto ? store.value : state.value;
    },
    set(v) {
      store.value = v;
    }
  });
  return Object.assign(auto, { store, system, state });
}
var UseColorMode = defineComponent({
  name: "UseColorMode",
  props: ["selector", "attribute", "modes", "onChanged", "storageKey", "storage", "emitAuto"],
  setup(props, { slots }) {
    const mode = useColorMode(props);
    const data = reactive({
      mode,
      system: mode.system,
      store: mode.store
    });
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseDark = defineComponent({
  name: "UseDark",
  props: ["selector", "attribute", "valueDark", "valueLight", "onChanged", "storageKey", "storage"],
  setup(props, { slots }) {
    const isDark = useDark(props);
    const data = reactive({
      isDark,
      toggleDark: useToggle(isDark)
    });
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseDeviceMotion = defineComponent({
  name: "UseDeviceMotion",
  setup(props, { slots }) {
    const data = useDeviceMotion();
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseDeviceOrientation = defineComponent({
  name: "UseDeviceOrientation",
  setup(props, { slots }) {
    const data = reactive(useDeviceOrientation());
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseDevicePixelRatio = defineComponent({
  name: "UseDevicePixelRatio",
  setup(props, { slots }) {
    const data = reactive({
      pixelRatio: useDevicePixelRatio()
    });
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseDevicesList = defineComponent({
  name: "UseDevicesList",
  props: ["onUpdated", "requestPermissions", "constraints"],
  setup(props, { slots }) {
    const data = reactive(useDevicesList(props));
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseDocumentVisibility = defineComponent({
  name: "UseDocumentVisibility",
  setup(props, { slots }) {
    const data = reactive({
      visibility: useDocumentVisibility()
    });
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseDraggable = defineComponent({
  name: "UseDraggable",
  props: [
    "storageKey",
    "storageType",
    "initialValue",
    "exact",
    "preventDefault",
    "stopPropagation",
    "pointerTypes",
    "as",
    "handle",
    "axis",
    "onStart",
    "onMove",
    "onEnd",
    "disabled",
    "buttons",
    "containerElement"
  ],
  setup(props, { slots }) {
    const target = shallowRef();
    const handle = computed(() => {
      var _a;
      return (_a = toValue(props.handle)) != null ? _a : target.value;
    });
    const containerElement = computed(() => {
      var _a;
      return (_a = props.containerElement) != null ? _a : void 0;
    });
    const disabled = computed(() => !!props.disabled);
    const storageValue = props.storageKey && useStorage(
      props.storageKey,
      toValue(props.initialValue) || { x: 0, y: 0 },
      isClient ? props.storageType === "session" ? sessionStorage : localStorage : void 0
    );
    const initialValue = storageValue || props.initialValue || { x: 0, y: 0 };
    const onEnd = (position, event) => {
      var _a;
      (_a = props.onEnd) == null ? void 0 : _a.call(props, position, event);
      if (!storageValue)
        return;
      storageValue.value.x = position.x;
      storageValue.value.y = position.y;
    };
    const data = reactive(useDraggable(target, {
      ...props,
      handle,
      initialValue,
      onEnd,
      disabled,
      containerElement
    }));
    return () => {
      if (slots.default)
        return h(props.as || "div", { ref: target, style: `touch-action:none;${data.style}` }, slots.default(data));
    };
  }
});
var UseElementBounding = defineComponent({
  name: "UseElementBounding",
  props: ["box", "as"],
  setup(props, { slots }) {
    const target = shallowRef();
    const data = reactive(useElementBounding(target));
    return () => {
      if (slots.default)
        return h(props.as || "div", { ref: target }, slots.default(data));
    };
  }
});
function useMutationObserver(target, callback, options = {}) {
  const { window: window2 = defaultWindow, ...mutationOptions } = options;
  let observer;
  const isSupported = useSupported(() => window2 && "MutationObserver" in window2);
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = void 0;
    }
  };
  const targets = computed(() => {
    const value = toValue(target);
    const items = toArray(value).map(unrefElement).filter(notNullish);
    return new Set(items);
  });
  const stopWatch = watch(
    () => targets.value,
    (targets2) => {
      cleanup();
      if (isSupported.value && targets2.size) {
        observer = new MutationObserver(callback);
        targets2.forEach((el) => observer.observe(el, mutationOptions));
      }
    },
    { immediate: true, flush: "post" }
  );
  const takeRecords = () => {
    return observer == null ? void 0 : observer.takeRecords();
  };
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop,
    takeRecords
  };
}
function useResizeObserver(target, callback, options = {}) {
  const { window: window2 = defaultWindow, ...observerOptions } = options;
  let observer;
  const isSupported = useSupported(() => window2 && "ResizeObserver" in window2);
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = void 0;
    }
  };
  const targets = computed(() => {
    const _targets = toValue(target);
    return Array.isArray(_targets) ? _targets.map((el) => unrefElement(el)) : [unrefElement(_targets)];
  });
  const stopWatch = watch(
    targets,
    (els) => {
      cleanup();
      if (isSupported.value && window2) {
        observer = new ResizeObserver(callback);
        for (const _el of els) {
          if (_el)
            observer.observe(_el, observerOptions);
        }
      }
    },
    { immediate: true, flush: "post" }
  );
  const stop = () => {
    cleanup();
    stopWatch();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop
  };
}
function useElementBounding2(target, options = {}) {
  const {
    reset = true,
    windowResize = true,
    windowScroll = true,
    immediate = true,
    updateTiming = "sync"
  } = options;
  const height = shallowRef(0);
  const bottom = shallowRef(0);
  const left = shallowRef(0);
  const right = shallowRef(0);
  const top = shallowRef(0);
  const width = shallowRef(0);
  const x = shallowRef(0);
  const y = shallowRef(0);
  function recalculate() {
    const el = unrefElement(target);
    if (!el) {
      if (reset) {
        height.value = 0;
        bottom.value = 0;
        left.value = 0;
        right.value = 0;
        top.value = 0;
        width.value = 0;
        x.value = 0;
        y.value = 0;
      }
      return;
    }
    const rect = el.getBoundingClientRect();
    height.value = rect.height;
    bottom.value = rect.bottom;
    left.value = rect.left;
    right.value = rect.right;
    top.value = rect.top;
    width.value = rect.width;
    x.value = rect.x;
    y.value = rect.y;
  }
  function update() {
    if (updateTiming === "sync")
      recalculate();
    else if (updateTiming === "next-frame")
      requestAnimationFrame(() => recalculate());
  }
  useResizeObserver(target, update);
  watch(() => unrefElement(target), (ele) => !ele && update());
  useMutationObserver(target, update, {
    attributeFilter: ["style", "class"]
  });
  if (windowScroll)
    useEventListener("scroll", update, { capture: true, passive: true });
  if (windowResize)
    useEventListener("resize", update, { passive: true });
  tryOnMounted(() => {
    if (immediate)
      update();
  });
  return {
    height,
    bottom,
    left,
    right,
    top,
    width,
    x,
    y,
    update
  };
}
var vElementBounding = {
  mounted(el, binding) {
    const [handler, options] = typeof binding.value === "function" ? [binding.value, {}] : binding.value;
    const {
      height,
      bottom,
      left,
      right,
      top,
      width,
      x,
      y
    } = useElementBounding2(el, options);
    watch([height, bottom, left, right, top, width, x, y], () => handler({ height, bottom, left, right, top, width, x, y }));
  }
};
function onElementRemoval(target, callback, options = {}) {
  const {
    window: window2 = defaultWindow,
    document: document2 = window2 == null ? void 0 : window2.document,
    flush = "sync"
  } = options;
  if (!window2 || !document2)
    return noop;
  let stopFn;
  const cleanupAndUpdate = (fn) => {
    stopFn == null ? void 0 : stopFn();
    stopFn = fn;
  };
  const stopWatch = watchEffect(() => {
    const el = unrefElement(target);
    if (el) {
      const { stop } = useMutationObserver(
        document2,
        (mutationsList) => {
          const targetRemoved = mutationsList.map((mutation) => [...mutation.removedNodes]).flat().some((node) => node === el || node.contains(el));
          if (targetRemoved) {
            callback(mutationsList);
          }
        },
        {
          window: window2,
          childList: true,
          subtree: true
        }
      );
      cleanupAndUpdate(stop);
    }
  }, { flush });
  const stopHandle = () => {
    stopWatch();
    cleanupAndUpdate();
  };
  tryOnScopeDispose(stopHandle);
  return stopHandle;
}
function useElementHover(el, options = {}) {
  const {
    delayEnter = 0,
    delayLeave = 0,
    triggerOnRemoval = false,
    window: window2 = defaultWindow
  } = options;
  const isHovered = shallowRef(false);
  let timer;
  const toggle = (entering) => {
    const delay = entering ? delayEnter : delayLeave;
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
    }
    if (delay)
      timer = setTimeout(() => isHovered.value = entering, delay);
    else
      isHovered.value = entering;
  };
  if (!window2)
    return isHovered;
  useEventListener(el, "mouseenter", () => toggle(true), { passive: true });
  useEventListener(el, "mouseleave", () => toggle(false), { passive: true });
  if (triggerOnRemoval) {
    onElementRemoval(
      computed(() => unrefElement(el)),
      () => toggle(false)
    );
  }
  return isHovered;
}
var vElementHover = {
  mounted(el, binding) {
    const value = binding.value;
    if (typeof value === "function") {
      const isHovered = useElementHover(el);
      watch(isHovered, (v) => value(v));
    } else {
      const [handler, options] = value;
      const isHovered = useElementHover(el, options);
      watch(isHovered, (v) => handler(v));
    }
  }
};
var UseElementSize = defineComponent({
  name: "UseElementSize",
  props: ["width", "height", "box", "as"],
  setup(props, { slots }) {
    var _a, _b;
    const target = shallowRef();
    const data = reactive(useElementSize(target, { width: (_a = props.width) != null ? _a : 0, height: (_b = props.height) != null ? _b : 0 }, { box: props.box }));
    return () => {
      if (slots.default)
        return h(props.as || "div", { ref: target }, slots.default(data));
    };
  }
});
function useElementSize2(target, initialSize = { width: 0, height: 0 }, options = {}) {
  const { window: window2 = defaultWindow, box = "content-box" } = options;
  const isSVG = computed(() => {
    var _a, _b;
    return (_b = (_a = unrefElement(target)) == null ? void 0 : _a.namespaceURI) == null ? void 0 : _b.includes("svg");
  });
  const width = shallowRef(initialSize.width);
  const height = shallowRef(initialSize.height);
  const { stop: stop1 } = useResizeObserver(
    target,
    ([entry]) => {
      const boxSize = box === "border-box" ? entry.borderBoxSize : box === "content-box" ? entry.contentBoxSize : entry.devicePixelContentBoxSize;
      if (window2 && isSVG.value) {
        const $elem = unrefElement(target);
        if ($elem) {
          const rect = $elem.getBoundingClientRect();
          width.value = rect.width;
          height.value = rect.height;
        }
      } else {
        if (boxSize) {
          const formatBoxSize = toArray(boxSize);
          width.value = formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0);
          height.value = formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0);
        } else {
          width.value = entry.contentRect.width;
          height.value = entry.contentRect.height;
        }
      }
    },
    options
  );
  tryOnMounted(() => {
    const ele = unrefElement(target);
    if (ele) {
      width.value = "offsetWidth" in ele ? ele.offsetWidth : initialSize.width;
      height.value = "offsetHeight" in ele ? ele.offsetHeight : initialSize.height;
    }
  });
  const stop2 = watch(
    () => unrefElement(target),
    (ele) => {
      width.value = ele ? initialSize.width : 0;
      height.value = ele ? initialSize.height : 0;
    }
  );
  function stop() {
    stop1();
    stop2();
  }
  return {
    width,
    height,
    stop
  };
}
var vElementSize = {
  mounted(el, binding) {
    var _a;
    const handler = typeof binding.value === "function" ? binding.value : (_a = binding.value) == null ? void 0 : _a[0];
    const options = typeof binding.value === "function" ? [] : binding.value.slice(1);
    const { width, height } = useElementSize2(el, ...options);
    watch([width, height], ([width2, height2]) => handler({ width: width2, height: height2 }));
  }
};
var UseElementVisibility = defineComponent({
  name: "UseElementVisibility",
  props: ["as"],
  setup(props, { slots }) {
    const target = shallowRef();
    const data = reactive({
      isVisible: useElementVisibility(target)
    });
    return () => {
      if (slots.default)
        return h(props.as || "div", { ref: target }, slots.default(data));
    };
  }
});
function useIntersectionObserver(target, callback, options = {}) {
  const {
    root,
    rootMargin = "0px",
    threshold = 0,
    window: window2 = defaultWindow,
    immediate = true
  } = options;
  const isSupported = useSupported(() => window2 && "IntersectionObserver" in window2);
  const targets = computed(() => {
    const _target = toValue(target);
    return toArray(_target).map(unrefElement).filter(notNullish);
  });
  let cleanup = noop;
  const isActive = shallowRef(immediate);
  const stopWatch = isSupported.value ? watch(
    () => [targets.value, unrefElement(root), isActive.value],
    ([targets2, root2]) => {
      cleanup();
      if (!isActive.value)
        return;
      if (!targets2.length)
        return;
      const observer = new IntersectionObserver(
        callback,
        {
          root: unrefElement(root2),
          rootMargin,
          threshold
        }
      );
      targets2.forEach((el) => el && observer.observe(el));
      cleanup = () => {
        observer.disconnect();
        cleanup = noop;
      };
    },
    { immediate, flush: "post" }
  ) : noop;
  const stop = () => {
    cleanup();
    stopWatch();
    isActive.value = false;
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    isActive,
    pause() {
      cleanup();
      isActive.value = false;
    },
    resume() {
      isActive.value = true;
    },
    stop
  };
}
function useElementVisibility2(element, options = {}) {
  const {
    window: window2 = defaultWindow,
    scrollTarget,
    threshold = 0,
    rootMargin,
    once = false
  } = options;
  const elementIsVisible = shallowRef(false);
  const { stop } = useIntersectionObserver(
    element,
    (intersectionObserverEntries) => {
      let isIntersecting = elementIsVisible.value;
      let latestTime = 0;
      for (const entry of intersectionObserverEntries) {
        if (entry.time >= latestTime) {
          latestTime = entry.time;
          isIntersecting = entry.isIntersecting;
        }
      }
      elementIsVisible.value = isIntersecting;
      if (once) {
        watchOnce(elementIsVisible, () => {
          stop();
        });
      }
    },
    {
      root: scrollTarget,
      window: window2,
      threshold,
      rootMargin: toValue(rootMargin)
    }
  );
  return elementIsVisible;
}
var vElementVisibility = {
  mounted(el, binding) {
    if (typeof binding.value === "function") {
      const handler = binding.value;
      const isVisible = useElementVisibility2(el);
      watch(isVisible, (v) => handler(v), { immediate: true });
    } else {
      const [handler, options] = binding.value;
      const isVisible = useElementVisibility2(el, options);
      watch(isVisible, (v) => handler(v), { immediate: true });
    }
  }
};
var UseEyeDropper = defineComponent({
  name: "UseEyeDropper",
  props: {
    sRGBHex: String
  },
  setup(props, { slots }) {
    const data = reactive(useEyeDropper());
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseFullscreen = defineComponent({
  name: "UseFullscreen",
  props: ["as"],
  setup(props, { slots }) {
    const target = shallowRef();
    const data = reactive(useFullscreen(target));
    return () => {
      if (slots.default)
        return h(props.as || "div", { ref: target }, slots.default(data));
    };
  }
});
var UseGeolocation = defineComponent({
  name: "UseGeolocation",
  props: ["enableHighAccuracy", "maximumAge", "timeout", "navigator"],
  setup(props, { slots }) {
    const data = reactive(useGeolocation(props));
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseIdle = defineComponent({
  name: "UseIdle",
  props: ["timeout", "events", "listenForVisibilityChange", "initialState"],
  setup(props, { slots }) {
    const data = reactive(useIdle(props.timeout, props));
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
function useAsyncState(promise, initialState, options) {
  const {
    immediate = true,
    delay = 0,
    onError = noop,
    onSuccess = noop,
    resetOnExecute = true,
    shallow = true,
    throwError
  } = options != null ? options : {};
  const state = shallow ? shallowRef(initialState) : ref(initialState);
  const isReady = shallowRef(false);
  const isLoading = shallowRef(false);
  const error = shallowRef(void 0);
  async function execute(delay2 = 0, ...args) {
    if (resetOnExecute)
      state.value = initialState;
    error.value = void 0;
    isReady.value = false;
    isLoading.value = true;
    if (delay2 > 0)
      await promiseTimeout(delay2);
    const _promise = typeof promise === "function" ? promise(...args) : promise;
    try {
      const data = await _promise;
      state.value = data;
      isReady.value = true;
      onSuccess(data);
    } catch (e) {
      error.value = e;
      onError(e);
      if (throwError)
        throw e;
    } finally {
      isLoading.value = false;
    }
    return state.value;
  }
  if (immediate) {
    execute(delay);
  }
  const shell = {
    state,
    isReady,
    isLoading,
    error,
    execute
  };
  function waitUntilIsLoaded() {
    return new Promise((resolve, reject) => {
      until(isLoading).toBe(false).then(() => resolve(shell)).catch(reject);
    });
  }
  return {
    ...shell,
    then(onFulfilled, onRejected) {
      return waitUntilIsLoaded().then(onFulfilled, onRejected);
    }
  };
}
async function loadImage(options) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const { src, srcset, sizes, class: clazz, loading, crossorigin, referrerPolicy, width, height, decoding, fetchPriority, ismap, usemap } = options;
    img.src = src;
    if (srcset != null)
      img.srcset = srcset;
    if (sizes != null)
      img.sizes = sizes;
    if (clazz != null)
      img.className = clazz;
    if (loading != null)
      img.loading = loading;
    if (crossorigin != null)
      img.crossOrigin = crossorigin;
    if (referrerPolicy != null)
      img.referrerPolicy = referrerPolicy;
    if (width != null)
      img.width = width;
    if (height != null)
      img.height = height;
    if (decoding != null)
      img.decoding = decoding;
    if (fetchPriority != null)
      img.fetchPriority = fetchPriority;
    if (ismap != null)
      img.isMap = ismap;
    if (usemap != null)
      img.useMap = usemap;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}
function useImage(options, asyncStateOptions = {}) {
  const state = useAsyncState(
    () => loadImage(toValue(options)),
    void 0,
    {
      resetOnExecute: true,
      ...asyncStateOptions
    }
  );
  watch(
    () => toValue(options),
    () => state.execute(asyncStateOptions.delay),
    { deep: true }
  );
  return state;
}
var UseImage = defineComponent({
  name: "UseImage",
  props: [
    "src",
    "srcset",
    "sizes",
    "as",
    "alt",
    "class",
    "loading",
    "crossorigin",
    "referrerPolicy",
    "width",
    "height",
    "decoding",
    "fetchPriority",
    "ismap",
    "usemap"
  ],
  setup(props, { slots }) {
    const data = reactive(useImage(props));
    return () => {
      if (data.isLoading && slots.loading)
        return slots.loading(data);
      else if (data.error && slots.error)
        return slots.error(data.error);
      if (slots.default)
        return slots.default(data);
      return h(props.as || "img", props);
    };
  }
});
function resolveElement(el) {
  if (typeof Window !== "undefined" && el instanceof Window)
    return el.document.documentElement;
  if (typeof Document !== "undefined" && el instanceof Document)
    return el.documentElement;
  return el;
}
var ARRIVED_STATE_THRESHOLD_PIXELS = 1;
function useScroll(element, options = {}) {
  const {
    throttle = 0,
    idle = 200,
    onStop = noop,
    onScroll = noop,
    offset = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    eventListenerOptions = {
      capture: false,
      passive: true
    },
    behavior = "auto",
    window: window2 = defaultWindow,
    onError = (e) => {
      console.error(e);
    }
  } = options;
  const internalX = shallowRef(0);
  const internalY = shallowRef(0);
  const x = computed({
    get() {
      return internalX.value;
    },
    set(x2) {
      scrollTo(x2, void 0);
    }
  });
  const y = computed({
    get() {
      return internalY.value;
    },
    set(y2) {
      scrollTo(void 0, y2);
    }
  });
  function scrollTo(_x, _y) {
    var _a, _b, _c, _d;
    if (!window2)
      return;
    const _element = toValue(element);
    if (!_element)
      return;
    (_c = _element instanceof Document ? window2.document.body : _element) == null ? void 0 : _c.scrollTo({
      top: (_a = toValue(_y)) != null ? _a : y.value,
      left: (_b = toValue(_x)) != null ? _b : x.value,
      behavior: toValue(behavior)
    });
    const scrollContainer = ((_d = _element == null ? void 0 : _element.document) == null ? void 0 : _d.documentElement) || (_element == null ? void 0 : _element.documentElement) || _element;
    if (x != null)
      internalX.value = scrollContainer.scrollLeft;
    if (y != null)
      internalY.value = scrollContainer.scrollTop;
  }
  const isScrolling = shallowRef(false);
  const arrivedState = reactive({
    left: true,
    right: false,
    top: true,
    bottom: false
  });
  const directions = reactive({
    left: false,
    right: false,
    top: false,
    bottom: false
  });
  const onScrollEnd = (e) => {
    if (!isScrolling.value)
      return;
    isScrolling.value = false;
    directions.left = false;
    directions.right = false;
    directions.top = false;
    directions.bottom = false;
    onStop(e);
  };
  const onScrollEndDebounced = useDebounceFn(onScrollEnd, throttle + idle);
  const setArrivedState = (target) => {
    var _a;
    if (!window2)
      return;
    const el = ((_a = target == null ? void 0 : target.document) == null ? void 0 : _a.documentElement) || (target == null ? void 0 : target.documentElement) || unrefElement(target);
    const { display, flexDirection, direction } = getComputedStyle(el);
    const directionMultipler = direction === "rtl" ? -1 : 1;
    const scrollLeft = el.scrollLeft;
    directions.left = scrollLeft < internalX.value;
    directions.right = scrollLeft > internalX.value;
    const left = Math.abs(scrollLeft * directionMultipler) <= (offset.left || 0);
    const right = Math.abs(scrollLeft * directionMultipler) + el.clientWidth >= el.scrollWidth - (offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;
    if (display === "flex" && flexDirection === "row-reverse") {
      arrivedState.left = right;
      arrivedState.right = left;
    } else {
      arrivedState.left = left;
      arrivedState.right = right;
    }
    internalX.value = scrollLeft;
    let scrollTop = el.scrollTop;
    if (target === window2.document && !scrollTop)
      scrollTop = window2.document.body.scrollTop;
    directions.top = scrollTop < internalY.value;
    directions.bottom = scrollTop > internalY.value;
    const top = Math.abs(scrollTop) <= (offset.top || 0);
    const bottom = Math.abs(scrollTop) + el.clientHeight >= el.scrollHeight - (offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;
    if (display === "flex" && flexDirection === "column-reverse") {
      arrivedState.top = bottom;
      arrivedState.bottom = top;
    } else {
      arrivedState.top = top;
      arrivedState.bottom = bottom;
    }
    internalY.value = scrollTop;
  };
  const onScrollHandler = (e) => {
    var _a;
    if (!window2)
      return;
    const eventTarget = (_a = e.target.documentElement) != null ? _a : e.target;
    setArrivedState(eventTarget);
    isScrolling.value = true;
    onScrollEndDebounced(e);
    onScroll(e);
  };
  useEventListener(
    element,
    "scroll",
    throttle ? useThrottleFn(onScrollHandler, throttle, true, false) : onScrollHandler,
    eventListenerOptions
  );
  tryOnMounted(() => {
    try {
      const _element = toValue(element);
      if (!_element)
        return;
      setArrivedState(_element);
    } catch (e) {
      onError(e);
    }
  });
  useEventListener(
    element,
    "scrollend",
    onScrollEnd,
    eventListenerOptions
  );
  return {
    x,
    y,
    isScrolling,
    arrivedState,
    directions,
    measure() {
      const _element = toValue(element);
      if (window2 && _element)
        setArrivedState(_element);
    }
  };
}
function useInfiniteScroll(element, onLoadMore, options = {}) {
  var _a;
  const {
    direction = "bottom",
    interval = 100,
    canLoadMore = () => true
  } = options;
  const state = reactive(useScroll(
    element,
    {
      ...options,
      offset: {
        [direction]: (_a = options.distance) != null ? _a : 0,
        ...options.offset
      }
    }
  ));
  const promise = ref();
  const isLoading = computed(() => !!promise.value);
  const observedElement = computed(() => {
    return resolveElement(toValue(element));
  });
  const isElementVisible = useElementVisibility2(observedElement);
  function checkAndLoad() {
    state.measure();
    if (!observedElement.value || !isElementVisible.value || !canLoadMore(observedElement.value))
      return;
    const { scrollHeight, clientHeight, scrollWidth, clientWidth } = observedElement.value;
    const isNarrower = direction === "bottom" || direction === "top" ? scrollHeight <= clientHeight : scrollWidth <= clientWidth;
    if (state.arrivedState[direction] || isNarrower) {
      if (!promise.value) {
        promise.value = Promise.all([
          onLoadMore(state),
          new Promise((resolve) => setTimeout(resolve, interval))
        ]).finally(() => {
          promise.value = null;
          nextTick(() => checkAndLoad());
        });
      }
    }
  }
  const stop = watch(
    () => [state.arrivedState[direction], isElementVisible.value],
    checkAndLoad,
    { immediate: true }
  );
  tryOnUnmounted(stop);
  return {
    isLoading,
    reset() {
      nextTick(() => checkAndLoad());
    }
  };
}
var vInfiniteScroll = {
  mounted(el, binding) {
    if (typeof binding.value === "function")
      useInfiniteScroll(el, binding.value);
    else
      useInfiniteScroll(el, ...binding.value);
  }
};
var vIntersectionObserver = {
  mounted(el, binding) {
    if (typeof binding.value === "function")
      useIntersectionObserver(el, binding.value);
    else
      useIntersectionObserver(el, ...binding.value);
  }
};
var UseMouse = defineComponent({
  name: "UseMouse",
  props: ["touch", "resetOnTouchEnds", "initialValue"],
  setup(props, { slots }) {
    const data = reactive(useMouse(props));
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseMouseInElement = defineComponent({
  name: "UseMouseElement",
  props: ["handleOutside", "as"],
  setup(props, { slots }) {
    const target = shallowRef();
    const data = reactive(useMouseInElement(target, props));
    return () => {
      if (slots.default)
        return h(props.as || "div", { ref: target }, slots.default(data));
    };
  }
});
var UseMouseBuiltinExtractors = {
  page: (event) => [event.pageX, event.pageY],
  client: (event) => [event.clientX, event.clientY],
  screen: (event) => [event.screenX, event.screenY],
  movement: (event) => event instanceof MouseEvent ? [event.movementX, event.movementY] : null
};
function useMouse2(options = {}) {
  const {
    type = "page",
    touch = true,
    resetOnTouchEnds = false,
    initialValue = { x: 0, y: 0 },
    window: window2 = defaultWindow,
    target = window2,
    scroll = true,
    eventFilter
  } = options;
  let _prevMouseEvent = null;
  let _prevScrollX = 0;
  let _prevScrollY = 0;
  const x = shallowRef(initialValue.x);
  const y = shallowRef(initialValue.y);
  const sourceType = shallowRef(null);
  const extractor = typeof type === "function" ? type : UseMouseBuiltinExtractors[type];
  const mouseHandler = (event) => {
    const result = extractor(event);
    _prevMouseEvent = event;
    if (result) {
      [x.value, y.value] = result;
      sourceType.value = "mouse";
    }
    if (window2) {
      _prevScrollX = window2.scrollX;
      _prevScrollY = window2.scrollY;
    }
  };
  const touchHandler = (event) => {
    if (event.touches.length > 0) {
      const result = extractor(event.touches[0]);
      if (result) {
        [x.value, y.value] = result;
        sourceType.value = "touch";
      }
    }
  };
  const scrollHandler = () => {
    if (!_prevMouseEvent || !window2)
      return;
    const pos = extractor(_prevMouseEvent);
    if (_prevMouseEvent instanceof MouseEvent && pos) {
      x.value = pos[0] + window2.scrollX - _prevScrollX;
      y.value = pos[1] + window2.scrollY - _prevScrollY;
    }
  };
  const reset = () => {
    x.value = initialValue.x;
    y.value = initialValue.y;
  };
  const mouseHandlerWrapper = eventFilter ? (event) => eventFilter(() => mouseHandler(event), {}) : (event) => mouseHandler(event);
  const touchHandlerWrapper = eventFilter ? (event) => eventFilter(() => touchHandler(event), {}) : (event) => touchHandler(event);
  const scrollHandlerWrapper = eventFilter ? () => eventFilter(() => scrollHandler(), {}) : () => scrollHandler();
  if (target) {
    const listenerOptions = { passive: true };
    useEventListener(target, ["mousemove", "dragover"], mouseHandlerWrapper, listenerOptions);
    if (touch && type !== "movement") {
      useEventListener(target, ["touchstart", "touchmove"], touchHandlerWrapper, listenerOptions);
      if (resetOnTouchEnds)
        useEventListener(target, "touchend", reset, listenerOptions);
    }
    if (scroll && type === "page")
      useEventListener(window2, "scroll", scrollHandlerWrapper, listenerOptions);
  }
  return {
    x,
    y,
    sourceType
  };
}
function useMouseInElement2(target, options = {}) {
  const {
    handleOutside = true,
    window: window2 = defaultWindow
  } = options;
  const type = options.type || "page";
  const { x, y, sourceType } = useMouse2(options);
  const targetRef = shallowRef(target != null ? target : window2 == null ? void 0 : window2.document.body);
  const elementX = shallowRef(0);
  const elementY = shallowRef(0);
  const elementPositionX = shallowRef(0);
  const elementPositionY = shallowRef(0);
  const elementHeight = shallowRef(0);
  const elementWidth = shallowRef(0);
  const isOutside = shallowRef(true);
  let stop = () => {
  };
  if (window2) {
    stop = watch(
      [targetRef, x, y],
      () => {
        const el = unrefElement(targetRef);
        if (!el || !(el instanceof Element))
          return;
        const {
          left,
          top,
          width,
          height
        } = el.getBoundingClientRect();
        elementPositionX.value = left + (type === "page" ? window2.pageXOffset : 0);
        elementPositionY.value = top + (type === "page" ? window2.pageYOffset : 0);
        elementHeight.value = height;
        elementWidth.value = width;
        const elX = x.value - elementPositionX.value;
        const elY = y.value - elementPositionY.value;
        isOutside.value = width === 0 || height === 0 || elX < 0 || elY < 0 || elX > width || elY > height;
        if (handleOutside || !isOutside.value) {
          elementX.value = elX;
          elementY.value = elY;
        }
      },
      { immediate: true }
    );
    useEventListener(
      document,
      "mouseleave",
      () => isOutside.value = true,
      { passive: true }
    );
  }
  return {
    x,
    y,
    sourceType,
    elementX,
    elementY,
    elementPositionX,
    elementPositionY,
    elementHeight,
    elementWidth,
    isOutside,
    stop
  };
}
var vMouseInElement = {
  mounted(el, binding) {
    const [handler, options] = typeof binding.value === "function" ? [binding.value, {}] : binding.value;
    const state = reactiveOmit(reactive(useMouseInElement2(el, options)), "stop");
    watch(state, (val) => handler(val));
  }
};
var UseMousePressed = defineComponent({
  name: "UseMousePressed",
  props: ["touch", "initialValue", "as"],
  setup(props, { slots }) {
    const target = shallowRef();
    const data = reactive(useMousePressed({ ...props, target }));
    return () => {
      if (slots.default)
        return h(props.as || "div", { ref: target }, slots.default(data));
    };
  }
});
var UseNetwork = defineComponent({
  name: "UseNetwork",
  setup(props, { slots }) {
    const data = reactive(useNetwork());
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseNow = defineComponent({
  name: "UseNow",
  props: ["interval"],
  setup(props, { slots }) {
    const data = reactive(useNow({ ...props, controls: true }));
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseObjectUrl = defineComponent({
  name: "UseObjectUrl",
  props: [
    "object"
  ],
  setup(props, { slots }) {
    const object = toRef(props, "object");
    const url = useObjectUrl(object);
    return () => {
      if (slots.default && url.value)
        return slots.default(url);
    };
  }
});
var UseOffsetPagination = defineComponent({
  name: "UseOffsetPagination",
  props: [
    "total",
    "page",
    "pageSize",
    "onPageChange",
    "onPageSizeChange",
    "onPageCountChange"
  ],
  emits: [
    "page-change",
    "page-size-change",
    "page-count-change"
  ],
  setup(props, { slots, emit }) {
    const data = reactive(useOffsetPagination({
      ...props,
      onPageChange(...args) {
        var _a;
        (_a = props.onPageChange) == null ? void 0 : _a.call(props, ...args);
        emit("page-change", ...args);
      },
      onPageSizeChange(...args) {
        var _a;
        (_a = props.onPageSizeChange) == null ? void 0 : _a.call(props, ...args);
        emit("page-size-change", ...args);
      },
      onPageCountChange(...args) {
        var _a;
        (_a = props.onPageCountChange) == null ? void 0 : _a.call(props, ...args);
        emit("page-count-change", ...args);
      }
    }));
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseOnline = defineComponent({
  name: "UseOnline",
  setup(props, { slots }) {
    const data = reactive({
      isOnline: useOnline()
    });
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UsePageLeave = defineComponent({
  name: "UsePageLeave",
  setup(props, { slots }) {
    const data = reactive({
      isLeft: usePageLeave()
    });
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UsePointer = defineComponent({
  name: "UsePointer",
  props: [
    "pointerTypes",
    "initialValue",
    "target"
  ],
  setup(props, { slots }) {
    const el = shallowRef(null);
    const data = reactive(usePointer({
      ...props,
      target: props.target === "self" ? el : defaultWindow
    }));
    return () => {
      if (slots.default)
        return slots.default(data, { ref: el });
    };
  }
});
var UsePointerLock = defineComponent({
  name: "UsePointerLock",
  props: ["as"],
  setup(props, { slots }) {
    const target = shallowRef();
    const data = reactive(usePointerLock(target));
    return () => {
      if (slots.default)
        return h(props.as || "div", { ref: target }, slots.default(data));
    };
  }
});
var UsePreferredColorScheme = defineComponent({
  name: "UsePreferredColorScheme",
  setup(props, { slots }) {
    const data = reactive({
      colorScheme: usePreferredColorScheme()
    });
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UsePreferredContrast = defineComponent({
  name: "UsePreferredContrast",
  setup(props, { slots }) {
    const data = reactive({
      contrast: usePreferredContrast()
    });
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UsePreferredDark = defineComponent({
  name: "UsePreferredDark",
  setup(props, { slots }) {
    const data = reactive({
      prefersDark: usePreferredDark()
    });
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UsePreferredLanguages = defineComponent({
  name: "UsePreferredLanguages",
  setup(props, { slots }) {
    const data = reactive({
      languages: usePreferredLanguages()
    });
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UsePreferredReducedMotion = defineComponent({
  name: "UsePreferredReducedMotion",
  setup(props, { slots }) {
    const data = reactive({
      motion: usePreferredReducedMotion()
    });
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UsePreferredReducedTransparency = defineComponent({
  name: "UsePreferredReducedTransparency",
  setup(props, { slots }) {
    const data = reactive({
      transparency: usePreferredReducedTransparency()
    });
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var vResizeObserver = {
  mounted(el, binding) {
    if (typeof binding.value === "function")
      useResizeObserver(el, binding.value);
    else
      useResizeObserver(el, ...binding.value);
  }
};
function useCssVar(prop, target, options = {}) {
  const { window: window2 = defaultWindow, initialValue, observe = false } = options;
  const variable = shallowRef(initialValue);
  const elRef = computed(() => {
    var _a;
    return unrefElement(target) || ((_a = window2 == null ? void 0 : window2.document) == null ? void 0 : _a.documentElement);
  });
  function updateCssVar() {
    var _a;
    const key = toValue(prop);
    const el = toValue(elRef);
    if (el && window2 && key) {
      const value = (_a = window2.getComputedStyle(el).getPropertyValue(key)) == null ? void 0 : _a.trim();
      variable.value = value || variable.value || initialValue;
    }
  }
  if (observe) {
    useMutationObserver(elRef, updateCssVar, {
      attributeFilter: ["style", "class"],
      window: window2
    });
  }
  watch(
    [elRef, () => toValue(prop)],
    (_, old) => {
      if (old[0] && old[1])
        old[0].style.removeProperty(old[1]);
      updateCssVar();
    },
    { immediate: true }
  );
  watch(
    [variable, elRef],
    ([val, el]) => {
      const raw_prop = toValue(prop);
      if ((el == null ? void 0 : el.style) && raw_prop) {
        if (val == null)
          el.style.removeProperty(raw_prop);
        else
          el.style.setProperty(raw_prop, val);
      }
    },
    { immediate: true }
  );
  return variable;
}
var topVarName = "--vueuse-safe-area-top";
var rightVarName = "--vueuse-safe-area-right";
var bottomVarName = "--vueuse-safe-area-bottom";
var leftVarName = "--vueuse-safe-area-left";
function useScreenSafeArea() {
  const top = shallowRef("");
  const right = shallowRef("");
  const bottom = shallowRef("");
  const left = shallowRef("");
  if (isClient) {
    const topCssVar = useCssVar(topVarName);
    const rightCssVar = useCssVar(rightVarName);
    const bottomCssVar = useCssVar(bottomVarName);
    const leftCssVar = useCssVar(leftVarName);
    topCssVar.value = "env(safe-area-inset-top, 0px)";
    rightCssVar.value = "env(safe-area-inset-right, 0px)";
    bottomCssVar.value = "env(safe-area-inset-bottom, 0px)";
    leftCssVar.value = "env(safe-area-inset-left, 0px)";
    update();
    useEventListener("resize", useDebounceFn(update), { passive: true });
  }
  function update() {
    top.value = getValue(topVarName);
    right.value = getValue(rightVarName);
    bottom.value = getValue(bottomVarName);
    left.value = getValue(leftVarName);
  }
  return {
    top,
    right,
    bottom,
    left,
    update
  };
}
function getValue(position) {
  return getComputedStyle(document.documentElement).getPropertyValue(position);
}
var UseScreenSafeArea = defineComponent({
  name: "UseScreenSafeArea",
  props: {
    top: Boolean,
    right: Boolean,
    bottom: Boolean,
    left: Boolean
  },
  setup(props, { slots }) {
    const {
      top,
      right,
      bottom,
      left
    } = useScreenSafeArea();
    return () => {
      if (slots.default) {
        return h("div", {
          style: {
            paddingTop: props.top ? top.value : "",
            paddingRight: props.right ? right.value : "",
            paddingBottom: props.bottom ? bottom.value : "",
            paddingLeft: props.left ? left.value : "",
            boxSizing: "border-box",
            maxHeight: "100vh",
            maxWidth: "100vw",
            overflow: "auto"
          }
        }, slots.default());
      }
    };
  }
});
var vScroll = {
  mounted(el, binding) {
    if (typeof binding.value === "function") {
      const handler = binding.value;
      const state = useScroll(el, {
        onScroll() {
          handler(state);
        },
        onStop() {
          handler(state);
        }
      });
    } else {
      const [handler, options] = binding.value;
      const state = useScroll(el, {
        ...options,
        onScroll(e) {
          var _a;
          (_a = options.onScroll) == null ? void 0 : _a.call(options, e);
          handler(state);
        },
        onStop(e) {
          var _a;
          (_a = options.onStop) == null ? void 0 : _a.call(options, e);
          handler(state);
        }
      });
    }
  }
};
function checkOverflowScroll(ele) {
  const style = window.getComputedStyle(ele);
  if (style.overflowX === "scroll" || style.overflowY === "scroll" || style.overflowX === "auto" && ele.clientWidth < ele.scrollWidth || style.overflowY === "auto" && ele.clientHeight < ele.scrollHeight) {
    return true;
  } else {
    const parent = ele.parentNode;
    if (!parent || parent.tagName === "BODY")
      return false;
    return checkOverflowScroll(parent);
  }
}
function preventDefault(rawEvent) {
  const e = rawEvent || window.event;
  const _target = e.target;
  if (checkOverflowScroll(_target))
    return false;
  if (e.touches.length > 1)
    return true;
  if (e.preventDefault)
    e.preventDefault();
  return false;
}
var elInitialOverflow = /* @__PURE__ */ new WeakMap();
function useScrollLock(element, initialState = false) {
  const isLocked = shallowRef(initialState);
  let stopTouchMoveListener = null;
  let initialOverflow = "";
  watch(toRef(element), (el) => {
    const target = resolveElement(toValue(el));
    if (target) {
      const ele = target;
      if (!elInitialOverflow.get(ele))
        elInitialOverflow.set(ele, ele.style.overflow);
      if (ele.style.overflow !== "hidden")
        initialOverflow = ele.style.overflow;
      if (ele.style.overflow === "hidden")
        return isLocked.value = true;
      if (isLocked.value)
        return ele.style.overflow = "hidden";
    }
  }, {
    immediate: true
  });
  const lock = () => {
    const el = resolveElement(toValue(element));
    if (!el || isLocked.value)
      return;
    if (isIOS) {
      stopTouchMoveListener = useEventListener(
        el,
        "touchmove",
        (e) => {
          preventDefault(e);
        },
        { passive: false }
      );
    }
    el.style.overflow = "hidden";
    isLocked.value = true;
  };
  const unlock = () => {
    const el = resolveElement(toValue(element));
    if (!el || !isLocked.value)
      return;
    if (isIOS)
      stopTouchMoveListener == null ? void 0 : stopTouchMoveListener();
    el.style.overflow = initialOverflow;
    elInitialOverflow.delete(el);
    isLocked.value = false;
  };
  tryOnScopeDispose(unlock);
  return computed({
    get() {
      return isLocked.value;
    },
    set(v) {
      if (v)
        lock();
      else unlock();
    }
  });
}
function onScrollLock() {
  let isMounted = false;
  const state = shallowRef(false);
  return (el, binding) => {
    state.value = binding.value;
    if (isMounted)
      return;
    isMounted = true;
    const isLocked = useScrollLock(el, binding.value);
    watch(state, (v) => isLocked.value = v);
  };
}
var vScrollLock = onScrollLock();
var UseTimeAgo = defineComponent({
  name: "UseTimeAgo",
  props: ["time", "updateInterval", "max", "fullDateFormatter", "messages", "showSecond"],
  setup(props, { slots }) {
    const data = reactive(useTimeAgo(() => props.time, { ...props, controls: true }));
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseTimestamp = defineComponent({
  name: "UseTimestamp",
  props: ["immediate", "interval", "offset"],
  setup(props, { slots }) {
    const data = reactive(useTimestamp({ ...props, controls: true }));
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseVirtualList = defineComponent({
  name: "UseVirtualList",
  props: [
    "list",
    "options",
    "height"
  ],
  setup(props, { slots, expose }) {
    const { list: listRef } = toRefs(props);
    const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(listRef, props.options);
    expose({ scrollTo });
    if (containerProps.style && typeof containerProps.style === "object" && !Array.isArray(containerProps.style))
      containerProps.style.height = props.height || "300px";
    return () => h("div", { ...containerProps }, [
      h("div", { ...wrapperProps.value }, list.value.map((item) => h("div", { style: { overflow: "hidden", height: item.height } }, slots.default ? slots.default(item) : "Please set content!")))
    ]);
  }
});
var UseWindowFocus = defineComponent({
  name: "UseWindowFocus",
  setup(props, { slots }) {
    const data = reactive({
      focused: useWindowFocus()
    });
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
var UseWindowSize = defineComponent({
  name: "UseWindowSize",
  props: ["initialWidth", "initialHeight"],
  setup(props, { slots }) {
    const data = reactive(useWindowSize(props));
    return () => {
      if (slots.default)
        return slots.default(data);
    };
  }
});
export {
  OnClickOutside,
  OnLongPress,
  UseActiveElement,
  UseBattery,
  UseBrowserLocation,
  UseClipboard,
  UseColorMode,
  UseDark,
  UseDeviceMotion,
  UseDeviceOrientation,
  UseDevicePixelRatio,
  UseDevicesList,
  UseDocumentVisibility,
  UseDraggable,
  UseElementBounding,
  UseElementSize,
  UseElementVisibility,
  UseEyeDropper,
  UseFullscreen,
  UseGeolocation,
  UseIdle,
  UseImage,
  UseMouse,
  UseMouseInElement,
  UseMousePressed,
  UseNetwork,
  UseNow,
  UseObjectUrl,
  UseOffsetPagination,
  UseOnline,
  UsePageLeave,
  UsePointer,
  UsePointerLock,
  UsePreferredColorScheme,
  UsePreferredContrast,
  UsePreferredDark,
  UsePreferredLanguages,
  UsePreferredReducedMotion,
  UsePreferredReducedTransparency,
  UseScreenSafeArea,
  UseTimeAgo,
  UseTimestamp,
  UseVirtualList,
  UseWindowFocus,
  UseWindowSize,
  vOnClickOutside as VOnClickOutside,
  vOnLongPress as VOnLongPress,
  vElementBounding,
  vElementHover,
  vElementSize,
  vElementVisibility,
  vInfiniteScroll,
  vIntersectionObserver,
  vMouseInElement,
  vOnClickOutside,
  vOnKeyStroke,
  vOnLongPress,
  vResizeObserver,
  vScroll,
  vScrollLock
};
//# sourceMappingURL=@vueuse_components.js.map
