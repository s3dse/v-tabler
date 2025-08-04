import {
  Comment,
  Fragment,
  KeepAlive,
  Teleport,
  Transition,
  camelize,
  cloneVNode,
  computed,
  createBaseVNode,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createSlots,
  createTextVNode,
  createVNode,
  customRef,
  defineComponent,
  effectScope,
  getCurrentInstance,
  getCurrentScope,
  guardReactiveProps,
  h,
  inject,
  isRef,
  markRaw,
  mergeDefaults,
  mergeModels,
  mergeProps,
  nextTick,
  normalizeClass,
  normalizeProps,
  normalizeStyle,
  onBeforeUnmount,
  onMounted,
  onScopeDispose,
  onUnmounted,
  onUpdated,
  openBlock,
  provide,
  reactive,
  readonly,
  ref,
  renderList,
  renderSlot,
  resolveComponent,
  resolveDirective,
  resolveDynamicComponent,
  shallowReadonly,
  shallowRef,
  toDisplayString,
  toHandlerKey,
  toHandlers,
  toRef,
  toRefs,
  toValue,
  triggerRef,
  unref,
  useAttrs,
  useCssVars,
  useId,
  useModel,
  useSlots,
  useTemplateRef,
  vModelCheckbox,
  vModelText,
  vShow,
  vue_runtime_esm_bundler_exports,
  watch,
  watchEffect,
  watchPostEffect,
  watchSyncEffect,
  withCtx,
  withDirectives,
  withKeys,
  withMemo,
  withModifiers
} from "./chunk-LSU4EJ5K.js";
import "./chunk-PZ5AY32C.js";

// docs/node_modules/@s3_dse/v-tabler/dist/v-tabler.js
var Ho = (e) => {
  throw TypeError(e);
};
var Ka = (e, t, n) => t.has(e) || Ho("Cannot " + n);
var Mt = (e, t, n) => (Ka(e, t, "read from private field"), n ? n.call(e) : t.get(e));
var Ko = (e, t, n) => t.has(e) ? Ho("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n);
var Go = (e) => e.split(/\r?\n|\r|\s+/g).join(" ");
function oi(e) {
  const t = ref([...e.items || []]), n = computed(() => e.fields && Array.isArray(e.fields) ? e.fields.map((c) => ({
    visible: true,
    ...c
  })).filter((c) => c.visible) : []);
  function o(i, l) {
    if (!i) return "";
    const c = i[l.key];
    return l.formatter ? l.formatter(c) : c;
  }
  function r(i, l) {
    return i ? i[l.key] : "";
  }
  function a(i) {
    return i.label ? i.label : i.key;
  }
  function s(i) {
    return i && i.replaceAll("_", " ");
  }
  return watch(
    () => e.items,
    (i) => {
      t.value = i || [];
    }
  ), {
    tableData: t,
    visibleFields: n,
    getValue: o,
    getUnformattedValue: r,
    getColumnLabel: a,
    underscoresToSpaces: s
  };
}
function ri(e, t, n, o) {
  return e == null ? o ? -1 : 1 : t == null ? o ? 1 : -1 : n ? e - t : t - e;
}
function ai(e, t, n, o) {
  const r = n ? 1 : -1;
  if (!Xo(e))
    return o ? -1 : 1;
  if (!Xo(t))
    return o ? 1 : -1;
  const a = e.toString(), s = t.toString();
  return a.localeCompare(s, void 0, {
    sensitivity: "base"
  }) * r;
}
var Yo = Object.freeze({ NUMERIC: "numeric", ALPHANUMERIC: "alphanumeric" });
var Xo = (e) => e && typeof ("" + e) == "string";
var ii = (e) => e && typeof e == "number" && Number.isNaN(e) === false;
function si(e, t) {
  return e.filter((o) => o[t.key]).some((o) => !ii(o[t.key])) ? Yo.ALPHANUMERIC : Yo.NUMERIC;
}
var li = (e, t) => {
  const n = {
    numeric: ri,
    alphanumeric: ai
  }, o = n[t.type];
  return o || n[si(e, t)];
};
function ui(e, t, { ascending: n = true, nullsFirst: o = null } = {}) {
  const r = li(e, t);
  return e.sort((a, s) => {
    const i = a[t.key], l = s[t.key];
    return r(i, l, n, o === null ? !n : o);
  });
}
function ci(e, t, n) {
  const o = ref(false), r = ref(""), a = computed(() => ({
    column: r.value,
    ascending: o.value
  }));
  function s(l, c) {
    r.value === l.key ? o.value = !o.value : (o.value = true, r.value = l.key);
    const d = {
      column: l,
      ascending: o.value
    }, p = !t;
    return p && (ui(e.value, l, {
      ascending: o.value,
      nullsFirst: n
    }), c && c(1)), {
      shouldEmitSortChange: true,
      shouldEmitAfterSort: p,
      eventData: d
    };
  }
  function i(l) {
    return l === r.value ? o.value ? "i-tabler-sort-ascending" : "i-tabler-sort-descending" : "i-tabler-arrows-sort";
  }
  return {
    ascending: o,
    sortColumnKey: r,
    sortState: a,
    handleSort: s,
    getSortIconClass: i
  };
}
function di(e, t, n) {
  var u;
  const o = ref(1), r = () => {
    var f, v;
    const d = ((f = e.topRows) == null ? void 0 : f.length) || 0;
    return ((v = e.pageSizes) == null ? void 0 : v.find((h2) => h2 > d)) || 5;
  }, a = ref(
    e.perPage > (((u = e.topRows) == null ? void 0 : u.length) || 0) ? e.perPage : r()
  ), s = computed({
    get() {
      var f;
      const d = ((f = e.topRows) == null ? void 0 : f.length) || 0;
      return a.value > d ? a.value : r();
    },
    set(d) {
      var v;
      const p = ((v = e.topRows) == null ? void 0 : v.length) || 0, f = d > p;
      a.value = f ? d : r();
    }
  }), i = computed(() => {
    var f;
    const d = t.value || 1;
    if (e.remotePagination) {
      const v = e.totalItems || 0;
      return Math.ceil(v / d);
    } else {
      const v = ((f = n.value) == null ? void 0 : f.length) || 0;
      return Math.ceil(v / d);
    }
  });
  function l(d) {
    if (d === o.value) return null;
    const f = o.value;
    return o.value = d, {
      shouldEmitPageChange: true,
      shouldEmitAfterPageChange: true,
      eventData: {
        page: d,
        oldPage: f,
        newPage: d
      }
    };
  }
  function c(d = n.value, p = e.paginate) {
    const f = d || [];
    if (p && !e.remotePagination) {
      const h2 = t.value || 1, g = (o.value - 1) * h2, x = g + h2;
      return f.slice(g, x);
    } else
      return f;
  }
  return {
    currentPage: o,
    pageSize: s,
    numberOfPages: i,
    changePage: l,
    getRows: c
  };
}
function Wr(e) {
  return getCurrentScope() ? (onScopeDispose(e), true) : false;
}
var Hr = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
var fi = Object.prototype.toString;
var pi = (e) => fi.call(e) === "[object Object]";
var Ue = () => {
};
var Zn = mi();
function mi() {
  var e, t;
  return Hr && ((e = window == null ? void 0 : window.navigator) == null ? void 0 : e.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((t = window == null ? void 0 : window.navigator) == null ? void 0 : t.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window == null ? void 0 : window.navigator.userAgent));
}
function vi(...e) {
  if (e.length !== 1)
    return toRef(...e);
  const t = e[0];
  return typeof t == "function" ? readonly(customRef(() => ({ get: t, set: Ue }))) : ref(t);
}
function hi(e, t) {
  function n(...o) {
    return new Promise((r, a) => {
      Promise.resolve(e(() => t.apply(this, o), { fn: t, thisArg: this, args: o })).then(r).catch(a);
    });
  }
  return n;
}
function gi(e, t = {}) {
  let n, o, r = Ue;
  const a = (l) => {
    clearTimeout(l), r(), r = Ue;
  };
  let s;
  return (l) => {
    const c = toValue(e), u = toValue(t.maxWait);
    return n && a(n), c <= 0 || u !== void 0 && u <= 0 ? (o && (a(o), o = null), Promise.resolve(l())) : new Promise((d, p) => {
      r = t.rejectOnCancel ? p : d, s = l, u && !o && (o = setTimeout(() => {
        n && a(n), o = null, d(s());
      }, u)), n = setTimeout(() => {
        o && a(o), o = null, d(l());
      }, c);
    });
  };
}
function Mn(e) {
  return Array.isArray(e) ? e : [e];
}
function yi(e, t = 200, n = {}) {
  return hi(
    gi(t, n),
    e
  );
}
function bi(e, t, n) {
  return watch(
    e,
    t,
    {
      ...n,
      immediate: true
    }
  );
}
function wi(e, t) {
  const n = e.toLowerCase();
  return t.toLowerCase().indexOf(n) !== -1;
}
function xi(e) {
  const t = Object.values(e).join(""), n = Object.values(e).join(" "), o = t + " " + n;
  return {
    row: e,
    normalized: o
  };
}
function Ci(e, t, n, o) {
  const r = ref(null), a = (c) => yi(
    () => {
      c && c({
        shouldEmitFilterChangeDebounced: true,
        eventData: {
          searchTerm: r.value
        }
      });
    },
    e.filterDebounce,
    { maxWait: e.filterMaxWait }
  );
  function s(c, u) {
    return wi(u, c.normalized);
  }
  function i(c) {
    const u = c.target.value;
    r.value = u;
    const d = !e.remotePagination;
    if (d) {
      e.paginate && o(1);
      const v = t.map(xi).filter(
        (h2) => s(h2, u)
      );
      n.value = v.map(
        (h2) => h2 ? h2.row : []
      );
    }
    return {
      shouldEmitFilterChange: true,
      shouldEmitAfterFilter: d,
      eventData: {
        searchValue: u,
        searchTerm: u
      }
    };
  }
  function l(c) {
    const u = a(c);
    watch(r, () => {
      u();
    });
  }
  return {
    searchTerm: r,
    filterData: i,
    setupDebouncedEmission: l
  };
}
function Si() {
  function e(t, n, o, r) {
    let a = true;
    return t <= n && (console.error("'pageSize' must be higher than length of 'topRows'."), a = false), o && r == null && (console.error("'remotePagination === true' requires a 'totalItems' (int) prop"), a = false), a;
  }
  return {
    validateProps: e
  };
}
function Ei() {
  function e(a) {
    return a.tdClassList || "";
  }
  function t(a) {
    return a.tdTopRowClassList ? a.tdTopRowClassList : e(a);
  }
  function n(a) {
    return a.tdBottomRowClassList ? a.tdBottomRowClassList : e(a);
  }
  function o(a) {
    return a === 0 ? "pe-6" : "";
  }
  function r(a, s) {
    return a === s - 1 ? "pe-6" : "";
  }
  return {
    getClassList: e,
    getTopRowClassList: t,
    getBottomRowClassList: n,
    leftPadFirstCol: o,
    rightPadLastCol: r
  };
}
var Oi = {
  key: 0,
  class: "vt-title card-title mx-4 my-3"
};
var Pi = {
  __name: "TableTitle",
  props: {
    title: {
      type: String,
      required: false
    }
  },
  setup(e) {
    const t = useSlots();
    return (n, o) => e.title || unref(t).title ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(["vt-title-border border-b border-border my-3", { "bg-surface": e.title && !unref(t).title }])
    }, [
      e.title && !unref(t).title ? (openBlock(), createElementBlock("div", Oi, toDisplayString(e.title), 1)) : renderSlot(n.$slots, "title", { key: 1 })
    ], 2)) : createCommentVNode("", true);
  }
};
var mo = {
  beforeMount: function(e, t, n) {
    e.eventSetDrag = function() {
      e.setAttribute("data-dragging", "yes");
    }, e.eventClearDrag = function() {
      e.removeAttribute("data-dragging");
    }, e.eventOnClick = function(o) {
      var r = e.getAttribute("data-dragging");
      !(e === o.target || e.contains(o.target)) && !r && t.value();
    }, document.addEventListener("touchstart", e.eventClearDrag), document.addEventListener("touchmove", e.eventSetDrag), document.addEventListener("click", e.eventOnClick), document.addEventListener("touchend", e.eventOnClick);
  },
  unmounted: function(e) {
    document.removeEventListener("touchstart", e.eventClearDrag), document.removeEventListener("touchmove", e.eventSetDrag), document.removeEventListener("click", e.eventOnClick), document.removeEventListener("touchend", e.eventOnClick), e.removeAttribute("data-dragging");
  }
};
var vt = Object.freeze({
  COVER: "cover",
  ADJACENT: "adjacent"
});
var Ai = (e, t, n, o) => {
  if (o === vt.COVER)
    return n ? e.bottom + window.scrollY - t.offsetHeight : e.top + window.scrollY;
  if (o === vt.ADJACENT)
    return n ? e.top + window.scrollY - t.offsetHeight : e.bottom + window.scrollY;
};
var $i = (e, t) => {
  const n = e.getBoundingClientRect(), o = window.innerHeight - n.bottom, r = t.offsetHeight;
  return o < r;
};
function An(e, { positionToTrigger: t = vt.COVER } = {}) {
  if (!Object.values(vt).includes(t))
    return new Error(
      `Invalid positionToTrigger value: ${t}. Valid values are: ${Object.keys(vt).join(", ")}`
    );
  const n = ref(false), o = ref(false), r = ref({});
  function a(s) {
    nextTick().then(() => {
      requestAnimationFrame(() => {
        const i = e.value, l = toValue(s);
        if (!i || !l) return;
        const c = i.getBoundingClientRect(), u = $i(i, l);
        r.value = {
          position: "absolute",
          left: `${c.left + window.scrollX}px`,
          top: `${Ai(c, l, u, t)}px`,
          width: `${l.width}px`,
          zIndex: 501
        }, l.classList.remove("invisible");
      });
    });
  }
  return {
    dropdownAbove: n,
    dropdownLeft: o,
    updateDropdownPosition: a,
    dropdownStyles: r
  };
}
var Ft = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
};
var ki = {
  setup() {
    const e = useTemplateRef("dropdown-container"), t = useTemplateRef("dropdown-content"), { updateDropdownPosition: n, dropdownStyles: o } = An(e, {
      positionToTrigger: vt.ADJACENT
    });
    return {
      updateDropdownPosition: n,
      dropdownStyles: o,
      dropdownContentRef: t
    };
  },
  directives: {
    clickOutside: mo
  },
  name: "dropdown-component",
  props: {
    modelValue: {
      type: [String, Boolean, Number],
      required: false
    },
    value: {
      type: [String, Boolean, Number],
      required: false
    },
    options: {
      type: Array,
      default: () => []
    },
    buttonClassList: {
      type: String,
      default: ""
    },
    upIcon: {
      type: String,
      default: "i-custom-chevron-up text-default"
    },
    downIcon: {
      type: String,
      default: "i-custom-chevron-down text-default"
    },
    activeClassList: {
      type: String,
      default: ""
    },
    dropdownContainerClassList: {
      type: String,
      default: ""
    },
    ulClassList: {
      type: String,
      default: ""
    },
    liClassList: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: false
    };
  },
  computed: {
    currentItem: {
      get() {
        return this.modelValue || this.value;
      },
      set(e) {
        this.internalCurrentItem = e;
      }
    }
  },
  methods: {
    closeDropdown() {
      this.show = false;
    },
    toggleDropdown() {
      this.show = !this.show, this.show && this.updateDropdownPosition(this.dropdownContentRef);
    },
    setCurrentItem(e) {
      this.$emit("update:modelValue", e), this.$emit("input", e);
    },
    isSelected(e) {
      return this.currentItem === e;
    },
    getActiveClassList(e) {
      return this.currentItem === e ? this.activeClassList : "";
    }
  }
};
var Ti = { class: "dropdown-component relative" };
var Ii = ["aria-selected", "data-selected", "onClick"];
function Di(e, t, n, o, r, a) {
  const s = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("div", Ti, [
    createBaseVNode("div", {
      onClick: t[0] || (t[0] = (...i) => a.toggleDropdown && a.toggleDropdown(...i)),
      class: normalizeClass([
        "dropdown-button",
        n.buttonClassList ? n.buttonClassList : "btn-base-default rounded-sm border px-4 py-1 w-full"
      ]),
      type: "button",
      ref: "dropdown-container"
    }, [
      renderSlot(e.$slots, "toggle-label", normalizeProps(guardReactiveProps({ currentItem: a.currentItem })), () => [
        createTextVNode(toDisplayString(a.currentItem), 1)
      ]),
      createBaseVNode("span", {
        class: normalizeClass(["ms-2", [r.show ? n.upIcon : n.downIcon]])
      }, null, 2)
    ], 2),
    (openBlock(), createBlock(Teleport, { to: "body" }, [
      withDirectives(createBaseVNode("div", {
        class: normalizeClass([
          "dropdown-container absolute z-600",
          n.dropdownContainerClassList ? n.dropdownContainerClassList : "w-fit bg-surface text-default divide-y border border-1 border-solid border-border divide-border rounded-sm shadow-lg w-44"
        ]),
        ref: "dropdown-content",
        style: normalizeStyle(o.dropdownStyles)
      }, [
        createBaseVNode("ul", {
          class: normalizeClass([n.ulClassList ? n.ulClassList : "text-sm text-default"])
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(n.options, (i, l) => (openBlock(), createElementBlock("li", {
            key: l,
            "aria-selected": a.isSelected(i),
            "data-selected": a.isSelected(i),
            onClick: (c) => a.setCurrentItem(i),
            class: normalizeClass([
              n.liClassList ? n.liClassList : "hovered-minor data-[selected=true]:selected-minor hover:data-[selected=true]:selected-hovered-minor block py-2 text-right cursor-pointer"
            ])
          }, [
            renderSlot(e.$slots, "itemlabel", mergeProps({ ref_for: true }, { item: i, index: l, isSelected: a.isSelected, getActiveClassList: a.getActiveClassList }), () => [
              createBaseVNode("p", {
                class: normalizeClass(["block w-[100%] px-8", a.getActiveClassList(i)])
              }, toDisplayString(i), 3)
            ])
          ], 10, Ii))), 128))
        ], 2)
      ], 6), [
        [vShow, r.show]
      ])
    ]))
  ])), [
    [s, a.closeDropdown]
  ]);
}
var Kr = Ft(ki, [["render", Di]]);
var _i = { class: "vt-table-header flex flex-wrap mx-4 my-3 gap-2 justify-start" };
var Li = ["placeholder", "id", "value"];
var Fi = {
  __name: "TableHeader",
  props: {
    enableSearch: {
      type: Boolean,
      default: true
    },
    searchPlaceholder: {
      type: String,
      default: "Search"
    },
    filterInputId: {
      type: String,
      required: true
    },
    searchTerm: {
      type: String,
      default: null
    },
    searchInputClassList: {
      type: String,
      required: true
    },
    configurablePageSize: {
      type: Boolean,
      default: true
    },
    pageSize: {
      required: true
    },
    pageSizes: {
      type: Array,
      required: true
    },
    topRowsLength: {
      type: Number,
      required: true
    },
    pageSizeButtonClassList: {
      type: String,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    topRows: {
      type: Array,
      required: true
    },
    fields: {
      type: Array,
      required: true
    }
  },
  emits: ["update:searchTerm", "update:pageSize", "filter-data"],
  setup(e, { emit: t }) {
    const n = t, o = (a) => {
      n("update:searchTerm", a.target.value), n("filter-data", a);
    }, r = (a) => {
      n("update:pageSize", a);
    };
    return (a, s) => (openBlock(), createElementBlock("div", _i, [
      e.enableSearch ? (openBlock(), createElementBlock("input", {
        key: 0,
        name: "search",
        placeholder: e.searchPlaceholder,
        id: e.filterInputId,
        onInput: o,
        value: e.searchTerm,
        class: normalizeClass(e.searchInputClassList)
      }, null, 42, Li)) : createCommentVNode("", true),
      e.configurablePageSize ? (openBlock(), createBlock(Kr, {
        key: 1,
        class: "flex",
        "model-value": e.pageSize,
        "onUpdate:modelValue": r,
        options: (e.pageSizes || []).filter((i) => i > (e.topRowsLength || 0)),
        "default-item": 5,
        "button-class-list": e.pageSizeButtonClassList
      }, {
        "toggle-label": withCtx(({ currentItem: i }) => [
          renderSlot(a.$slots, "page-size-label", normalizeProps(guardReactiveProps({ pageSize: i })))
        ]),
        _: 3
      }, 8, ["model-value", "options", "button-class-list"])) : createCommentVNode("", true),
      renderSlot(a.$slots, "table-top-controls", {
        data: e.tableData || [],
        topRows: e.topRows || [],
        fields: e.fields || []
      })
    ]));
  }
};
var Bi = {
  key: 0,
  class: "bg-thead-background font-semibold text-[0.625rem] text-thead-text"
};
var Ri = ["onClick"];
var Mi = { class: "" };
var Ni = {
  __name: "TableHead",
  props: {
    visibleFields: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    topRows: {
      type: Array,
      required: true
    },
    underscoresToSpaces: {
      type: Function,
      required: true
    },
    getColumnLabel: {
      type: Function,
      required: true
    },
    getSortIconClass: {
      type: Function,
      required: true
    },
    leftPadFirstCol: {
      type: Function,
      required: true
    },
    rightPadLastCol: {
      type: Function,
      required: true
    }
  },
  emits: ["sort-table"],
  setup(e, { emit: t }) {
    const n = t, o = (r) => {
      n("sort-table", r);
    };
    return (r, a) => (e.tableData || []).length || (e.topRows || []).length ? (openBlock(), createElementBlock("thead", Bi, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(e.visibleFields || [], (s, i) => (openBlock(), createElementBlock("th", {
        key: i,
        onClick: (l) => o(s),
        class: normalizeClass([[s == null ? void 0 : s.thClassList, e.leftPadFirstCol(i), e.rightPadLastCol(i)], "hover:cursor-pointer p-2 first:ps-6 last:pe-6 uppercase"])
      }, [
        renderSlot(r.$slots, `th(${s == null ? void 0 : s.key})`, { field: s }, () => [
          createBaseVNode("div", Mi, [
            createTextVNode(toDisplayString(e.underscoresToSpaces(e.getColumnLabel(s))) + " ", 1),
            createBaseVNode("div", {
              class: normalizeClass(["inline-block", e.getSortIconClass(s == null ? void 0 : s.key)])
            }, null, 2)
          ])
        ])
      ], 10, Ri))), 128))
    ])) : createCommentVNode("", true);
  }
};
var Vi = ["data-top-row"];
var Nn = {
  __name: "TableBody",
  props: {
    rows: {
      type: Array,
      required: true
    },
    visibleFields: {
      type: Array,
      required: true
    },
    rowType: {
      type: String,
      default: "regular",
      // 'top', 'regular', 'bottom'
      validator: (e) => ["top", "regular", "bottom"].includes(e)
    },
    bodyClass: {
      type: String,
      default: ""
    },
    rowClass: {
      type: String,
      default: ""
    },
    getValue: {
      type: Function,
      required: true
    },
    getUnformattedValue: {
      type: Function,
      required: true
    },
    getCellClassList: {
      type: Function,
      required: true
    }
  },
  setup(e) {
    const t = e, n = (r) => t.rowType === "top" ? `top_row_${r}` : t.rowType === "bottom" ? `bottom_row_${r}` : `row_${r}`, o = (r) => t.rowType === "top" ? `top_row_column_${r}` : t.rowType === "bottom" ? `bottom_row_column_${r}` : `column_${r}`;
    return (r, a) => (openBlock(), createElementBlock("tbody", {
      class: normalizeClass(e.bodyClass)
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(e.rows || [], (s, i) => (openBlock(), createElementBlock("tr", {
        key: n(i),
        class: normalizeClass(e.rowClass),
        "data-top-row": e.rowType === "top" ? i : void 0
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(e.visibleFields || [], (l, c) => (openBlock(), createElementBlock("td", {
          key: o(c),
          class: normalizeClass(["p-2 first:ps-6 last:pe-6", [e.getCellClassList(l)]])
        }, [
          renderSlot(r.$slots, `cell(${l == null ? void 0 : l.key})`, {
            value: e.getValue(s, l),
            unformatted: e.getUnformattedValue(s, l),
            item: s,
            field: l
          }, () => [
            createTextVNode(toDisplayString(e.getValue(s, l)), 1)
          ])
        ], 2))), 128))
      ], 10, Vi))), 128))
    ], 2));
  }
};
var xt = "page-changed";
var zi = (e, t, n) => {
  if (n < t)
    return Array.from({ length: n }, (s, i) => i + 1);
  if (e <= Math.ceil((t - 1) / 2) || e === 1)
    return Array.from({ length: t }, (s, i) => i + 1);
  if (e === n)
    return Array.from({ length: t }, (s, i) => n - i).reverse();
  const a = Math.ceil((t - 1) / 2);
  return Array.from(
    { length: t },
    (s, i) => i + e - a
  );
};
function qr(e) {
  const t = computed(() => {
    const f = e.currentPage || 1, v = e.totalPages || 0, h2 = e.maxVisibleButtons || 5, g = zi(
      f,
      h2 - 2,
      v
    ), x = 1, y = v > 0 ? [v] : [];
    return [.../* @__PURE__ */ new Set([x, ...g, ...y])];
  }), n = computed(() => (e.currentPage || 1) === 1), o = computed(() => {
    const f = e.currentPage || 1, v = e.totalPages || 0;
    return f === v || v === 0;
  }), r = computed(() => e.lastLabel !== "" ? e.lastLabel : e.totalPages || 0), a = computed(() => {
    const f = e.perPage || 0, v = e.currentPage || 1, h2 = e.totalEntries || 0, g = Math.max(1, f * v - f + 1), x = Math.min(h2, f * v);
    return `Showing entries ${g} to ${x} of ${h2} entries`;
  }), i = /* @__PURE__ */ ((f) => () => ({
    shouldEmitPageChanged: true,
    eventData: f,
    eventName: xt
  }))(1);
  return {
    pages: t,
    isInFirstPage: n,
    isInLastPage: o,
    last: r,
    paginationLabel: a,
    onClickFirstPage: i,
    onClickPreviousPage: () => {
      const f = e.currentPage || 1;
      return f > 1 ? {
        shouldEmitPageChanged: true,
        eventData: f - 1,
        eventName: xt
      } : null;
    },
    onClickPage: (f) => ({
      shouldEmitPageChanged: true,
      eventData: f,
      eventName: xt
    }),
    onClickNextPage: () => {
      const f = e.currentPage || 1, v = e.totalPages || 0;
      return f < v ? {
        shouldEmitPageChanged: true,
        eventData: f + 1,
        eventName: xt
      } : null;
    },
    onClickLastPage: () => ({
      shouldEmitPageChanged: true,
      eventData: e.totalPages || 0,
      eventName: xt
    }),
    isPageSelected: (f) => (e.currentPage || 1) === f,
    PAGE_CHANGED_EVENT: xt
  };
}
var ji = {
  name: "pagination-component",
  props: {
    maxVisibleButtons: {
      type: Number,
      default: 5
    },
    totalPages: {
      type: Number,
      required: true
    },
    totalEntries: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    firstLabel: {
      type: [String, Number],
      default: 1
    },
    lastLabel: {
      type: [String, Number],
      default: ""
    },
    previousLabel: {
      type: String,
      default: "Previous"
    },
    nextLabel: {
      type: String,
      default: "Next"
    },
    activeClasses: {
      type: String,
      default: "bg-primary text-onprimary hover:text-default hover:bg-inherit! border border-primary border-2 rounded-sm px-2 color-transition"
    },
    inactiveClasses: {
      type: String,
      default: "bg-inherit hover:text-primary-hover color-transition"
    },
    disabledClasses: {
      type: String,
      default: "text-disabled bg-inherit"
    }
  },
  emits: ["page-changed"],
  setup(e, { emit: t }) {
    const {
      pages: n,
      isInFirstPage: o,
      isInLastPage: r,
      last: a,
      paginationLabel: s,
      onClickFirstPage: i,
      onClickPreviousPage: l,
      onClickPage: c,
      onClickNextPage: u,
      onClickLastPage: d,
      isPageSelected: p
    } = qr(e);
    return {
      pages: n,
      isInFirstPage: o,
      isInLastPage: r,
      last: a,
      paginationLabel: s,
      onClickFirstPage: () => {
        const y = i();
        y != null && y.shouldEmitPageChanged && t(y.eventName, y.eventData);
      },
      onClickPreviousPage: () => {
        const y = l();
        y != null && y.shouldEmitPageChanged && t(y.eventName, y.eventData);
      },
      onClickPage: (y) => {
        const b = c(y);
        b != null && b.shouldEmitPageChanged && t(b.eventName, b.eventData);
      },
      onClickNextPage: () => {
        const y = u();
        y != null && y.shouldEmitPageChanged && t(y.eventName, y.eventData);
      },
      onClickLastPage: () => {
        const y = d();
        y != null && y.shouldEmitPageChanged && t(y.eventName, y.eventData);
      },
      isPageSelected: p
    };
  }
};
var Wi = {
  class: "flex gap-4 flex-wrap justify-between w-[100%]",
  "data-pagination-component": ""
};
var Hi = { class: "pagination-label text-muted" };
var Ki = { class: "pagination flex flex-wrap justify-between gap-8" };
var qi = { class: "pagination-item" };
var Ui = ["disabled"];
var Gi = ["disabled", "onClick"];
var Yi = { class: "pagination-item" };
var Xi = ["disabled"];
function Ji(e, t, n, o, r, a) {
  return openBlock(), createElementBlock("div", Wi, [
    createBaseVNode("div", Hi, [
      renderSlot(e.$slots, "pagination-label", {
        data: { perPage: n.perPage || 0, currentPage: n.currentPage || 1, totalEntries: n.totalEntries || 0 }
      }, () => [
        createTextVNode(toDisplayString(o.paginationLabel), 1)
      ])
    ]),
    createBaseVNode("div", null, [
      createBaseVNode("ul", Ki, [
        createBaseVNode("li", qi, [
          createBaseVNode("button", {
            type: "button",
            disabled: o.isInFirstPage,
            onClick: t[0] || (t[0] = (...s) => o.onClickPreviousPage && o.onClickPreviousPage(...s)),
            class: normalizeClass(["text-default", o.isInFirstPage ? n.disabledClasses : n.inactiveClasses])
          }, toDisplayString(n.previousLabel), 11, Ui)
        ]),
        (openBlock(true), createElementBlock(Fragment, null, renderList(o.pages, (s) => (openBlock(), createElementBlock("li", {
          key: s,
          class: "pagination-item"
        }, [
          createBaseVNode("button", {
            type: "button",
            disabled: o.isPageSelected(s),
            onClick: (i) => o.onClickPage(s),
            class: normalizeClass([" text-default", o.isPageSelected(s) ? n.activeClasses : n.inactiveClasses])
          }, toDisplayString(s > Number.MAX_SAFE_INTEGER ? "..." : s), 11, Gi)
        ]))), 128)),
        createBaseVNode("li", Yi, [
          createBaseVNode("button", {
            type: "button",
            disabled: o.isInLastPage,
            onClick: t[1] || (t[1] = (...s) => o.onClickNextPage && o.onClickNextPage(...s)),
            class: normalizeClass([" text-default", o.isInLastPage ? n.disabledClasses : n.inactiveClasses])
          }, toDisplayString(n.nextLabel), 11, Xi)
        ])
      ])
    ])
  ]);
}
var Ur = Ft(ji, [["render", Ji]]);
var Zi = { class: "vt-table-footer flex flex-wrap gap-2 mx-4 my-2 pb-1" };
var Qi = {
  __name: "TableFooter",
  props: {
    paginate: {
      type: Boolean,
      default: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    numberOfPages: {
      type: Number,
      required: true
    },
    remotePagination: {
      type: Boolean,
      default: false
    },
    totalItems: {
      type: Number,
      required: false
    },
    tableDataLength: {
      type: Number,
      required: true
    },
    paginationPreviousLabel: {
      type: String,
      required: false
    },
    paginationNextLabel: {
      type: String,
      required: false
    },
    fields: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    bottomRows: {
      type: Array,
      required: true
    }
  },
  emits: ["page-changed"],
  setup(e, { emit: t }) {
    const n = t, o = (r) => {
      n("page-changed", r);
    };
    return (r, a) => (openBlock(), createElementBlock("div", Zi, [
      e.paginate ? (openBlock(), createBlock(Ur, {
        key: 0,
        "per-page": e.itemsPerPage || 0,
        "current-page": e.currentPage || 1,
        "total-pages": e.numberOfPages || 0,
        "total-entries": e.remotePagination ? e.totalItems || 0 : e.tableDataLength || 0,
        "previous-label": e.paginationPreviousLabel,
        "next-label": e.paginationNextLabel,
        onPageChanged: o,
        class: "text-default"
      }, {
        "pagination-label": withCtx(({ data: s }) => [
          renderSlot(r.$slots, "pagination-label", normalizeProps(guardReactiveProps(s || {})))
        ]),
        _: 3
      }, 8, ["per-page", "current-page", "total-pages", "total-entries", "previous-label", "next-label"])) : createCommentVNode("", true),
      renderSlot(r.$slots, "table-bottom-controls", {
        fields: e.fields || [],
        data: e.tableData || [],
        summaryRows: e.bottomRows || []
      })
    ]));
  }
};
var es = { class: "mt-2 pb-2 border-t border-border overflow-x-auto with-scrollbar" };
var ts = {
  __name: "TableComponent",
  props: {
    title: {
      type: String,
      required: false
    },
    items: {
      type: Array,
      required: true
    },
    totalItems: {
      type: Number,
      required: false
    },
    topRows: {
      type: Array,
      default: () => []
    },
    bottomRows: {
      type: Array,
      default: () => []
    },
    fields: {
      type: Array,
      default: () => [],
      validator: (e) => e.every((t) => t.key)
    },
    perPage: {
      type: Number,
      default: 5
    },
    configurablePageSize: {
      type: Boolean,
      default: true
    },
    pageSizes: {
      type: Array,
      default: () => [5, 10, 25, 50]
    },
    pageSizeButtonClassList: {
      type: String,
      default: Go(`btn-transparent-default 
                            table-top-control`)
    },
    searchInputClassList: {
      type: String,
      default: Go("form-inputfield-sm text-default")
    },
    paginate: {
      type: Boolean,
      default: true
    },
    enableSearch: {
      type: Boolean,
      default: true
    },
    searchPlaceholder: {
      type: String,
      default: "Search"
    },
    paginationPreviousLabel: {
      type: String,
      required: false
    },
    paginationNextLabel: {
      type: String,
      required: false
    },
    fixed: {
      type: Boolean,
      default: false
    },
    remotePagination: {
      type: Boolean,
      default: false
    },
    filterDebounce: {
      type: Number,
      default: 250
    },
    filterMaxWait: {
      type: Number,
      default: 2e3
    },
    sortNullsFirst: {
      type: Boolean,
      default: null
    }
  },
  emits: [
    "per-page-change",
    "sort-change",
    "after-sort",
    "page-change",
    "after-page-change",
    "filter-change",
    "filter-change-debounced",
    "after-filter"
  ],
  setup(e, { emit: t }) {
    const n = e, o = t, r = useId(), a = useSlots(), {
      tableData: s,
      visibleFields: i,
      getValue: l,
      getUnformattedValue: c,
      getColumnLabel: u,
      underscoresToSpaces: d
    } = oi(n), p = computed(() => {
      var j;
      const L = v.value || 5, D = ((j = n.topRows) == null ? void 0 : j.length) || 0;
      return Math.max(1, L - D);
    }), {
      currentPage: f,
      pageSize: v,
      numberOfPages: h2,
      changePage: g,
      getRows: x
    } = di(n, p, s), {
      handleSort: y,
      getSortIconClass: b
    } = ci(s, n.remotePagination, n.sortNullsFirst), {
      searchTerm: w,
      filterData: C,
      setupDebouncedEmission: E
    } = Ci(n, n.items, s, (L) => {
      const D = g(L);
      D != null && D.shouldEmitPageChange && o("page-change", D.eventData.page), D != null && D.shouldEmitAfterPageChange && o("after-page-change", {
        oldPage: D.eventData.oldPage,
        newPage: D.eventData.newPage
      });
    }), { validateProps: O } = Si(), {
      getClassList: _,
      getTopRowClassList: T,
      getBottomRowClassList: z,
      leftPadFirstCol: M,
      rightPadLastCol: Z
    } = Ei(), G = computed(() => `filter_input_${r}`), J = (L) => {
      const D = g(L);
      return D != null && D.shouldEmitPageChange && o("page-change", D.eventData.page), D != null && D.shouldEmitAfterPageChange && o("after-page-change", {
        oldPage: D.eventData.oldPage,
        newPage: D.eventData.newPage
      }), D;
    }, N = (L) => {
      const D = y(L, (j) => {
        const Y = g(j);
        Y != null && Y.shouldEmitPageChange && o("page-change", Y.eventData.page), Y != null && Y.shouldEmitAfterPageChange && o("after-page-change", {
          oldPage: Y.eventData.oldPage,
          newPage: Y.eventData.newPage
        });
      });
      o("sort-change", D.eventData), D != null && D.shouldEmitAfterSort && o("after-sort", D.eventData);
    }, U = (L) => {
      const D = C(L);
      o("filter-change", D.eventData.searchValue), D != null && D.shouldEmitAfterFilter && o("after-filter", { searchTerm: D.eventData.searchTerm });
    };
    return E((L) => {
      L != null && L.shouldEmitFilterChangeDebounced && o("filter-change-debounced", L.eventData.searchTerm);
    }), watch(() => p.value, (L) => {
      o("per-page-change", L);
    }), watch(() => n.perPage, (L) => {
      L > n.topRows.length ? v.value = L : v.value = n.pageSizes.find((D) => D > n.topRows.length);
    }), onMounted(() => {
      O(
        v.value,
        n.topRows.length,
        n.remotePagination,
        n.totalItems
      );
    }), (L, D) => (openBlock(), createElementBlock("div", null, [
      createVNode(unref(Pi), { title: e.title }, createSlots({ _: 2 }, [
        unref(a).title ? {
          name: "title",
          fn: withCtx(() => [
            renderSlot(L.$slots, "title")
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["title"]),
      createVNode(unref(Fi), {
        "enable-search": e.enableSearch,
        "search-placeholder": e.searchPlaceholder,
        "filter-input-id": G.value,
        "search-term": unref(w),
        "onUpdate:searchTerm": D[0] || (D[0] = (j) => isRef(w) ? w.value = j : null),
        "search-input-class-list": e.searchInputClassList,
        "configurable-page-size": e.configurablePageSize,
        "page-size": unref(v),
        "onUpdate:pageSize": D[1] || (D[1] = (j) => isRef(v) ? v.value = j : null),
        "page-sizes": e.pageSizes,
        "top-rows-length": e.topRows.length,
        "page-size-button-class-list": e.pageSizeButtonClassList,
        "table-data": unref(s),
        "top-rows": e.topRows,
        fields: e.fields,
        onFilterData: U
      }, {
        "page-size-label": withCtx(({ pageSize: j }) => [
          renderSlot(L.$slots, "page-size-label", normalizeProps(guardReactiveProps({ pageSize: j })))
        ]),
        "table-top-controls": withCtx((j) => [
          renderSlot(L.$slots, "table-top-controls", normalizeProps(guardReactiveProps(j)))
        ]),
        _: 3
      }, 8, ["enable-search", "search-placeholder", "filter-input-id", "search-term", "search-input-class-list", "configurable-page-size", "page-size", "page-sizes", "top-rows-length", "page-size-button-class-list", "table-data", "top-rows", "fields"]),
      createBaseVNode("div", es, [
        createBaseVNode("table", {
          class: normalizeClass(["w-full text-default", { "table-fixed whitespace-normal break-words": e.fixed }])
        }, [
          createVNode(unref(Ni), {
            "visible-fields": unref(i),
            "table-data": unref(s),
            "top-rows": e.topRows,
            "underscores-to-spaces": unref(d),
            "get-column-label": unref(u),
            "get-sort-icon-class": unref(b),
            "left-pad-first-col": unref(M),
            "right-pad-last-col": (j) => unref(Z)(j, unref(i).length),
            onSortTable: N
          }, createSlots({ _: 2 }, [
            renderList(unref(i), (j) => ({
              name: `th(${j.key})`,
              fn: withCtx((Y) => [
                renderSlot(L.$slots, `th(${j.key})`, normalizeProps(guardReactiveProps(Y)))
              ])
            }))
          ]), 1032, ["visible-fields", "table-data", "top-rows", "underscores-to-spaces", "get-column-label", "get-sort-icon-class", "left-pad-first-col", "right-pad-last-col"]),
          e.topRows.length ? (openBlock(), createBlock(unref(Nn), {
            key: 0,
            rows: unref(x)(e.topRows, false),
            "visible-fields": unref(i),
            "row-type": "top",
            "get-value": unref(l),
            "get-unformatted-value": unref(c),
            "get-cell-class-list": unref(T)
          }, createSlots({ _: 2 }, [
            renderList(unref(i), (j) => ({
              name: `cell(${j.key})`,
              fn: withCtx((Y) => [
                renderSlot(L.$slots, `cell(${j.key})`, normalizeProps(guardReactiveProps(Y)))
              ])
            }))
          ]), 1032, ["rows", "visible-fields", "get-value", "get-unformatted-value", "get-cell-class-list"])) : createCommentVNode("", true),
          createVNode(unref(Nn), {
            rows: unref(x)(),
            "visible-fields": unref(i),
            "row-type": "regular",
            "row-class": "border-y border-border",
            "get-value": unref(l),
            "get-unformatted-value": unref(c),
            "get-cell-class-list": unref(_)
          }, createSlots({ _: 2 }, [
            renderList(unref(i), (j) => ({
              name: `cell(${j.key})`,
              fn: withCtx((Y) => [
                renderSlot(L.$slots, `cell(${j.key})`, normalizeProps(guardReactiveProps(Y)))
              ])
            }))
          ]), 1032, ["rows", "visible-fields", "get-value", "get-unformatted-value", "get-cell-class-list"]),
          e.bottomRows.length ? (openBlock(), createBlock(unref(Nn), {
            key: 1,
            rows: unref(x)(e.bottomRows, false),
            "visible-fields": unref(i),
            "row-type": "bottom",
            "row-class": "border-t border-border",
            "get-value": unref(l),
            "get-unformatted-value": unref(c),
            "get-cell-class-list": unref(z)
          }, createSlots({ _: 2 }, [
            renderList(unref(i), (j) => ({
              name: `cell(${j.key})`,
              fn: withCtx((Y) => [
                renderSlot(L.$slots, `cell(${j.key})`, normalizeProps(guardReactiveProps(Y)))
              ])
            }))
          ]), 1032, ["rows", "visible-fields", "get-value", "get-unformatted-value", "get-cell-class-list"])) : createCommentVNode("", true)
        ], 2)
      ]),
      createVNode(unref(Qi), {
        paginate: e.paginate,
        "items-per-page": p.value,
        "current-page": unref(f),
        "number-of-pages": unref(h2),
        "remote-pagination": e.remotePagination,
        "total-items": e.totalItems,
        "table-data-length": unref(s).length,
        "pagination-previous-label": e.paginationPreviousLabel,
        "pagination-next-label": e.paginationNextLabel,
        fields: e.fields,
        "table-data": unref(s),
        "bottom-rows": e.bottomRows,
        onPageChanged: J
      }, {
        "pagination-label": withCtx(({ data: j }) => [
          renderSlot(L.$slots, "pagination-label", normalizeProps(guardReactiveProps(j || { perPage: 0, currentPage: 1, totalEntries: 0 })))
        ]),
        "table-bottom-controls": withCtx((j) => [
          renderSlot(L.$slots, "table-bottom-controls", normalizeProps(guardReactiveProps(j || {})))
        ]),
        _: 3
      }, 8, ["paginate", "items-per-page", "current-page", "number-of-pages", "remote-pagination", "total-items", "table-data-length", "pagination-previous-label", "pagination-next-label", "fields", "table-data", "bottom-rows"])
    ]));
  }
};
var ns = {
  setup() {
    const e = useTemplateRef("dropdown-container"), t = useTemplateRef("dropdown-content"), { updateDropdownPosition: n, dropdownStyles: o } = An(e, {
      positionToTrigger: vt.ADJACENT
    });
    return {
      updateDropdownPosition: n,
      dropdownStyles: o,
      dropdownContentRef: t
    };
  },
  directives: {
    clickOutside: mo
  },
  name: "action-dropdown-component",
  props: {
    options: {
      type: Array,
      default: () => []
    },
    buttonClassList: {
      type: String,
      default: ""
    },
    upIcon: {
      type: String,
      default: "i-custom-chevron-up text-default"
    },
    downIcon: {
      type: String,
      default: "i-custom-chevron-down text-default"
    },
    dropdownContainerClassList: {
      type: String,
      default: ""
    },
    ulClassList: {
      type: String,
      default: ""
    },
    liClassList: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    closeDropdown() {
      this.show = false;
    },
    toggleDropdown() {
      this.show = !this.show, this.show && this.updateDropdownPosition(this.dropdownContentRef);
    },
    onSelect(e) {
      this.$emit("on-select", e), this.closeDropdown();
    }
  }
};
var os = { class: "dropdown-component action-dropdown-component relative" };
var rs = ["onClick"];
var as = { class: "block w-[100%] px-8" };
function is(e, t, n, o, r, a) {
  const s = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("div", os, [
    createBaseVNode("div", {
      onClick: t[0] || (t[0] = (...i) => a.toggleDropdown && a.toggleDropdown(...i)),
      class: normalizeClass([
        "dropdown-button",
        n.buttonClassList ? n.buttonClassList : "btn-base-default rounded-sm py-1 text-center w-full"
      ]),
      type: "button",
      ref: "dropdown-container"
    }, [
      renderSlot(e.$slots, "toggle-label"),
      createBaseVNode("span", {
        class: normalizeClass(["ms-2 chevron", [r.show ? n.upIcon : n.downIcon]])
      }, null, 2)
    ], 2),
    (openBlock(), createBlock(Teleport, { to: "body" }, [
      withDirectives(createBaseVNode("div", {
        class: normalizeClass([
          "dropdown-container absolute z-600",
          n.dropdownContainerClassList ? n.dropdownContainerClassList : " w-fit bg-surface text-default divide-y divide-border border border border-1 border-solid border-border rounded-sm shadow-lg w-44"
        ]),
        ref: "dropdown-content",
        style: normalizeStyle(o.dropdownStyles)
      }, [
        createBaseVNode("ul", {
          class: normalizeClass([n.ulClassList ? n.ulClassList : "text-sm text-default"])
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(n.options, (i, l) => (openBlock(), createElementBlock("li", {
            key: l,
            class: normalizeClass([
              n.liClassList ? n.liClassList : "hovered-minor block py-2 text-right cursor-pointer"
            ]),
            onClick: (c) => a.onSelect(i)
          }, [
            renderSlot(e.$slots, "item", { item: i }, () => [
              createBaseVNode("p", as, toDisplayString(i), 1)
            ])
          ], 10, rs))), 128))
        ], 2)
      ], 6), [
        [vShow, r.show]
      ])
    ]))
  ])), [
    [s, a.closeDropdown]
  ]);
}
var ss = Ft(ns, [["render", is]]);
function Qn(e, t, n) {
  var o, r, a, s, i;
  t == null && (t = 100);
  function l() {
    var u = Date.now() - s;
    u < t && u >= 0 ? o = setTimeout(l, t - u) : (o = null, n || (i = e.apply(a, r), a = r = null));
  }
  var c = function() {
    a = this, r = arguments, s = Date.now();
    var u = n && !o;
    return o || (o = setTimeout(l, t)), u && (i = e.apply(a, r), a = r = null), i;
  };
  return c.clear = function() {
    o && (clearTimeout(o), o = null);
  }, c.flush = function() {
    o && (i = e.apply(a, r), a = r = null, clearTimeout(o), o = null);
  }, c;
}
Qn.debounce = Qn;
var Vn = Qn;
function ls(e, t, n) {
  isRef(e) ? watch(e, (o, r) => {
    r == null || r.removeEventListener(t, n), o == null || o.addEventListener(t, n);
  }) : onMounted(() => {
    e.addEventListener(t, n);
  }), onBeforeUnmount(() => {
    var o;
    (o = unref(e)) === null || o === void 0 || o.removeEventListener(t, n);
  });
}
function us(e, t) {
  const n = "pointerdown";
  return typeof window > "u" || !window ? void 0 : ls(window, n, (r) => {
    const a = unref(e);
    a && (a === r.target || r.composedPath().includes(a) || t(r));
  });
}
function cs(e, t, n) {
  let o = null;
  const r = ref(false);
  onMounted(() => {
    (e.content !== void 0 || n.value) && (r.value = true), o = new MutationObserver(a), o.observe(t.value, {
      childList: true,
      subtree: true
    });
  }), onBeforeUnmount(() => o.disconnect()), watch(n, (s) => {
    s ? r.value = true : r.value = false;
  });
  const a = () => {
    e.content ? r.value = true : r.value = false;
  };
  return {
    hasContent: r
  };
}
function $t(e, t) {
  var n = e.getBoundingClientRect(), o = 1, r = 1;
  return {
    width: n.width / o,
    height: n.height / r,
    top: n.top / r,
    right: n.right / o,
    bottom: n.bottom / r,
    left: n.left / o,
    x: n.left / o,
    y: n.top / r
  };
}
function Re(e) {
  if (e == null)
    return window;
  if (e.toString() !== "[object Window]") {
    var t = e.ownerDocument;
    return t && t.defaultView || window;
  }
  return e;
}
function vo(e) {
  var t = Re(e), n = t.pageXOffset, o = t.pageYOffset;
  return {
    scrollLeft: n,
    scrollTop: o
  };
}
function Ht(e) {
  var t = Re(e).Element;
  return e instanceof t || e instanceof Element;
}
function Pe(e) {
  var t = Re(e).HTMLElement;
  return e instanceof t || e instanceof HTMLElement;
}
function Gr(e) {
  if (typeof ShadowRoot > "u")
    return false;
  var t = Re(e).ShadowRoot;
  return e instanceof t || e instanceof ShadowRoot;
}
function ds(e) {
  return {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  };
}
function fs(e) {
  return e === Re(e) || !Pe(e) ? vo(e) : ds(e);
}
function ze(e) {
  return e ? (e.nodeName || "").toLowerCase() : null;
}
function ft(e) {
  return ((Ht(e) ? e.ownerDocument : (
    // $FlowFixMe[prop-missing]
    e.document
  )) || window.document).documentElement;
}
function ho(e) {
  return $t(ft(e)).left + vo(e).scrollLeft;
}
function Ye(e) {
  return Re(e).getComputedStyle(e);
}
function go(e) {
  var t = Ye(e), n = t.overflow, o = t.overflowX, r = t.overflowY;
  return /auto|scroll|overlay|hidden/.test(n + r + o);
}
function ps(e) {
  var t = e.getBoundingClientRect(), n = t.width / e.offsetWidth || 1, o = t.height / e.offsetHeight || 1;
  return n !== 1 || o !== 1;
}
function ms(e, t, n) {
  n === void 0 && (n = false);
  var o = Pe(t);
  Pe(t) && ps(t);
  var r = ft(t), a = $t(e), s = {
    scrollLeft: 0,
    scrollTop: 0
  }, i = {
    x: 0,
    y: 0
  };
  return (o || !o && !n) && ((ze(t) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  go(r)) && (s = fs(t)), Pe(t) ? (i = $t(t), i.x += t.clientLeft, i.y += t.clientTop) : r && (i.x = ho(r))), {
    x: a.left + s.scrollLeft - i.x,
    y: a.top + s.scrollTop - i.y,
    width: a.width,
    height: a.height
  };
}
function yo(e) {
  var t = $t(e), n = e.offsetWidth, o = e.offsetHeight;
  return Math.abs(t.width - n) <= 1 && (n = t.width), Math.abs(t.height - o) <= 1 && (o = t.height), {
    x: e.offsetLeft,
    y: e.offsetTop,
    width: n,
    height: o
  };
}
function $n(e) {
  return ze(e) === "html" ? e : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    e.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    e.parentNode || // DOM Element detected
    (Gr(e) ? e.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    ft(e)
  );
}
function Yr(e) {
  return ["html", "body", "#document"].indexOf(ze(e)) >= 0 ? e.ownerDocument.body : Pe(e) && go(e) ? e : Yr($n(e));
}
function jt(e, t) {
  var n;
  t === void 0 && (t = []);
  var o = Yr(e), r = o === ((n = e.ownerDocument) == null ? void 0 : n.body), a = Re(o), s = r ? [a].concat(a.visualViewport || [], go(o) ? o : []) : o, i = t.concat(s);
  return r ? i : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    i.concat(jt($n(s)))
  );
}
function vs(e) {
  return ["table", "td", "th"].indexOf(ze(e)) >= 0;
}
function Jo(e) {
  return !Pe(e) || // https://github.com/popperjs/popper-core/issues/837
  Ye(e).position === "fixed" ? null : e.offsetParent;
}
function hs(e) {
  var t = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1, n = navigator.userAgent.indexOf("Trident") !== -1;
  if (n && Pe(e)) {
    var o = Ye(e);
    if (o.position === "fixed")
      return null;
  }
  for (var r = $n(e); Pe(r) && ["html", "body"].indexOf(ze(r)) < 0; ) {
    var a = Ye(r);
    if (a.transform !== "none" || a.perspective !== "none" || a.contain === "paint" || ["transform", "perspective"].indexOf(a.willChange) !== -1 || t && a.willChange === "filter" || t && a.filter && a.filter !== "none")
      return r;
    r = r.parentNode;
  }
  return null;
}
function Jt(e) {
  for (var t = Re(e), n = Jo(e); n && vs(n) && Ye(n).position === "static"; )
    n = Jo(n);
  return n && (ze(n) === "html" || ze(n) === "body" && Ye(n).position === "static") ? t : n || hs(e) || t;
}
var Ae = "top";
var De = "bottom";
var _e = "right";
var $e = "left";
var bo = "auto";
var Zt = [Ae, De, _e, $e];
var kt = "start";
var Kt = "end";
var gs = "clippingParents";
var Xr = "viewport";
var Vt = "popper";
var ys = "reference";
var Zo = Zt.reduce(function(e, t) {
  return e.concat([t + "-" + kt, t + "-" + Kt]);
}, []);
var Jr = [].concat(Zt, [bo]).reduce(function(e, t) {
  return e.concat([t, t + "-" + kt, t + "-" + Kt]);
}, []);
var bs = "beforeRead";
var ws = "read";
var xs = "afterRead";
var Cs = "beforeMain";
var Ss = "main";
var Es = "afterMain";
var Os = "beforeWrite";
var Ps = "write";
var As = "afterWrite";
var $s = [bs, ws, xs, Cs, Ss, Es, Os, Ps, As];
function ks(e) {
  var t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), o = [];
  e.forEach(function(a) {
    t.set(a.name, a);
  });
  function r(a) {
    n.add(a.name);
    var s = [].concat(a.requires || [], a.requiresIfExists || []);
    s.forEach(function(i) {
      if (!n.has(i)) {
        var l = t.get(i);
        l && r(l);
      }
    }), o.push(a);
  }
  return e.forEach(function(a) {
    n.has(a.name) || r(a);
  }), o;
}
function Ts(e) {
  var t = ks(e);
  return $s.reduce(function(n, o) {
    return n.concat(t.filter(function(r) {
      return r.phase === o;
    }));
  }, []);
}
function Is(e) {
  var t;
  return function() {
    return t || (t = new Promise(function(n) {
      Promise.resolve().then(function() {
        t = void 0, n(e());
      });
    })), t;
  };
}
function Ne(e) {
  return e.split("-")[0];
}
function Ds(e) {
  var t = e.reduce(function(n, o) {
    var r = n[o.name];
    return n[o.name] = r ? Object.assign({}, r, o, {
      options: Object.assign({}, r.options, o.options),
      data: Object.assign({}, r.data, o.data)
    }) : o, n;
  }, {});
  return Object.keys(t).map(function(n) {
    return t[n];
  });
}
function _s(e) {
  var t = Re(e), n = ft(e), o = t.visualViewport, r = n.clientWidth, a = n.clientHeight, s = 0, i = 0;
  return o && (r = o.width, a = o.height, /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (s = o.offsetLeft, i = o.offsetTop)), {
    width: r,
    height: a,
    x: s + ho(e),
    y: i
  };
}
var at = Math.max;
var qt = Math.min;
var rn = Math.round;
function Ls(e) {
  var t, n = ft(e), o = vo(e), r = (t = e.ownerDocument) == null ? void 0 : t.body, a = at(n.scrollWidth, n.clientWidth, r ? r.scrollWidth : 0, r ? r.clientWidth : 0), s = at(n.scrollHeight, n.clientHeight, r ? r.scrollHeight : 0, r ? r.clientHeight : 0), i = -o.scrollLeft + ho(e), l = -o.scrollTop;
  return Ye(r || n).direction === "rtl" && (i += at(n.clientWidth, r ? r.clientWidth : 0) - a), {
    width: a,
    height: s,
    x: i,
    y: l
  };
}
function Zr(e, t) {
  var n = t.getRootNode && t.getRootNode();
  if (e.contains(t))
    return true;
  if (n && Gr(n)) {
    var o = t;
    do {
      if (o && e.isSameNode(o))
        return true;
      o = o.parentNode || o.host;
    } while (o);
  }
  return false;
}
function eo(e) {
  return Object.assign({}, e, {
    left: e.x,
    top: e.y,
    right: e.x + e.width,
    bottom: e.y + e.height
  });
}
function Fs(e) {
  var t = $t(e);
  return t.top = t.top + e.clientTop, t.left = t.left + e.clientLeft, t.bottom = t.top + e.clientHeight, t.right = t.left + e.clientWidth, t.width = e.clientWidth, t.height = e.clientHeight, t.x = t.left, t.y = t.top, t;
}
function Qo(e, t) {
  return t === Xr ? eo(_s(e)) : Pe(t) ? Fs(t) : eo(Ls(ft(e)));
}
function Bs(e) {
  var t = jt($n(e)), n = ["absolute", "fixed"].indexOf(Ye(e).position) >= 0, o = n && Pe(e) ? Jt(e) : e;
  return Ht(o) ? t.filter(function(r) {
    return Ht(r) && Zr(r, o) && ze(r) !== "body";
  }) : [];
}
function Rs(e, t, n) {
  var o = t === "clippingParents" ? Bs(e) : [].concat(t), r = [].concat(o, [n]), a = r[0], s = r.reduce(function(i, l) {
    var c = Qo(e, l);
    return i.top = at(c.top, i.top), i.right = qt(c.right, i.right), i.bottom = qt(c.bottom, i.bottom), i.left = at(c.left, i.left), i;
  }, Qo(e, a));
  return s.width = s.right - s.left, s.height = s.bottom - s.top, s.x = s.left, s.y = s.top, s;
}
function Tt(e) {
  return e.split("-")[1];
}
function wo(e) {
  return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
}
function Qr(e) {
  var t = e.reference, n = e.element, o = e.placement, r = o ? Ne(o) : null, a = o ? Tt(o) : null, s = t.x + t.width / 2 - n.width / 2, i = t.y + t.height / 2 - n.height / 2, l;
  switch (r) {
    case Ae:
      l = {
        x: s,
        y: t.y - n.height
      };
      break;
    case De:
      l = {
        x: s,
        y: t.y + t.height
      };
      break;
    case _e:
      l = {
        x: t.x + t.width,
        y: i
      };
      break;
    case $e:
      l = {
        x: t.x - n.width,
        y: i
      };
      break;
    default:
      l = {
        x: t.x,
        y: t.y
      };
  }
  var c = r ? wo(r) : null;
  if (c != null) {
    var u = c === "y" ? "height" : "width";
    switch (a) {
      case kt:
        l[c] = l[c] - (t[u] / 2 - n[u] / 2);
        break;
      case Kt:
        l[c] = l[c] + (t[u] / 2 - n[u] / 2);
        break;
    }
  }
  return l;
}
function ea() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function ta(e) {
  return Object.assign({}, ea(), e);
}
function na(e, t) {
  return t.reduce(function(n, o) {
    return n[o] = e, n;
  }, {});
}
function xo(e, t) {
  t === void 0 && (t = {});
  var n = t, o = n.placement, r = o === void 0 ? e.placement : o, a = n.boundary, s = a === void 0 ? gs : a, i = n.rootBoundary, l = i === void 0 ? Xr : i, c = n.elementContext, u = c === void 0 ? Vt : c, d = n.altBoundary, p = d === void 0 ? false : d, f = n.padding, v = f === void 0 ? 0 : f, h2 = ta(typeof v != "number" ? v : na(v, Zt)), g = u === Vt ? ys : Vt, x = e.rects.popper, y = e.elements[p ? g : u], b = Rs(Ht(y) ? y : y.contextElement || ft(e.elements.popper), s, l), w = $t(e.elements.reference), C = Qr({
    reference: w,
    element: x,
    placement: r
  }), E = eo(Object.assign({}, x, C)), O = u === Vt ? E : w, _ = {
    top: b.top - O.top + h2.top,
    bottom: O.bottom - b.bottom + h2.bottom,
    left: b.left - O.left + h2.left,
    right: O.right - b.right + h2.right
  }, T = e.modifiersData.offset;
  if (u === Vt && T) {
    var z = T[r];
    Object.keys(_).forEach(function(M) {
      var Z = [_e, De].indexOf(M) >= 0 ? 1 : -1, G = [Ae, De].indexOf(M) >= 0 ? "y" : "x";
      _[M] += z[G] * Z;
    });
  }
  return _;
}
var er = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function tr() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  return !t.some(function(o) {
    return !(o && typeof o.getBoundingClientRect == "function");
  });
}
function Ms(e) {
  e === void 0 && (e = {});
  var t = e, n = t.defaultModifiers, o = n === void 0 ? [] : n, r = t.defaultOptions, a = r === void 0 ? er : r;
  return function(i, l, c) {
    c === void 0 && (c = a);
    var u = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, er, a),
      modifiersData: {},
      elements: {
        reference: i,
        popper: l
      },
      attributes: {},
      styles: {}
    }, d = [], p = false, f = {
      state: u,
      setOptions: function(x) {
        var y = typeof x == "function" ? x(u.options) : x;
        h2(), u.options = Object.assign({}, a, u.options, y), u.scrollParents = {
          reference: Ht(i) ? jt(i) : i.contextElement ? jt(i.contextElement) : [],
          popper: jt(l)
        };
        var b = Ts(Ds([].concat(o, u.options.modifiers)));
        return u.orderedModifiers = b.filter(function(w) {
          return w.enabled;
        }), v(), f.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!p) {
          var x = u.elements, y = x.reference, b = x.popper;
          if (tr(y, b)) {
            u.rects = {
              reference: ms(y, Jt(b), u.options.strategy === "fixed"),
              popper: yo(b)
            }, u.reset = false, u.placement = u.options.placement, u.orderedModifiers.forEach(function(z) {
              return u.modifiersData[z.name] = Object.assign({}, z.data);
            });
            for (var w = 0; w < u.orderedModifiers.length; w++) {
              if (u.reset === true) {
                u.reset = false, w = -1;
                continue;
              }
              var C = u.orderedModifiers[w], E = C.fn, O = C.options, _ = O === void 0 ? {} : O, T = C.name;
              typeof E == "function" && (u = E({
                state: u,
                options: _,
                name: T,
                instance: f
              }) || u);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: Is(function() {
        return new Promise(function(g) {
          f.forceUpdate(), g(u);
        });
      }),
      destroy: function() {
        h2(), p = true;
      }
    };
    if (!tr(i, l))
      return f;
    f.setOptions(c).then(function(g) {
      !p && c.onFirstUpdate && c.onFirstUpdate(g);
    });
    function v() {
      u.orderedModifiers.forEach(function(g) {
        var x = g.name, y = g.options, b = y === void 0 ? {} : y, w = g.effect;
        if (typeof w == "function") {
          var C = w({
            state: u,
            name: x,
            instance: f,
            options: b
          }), E = function() {
          };
          d.push(C || E);
        }
      });
    }
    function h2() {
      d.forEach(function(g) {
        return g();
      }), d = [];
    }
    return f;
  };
}
var an = {
  passive: true
};
function Ns(e) {
  var t = e.state, n = e.instance, o = e.options, r = o.scroll, a = r === void 0 ? true : r, s = o.resize, i = s === void 0 ? true : s, l = Re(t.elements.popper), c = [].concat(t.scrollParents.reference, t.scrollParents.popper);
  return a && c.forEach(function(u) {
    u.addEventListener("scroll", n.update, an);
  }), i && l.addEventListener("resize", n.update, an), function() {
    a && c.forEach(function(u) {
      u.removeEventListener("scroll", n.update, an);
    }), i && l.removeEventListener("resize", n.update, an);
  };
}
var Vs = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function() {
  },
  effect: Ns,
  data: {}
};
function zs(e) {
  var t = e.state, n = e.name;
  t.modifiersData[n] = Qr({
    reference: t.rects.reference,
    element: t.rects.popper,
    placement: t.placement
  });
}
var js = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: zs,
  data: {}
};
var Ws = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function Hs(e) {
  var t = e.x, n = e.y, o = window, r = o.devicePixelRatio || 1;
  return {
    x: rn(rn(t * r) / r) || 0,
    y: rn(rn(n * r) / r) || 0
  };
}
function nr(e) {
  var t, n = e.popper, o = e.popperRect, r = e.placement, a = e.variation, s = e.offsets, i = e.position, l = e.gpuAcceleration, c = e.adaptive, u = e.roundOffsets, d = u === true ? Hs(s) : typeof u == "function" ? u(s) : s, p = d.x, f = p === void 0 ? 0 : p, v = d.y, h2 = v === void 0 ? 0 : v, g = s.hasOwnProperty("x"), x = s.hasOwnProperty("y"), y = $e, b = Ae, w = window;
  if (c) {
    var C = Jt(n), E = "clientHeight", O = "clientWidth";
    C === Re(n) && (C = ft(n), Ye(C).position !== "static" && i === "absolute" && (E = "scrollHeight", O = "scrollWidth")), C = C, (r === Ae || (r === $e || r === _e) && a === Kt) && (b = De, h2 -= C[E] - o.height, h2 *= l ? 1 : -1), (r === $e || (r === Ae || r === De) && a === Kt) && (y = _e, f -= C[O] - o.width, f *= l ? 1 : -1);
  }
  var _ = Object.assign({
    position: i
  }, c && Ws);
  if (l) {
    var T;
    return Object.assign({}, _, (T = {}, T[b] = x ? "0" : "", T[y] = g ? "0" : "", T.transform = (w.devicePixelRatio || 1) <= 1 ? "translate(" + f + "px, " + h2 + "px)" : "translate3d(" + f + "px, " + h2 + "px, 0)", T));
  }
  return Object.assign({}, _, (t = {}, t[b] = x ? h2 + "px" : "", t[y] = g ? f + "px" : "", t.transform = "", t));
}
function Ks(e) {
  var t = e.state, n = e.options, o = n.gpuAcceleration, r = o === void 0 ? true : o, a = n.adaptive, s = a === void 0 ? true : a, i = n.roundOffsets, l = i === void 0 ? true : i, c = {
    placement: Ne(t.placement),
    variation: Tt(t.placement),
    popper: t.elements.popper,
    popperRect: t.rects.popper,
    gpuAcceleration: r
  };
  t.modifiersData.popperOffsets != null && (t.styles.popper = Object.assign({}, t.styles.popper, nr(Object.assign({}, c, {
    offsets: t.modifiersData.popperOffsets,
    position: t.options.strategy,
    adaptive: s,
    roundOffsets: l
  })))), t.modifiersData.arrow != null && (t.styles.arrow = Object.assign({}, t.styles.arrow, nr(Object.assign({}, c, {
    offsets: t.modifiersData.arrow,
    position: "absolute",
    adaptive: false,
    roundOffsets: l
  })))), t.attributes.popper = Object.assign({}, t.attributes.popper, {
    "data-popper-placement": t.placement
  });
}
var qs = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: Ks,
  data: {}
};
function Us(e) {
  var t = e.state;
  Object.keys(t.elements).forEach(function(n) {
    var o = t.styles[n] || {}, r = t.attributes[n] || {}, a = t.elements[n];
    !Pe(a) || !ze(a) || (Object.assign(a.style, o), Object.keys(r).forEach(function(s) {
      var i = r[s];
      i === false ? a.removeAttribute(s) : a.setAttribute(s, i === true ? "" : i);
    }));
  });
}
function Gs(e) {
  var t = e.state, n = {
    popper: {
      position: t.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  return Object.assign(t.elements.popper.style, n.popper), t.styles = n, t.elements.arrow && Object.assign(t.elements.arrow.style, n.arrow), function() {
    Object.keys(t.elements).forEach(function(o) {
      var r = t.elements[o], a = t.attributes[o] || {}, s = Object.keys(t.styles.hasOwnProperty(o) ? t.styles[o] : n[o]), i = s.reduce(function(l, c) {
        return l[c] = "", l;
      }, {});
      !Pe(r) || !ze(r) || (Object.assign(r.style, i), Object.keys(a).forEach(function(l) {
        r.removeAttribute(l);
      }));
    });
  };
}
var Ys = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: Us,
  effect: Gs,
  requires: ["computeStyles"]
};
var Xs = [Vs, js, qs, Ys];
var Js = Ms({
  defaultModifiers: Xs
});
function Zs(e) {
  return e === "x" ? "y" : "x";
}
function dn(e, t, n) {
  return at(e, qt(t, n));
}
function Qs(e) {
  var t = e.state, n = e.options, o = e.name, r = n.mainAxis, a = r === void 0 ? true : r, s = n.altAxis, i = s === void 0 ? false : s, l = n.boundary, c = n.rootBoundary, u = n.altBoundary, d = n.padding, p = n.tether, f = p === void 0 ? true : p, v = n.tetherOffset, h2 = v === void 0 ? 0 : v, g = xo(t, {
    boundary: l,
    rootBoundary: c,
    padding: d,
    altBoundary: u
  }), x = Ne(t.placement), y = Tt(t.placement), b = !y, w = wo(x), C = Zs(w), E = t.modifiersData.popperOffsets, O = t.rects.reference, _ = t.rects.popper, T = typeof h2 == "function" ? h2(Object.assign({}, t.rects, {
    placement: t.placement
  })) : h2, z = {
    x: 0,
    y: 0
  };
  if (E) {
    if (a || i) {
      var M = w === "y" ? Ae : $e, Z = w === "y" ? De : _e, G = w === "y" ? "height" : "width", J = E[w], N = E[w] + g[M], U = E[w] - g[Z], L = f ? -_[G] / 2 : 0, D = y === kt ? O[G] : _[G], j = y === kt ? -_[G] : -O[G], Y = t.elements.arrow, ye = f && Y ? yo(Y) : {
        width: 0,
        height: 0
      }, be = t.modifiersData["arrow#persistent"] ? t.modifiersData["arrow#persistent"].padding : ea(), tt = be[M], he = be[Z], we = dn(0, O[G], ye[G]), nt = b ? O[G] / 2 - L - we - tt - T : D - we - tt - T, R = b ? -O[G] / 2 + L + we + he + T : j + we + he + T, H = t.elements.arrow && Jt(t.elements.arrow), q = H ? w === "y" ? H.clientTop || 0 : H.clientLeft || 0 : 0, te = t.modifiersData.offset ? t.modifiersData.offset[t.placement][w] : 0, me = E[w] + nt - te - q, Te = E[w] + R - te;
      if (a) {
        var ot = dn(f ? qt(N, me) : N, J, f ? at(U, Te) : U);
        E[w] = ot, z[w] = ot - J;
      }
      if (i) {
        var mt = w === "x" ? Ae : $e, Ha = w === "x" ? De : _e, nn = E[C], zo = nn + g[mt], jo = nn - g[Ha], Wo = dn(f ? qt(zo, me) : zo, nn, f ? at(jo, Te) : jo);
        E[C] = Wo, z[C] = Wo - nn;
      }
    }
    t.modifiersData[o] = z;
  }
}
var el = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: Qs,
  requiresIfExists: ["offset"]
};
var tl = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function fn(e) {
  return e.replace(/left|right|bottom|top/g, function(t) {
    return tl[t];
  });
}
var nl = {
  start: "end",
  end: "start"
};
function or(e) {
  return e.replace(/start|end/g, function(t) {
    return nl[t];
  });
}
function ol(e, t) {
  t === void 0 && (t = {});
  var n = t, o = n.placement, r = n.boundary, a = n.rootBoundary, s = n.padding, i = n.flipVariations, l = n.allowedAutoPlacements, c = l === void 0 ? Jr : l, u = Tt(o), d = u ? i ? Zo : Zo.filter(function(v) {
    return Tt(v) === u;
  }) : Zt, p = d.filter(function(v) {
    return c.indexOf(v) >= 0;
  });
  p.length === 0 && (p = d);
  var f = p.reduce(function(v, h2) {
    return v[h2] = xo(e, {
      placement: h2,
      boundary: r,
      rootBoundary: a,
      padding: s
    })[Ne(h2)], v;
  }, {});
  return Object.keys(f).sort(function(v, h2) {
    return f[v] - f[h2];
  });
}
function rl(e) {
  if (Ne(e) === bo)
    return [];
  var t = fn(e);
  return [or(e), t, or(t)];
}
function al(e) {
  var t = e.state, n = e.options, o = e.name;
  if (!t.modifiersData[o]._skip) {
    for (var r = n.mainAxis, a = r === void 0 ? true : r, s = n.altAxis, i = s === void 0 ? true : s, l = n.fallbackPlacements, c = n.padding, u = n.boundary, d = n.rootBoundary, p = n.altBoundary, f = n.flipVariations, v = f === void 0 ? true : f, h2 = n.allowedAutoPlacements, g = t.options.placement, x = Ne(g), y = x === g, b = l || (y || !v ? [fn(g)] : rl(g)), w = [g].concat(b).reduce(function(he, we) {
      return he.concat(Ne(we) === bo ? ol(t, {
        placement: we,
        boundary: u,
        rootBoundary: d,
        padding: c,
        flipVariations: v,
        allowedAutoPlacements: h2
      }) : we);
    }, []), C = t.rects.reference, E = t.rects.popper, O = /* @__PURE__ */ new Map(), _ = true, T = w[0], z = 0; z < w.length; z++) {
      var M = w[z], Z = Ne(M), G = Tt(M) === kt, J = [Ae, De].indexOf(Z) >= 0, N = J ? "width" : "height", U = xo(t, {
        placement: M,
        boundary: u,
        rootBoundary: d,
        altBoundary: p,
        padding: c
      }), L = J ? G ? _e : $e : G ? De : Ae;
      C[N] > E[N] && (L = fn(L));
      var D = fn(L), j = [];
      if (a && j.push(U[Z] <= 0), i && j.push(U[L] <= 0, U[D] <= 0), j.every(function(he) {
        return he;
      })) {
        T = M, _ = false;
        break;
      }
      O.set(M, j);
    }
    if (_)
      for (var Y = v ? 3 : 1, ye = function(we) {
        var nt = w.find(function(R) {
          var H = O.get(R);
          if (H)
            return H.slice(0, we).every(function(q) {
              return q;
            });
        });
        if (nt)
          return T = nt, "break";
      }, be = Y; be > 0; be--) {
        var tt = ye(be);
        if (tt === "break") break;
      }
    t.placement !== T && (t.modifiersData[o]._skip = true, t.placement = T, t.reset = true);
  }
}
var il = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: al,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};
function sl(e, t, n) {
  var o = Ne(e), r = [$e, Ae].indexOf(o) >= 0 ? -1 : 1, a = typeof n == "function" ? n(Object.assign({}, t, {
    placement: e
  })) : n, s = a[0], i = a[1];
  return s = s || 0, i = (i || 0) * r, [$e, _e].indexOf(o) >= 0 ? {
    x: i,
    y: s
  } : {
    x: s,
    y: i
  };
}
function ll(e) {
  var t = e.state, n = e.options, o = e.name, r = n.offset, a = r === void 0 ? [0, 0] : r, s = Jr.reduce(function(u, d) {
    return u[d] = sl(d, t.rects, a), u;
  }, {}), i = s[t.placement], l = i.x, c = i.y;
  t.modifiersData.popperOffsets != null && (t.modifiersData.popperOffsets.x += l, t.modifiersData.popperOffsets.y += c), t.modifiersData[o] = s;
}
var ul = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: ll
};
var cl = function(t, n) {
  return t = typeof t == "function" ? t(Object.assign({}, n.rects, {
    placement: n.placement
  })) : t, ta(typeof t != "number" ? t : na(t, Zt));
};
function dl(e) {
  var t, n = e.state, o = e.name, r = e.options, a = n.elements.arrow, s = n.modifiersData.popperOffsets, i = Ne(n.placement), l = wo(i), c = [$e, _e].indexOf(i) >= 0, u = c ? "height" : "width";
  if (!(!a || !s)) {
    var d = cl(r.padding, n), p = yo(a), f = l === "y" ? Ae : $e, v = l === "y" ? De : _e, h2 = n.rects.reference[u] + n.rects.reference[l] - s[l] - n.rects.popper[u], g = s[l] - n.rects.reference[l], x = Jt(a), y = x ? l === "y" ? x.clientHeight || 0 : x.clientWidth || 0 : 0, b = h2 / 2 - g / 2, w = d[f], C = y - p[u] - d[v], E = y / 2 - p[u] / 2 + b, O = dn(w, E, C), _ = l;
    n.modifiersData[o] = (t = {}, t[_] = O, t.centerOffset = O - E, t);
  }
}
function fl(e) {
  var t = e.state, n = e.options, o = n.element, r = o === void 0 ? "[data-popper-arrow]" : o;
  r != null && (typeof r == "string" && (r = t.elements.popper.querySelector(r), !r) || Zr(t.elements.popper, r) && (t.elements.arrow = r));
}
var pl = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: dl,
  effect: fl,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
var zn = (e) => parseInt(e, 10);
function ml({
  arrowPadding: e,
  emit: t,
  locked: n,
  offsetDistance: o,
  offsetSkid: r,
  placement: a,
  popperNode: s,
  triggerNode: i
}) {
  const l = reactive({
    isOpen: false,
    popperInstance: null
  }), c = (h2) => {
    var g;
    (g = l.popperInstance) === null || g === void 0 || g.setOptions((x) => ({
      ...x,
      modifiers: [...x.modifiers, {
        name: "eventListeners",
        enabled: h2
      }]
    }));
  }, u = () => c(true), d = () => c(false), p = () => {
    l.isOpen && (l.isOpen = false, t("close:popper"));
  }, f = () => {
    l.isOpen || (l.isOpen = true, t("open:popper"));
  };
  watch([() => l.isOpen, a], async ([h2]) => {
    h2 ? (await v(), u()) : d();
  });
  const v = async () => {
    await nextTick(), l.popperInstance = Js(i.value, s.value, {
      placement: a.value,
      modifiers: [el, il, {
        name: "flip",
        enabled: !n.value
      }, pl, {
        name: "arrow",
        options: {
          padding: zn(e.value)
        }
      }, ul, {
        name: "offset",
        options: {
          offset: [zn(r.value), zn(o.value)]
        }
      }]
    }), l.popperInstance.update();
  };
  return onBeforeUnmount(() => {
    var h2;
    (h2 = l.popperInstance) === null || h2 === void 0 || h2.destroy();
  }), {
    ...toRefs(l),
    open: f,
    close: p
  };
}
var vl = {
  id: "arrow",
  "data-popper-arrow": ""
};
function hl(e, t) {
  return openBlock(), createElementBlock("div", vl);
}
function oa(e, t) {
  t === void 0 && (t = {});
  var n = t.insertAt;
  if (!(!e || typeof document > "u")) {
    var o = document.head || document.getElementsByTagName("head")[0], r = document.createElement("style");
    r.type = "text/css", n === "top" && o.firstChild ? o.insertBefore(r, o.firstChild) : o.appendChild(r), r.styleSheet ? r.styleSheet.cssText = e : r.appendChild(document.createTextNode(e));
  }
}
var gl = `
#arrow[data-v-20b7fd4a],
  #arrow[data-v-20b7fd4a]::before {
    transition: background 250ms ease-in-out;
    position: absolute;
    width: calc(10px - var(--popper-theme-border-width, 0px));
    height: calc(10px - var(--popper-theme-border-width, 0px));
    box-sizing: border-box;
    background: var(--popper-theme-background-color);
}
#arrow[data-v-20b7fd4a] {
    visibility: hidden;
}
#arrow[data-v-20b7fd4a]::before {
    visibility: visible;
    content: "";
    transform: rotate(45deg);
}

  /* Top arrow */
.popper[data-popper-placement^="top"] > #arrow[data-v-20b7fd4a] {
    bottom: -5px;
}
.popper[data-popper-placement^="top"] > #arrow[data-v-20b7fd4a]::before {
    border-right: var(--popper-theme-border-width)
      var(--popper-theme-border-style) var(--popper-theme-border-color);
    border-bottom: var(--popper-theme-border-width)
      var(--popper-theme-border-style) var(--popper-theme-border-color);
}

  /* Bottom arrow */
.popper[data-popper-placement^="bottom"] > #arrow[data-v-20b7fd4a] {
    top: -5px;
}
.popper[data-popper-placement^="bottom"] > #arrow[data-v-20b7fd4a]::before {
    border-left: var(--popper-theme-border-width)
      var(--popper-theme-border-style) var(--popper-theme-border-color);
    border-top: var(--popper-theme-border-width)
      var(--popper-theme-border-style) var(--popper-theme-border-color);
}

  /* Left arrow */
.popper[data-popper-placement^="left"] > #arrow[data-v-20b7fd4a] {
    right: -5px;
}
.popper[data-popper-placement^="left"] > #arrow[data-v-20b7fd4a]::before {
    border-right: var(--popper-theme-border-width)
      var(--popper-theme-border-style) var(--popper-theme-border-color);
    border-top: var(--popper-theme-border-width)
      var(--popper-theme-border-style) var(--popper-theme-border-color);
}

  /* Right arrow */
.popper[data-popper-placement^="right"] > #arrow[data-v-20b7fd4a] {
    left: -5px;
}
`;
oa(gl);
var Co = {};
Co.render = hl;
Co.__scopeId = "data-v-20b7fd4a";
var yl = Co;
var bl = ["onKeyup"];
var ra = {
  props: {
    /**
     * Preferred placement (the "auto" placements will choose the side with most space.)
     */
    placement: {
      type: String,
      default: "bottom",
      validator: function(e) {
        return ["auto", "auto-start", "auto-end", "top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "right", "right-start", "right-end", "left", "left-start", "left-end"].includes(e);
      }
    },
    /**
     * Disables automatically closing the popover when the user clicks away from it
     */
    disableClickAway: {
      type: Boolean,
      default: false
    },
    /**
     * Offset in pixels along the trigger element
     */
    offsetSkid: {
      type: String,
      default: "0"
    },
    /**
     * Offset in pixels away from the trigger element
     */
    offsetDistance: {
      type: String,
      default: "12"
    },
    /**
     * Trigger the popper on hover
     */
    hover: {
      type: Boolean,
      default: false
    },
    /**
     * Manually open/close the Popper, other events are ignored if this prop is set
     */
    show: {
      type: Boolean,
      default: null
    },
    /**
     * Disables the Popper. If it was already open, it will be closed.
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Open the Popper after a delay (ms).
     */
    openDelay: {
      type: [Number, String],
      default: 0
    },
    /**
     * Close the Popper after a delay (ms).
     */
    closeDelay: {
      type: [Number, String],
      default: 0
    },
    /**
     * The z-index of the Popper.
     */
    zIndex: {
      type: [Number, String],
      default: 9999
    },
    /**
     * Display an arrow on the popper
     */
    arrow: {
      type: Boolean,
      default: false
    },
    /**
     * Stop arrow from reaching the edge of the popper
     */
    arrowPadding: {
      type: String,
      default: "0"
    },
    /**
     * If the Popper should be interactive, it will close when clicked/hovered if false
     */
    interactive: {
      type: Boolean,
      default: true
    },
    /**
     * Lock the Popper into place, it will not flip dynamically when it runs out of space if true
     */
    locked: {
      type: Boolean,
      default: false
    },
    /**
     * If the content is just a simple string, it can be passed in as a prop
     */
    content: {
      type: String,
      default: null
    }
  },
  emits: ["open:popper", "close:popper"],
  setup(e, {
    emit: t
  }) {
    const n = e;
    useCssVars((D) => ({
      c81fc0a4: e.zIndex
    }));
    const o = useSlots(), r = ref(null), a = ref(null), s = ref(null), i = ref(false);
    onMounted(() => {
      const D = o.default();
      if (D && D.length > 1)
        return console.error(`[Popper]: The <Popper> component expects only one child element at its root. You passed ${D.length} child nodes.`);
    });
    const {
      arrowPadding: l,
      closeDelay: c,
      content: u,
      disableClickAway: d,
      disabled: p,
      interactive: f,
      locked: v,
      offsetDistance: h2,
      offsetSkid: g,
      openDelay: x,
      placement: y,
      show: b
    } = toRefs(n), {
      isOpen: w,
      open: C,
      close: E
    } = ml({
      arrowPadding: l,
      emit: t,
      locked: v,
      offsetDistance: h2,
      offsetSkid: g,
      placement: y,
      popperNode: a,
      triggerNode: s
    }), {
      hasContent: O
    } = cs(o, a, u), _ = computed(() => b.value !== null), T = computed(() => p.value || !O.value), z = computed(() => w.value && !T.value), M = computed(() => !d.value && !_.value), Z = computed(() => f.value ? `border: ${h2.value}px solid transparent; margin: -${h2.value}px;` : null), G = Vn.debounce(C, x.value), J = Vn.debounce(E, c.value), N = async () => {
      T.value || _.value || (J.clear(), G());
    }, U = async () => {
      _.value || (G.clear(), J());
    }, L = () => {
      w.value ? U() : N();
    };
    return watch([O, p], ([D, j]) => {
      w.value && (!D || j) && E();
    }), watch(w, (D) => {
      D ? i.value = true : Vn.debounce(() => {
        i.value = false;
      }, 200);
    }), watchEffect(() => {
      _.value && (b.value ? G() : J());
    }), watchEffect(() => {
      M.value && us(r, U);
    }), (D, j) => (openBlock(), createElementBlock("div", {
      class: "inline-block",
      style: normalizeStyle(unref(Z)),
      onMouseleave: j[2] || (j[2] = (Y) => e.hover && U()),
      ref: (Y, ye) => {
        ye.popperContainerNode = Y, r.value = Y;
      }
    }, [createBaseVNode("div", {
      ref: (Y, ye) => {
        ye.triggerNode = Y, s.value = Y;
      },
      onMouseover: j[0] || (j[0] = (Y) => e.hover && N()),
      onClick: L,
      onFocus: N,
      onKeyup: withKeys(U, ["esc"])
    }, [renderSlot(D.$slots, "default")], 40, bl), createVNode(Transition, {
      name: "fade"
    }, {
      default: withCtx(() => [withDirectives(createBaseVNode("div", {
        onClick: j[1] || (j[1] = (Y) => !unref(f) && U()),
        class: "popper",
        ref: (Y, ye) => {
          ye.popperNode = Y, a.value = Y;
        }
      }, [renderSlot(D.$slots, "content", {
        close: unref(E),
        isOpen: i.value
      }, () => [createTextVNode(toDisplayString(unref(u)), 1)]), e.arrow ? (openBlock(), createBlock(yl, {
        key: 0
      })) : createCommentVNode("", true)], 512), [[vShow, unref(z)]])]),
      _: 3
    })], 36));
  }
};
var wl = `
.inline-block[data-v-5784ed69] {
    display: inline-block;
}
.popper[data-v-5784ed69] {
    transition: background 250ms ease-in-out;
    background: var(--popper-theme-background-color);
    padding: var(--popper-theme-padding);
    color: var(--popper-theme-text-color);
    border-radius: var(--popper-theme-border-radius);
    border-width: var(--popper-theme-border-width);
    border-style: var(--popper-theme-border-style);
    border-color: var(--popper-theme-border-color);
    box-shadow: var(--popper-theme-box-shadow);
    z-index: var(--c81fc0a4);
}
.popper[data-v-5784ed69]:hover,
  .popper:hover > #arrow[data-v-5784ed69]::before {
    background: var(--popper-theme-background-color-hover);
}
.inline-block[data-v-5784ed69] {
    display: inline-block;
}
.fade-enter-active[data-v-5784ed69],
  .fade-leave-active[data-v-5784ed69] {
    transition: opacity 0.2s ease;
}
.fade-enter-from[data-v-5784ed69],
  .fade-leave-to[data-v-5784ed69] {
    opacity: 0;
}
`;
oa(wl);
ra.__scopeId = "data-v-5784ed69";
var xl = (() => {
  const e = ra;
  return e.install = (t) => {
    t.component("Popper", e);
  }, e;
})();
var Cl = defineComponent({
  components: {
    Popper: xl
  }
});
function Sl(e, t, n, o, r, a) {
  const s = resolveComponent("Popper");
  return openBlock(), createBlock(s, {
    arrow: "",
    "open-delay": "100",
    "close-delay": "100"
  }, {
    content: withCtx((i) => [
      renderSlot(e.$slots, "content", normalizeProps(guardReactiveProps(i)), void 0, true)
    ]),
    default: withCtx(() => [
      t[0] || (t[0] = createBaseVNode("span", { class: "form-help" }, "?", -1))
    ]),
    _: 3,
    __: [0]
  });
}
var El = Ft(Cl, [["render", Sl], ["__scopeId", "data-v-b8d12902"]]);
var Ol = { key: 0 };
var Pl = { class: "flex gap-2" };
var Al = ["innerHTML"];
var $l = {
  key: 1,
  class: ""
};
var kl = {
  __name: "TabComponent",
  props: {
    title: {
      type: String
    },
    help: {
      type: String
    }
  },
  setup(e) {
    return (t, n) => e.help ? (openBlock(), createElementBlock("li", Ol, [
      createBaseVNode("div", Pl, [
        createBaseVNode("span", null, toDisplayString(e.title), 1),
        createVNode(El, null, {
          content: withCtx(() => [
            createBaseVNode("p", {
              class: "text-sm font-light normal-case",
              innerHTML: e.help
            }, null, 8, Al)
          ]),
          _: 1
        })
      ])
    ])) : (openBlock(), createElementBlock("li", $l, toDisplayString(e.title), 1));
  }
};
var Tl = { class: "flex px-2 border-b border-border w-full" };
var aa = {
  __name: "TabsComponent",
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    currentTabIndex: {
      type: Number,
      default: 0
    }
  },
  emits: ["update:currentTabIndex"],
  setup(e, { emit: t }) {
    const n = e, o = (i) => i.label ? i.label : `tab-${n.tabs.indexOf(i)}`, r = ref(n.currentTabIndex), a = t, s = (i) => {
      r.value = i, a("update:currentTabIndex", i);
    };
    return (i, l) => (openBlock(), createElementBlock("ul", Tl, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(e.tabs, (c, u) => (openBlock(), createBlock(kl, {
        class: "data-[active=true]:bg-surface border border-border data-[active=true]:border-b-none data-[active=true]:text-default -mb-px py-3 px-4 inline-flex items-center gap-x-2 tab-heading text-center data-[active=false]:border-t-transparent data-[active=false]:border-l-transparent data-[active=false]:border-r-transparent hover:data-[active=false]:border-border hover:data-[active=false]:text-primary-hover text-muted rounded-t hover:border-t-1 hover:border-l-1 hover:border-r-1 hover:border-t-border hover:border-l-border hover:border-r-border hover:border-t-solid hover:border-l-solid hover:border-r-solid disabled:bg-disabled disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-muted color-transition",
        key: c,
        title: o(c),
        help: c.help,
        onClick: (d) => s(u),
        "data-active": u === r.value
      }, null, 8, ["title", "help", "onClick", "data-active"]))), 128))
    ]));
  }
};
var Il = {
  props: {
    classes: {
      type: String,
      default: ""
    }
  },
  name: "card-component"
};
function Dl(e, t, n, o, r, a) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["card-component", [n.classes ? n.classes : "card"]])
  }, [
    renderSlot(e.$slots, "default")
  ], 2);
}
var _l = Ft(Il, [["render", Dl]]);
var Ll = { class: "card" };
var Fl = { class: "pt-3 bg-surface" };
var Bl = {
  __name: "TabCardComponent",
  props: {
    currentTabIndex: {
      type: Number,
      default: 0
    },
    tabs: {
      type: Array,
      default: () => []
    },
    keepAlive: {
      type: Boolean,
      default: false
    }
  },
  setup(e) {
    const t = e, n = computed(() => t.tabs[a.value].component), o = computed(() => t.tabs[a.value].props), r = computed(() => t.tabs[a.value].events || {}), a = ref(t.currentTabIndex), s = (i) => {
      a.value = i;
    };
    return (i, l) => (openBlock(), createElementBlock("div", Ll, [
      createBaseVNode("div", Fl, [
        createVNode(aa, {
          "onUpdate:currentTabIndex": s,
          tabs: e.tabs
        }, null, 8, ["tabs"])
      ]),
      e.keepAlive ? (openBlock(), createBlock(KeepAlive, { key: 0 }, [
        (openBlock(), createBlock(resolveDynamicComponent(n.value), mergeProps(o.value, toHandlers(r.value)), null, 16))
      ], 1024)) : (openBlock(), createBlock(resolveDynamicComponent(n.value), mergeProps({ key: 1 }, o.value, toHandlers(r.value)), null, 16))
    ]));
  }
};
var Rl = { class: "collapse-inner transition-opacity duration-300 ease" };
var ia = {
  __name: "Collapse",
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  setup(e) {
    const t = ref(null);
    function n(l) {
      l.style.height = "0";
    }
    function o(l) {
      l.style.transition = "height 0.3s ease", l.style.height = l.scrollHeight + "px";
      const c = l.querySelector(".collapse-inner");
      c.style.opacity = "0", requestAnimationFrame(() => {
        c.style.transition = "opacity 0.3s ease", c.style.opacity = "1";
      });
    }
    function r(l) {
      l.style.height = "auto", l.style.transition = "";
    }
    function a(l) {
      l.style.height = l.scrollHeight + "px";
      const c = l.querySelector(".collapse-inner");
      c.style.transition = "opacity 0.3s ease", c.style.opacity = "1";
    }
    function s(l) {
      l.style.transition = "height 0.3s ease", l.style.height = "0";
      const c = l.querySelector(".collapse-inner");
      c.style.opacity = "0";
    }
    function i(l) {
      l.style.transition = "";
    }
    return (l, c) => (openBlock(), createBlock(Transition, {
      onBeforeEnter: n,
      onEnter: o,
      onAfterEnter: r,
      onBeforeLeave: a,
      onLeave: s,
      onAfterLeave: i
    }, {
      default: withCtx(() => [
        withDirectives(createBaseVNode("div", {
          ref_key: "container",
          ref: t,
          class: "overflow-hidden"
        }, [
          createBaseVNode("div", Rl, [
            renderSlot(l.$slots, "default")
          ])
        ], 512), [
          [vShow, e.show]
        ])
      ]),
      _: 3
    }));
  }
};
var So = {
  __name: "Heading",
  props: {
    tag: {
      type: String,
      default: "",
      validator: (e) => ["h1", "h2", "h3", "h4", "h5", "h6"].includes(e)
    }
  },
  setup(e) {
    const t = e, n = {
      h1: "header-1",
      h2: "header-2",
      h3: "header-3",
      h4: "header-4",
      h5: "header-5",
      h6: "header-6",
      default: ""
    }, o = computed(() => n[t.tag] || n.default);
    return (r, a) => (openBlock(), createBlock(resolveDynamicComponent(e.tag), {
      class: normalizeClass([o.value, r.$attrs.class])
    }, {
      default: withCtx(() => [
        renderSlot(r.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
};
var Ml = defineComponent({
  __name: "PageTitle",
  setup(e) {
    return (t, n) => (openBlock(), createBlock(So, mergeProps({
      tag: "h1",
      class: "text-default"
    }, t.$attrs), {
      default: withCtx(() => [
        renderSlot(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
});
var Nl = { class: "card" };
var Vl = ["onKeydown"];
var zl = { class: "flex flex-row group-hover/header:text-primary-hover color-transition py-2 px-2" };
var jl = {
  __name: "CollapsibleCard",
  props: {
    heading: {
      type: String,
      default: ""
    },
    horizontalRule: {
      type: Boolean,
      default: true
    },
    showToggleIcon: {
      type: Boolean,
      default: false
    }
  },
  setup(e) {
    const t = ref(false), n = () => t.value = !t.value;
    return (o, r) => (openBlock(), createElementBlock("div", Nl, [
      createBaseVNode("div", {
        class: normalizeClass(["flex group/header justify-between items-center cursor-pointer focus-visible:ring focus-visible:ring-primary/30 focus-visible:rounded-sm focus-visible:outline-none", [t.value && e.horizontalRule ? "border-b border-border" : ""]]),
        tabindex: "0",
        onClick: n,
        onKeydown: [
          withKeys(withModifiers(n, ["prevent"]), ["enter"]),
          withKeys(withModifiers(n, ["prevent"]), ["space"])
        ]
      }, [
        createBaseVNode("div", zl, [
          renderSlot(o.$slots, "header", {}, () => [
            createVNode(unref(So), { tag: "h2" }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(e.heading), 1)
              ]),
              _: 1
            })
          ])
        ]),
        e.showToggleIcon ? renderSlot(o.$slots, "toggle-icon", { key: 0 }, () => [
          createBaseVNode("span", {
            class: normalizeClass(["pt-2 px-8 header-2 flex", [t.value ? "i-custom-chevron-up" : "i-custom-chevron-down"]])
          }, null, 2)
        ]) : createCommentVNode("", true)
      ], 42, Vl),
      createVNode(ia, { show: t.value }, {
        default: withCtx(() => [
          createBaseVNode("div", null, [
            renderSlot(o.$slots, "default")
          ])
        ]),
        _: 3
      }, 8, ["show"])
    ]));
  }
};
var Wl = {
  name: "loading-overlay",
  props: {
    show: {
      type: Boolean,
      required: true
    }
  }
};
function Hl(e, t, n, o, r, a) {
  const s = resolveDirective("busy");
  return withDirectives((openBlock(), createElementBlock("div", null, [
    renderSlot(e.$slots, "default")
  ])), [
    [s, n.show]
  ]);
}
var Kl = Ft(Wl, [["render", Hl]]);
var ql = ["top", "right", "bottom", "left"];
var st = Math.min;
var Se = Math.max;
var hn = Math.round;
var sn = Math.floor;
var Ve = (e) => ({
  x: e,
  y: e
});
var Ul = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
var Gl = {
  start: "end",
  end: "start"
};
function to(e, t, n) {
  return Se(e, st(t, n));
}
function Xe(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function Je(e) {
  return e.split("-")[0];
}
function Bt(e) {
  return e.split("-")[1];
}
function Eo(e) {
  return e === "x" ? "y" : "x";
}
function Oo(e) {
  return e === "y" ? "height" : "width";
}
function Me(e) {
  return ["top", "bottom"].includes(Je(e)) ? "y" : "x";
}
function Po(e) {
  return Eo(Me(e));
}
function Yl(e, t, n) {
  n === void 0 && (n = false);
  const o = Bt(e), r = Po(e), a = Oo(r);
  let s = r === "x" ? o === (n ? "end" : "start") ? "right" : "left" : o === "start" ? "bottom" : "top";
  return t.reference[a] > t.floating[a] && (s = gn(s)), [s, gn(s)];
}
function Xl(e) {
  const t = gn(e);
  return [no(e), t, no(t)];
}
function no(e) {
  return e.replace(/start|end/g, (t) => Gl[t]);
}
function Jl(e, t, n) {
  const o = ["left", "right"], r = ["right", "left"], a = ["top", "bottom"], s = ["bottom", "top"];
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? r : o : t ? o : r;
    case "left":
    case "right":
      return t ? a : s;
    default:
      return [];
  }
}
function Zl(e, t, n, o) {
  const r = Bt(e);
  let a = Jl(Je(e), n === "start", o);
  return r && (a = a.map((s) => s + "-" + r), t && (a = a.concat(a.map(no)))), a;
}
function gn(e) {
  return e.replace(/left|right|bottom|top/g, (t) => Ul[t]);
}
function Ql(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function sa(e) {
  return typeof e != "number" ? Ql(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function yn(e) {
  const {
    x: t,
    y: n,
    width: o,
    height: r
  } = e;
  return {
    width: o,
    height: r,
    top: n,
    left: t,
    right: t + o,
    bottom: n + r,
    x: t,
    y: n
  };
}
function rr(e, t, n) {
  let {
    reference: o,
    floating: r
  } = e;
  const a = Me(t), s = Po(t), i = Oo(s), l = Je(t), c = a === "y", u = o.x + o.width / 2 - r.width / 2, d = o.y + o.height / 2 - r.height / 2, p = o[i] / 2 - r[i] / 2;
  let f;
  switch (l) {
    case "top":
      f = {
        x: u,
        y: o.y - r.height
      };
      break;
    case "bottom":
      f = {
        x: u,
        y: o.y + o.height
      };
      break;
    case "right":
      f = {
        x: o.x + o.width,
        y: d
      };
      break;
    case "left":
      f = {
        x: o.x - r.width,
        y: d
      };
      break;
    default:
      f = {
        x: o.x,
        y: o.y
      };
  }
  switch (Bt(t)) {
    case "start":
      f[s] -= p * (n && c ? -1 : 1);
      break;
    case "end":
      f[s] += p * (n && c ? -1 : 1);
      break;
  }
  return f;
}
var eu = async (e, t, n) => {
  const {
    placement: o = "bottom",
    strategy: r = "absolute",
    middleware: a = [],
    platform: s
  } = n, i = a.filter(Boolean), l = await (s.isRTL == null ? void 0 : s.isRTL(t));
  let c = await s.getElementRects({
    reference: e,
    floating: t,
    strategy: r
  }), {
    x: u,
    y: d
  } = rr(c, o, l), p = o, f = {}, v = 0;
  for (let h2 = 0; h2 < i.length; h2++) {
    const {
      name: g,
      fn: x
    } = i[h2], {
      x: y,
      y: b,
      data: w,
      reset: C
    } = await x({
      x: u,
      y: d,
      initialPlacement: o,
      placement: p,
      strategy: r,
      middlewareData: f,
      rects: c,
      platform: s,
      elements: {
        reference: e,
        floating: t
      }
    });
    u = y ?? u, d = b ?? d, f = {
      ...f,
      [g]: {
        ...f[g],
        ...w
      }
    }, C && v <= 50 && (v++, typeof C == "object" && (C.placement && (p = C.placement), C.rects && (c = C.rects === true ? await s.getElementRects({
      reference: e,
      floating: t,
      strategy: r
    }) : C.rects), {
      x: u,
      y: d
    } = rr(c, p, l)), h2 = -1);
  }
  return {
    x: u,
    y: d,
    placement: p,
    strategy: r,
    middlewareData: f
  };
};
async function Ut(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: o,
    y: r,
    platform: a,
    rects: s,
    elements: i,
    strategy: l
  } = e, {
    boundary: c = "clippingAncestors",
    rootBoundary: u = "viewport",
    elementContext: d = "floating",
    altBoundary: p = false,
    padding: f = 0
  } = Xe(t, e), v = sa(f), g = i[p ? d === "floating" ? "reference" : "floating" : d], x = yn(await a.getClippingRect({
    element: (n = await (a.isElement == null ? void 0 : a.isElement(g))) == null || n ? g : g.contextElement || await (a.getDocumentElement == null ? void 0 : a.getDocumentElement(i.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), y = d === "floating" ? {
    x: o,
    y: r,
    width: s.floating.width,
    height: s.floating.height
  } : s.reference, b = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(i.floating)), w = await (a.isElement == null ? void 0 : a.isElement(b)) ? await (a.getScale == null ? void 0 : a.getScale(b)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, C = yn(a.convertOffsetParentRelativeRectToViewportRelativeRect ? await a.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: i,
    rect: y,
    offsetParent: b,
    strategy: l
  }) : y);
  return {
    top: (x.top - C.top + v.top) / w.y,
    bottom: (C.bottom - x.bottom + v.bottom) / w.y,
    left: (x.left - C.left + v.left) / w.x,
    right: (C.right - x.right + v.right) / w.x
  };
}
var tu = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: n,
      y: o,
      placement: r,
      rects: a,
      platform: s,
      elements: i,
      middlewareData: l
    } = t, {
      element: c,
      padding: u = 0
    } = Xe(e, t) || {};
    if (c == null)
      return {};
    const d = sa(u), p = {
      x: n,
      y: o
    }, f = Po(r), v = Oo(f), h2 = await s.getDimensions(c), g = f === "y", x = g ? "top" : "left", y = g ? "bottom" : "right", b = g ? "clientHeight" : "clientWidth", w = a.reference[v] + a.reference[f] - p[f] - a.floating[v], C = p[f] - a.reference[f], E = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(c));
    let O = E ? E[b] : 0;
    (!O || !await (s.isElement == null ? void 0 : s.isElement(E))) && (O = i.floating[b] || a.floating[v]);
    const _ = w / 2 - C / 2, T = O / 2 - h2[v] / 2 - 1, z = st(d[x], T), M = st(d[y], T), Z = z, G = O - h2[v] - M, J = O / 2 - h2[v] / 2 + _, N = to(Z, J, G), U = !l.arrow && Bt(r) != null && J !== N && a.reference[v] / 2 - (J < Z ? z : M) - h2[v] / 2 < 0, L = U ? J < Z ? J - Z : J - G : 0;
    return {
      [f]: p[f] + L,
      data: {
        [f]: N,
        centerOffset: J - N - L,
        ...U && {
          alignmentOffset: L
        }
      },
      reset: U
    };
  }
});
var nu = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var n, o;
      const {
        placement: r,
        middlewareData: a,
        rects: s,
        initialPlacement: i,
        platform: l,
        elements: c
      } = t, {
        mainAxis: u = true,
        crossAxis: d = true,
        fallbackPlacements: p,
        fallbackStrategy: f = "bestFit",
        fallbackAxisSideDirection: v = "none",
        flipAlignment: h2 = true,
        ...g
      } = Xe(e, t);
      if ((n = a.arrow) != null && n.alignmentOffset)
        return {};
      const x = Je(r), y = Me(i), b = Je(i) === i, w = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), C = p || (b || !h2 ? [gn(i)] : Xl(i)), E = v !== "none";
      !p && E && C.push(...Zl(i, h2, v, w));
      const O = [i, ...C], _ = await Ut(t, g), T = [];
      let z = ((o = a.flip) == null ? void 0 : o.overflows) || [];
      if (u && T.push(_[x]), d) {
        const J = Yl(r, s, w);
        T.push(_[J[0]], _[J[1]]);
      }
      if (z = [...z, {
        placement: r,
        overflows: T
      }], !T.every((J) => J <= 0)) {
        var M, Z;
        const J = (((M = a.flip) == null ? void 0 : M.index) || 0) + 1, N = O[J];
        if (N && (!(d === "alignment" ? y !== Me(N) : false) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        z.every((D) => D.overflows[0] > 0 && Me(D.placement) === y)))
          return {
            data: {
              index: J,
              overflows: z
            },
            reset: {
              placement: N
            }
          };
        let U = (Z = z.filter((L) => L.overflows[0] <= 0).sort((L, D) => L.overflows[1] - D.overflows[1])[0]) == null ? void 0 : Z.placement;
        if (!U)
          switch (f) {
            case "bestFit": {
              var G;
              const L = (G = z.filter((D) => {
                if (E) {
                  const j = Me(D.placement);
                  return j === y || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  j === "y";
                }
                return true;
              }).map((D) => [D.placement, D.overflows.filter((j) => j > 0).reduce((j, Y) => j + Y, 0)]).sort((D, j) => D[1] - j[1])[0]) == null ? void 0 : G[0];
              L && (U = L);
              break;
            }
            case "initialPlacement":
              U = i;
              break;
          }
        if (r !== U)
          return {
            reset: {
              placement: U
            }
          };
      }
      return {};
    }
  };
};
function ar(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function ir(e) {
  return ql.some((t) => e[t] >= 0);
}
var ou = function(e) {
  return e === void 0 && (e = {}), {
    name: "hide",
    options: e,
    async fn(t) {
      const {
        rects: n
      } = t, {
        strategy: o = "referenceHidden",
        ...r
      } = Xe(e, t);
      switch (o) {
        case "referenceHidden": {
          const a = await Ut(t, {
            ...r,
            elementContext: "reference"
          }), s = ar(a, n.reference);
          return {
            data: {
              referenceHiddenOffsets: s,
              referenceHidden: ir(s)
            }
          };
        }
        case "escaped": {
          const a = await Ut(t, {
            ...r,
            altBoundary: true
          }), s = ar(a, n.floating);
          return {
            data: {
              escapedOffsets: s,
              escaped: ir(s)
            }
          };
        }
        default:
          return {};
      }
    }
  };
};
async function ru(e, t) {
  const {
    placement: n,
    platform: o,
    elements: r
  } = e, a = await (o.isRTL == null ? void 0 : o.isRTL(r.floating)), s = Je(n), i = Bt(n), l = Me(n) === "y", c = ["left", "top"].includes(s) ? -1 : 1, u = a && l ? -1 : 1, d = Xe(t, e);
  let {
    mainAxis: p,
    crossAxis: f,
    alignmentAxis: v
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return i && typeof v == "number" && (f = i === "end" ? v * -1 : v), l ? {
    x: f * u,
    y: p * c
  } : {
    x: p * c,
    y: f * u
  };
}
var au = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var n, o;
      const {
        x: r,
        y: a,
        placement: s,
        middlewareData: i
      } = t, l = await ru(t, e);
      return s === ((n = i.offset) == null ? void 0 : n.placement) && (o = i.arrow) != null && o.alignmentOffset ? {} : {
        x: r + l.x,
        y: a + l.y,
        data: {
          ...l,
          placement: s
        }
      };
    }
  };
};
var iu = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: o,
        placement: r
      } = t, {
        mainAxis: a = true,
        crossAxis: s = false,
        limiter: i = {
          fn: (g) => {
            let {
              x,
              y
            } = g;
            return {
              x,
              y
            };
          }
        },
        ...l
      } = Xe(e, t), c = {
        x: n,
        y: o
      }, u = await Ut(t, l), d = Me(Je(r)), p = Eo(d);
      let f = c[p], v = c[d];
      if (a) {
        const g = p === "y" ? "top" : "left", x = p === "y" ? "bottom" : "right", y = f + u[g], b = f - u[x];
        f = to(y, f, b);
      }
      if (s) {
        const g = d === "y" ? "top" : "left", x = d === "y" ? "bottom" : "right", y = v + u[g], b = v - u[x];
        v = to(y, v, b);
      }
      const h2 = i.fn({
        ...t,
        [p]: f,
        [d]: v
      });
      return {
        ...h2,
        data: {
          x: h2.x - n,
          y: h2.y - o,
          enabled: {
            [p]: a,
            [d]: s
          }
        }
      };
    }
  };
};
var su = function(e) {
  return e === void 0 && (e = {}), {
    options: e,
    fn(t) {
      const {
        x: n,
        y: o,
        placement: r,
        rects: a,
        middlewareData: s
      } = t, {
        offset: i = 0,
        mainAxis: l = true,
        crossAxis: c = true
      } = Xe(e, t), u = {
        x: n,
        y: o
      }, d = Me(r), p = Eo(d);
      let f = u[p], v = u[d];
      const h2 = Xe(i, t), g = typeof h2 == "number" ? {
        mainAxis: h2,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...h2
      };
      if (l) {
        const b = p === "y" ? "height" : "width", w = a.reference[p] - a.floating[b] + g.mainAxis, C = a.reference[p] + a.reference[b] - g.mainAxis;
        f < w ? f = w : f > C && (f = C);
      }
      if (c) {
        var x, y;
        const b = p === "y" ? "width" : "height", w = ["top", "left"].includes(Je(r)), C = a.reference[d] - a.floating[b] + (w && ((x = s.offset) == null ? void 0 : x[d]) || 0) + (w ? 0 : g.crossAxis), E = a.reference[d] + a.reference[b] + (w ? 0 : ((y = s.offset) == null ? void 0 : y[d]) || 0) - (w ? g.crossAxis : 0);
        v < C ? v = C : v > E && (v = E);
      }
      return {
        [p]: f,
        [d]: v
      };
    }
  };
};
var lu = function(e) {
  return e === void 0 && (e = {}), {
    name: "size",
    options: e,
    async fn(t) {
      var n, o;
      const {
        placement: r,
        rects: a,
        platform: s,
        elements: i
      } = t, {
        apply: l = () => {
        },
        ...c
      } = Xe(e, t), u = await Ut(t, c), d = Je(r), p = Bt(r), f = Me(r) === "y", {
        width: v,
        height: h2
      } = a.floating;
      let g, x;
      d === "top" || d === "bottom" ? (g = d, x = p === (await (s.isRTL == null ? void 0 : s.isRTL(i.floating)) ? "start" : "end") ? "left" : "right") : (x = d, g = p === "end" ? "top" : "bottom");
      const y = h2 - u.top - u.bottom, b = v - u.left - u.right, w = st(h2 - u[g], y), C = st(v - u[x], b), E = !t.middlewareData.shift;
      let O = w, _ = C;
      if ((n = t.middlewareData.shift) != null && n.enabled.x && (_ = b), (o = t.middlewareData.shift) != null && o.enabled.y && (O = y), E && !p) {
        const z = Se(u.left, 0), M = Se(u.right, 0), Z = Se(u.top, 0), G = Se(u.bottom, 0);
        f ? _ = v - 2 * (z !== 0 || M !== 0 ? z + M : Se(u.left, u.right)) : O = h2 - 2 * (Z !== 0 || G !== 0 ? Z + G : Se(u.top, u.bottom));
      }
      await l({
        ...t,
        availableWidth: _,
        availableHeight: O
      });
      const T = await s.getDimensions(i.floating);
      return v !== T.width || h2 !== T.height ? {
        reset: {
          rects: true
        }
      } : {};
    }
  };
};
function kn() {
  return typeof window < "u";
}
function gt(e) {
  return Ao(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Ee(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function We(e) {
  var t;
  return (t = (Ao(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Ao(e) {
  return kn() ? e instanceof Node || e instanceof Ee(e).Node : false;
}
function Le(e) {
  return kn() ? e instanceof Element || e instanceof Ee(e).Element : false;
}
function je(e) {
  return kn() ? e instanceof HTMLElement || e instanceof Ee(e).HTMLElement : false;
}
function sr(e) {
  return !kn() || typeof ShadowRoot > "u" ? false : e instanceof ShadowRoot || e instanceof Ee(e).ShadowRoot;
}
function Qt(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: o,
    display: r
  } = Fe(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + o + n) && !["inline", "contents"].includes(r);
}
function uu(e) {
  return ["table", "td", "th"].includes(gt(e));
}
function Tn(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return false;
    }
  });
}
function $o(e) {
  const t = ko(), n = Le(e) ? Fe(e) : e;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((o) => n[o] ? n[o] !== "none" : false) || (n.containerType ? n.containerType !== "normal" : false) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : false) || !t && (n.filter ? n.filter !== "none" : false) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((o) => (n.willChange || "").includes(o)) || ["paint", "layout", "strict", "content"].some((o) => (n.contain || "").includes(o));
}
function cu(e) {
  let t = lt(e);
  for (; je(t) && !It(t); ) {
    if ($o(t))
      return t;
    if (Tn(t))
      return null;
    t = lt(t);
  }
  return null;
}
function ko() {
  return typeof CSS > "u" || !CSS.supports ? false : CSS.supports("-webkit-backdrop-filter", "none");
}
function It(e) {
  return ["html", "body", "#document"].includes(gt(e));
}
function Fe(e) {
  return Ee(e).getComputedStyle(e);
}
function In(e) {
  return Le(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function lt(e) {
  if (gt(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    sr(e) && e.host || // Fallback.
    We(e)
  );
  return sr(t) ? t.host : t;
}
function la(e) {
  const t = lt(e);
  return It(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : je(t) && Qt(t) ? t : la(t);
}
function Gt(e, t, n) {
  var o;
  t === void 0 && (t = []), n === void 0 && (n = true);
  const r = la(e), a = r === ((o = e.ownerDocument) == null ? void 0 : o.body), s = Ee(r);
  if (a) {
    const i = oo(s);
    return t.concat(s, s.visualViewport || [], Qt(r) ? r : [], i && n ? Gt(i) : []);
  }
  return t.concat(r, Gt(r, [], n));
}
function oo(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function ua(e) {
  const t = Fe(e);
  let n = parseFloat(t.width) || 0, o = parseFloat(t.height) || 0;
  const r = je(e), a = r ? e.offsetWidth : n, s = r ? e.offsetHeight : o, i = hn(n) !== a || hn(o) !== s;
  return i && (n = a, o = s), {
    width: n,
    height: o,
    $: i
  };
}
function To(e) {
  return Le(e) ? e : e.contextElement;
}
function Pt(e) {
  const t = To(e);
  if (!je(t))
    return Ve(1);
  const n = t.getBoundingClientRect(), {
    width: o,
    height: r,
    $: a
  } = ua(t);
  let s = (a ? hn(n.width) : n.width) / o, i = (a ? hn(n.height) : n.height) / r;
  return (!s || !Number.isFinite(s)) && (s = 1), (!i || !Number.isFinite(i)) && (i = 1), {
    x: s,
    y: i
  };
}
var du = Ve(0);
function ca(e) {
  const t = Ee(e);
  return !ko() || !t.visualViewport ? du : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function fu(e, t, n) {
  return t === void 0 && (t = false), !n || t && n !== Ee(e) ? false : t;
}
function ht(e, t, n, o) {
  t === void 0 && (t = false), n === void 0 && (n = false);
  const r = e.getBoundingClientRect(), a = To(e);
  let s = Ve(1);
  t && (o ? Le(o) && (s = Pt(o)) : s = Pt(e));
  const i = fu(a, n, o) ? ca(a) : Ve(0);
  let l = (r.left + i.x) / s.x, c = (r.top + i.y) / s.y, u = r.width / s.x, d = r.height / s.y;
  if (a) {
    const p = Ee(a), f = o && Le(o) ? Ee(o) : o;
    let v = p, h2 = oo(v);
    for (; h2 && o && f !== v; ) {
      const g = Pt(h2), x = h2.getBoundingClientRect(), y = Fe(h2), b = x.left + (h2.clientLeft + parseFloat(y.paddingLeft)) * g.x, w = x.top + (h2.clientTop + parseFloat(y.paddingTop)) * g.y;
      l *= g.x, c *= g.y, u *= g.x, d *= g.y, l += b, c += w, v = Ee(h2), h2 = oo(v);
    }
  }
  return yn({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Io(e, t) {
  const n = In(e).scrollLeft;
  return t ? t.left + n : ht(We(e)).left + n;
}
function da(e, t, n) {
  n === void 0 && (n = false);
  const o = e.getBoundingClientRect(), r = o.left + t.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    Io(e, o)
  )), a = o.top + t.scrollTop;
  return {
    x: r,
    y: a
  };
}
function pu(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: o,
    strategy: r
  } = e;
  const a = r === "fixed", s = We(o), i = t ? Tn(t.floating) : false;
  if (o === s || i && a)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Ve(1);
  const u = Ve(0), d = je(o);
  if ((d || !d && !a) && ((gt(o) !== "body" || Qt(s)) && (l = In(o)), je(o))) {
    const f = ht(o);
    c = Pt(o), u.x = f.x + o.clientLeft, u.y = f.y + o.clientTop;
  }
  const p = s && !d && !a ? da(s, l, true) : Ve(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + p.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + p.y
  };
}
function mu(e) {
  return Array.from(e.getClientRects());
}
function vu(e) {
  const t = We(e), n = In(e), o = e.ownerDocument.body, r = Se(t.scrollWidth, t.clientWidth, o.scrollWidth, o.clientWidth), a = Se(t.scrollHeight, t.clientHeight, o.scrollHeight, o.clientHeight);
  let s = -n.scrollLeft + Io(e);
  const i = -n.scrollTop;
  return Fe(o).direction === "rtl" && (s += Se(t.clientWidth, o.clientWidth) - r), {
    width: r,
    height: a,
    x: s,
    y: i
  };
}
function hu(e, t) {
  const n = Ee(e), o = We(e), r = n.visualViewport;
  let a = o.clientWidth, s = o.clientHeight, i = 0, l = 0;
  if (r) {
    a = r.width, s = r.height;
    const c = ko();
    (!c || c && t === "fixed") && (i = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: a,
    height: s,
    x: i,
    y: l
  };
}
function gu(e, t) {
  const n = ht(e, true, t === "fixed"), o = n.top + e.clientTop, r = n.left + e.clientLeft, a = je(e) ? Pt(e) : Ve(1), s = e.clientWidth * a.x, i = e.clientHeight * a.y, l = r * a.x, c = o * a.y;
  return {
    width: s,
    height: i,
    x: l,
    y: c
  };
}
function lr(e, t, n) {
  let o;
  if (t === "viewport")
    o = hu(e, n);
  else if (t === "document")
    o = vu(We(e));
  else if (Le(t))
    o = gu(t, n);
  else {
    const r = ca(e);
    o = {
      x: t.x - r.x,
      y: t.y - r.y,
      width: t.width,
      height: t.height
    };
  }
  return yn(o);
}
function fa(e, t) {
  const n = lt(e);
  return n === t || !Le(n) || It(n) ? false : Fe(n).position === "fixed" || fa(n, t);
}
function yu(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let o = Gt(e, [], false).filter((i) => Le(i) && gt(i) !== "body"), r = null;
  const a = Fe(e).position === "fixed";
  let s = a ? lt(e) : e;
  for (; Le(s) && !It(s); ) {
    const i = Fe(s), l = $o(s);
    !l && i.position === "fixed" && (r = null), (a ? !l && !r : !l && i.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || Qt(s) && !l && fa(e, s)) ? o = o.filter((u) => u !== s) : r = i, s = lt(s);
  }
  return t.set(e, o), o;
}
function bu(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: o,
    strategy: r
  } = e;
  const s = [...n === "clippingAncestors" ? Tn(t) ? [] : yu(t, this._c) : [].concat(n), o], i = s[0], l = s.reduce((c, u) => {
    const d = lr(t, u, r);
    return c.top = Se(d.top, c.top), c.right = st(d.right, c.right), c.bottom = st(d.bottom, c.bottom), c.left = Se(d.left, c.left), c;
  }, lr(t, i, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function wu(e) {
  const {
    width: t,
    height: n
  } = ua(e);
  return {
    width: t,
    height: n
  };
}
function xu(e, t, n) {
  const o = je(t), r = We(t), a = n === "fixed", s = ht(e, true, a, t);
  let i = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Ve(0);
  function c() {
    l.x = Io(r);
  }
  if (o || !o && !a)
    if ((gt(t) !== "body" || Qt(r)) && (i = In(t)), o) {
      const f = ht(t, true, a, t);
      l.x = f.x + t.clientLeft, l.y = f.y + t.clientTop;
    } else r && c();
  a && !o && r && c();
  const u = r && !o && !a ? da(r, i) : Ve(0), d = s.left + i.scrollLeft - l.x - u.x, p = s.top + i.scrollTop - l.y - u.y;
  return {
    x: d,
    y: p,
    width: s.width,
    height: s.height
  };
}
function jn(e) {
  return Fe(e).position === "static";
}
function ur(e, t) {
  if (!je(e) || Fe(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return We(e) === n && (n = n.ownerDocument.body), n;
}
function pa(e, t) {
  const n = Ee(e);
  if (Tn(e))
    return n;
  if (!je(e)) {
    let r = lt(e);
    for (; r && !It(r); ) {
      if (Le(r) && !jn(r))
        return r;
      r = lt(r);
    }
    return n;
  }
  let o = ur(e, t);
  for (; o && uu(o) && jn(o); )
    o = ur(o, t);
  return o && It(o) && jn(o) && !$o(o) ? n : o || cu(e) || n;
}
var Cu = async function(e) {
  const t = this.getOffsetParent || pa, n = this.getDimensions, o = await n(e.floating);
  return {
    reference: xu(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: o.width,
      height: o.height
    }
  };
};
function Su(e) {
  return Fe(e).direction === "rtl";
}
var Eu = {
  convertOffsetParentRelativeRectToViewportRelativeRect: pu,
  getDocumentElement: We,
  getClippingRect: bu,
  getOffsetParent: pa,
  getElementRects: Cu,
  getClientRects: mu,
  getDimensions: wu,
  getScale: Pt,
  isElement: Le,
  isRTL: Su
};
function ma(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Ou(e, t) {
  let n = null, o;
  const r = We(e);
  function a() {
    var i;
    clearTimeout(o), (i = n) == null || i.disconnect(), n = null;
  }
  function s(i, l) {
    i === void 0 && (i = false), l === void 0 && (l = 1), a();
    const c = e.getBoundingClientRect(), {
      left: u,
      top: d,
      width: p,
      height: f
    } = c;
    if (i || t(), !p || !f)
      return;
    const v = sn(d), h2 = sn(r.clientWidth - (u + p)), g = sn(r.clientHeight - (d + f)), x = sn(u), b = {
      rootMargin: -v + "px " + -h2 + "px " + -g + "px " + -x + "px",
      threshold: Se(0, st(1, l)) || 1
    };
    let w = true;
    function C(E) {
      const O = E[0].intersectionRatio;
      if (O !== l) {
        if (!w)
          return s();
        O ? s(false, O) : o = setTimeout(() => {
          s(false, 1e-7);
        }, 1e3);
      }
      O === 1 && !ma(c, e.getBoundingClientRect()) && s(), w = false;
    }
    try {
      n = new IntersectionObserver(C, {
        ...b,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(C, b);
    }
    n.observe(e);
  }
  return s(true), a;
}
function Pu(e, t, n, o) {
  o === void 0 && (o = {});
  const {
    ancestorScroll: r = true,
    ancestorResize: a = true,
    elementResize: s = typeof ResizeObserver == "function",
    layoutShift: i = typeof IntersectionObserver == "function",
    animationFrame: l = false
  } = o, c = To(e), u = r || a ? [...c ? Gt(c) : [], ...Gt(t)] : [];
  u.forEach((x) => {
    r && x.addEventListener("scroll", n, {
      passive: true
    }), a && x.addEventListener("resize", n);
  });
  const d = c && i ? Ou(c, n) : null;
  let p = -1, f = null;
  s && (f = new ResizeObserver((x) => {
    let [y] = x;
    y && y.target === c && f && (f.unobserve(t), cancelAnimationFrame(p), p = requestAnimationFrame(() => {
      var b;
      (b = f) == null || b.observe(t);
    })), n();
  }), c && !l && f.observe(c), f.observe(t));
  let v, h2 = l ? ht(e) : null;
  l && g();
  function g() {
    const x = ht(e);
    h2 && !ma(h2, x) && n(), h2 = x, v = requestAnimationFrame(g);
  }
  return n(), () => {
    var x;
    u.forEach((y) => {
      r && y.removeEventListener("scroll", n), a && y.removeEventListener("resize", n);
    }), d == null || d(), (x = f) == null || x.disconnect(), f = null, l && cancelAnimationFrame(v);
  };
}
var Au = au;
var $u = iu;
var cr = nu;
var ku = lu;
var Tu = ou;
var Iu = tu;
var Du = su;
var _u = (e, t, n) => {
  const o = /* @__PURE__ */ new Map(), r = {
    platform: Eu,
    ...n
  }, a = {
    ...r.platform,
    _c: o
  };
  return eu(e, t, {
    ...r,
    platform: a
  });
};
function Lu(e) {
  return e != null && typeof e == "object" && "$el" in e;
}
function ro(e) {
  if (Lu(e)) {
    const t = e.$el;
    return Ao(t) && gt(t) === "#comment" ? null : t;
  }
  return e;
}
function Et(e) {
  return typeof e == "function" ? e() : unref(e);
}
function Fu(e) {
  return {
    name: "arrow",
    options: e,
    fn(t) {
      const n = ro(Et(e.element));
      return n == null ? {} : Iu({
        element: n,
        padding: e.padding
      }).fn(t);
    }
  };
}
function va(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function dr(e, t) {
  const n = va(e);
  return Math.round(t * n) / n;
}
function Bu(e, t, n) {
  n === void 0 && (n = {});
  const o = n.whileElementsMounted, r = computed(() => {
    var O;
    return (O = Et(n.open)) != null ? O : true;
  }), a = computed(() => Et(n.middleware)), s = computed(() => {
    var O;
    return (O = Et(n.placement)) != null ? O : "bottom";
  }), i = computed(() => {
    var O;
    return (O = Et(n.strategy)) != null ? O : "absolute";
  }), l = computed(() => {
    var O;
    return (O = Et(n.transform)) != null ? O : true;
  }), c = computed(() => ro(e.value)), u = computed(() => ro(t.value)), d = ref(0), p = ref(0), f = ref(i.value), v = ref(s.value), h2 = shallowRef({}), g = ref(false), x = computed(() => {
    const O = {
      position: f.value,
      left: "0",
      top: "0"
    };
    if (!u.value)
      return O;
    const _ = dr(u.value, d.value), T = dr(u.value, p.value);
    return l.value ? {
      ...O,
      transform: "translate(" + _ + "px, " + T + "px)",
      ...va(u.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: f.value,
      left: _ + "px",
      top: T + "px"
    };
  });
  let y;
  function b() {
    if (c.value == null || u.value == null)
      return;
    const O = r.value;
    _u(c.value, u.value, {
      middleware: a.value,
      placement: s.value,
      strategy: i.value
    }).then((_) => {
      d.value = _.x, p.value = _.y, f.value = _.strategy, v.value = _.placement, h2.value = _.middlewareData, g.value = O !== false;
    });
  }
  function w() {
    typeof y == "function" && (y(), y = void 0);
  }
  function C() {
    if (w(), o === void 0) {
      b();
      return;
    }
    if (c.value != null && u.value != null) {
      y = o(c.value, u.value, b);
      return;
    }
  }
  function E() {
    r.value || (g.value = false);
  }
  return watch([a, s, i, r], b, {
    flush: "sync"
  }), watch([c, u], C, {
    flush: "sync"
  }), watch(r, E, {
    flush: "sync"
  }), getCurrentScope() && onScopeDispose(w), {
    x: shallowReadonly(d),
    y: shallowReadonly(p),
    strategy: shallowReadonly(f),
    placement: shallowReadonly(v),
    middlewareData: shallowReadonly(h2),
    isPositioned: shallowReadonly(g),
    floatingStyles: x,
    update: b
  };
}
function Do(e) {
  return e ? e.flatMap((t) => t.type === Fragment ? Do(t.children) : [t]) : [];
}
var ao = defineComponent({
  name: "PrimitiveSlot",
  inheritAttrs: false,
  setup(e, { attrs: t, slots: n }) {
    return () => {
      var l;
      if (!n.default)
        return null;
      const o = Do(n.default()), r = o.findIndex((c) => c.type !== Comment);
      if (r === -1)
        return o;
      const a = o[r];
      (l = a.props) == null || delete l.ref;
      const s = a.props ? mergeProps(t, a.props) : t, i = cloneVNode({ ...a, props: {} }, s);
      return o.length === 1 ? i : (o[r] = i, o);
    };
  }
});
var Ru = ["area", "img", "input"];
var re = defineComponent({
  name: "Primitive",
  inheritAttrs: false,
  props: {
    asChild: {
      type: Boolean,
      default: false
    },
    as: {
      type: [String, Object],
      default: "div"
    }
  },
  setup(e, { attrs: t, slots: n }) {
    const o = e.asChild ? "template" : e.as;
    return typeof o == "string" && Ru.includes(o) ? () => h(o, t) : o !== "template" ? () => h(e.as, t, { default: n.default }) : () => h(ao, t, { default: n.default });
  }
});
var ha = defineComponent({
  __name: "VisuallyHidden",
  props: {
    feature: { default: "focusable" },
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  setup(e) {
    return (t, n) => (openBlock(), createBlock(unref(re), {
      as: t.as,
      "as-child": t.asChild,
      "aria-hidden": t.feature === "focusable" ? "true" : void 0,
      "data-hidden": t.feature === "fully-hidden" ? "" : void 0,
      tabindex: t.feature === "fully-hidden" ? "-1" : void 0,
      style: {
        // See: https://github.com/twbs/bootstrap/blob/master/scss/mixins/_screen-reader.scss
        position: "absolute",
        border: 0,
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
        wordWrap: "normal"
      }
    }, {
      default: withCtx(() => [
        renderSlot(t.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "aria-hidden", "data-hidden", "tabindex"]));
  }
});
function Mu(e, t) {
  var n;
  const o = shallowRef();
  return watchEffect(() => {
    o.value = e();
  }, {
    ...t,
    flush: (n = void 0) != null ? n : "sync"
  }), readonly(o);
}
function Nu(e, t) {
  let n, o, r;
  const a = shallowRef(true), s = () => {
    a.value = true, r();
  };
  watch(e, s, { flush: "sync" });
  const i = typeof t == "function" ? t : t.get, l = typeof t == "function" ? void 0 : t.set, c = customRef((u, d) => (o = u, r = d, {
    get() {
      return a.value && (n = i(n), a.value = false), o(), n;
    },
    set(p) {
      l == null || l(p);
    }
  }));
  return Object.isExtensible(c) && (c.trigger = s), c;
}
function en(e) {
  return getCurrentScope() ? (onScopeDispose(e), true) : false;
}
function pn() {
  const e = /* @__PURE__ */ new Set(), t = (a) => {
    e.delete(a);
  };
  return {
    on: (a) => {
      e.add(a);
      const s = () => t(a);
      return en(s), {
        off: s
      };
    },
    off: t,
    trigger: (...a) => Promise.all(Array.from(e).map((s) => s(...a))),
    clear: () => {
      e.clear();
    }
  };
}
function Vu(e) {
  let t = false, n;
  const o = effectScope(true);
  return (...r) => (t || (n = o.run(() => e(...r)), t = true), n);
}
function zu(e) {
  let t = 0, n, o;
  const r = () => {
    t -= 1, o && t <= 0 && (o.stop(), n = void 0, o = void 0);
  };
  return (...a) => (t += 1, o || (o = effectScope(true), n = o.run(() => e(...a))), en(r), n);
}
var pt = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
var ju = (e) => typeof e < "u";
var Wu = Object.prototype.toString;
var Hu = (e) => Wu.call(e) === "[object Object]";
var fr = Ku();
function Ku() {
  var e, t;
  return pt && ((e = window == null ? void 0 : window.navigator) == null ? void 0 : e.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((t = window == null ? void 0 : window.navigator) == null ? void 0 : t.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window == null ? void 0 : window.navigator.userAgent));
}
function ga(e) {
  return getCurrentInstance();
}
function Wn(e) {
  return Array.isArray(e) ? e : [e];
}
function _o(e, t = 1e4) {
  return customRef((n, o) => {
    let r = toValue(e), a;
    const s = () => setTimeout(() => {
      r = toValue(e), o();
    }, toValue(t));
    return en(() => {
      clearTimeout(a);
    }), {
      get() {
        return n(), r;
      },
      set(i) {
        r = i, o(), clearTimeout(a), a = s();
      }
    };
  });
}
var qu = toValue;
function Uu(e, t) {
  ga() && onBeforeUnmount(e, t);
}
function Gu(e, t = true, n) {
  ga() ? onMounted(e, n) : t ? e() : nextTick(e);
}
function Yu(e, t, n) {
  return watch(
    e,
    t,
    {
      ...n,
      immediate: true
    }
  );
}
var Dn = pt ? window : void 0;
function Be(e) {
  var t;
  const n = toValue(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
function ya(...e) {
  const t = [], n = () => {
    t.forEach((i) => i()), t.length = 0;
  }, o = (i, l, c, u) => (i.addEventListener(l, c, u), () => i.removeEventListener(l, c, u)), r = computed(() => {
    const i = Wn(toValue(e[0])).filter((l) => l != null);
    return i.every((l) => typeof l != "string") ? i : void 0;
  }), a = Yu(
    () => {
      var i, l;
      return [
        (l = (i = r.value) == null ? void 0 : i.map((c) => Be(c))) != null ? l : [Dn].filter((c) => c != null),
        Wn(toValue(r.value ? e[1] : e[0])),
        Wn(unref(r.value ? e[2] : e[1])),
        // @ts-expect-error - TypeScript gets the correct types, but somehow still complains
        toValue(r.value ? e[3] : e[2])
      ];
    },
    ([i, l, c, u]) => {
      if (n(), !(i != null && i.length) || !(l != null && l.length) || !(c != null && c.length))
        return;
      const d = Hu(u) ? { ...u } : u;
      t.push(
        ...i.flatMap(
          (p) => l.flatMap(
            (f) => c.map((v) => o(p, f, v, d))
          )
        )
      );
    },
    { flush: "post" }
  ), s = () => {
    a(), n();
  };
  return en(n), s;
}
function ba() {
  const e = shallowRef(false), t = getCurrentInstance();
  return t && onMounted(() => {
    e.value = true;
  }, t), e;
}
function Xu(e) {
  const t = ba();
  return computed(() => (t.value, !!e()));
}
function Ju(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => true;
}
function Zu(...e) {
  let t, n, o = {};
  e.length === 3 ? (t = e[0], n = e[1], o = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = true, n = e[0], o = e[1]) : (t = e[0], n = e[1]) : (t = true, n = e[0]);
  const {
    target: r = Dn,
    eventName: a = "keydown",
    passive: s = false,
    dedupe: i = false
  } = o, l = Ju(t);
  return ya(r, a, (u) => {
    u.repeat && toValue(i) || l(u) && n(u);
  }, s);
}
function Qu(e) {
  return JSON.parse(JSON.stringify(e));
}
function ec(e) {
  const t = getCurrentInstance(), n = Nu(
    () => null,
    () => t.proxy.$el
  );
  return onUpdated(n.trigger), onMounted(n.trigger), n;
}
function tc(e, t, n = {}) {
  const { window: o = Dn, ...r } = n;
  let a;
  const s = Xu(() => o && "ResizeObserver" in o), i = () => {
    a && (a.disconnect(), a = void 0);
  }, l = computed(() => {
    const d = toValue(e);
    return Array.isArray(d) ? d.map((p) => Be(p)) : [Be(d)];
  }), c = watch(
    l,
    (d) => {
      if (i(), s.value && o) {
        a = new ResizeObserver(t);
        for (const p of d)
          p && a.observe(p, r);
      }
    },
    { immediate: true, flush: "post" }
  ), u = () => {
    i(), c();
  };
  return en(u), {
    isSupported: s,
    stop: u
  };
}
function nc(e = ec()) {
  const t = shallowRef(), n = () => {
    const o = Be(e);
    o && (t.value = o.parentElement);
  };
  return Gu(n), watch(() => toValue(e), n), t;
}
function ut(e, t, n, o = {}) {
  var r, a, s;
  const {
    clone: i = false,
    passive: l = false,
    eventName: c,
    deep: u = false,
    defaultValue: d,
    shouldEmit: p
  } = o, f = getCurrentInstance(), v = n || (f == null ? void 0 : f.emit) || ((r = f == null ? void 0 : f.$emit) == null ? void 0 : r.bind(f)) || ((s = (a = f == null ? void 0 : f.proxy) == null ? void 0 : a.$emit) == null ? void 0 : s.bind(f == null ? void 0 : f.proxy));
  let h2 = c;
  t || (t = "modelValue"), h2 = h2 || `update:${t.toString()}`;
  const g = (b) => i ? typeof i == "function" ? i(b) : Qu(b) : b, x = () => ju(e[t]) ? g(e[t]) : d, y = (b) => {
    p ? p(b) && v(h2, b) : v(h2, b);
  };
  if (l) {
    const b = x(), w = ref(b);
    let C = false;
    return watch(
      () => e[t],
      (E) => {
        C || (C = true, w.value = g(E), nextTick(() => C = false));
      }
    ), watch(
      w,
      (E) => {
        !C && (E !== e[t] || u) && y(E);
      },
      { deep: u }
    ), w;
  } else
    return computed({
      get() {
        return x();
      },
      set(b) {
        y(b);
      }
    });
}
function Ce(e, t) {
  const n = typeof e == "string" && !t ? `${e}Context` : t, o = Symbol(n);
  return [(s) => {
    const i = inject(o, s);
    if (i || i === null)
      return i;
    throw new Error(
      `Injection \`${o.toString()}\` not found. Component must be used within ${Array.isArray(e) ? `one of the following components: ${e.join(
        ", "
      )}` : `\`${e}\``}`
    );
  }, (s) => (provide(o, s), s)];
}
function pr(e) {
  return typeof e == "string" ? `'${e}'` : new oc().serialize(e);
}
var oc = function() {
  var t;
  class e {
    constructor() {
      Ko(this, t, /* @__PURE__ */ new Map());
    }
    compare(o, r) {
      const a = typeof o, s = typeof r;
      return a === "string" && s === "string" ? o.localeCompare(r) : a === "number" && s === "number" ? o - r : String.prototype.localeCompare.call(this.serialize(o, true), this.serialize(r, true));
    }
    serialize(o, r) {
      if (o === null) return "null";
      switch (typeof o) {
        case "string":
          return r ? o : `'${o}'`;
        case "bigint":
          return `${o}n`;
        case "object":
          return this.$object(o);
        case "function":
          return this.$function(o);
      }
      return String(o);
    }
    serializeObject(o) {
      const r = Object.prototype.toString.call(o);
      if (r !== "[object Object]") return this.serializeBuiltInType(r.length < 10 ? `unknown:${r}` : r.slice(8, -1), o);
      const a = o.constructor, s = a === Object || a === void 0 ? "" : a.name;
      if (s !== "" && globalThis[s] === a) return this.serializeBuiltInType(s, o);
      if (typeof o.toJSON == "function") {
        const i = o.toJSON();
        return s + (i !== null && typeof i == "object" ? this.$object(i) : `(${this.serialize(i)})`);
      }
      return this.serializeObjectEntries(s, Object.entries(o));
    }
    serializeBuiltInType(o, r) {
      const a = this["$" + o];
      if (a) return a.call(this, r);
      if (typeof (r == null ? void 0 : r.entries) == "function") return this.serializeObjectEntries(o, r.entries());
      throw new Error(`Cannot serialize ${o}`);
    }
    serializeObjectEntries(o, r) {
      const a = Array.from(r).sort((i, l) => this.compare(i[0], l[0]));
      let s = `${o}{`;
      for (let i = 0; i < a.length; i++) {
        const [l, c] = a[i];
        s += `${this.serialize(l, true)}:${this.serialize(c)}`, i < a.length - 1 && (s += ",");
      }
      return s + "}";
    }
    $object(o) {
      let r = Mt(this, t).get(o);
      return r === void 0 && (Mt(this, t).set(o, `#${Mt(this, t).size}`), r = this.serializeObject(o), Mt(this, t).set(o, r)), r;
    }
    $function(o) {
      const r = Function.prototype.toString.call(o);
      return r.slice(-15) === "[native code] }" ? `${o.name || ""}()[native]` : `${o.name}(${o.length})${r.replace(/\s*\n\s*/g, "")}`;
    }
    $Array(o) {
      let r = "[";
      for (let a = 0; a < o.length; a++) r += this.serialize(o[a]), a < o.length - 1 && (r += ",");
      return r + "]";
    }
    $Date(o) {
      try {
        return `Date(${o.toISOString()})`;
      } catch {
        return "Date(null)";
      }
    }
    $ArrayBuffer(o) {
      return `ArrayBuffer[${new Uint8Array(o).join(",")}]`;
    }
    $Set(o) {
      return `Set${this.$Array(Array.from(o).sort((r, a) => this.compare(r, a)))}`;
    }
    $Map(o) {
      return this.serializeObjectEntries("Map", o.entries());
    }
  }
  t = /* @__PURE__ */ new WeakMap();
  for (const n of ["Error", "RegExp", "URL"]) e.prototype["$" + n] = function(o) {
    return `${n}(${o})`;
  };
  for (const n of ["Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array"]) e.prototype["$" + n] = function(o) {
    return `${n}[${o.join(",")}]`;
  };
  for (const n of ["BigInt64Array", "BigUint64Array"]) e.prototype["$" + n] = function(o) {
    return `${n}[${o.join("n,")}${o.length > 0 ? "n" : ""}]`;
  };
  return e;
}();
function bn(e, t) {
  return e === t || pr(e) === pr(t);
}
function mr(e) {
  return e == null;
}
var [_n, ap] = Ce("ConfigProvider");
function Lo(e) {
  const t = _n({
    dir: ref("ltr")
  });
  return computed(() => {
    var n;
    return (e == null ? void 0 : e.value) || ((n = t.dir) == null ? void 0 : n.value) || "ltr";
  });
}
function ae() {
  const e = getCurrentInstance(), t = ref(), n = computed(() => {
    var s, i;
    return ["#text", "#comment"].includes((s = t.value) == null ? void 0 : s.$el.nodeName) ? (i = t.value) == null ? void 0 : i.$el.nextElementSibling : Be(t);
  }), o = Object.assign({}, e.exposed), r = {};
  for (const s in e.props)
    Object.defineProperty(r, s, {
      enumerable: true,
      configurable: true,
      get: () => e.props[s]
    });
  if (Object.keys(o).length > 0)
    for (const s in o)
      Object.defineProperty(r, s, {
        enumerable: true,
        configurable: true,
        get: () => o[s]
      });
  Object.defineProperty(r, "$el", {
    enumerable: true,
    configurable: true,
    get: () => e.vnode.el
  }), e.exposed = r;
  function a(s) {
    t.value = s, s && (Object.defineProperty(r, "$el", {
      enumerable: true,
      configurable: true,
      get: () => s instanceof Element ? s : s.$el
    }), e.exposed = r);
  }
  return { forwardRef: a, currentRef: t, currentElement: n };
}
var rc = 0;
function Ze(e, t = "reka") {
  var o;
  const n = _n({ useId: void 0 });
  return Object.hasOwn(vue_runtime_esm_bundler_exports, "useId") ? `${t}-${(o = useId) == null ? void 0 : o.call(vue_runtime_esm_bundler_exports)}` : n.useId ? `${t}-${n.useId()}` : `${t}-${++rc}`;
}
function ac(e, t) {
  const n = ref(e);
  function o(a) {
    return t[n.value][a] ?? n.value;
  }
  return {
    state: n,
    dispatch: (a) => {
      n.value = o(a);
    }
  };
}
function ic(e, t) {
  var g;
  const n = ref({}), o = ref("none"), r = ref(e), a = e.value ? "mounted" : "unmounted";
  let s;
  const i = ((g = t.value) == null ? void 0 : g.ownerDocument.defaultView) ?? Dn, { state: l, dispatch: c } = ac(a, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  }), u = (x) => {
    var y;
    if (pt) {
      const b = new CustomEvent(x, { bubbles: false, cancelable: false });
      (y = t.value) == null || y.dispatchEvent(b);
    }
  };
  watch(
    e,
    async (x, y) => {
      var w;
      const b = y !== x;
      if (await nextTick(), b) {
        const C = o.value, E = ln(t.value);
        x ? (c("MOUNT"), u("enter"), E === "none" && u("after-enter")) : E === "none" || E === "undefined" || ((w = n.value) == null ? void 0 : w.display) === "none" ? (c("UNMOUNT"), u("leave"), u("after-leave")) : y && C !== E ? (c("ANIMATION_OUT"), u("leave")) : (c("UNMOUNT"), u("after-leave"));
      }
    },
    { immediate: true }
  );
  const d = (x) => {
    const y = ln(t.value), b = y.includes(
      x.animationName
    ), w = l.value === "mounted" ? "enter" : "leave";
    if (x.target === t.value && b && (u(`after-${w}`), c("ANIMATION_END"), !r.value)) {
      const C = t.value.style.animationFillMode;
      t.value.style.animationFillMode = "forwards", s = i == null ? void 0 : i.setTimeout(() => {
        var E;
        ((E = t.value) == null ? void 0 : E.style.animationFillMode) === "forwards" && (t.value.style.animationFillMode = C);
      });
    }
    x.target === t.value && y === "none" && c("ANIMATION_END");
  }, p = (x) => {
    x.target === t.value && (o.value = ln(t.value));
  }, f = watch(
    t,
    (x, y) => {
      x ? (n.value = getComputedStyle(x), x.addEventListener("animationstart", p), x.addEventListener("animationcancel", d), x.addEventListener("animationend", d)) : (c("ANIMATION_END"), s !== void 0 && (i == null || i.clearTimeout(s)), y == null || y.removeEventListener("animationstart", p), y == null || y.removeEventListener("animationcancel", d), y == null || y.removeEventListener("animationend", d));
    },
    { immediate: true }
  ), v = watch(l, () => {
    const x = ln(t.value);
    o.value = l.value === "mounted" ? x : "none";
  });
  return onUnmounted(() => {
    f(), v();
  }), {
    isPresent: computed(
      () => ["mounted", "unmountSuspended"].includes(l.value)
    )
  };
}
function ln(e) {
  return e && getComputedStyle(e).animationName || "none";
}
var Ln = defineComponent({
  name: "Presence",
  props: {
    present: {
      type: Boolean,
      required: true
    },
    forceMount: {
      type: Boolean
    }
  },
  slots: {},
  setup(e, { slots: t, expose: n }) {
    var c;
    const { present: o, forceMount: r } = toRefs(e), a = ref(), { isPresent: s } = ic(o, a);
    n({ present: s });
    let i = t.default({ present: s.value });
    i = Do(i || []);
    const l = getCurrentInstance();
    if (i && (i == null ? void 0 : i.length) > 1) {
      const u = (c = l == null ? void 0 : l.parent) != null && c.type.name ? `<${l.parent.type.name} />` : "component";
      throw new Error(
        [
          `Detected an invalid children for \`${u}\` for  \`Presence\` component.`,
          "",
          "Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.",
          "You can apply a few solutions:",
          [
            "Provide a single child element so that `presence` directive attach correctly.",
            "Ensure the first child is an actual element instead of a raw text node or comment node."
          ].map((d) => `  - ${d}`).join(`
`)
        ].join(`
`)
      );
    }
    return () => r.value || o.value || s.value ? h(t.default({ present: s.value })[0], {
      ref: (u) => {
        const d = Be(u);
        return typeof (d == null ? void 0 : d.hasAttribute) > "u" || (d != null && d.hasAttribute("data-reka-popper-content-wrapper") ? a.value = d.firstElementChild : a.value = d), d;
      }
    }) : null;
  }
});
var [He, sc] = Ce("DialogRoot");
var lc = defineComponent({
  inheritAttrs: false,
  __name: "DialogRoot",
  props: {
    open: { type: Boolean, default: void 0 },
    defaultOpen: { type: Boolean, default: false },
    modal: { type: Boolean, default: true }
  },
  emits: ["update:open"],
  setup(e, { emit: t }) {
    const n = e, r = ut(n, "open", t, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), a = ref(), s = ref(), { modal: i } = toRefs(n);
    return sc({
      open: r,
      modal: i,
      openModal: () => {
        r.value = true;
      },
      onOpenChange: (l) => {
        r.value = l;
      },
      onOpenToggle: () => {
        r.value = !r.value;
      },
      contentId: "",
      titleId: "",
      descriptionId: "",
      triggerElement: a,
      contentElement: s
    }), (l, c) => renderSlot(l.$slots, "default", {
      open: unref(r),
      close: () => r.value = false
    });
  }
});
var uc = defineComponent({
  __name: "DialogClose",
  props: {
    asChild: { type: Boolean },
    as: { default: "button" }
  },
  setup(e) {
    const t = e;
    ae();
    const n = He();
    return (o, r) => (openBlock(), createBlock(unref(re), mergeProps(t, {
      type: o.as === "button" ? "button" : void 0,
      onClick: r[0] || (r[0] = (a) => unref(n).onOpenChange(false))
    }), {
      default: withCtx(() => [
        renderSlot(o.$slots, "default")
      ]),
      _: 3
    }, 16, ["type"]));
  }
});
function Fn(e) {
  const t = getCurrentInstance(), n = t == null ? void 0 : t.type.emits, o = {};
  return n != null && n.length || console.warn(
    `No emitted event found. Please check component: ${t == null ? void 0 : t.type.__name}`
  ), n == null || n.forEach((r) => {
    o[toHandlerKey(camelize(r))] = (...a) => e(r, ...a);
  }), o;
}
function xe() {
  let e = document.activeElement;
  if (e == null)
    return null;
  for (; e != null && e.shadowRoot != null && e.shadowRoot.activeElement != null; )
    e = e.shadowRoot.activeElement;
  return e;
}
function cc(e) {
  return e ? "open" : "closed";
}
function vr(e) {
  const t = xe();
  for (const n of e)
    if (n === t || (n.focus(), xe() !== t))
      return;
}
var dc = "DialogTitle";
var fc = "DialogContent";
function pc({
  titleName: e = dc,
  contentName: t = fc,
  componentLink: n = "dialog.html#title",
  titleId: o,
  descriptionId: r,
  contentElement: a
}) {
  const s = `Warning: \`${t}\` requires a \`${e}\` for the component to be accessible for screen reader users.

If you want to hide the \`${e}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${n}`, i = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${t}.`;
  onMounted(() => {
    var u;
    document.getElementById(o) || console.warn(s);
    const c = (u = a.value) == null ? void 0 : u.getAttribute("aria-describedby");
    r && c && (document.getElementById(r) || console.warn(i));
  });
}
var mc = Vu(() => ref([]));
function vc() {
  const e = mc();
  return {
    add(t) {
      const n = e.value[0];
      t !== n && (n == null || n.pause()), e.value = hr(e.value, t), e.value.unshift(t);
    },
    remove(t) {
      var n;
      e.value = hr(e.value, t), (n = e.value[0]) == null || n.resume();
    }
  };
}
function hr(e, t) {
  const n = [...e], o = n.indexOf(t);
  return o !== -1 && n.splice(o, 1), n;
}
function hc(e) {
  return e.filter((t) => t.tagName !== "A");
}
var Hn = "focusScope.autoFocusOnMount";
var Kn = "focusScope.autoFocusOnUnmount";
var gr = { bubbles: false, cancelable: true };
function gc(e, { select: t = false } = {}) {
  const n = xe();
  for (const o of e)
    if (rt(o, { select: t }), xe() !== n)
      return true;
}
function yc(e) {
  const t = wa(e), n = yr(t, e), o = yr(t.reverse(), e);
  return [n, o];
}
function wa(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (o) => {
      const r = o.tagName === "INPUT" && o.type === "hidden";
      return o.disabled || o.hidden || r ? NodeFilter.FILTER_SKIP : o.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function yr(e, t) {
  for (const n of e)
    if (!bc(n, { upTo: t }))
      return n;
}
function bc(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden")
    return true;
  for (; e; ) {
    if (t !== void 0 && e === t)
      return false;
    if (getComputedStyle(e).display === "none")
      return true;
    e = e.parentElement;
  }
  return false;
}
function wc(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function rt(e, { select: t = false } = {}) {
  if (e && e.focus) {
    const n = xe();
    e.focus({ preventScroll: true }), e !== n && wc(e) && t && e.select();
  }
}
var xa = defineComponent({
  __name: "FocusScope",
  props: {
    loop: { type: Boolean, default: false },
    trapped: { type: Boolean, default: false },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["mountAutoFocus", "unmountAutoFocus"],
  setup(e, { emit: t }) {
    const n = e, o = t, { currentRef: r, currentElement: a } = ae(), s = ref(null), i = vc(), l = reactive({
      paused: false,
      pause() {
        this.paused = true;
      },
      resume() {
        this.paused = false;
      }
    });
    watchEffect((u) => {
      if (!pt)
        return;
      const d = a.value;
      if (!n.trapped)
        return;
      function p(g) {
        if (l.paused || !d)
          return;
        const x = g.target;
        d.contains(x) ? s.value = x : rt(s.value, { select: true });
      }
      function f(g) {
        if (l.paused || !d)
          return;
        const x = g.relatedTarget;
        x !== null && (d.contains(x) || rt(s.value, { select: true }));
      }
      function v(g) {
        d.contains(s.value) || rt(d);
      }
      document.addEventListener("focusin", p), document.addEventListener("focusout", f);
      const h2 = new MutationObserver(v);
      d && h2.observe(d, { childList: true, subtree: true }), u(() => {
        document.removeEventListener("focusin", p), document.removeEventListener("focusout", f), h2.disconnect();
      });
    }), watchEffect(async (u) => {
      const d = a.value;
      if (await nextTick(), !d)
        return;
      i.add(l);
      const p = xe();
      if (!d.contains(p)) {
        const v = new CustomEvent(Hn, gr);
        d.addEventListener(Hn, (h2) => o("mountAutoFocus", h2)), d.dispatchEvent(v), v.defaultPrevented || (gc(hc(wa(d)), {
          select: true
        }), xe() === p && rt(d));
      }
      u(() => {
        d.removeEventListener(Hn, (g) => o("mountAutoFocus", g));
        const v = new CustomEvent(Kn, gr), h2 = (g) => {
          o("unmountAutoFocus", g);
        };
        d.addEventListener(Kn, h2), d.dispatchEvent(v), setTimeout(() => {
          v.defaultPrevented || rt(p ?? document.body, { select: true }), d.removeEventListener(Kn, h2), i.remove(l);
        }, 0);
      });
    });
    function c(u) {
      if (!n.loop && !n.trapped || l.paused)
        return;
      const d = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, p = xe();
      if (d && p) {
        const f = u.currentTarget, [v, h2] = yc(f);
        v && h2 ? !u.shiftKey && p === h2 ? (u.preventDefault(), n.loop && rt(v, { select: true })) : u.shiftKey && p === v && (u.preventDefault(), n.loop && rt(h2, { select: true })) : p === f && u.preventDefault();
      }
    }
    return (u, d) => (openBlock(), createBlock(unref(re), {
      ref_key: "currentRef",
      ref: r,
      tabindex: "-1",
      "as-child": u.asChild,
      as: u.as,
      onKeydown: c
    }, {
      default: withCtx(() => [
        renderSlot(u.$slots, "default")
      ]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
});
function Bn(e, t, n) {
  const o = n.originalEvent.target, r = new CustomEvent(e, {
    bubbles: false,
    cancelable: true,
    detail: n
  });
  t && o.addEventListener(e, t, { once: true }), o.dispatchEvent(r);
}
var xc = "dismissableLayer.pointerDownOutside";
var Cc = "dismissableLayer.focusOutside";
function Ca(e, t) {
  const n = t.closest(
    "[data-dismissable-layer]"
  ), o = e.dataset.dismissableLayer === "" ? e : e.querySelector(
    "[data-dismissable-layer]"
  ), r = Array.from(
    e.ownerDocument.querySelectorAll("[data-dismissable-layer]")
  );
  return !!(n && (o === n || r.indexOf(o) < r.indexOf(n)));
}
function Sc(e, t, n = true) {
  var s;
  const o = ((s = t == null ? void 0 : t.value) == null ? void 0 : s.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), r = ref(false), a = ref(() => {
  });
  return watchEffect((i) => {
    if (!pt || !toValue(n))
      return;
    const l = async (u) => {
      const d = u.target;
      if (!(!(t != null && t.value) || !d)) {
        if (Ca(t.value, d)) {
          r.value = false;
          return;
        }
        if (u.target && !r.value) {
          let p = function() {
            Bn(
              xc,
              e,
              f
            );
          };
          const f = { originalEvent: u };
          u.pointerType === "touch" ? (o.removeEventListener("click", a.value), a.value = p, o.addEventListener("click", a.value, {
            once: true
          })) : p();
        } else
          o.removeEventListener("click", a.value);
        r.value = false;
      }
    }, c = window.setTimeout(() => {
      o.addEventListener("pointerdown", l);
    }, 0);
    i(() => {
      window.clearTimeout(c), o.removeEventListener("pointerdown", l), o.removeEventListener("click", a.value);
    });
  }), {
    onPointerDownCapture: () => {
      toValue(n) && (r.value = true);
    }
  };
}
function Ec(e, t, n = true) {
  var a;
  const o = ((a = t == null ? void 0 : t.value) == null ? void 0 : a.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), r = ref(false);
  return watchEffect((s) => {
    if (!pt || !toValue(n))
      return;
    const i = async (l) => {
      if (!(t != null && t.value))
        return;
      await nextTick(), await nextTick();
      const c = l.target;
      !t.value || !c || Ca(t.value, c) || l.target && !r.value && Bn(
        Cc,
        e,
        { originalEvent: l }
      );
    };
    o.addEventListener("focusin", i), s(() => o.removeEventListener("focusin", i));
  }), {
    onFocusCapture: () => {
      toValue(n) && (r.value = true);
    },
    onBlurCapture: () => {
      toValue(n) && (r.value = false);
    }
  };
}
var qe = reactive({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
});
var Fo = defineComponent({
  __name: "DismissableLayer",
  props: {
    disableOutsidePointerEvents: { type: Boolean, default: false },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss"],
  setup(e, { emit: t }) {
    const n = e, o = t, { forwardRef: r, currentElement: a } = ae(), s = computed(
      () => {
        var v;
        return ((v = a.value) == null ? void 0 : v.ownerDocument) ?? globalThis.document;
      }
    ), i = computed(() => qe.layersRoot), l = computed(() => a.value ? Array.from(i.value).indexOf(a.value) : -1), c = computed(() => qe.layersWithOutsidePointerEventsDisabled.size > 0), u = computed(() => {
      const v = Array.from(i.value), [h2] = [...qe.layersWithOutsidePointerEventsDisabled].slice(-1), g = v.indexOf(h2);
      return l.value >= g;
    }), d = Sc(async (v) => {
      const h2 = [...qe.branches].some(
        (g) => g == null ? void 0 : g.contains(v.target)
      );
      !u.value || h2 || (o("pointerDownOutside", v), o("interactOutside", v), await nextTick(), v.defaultPrevented || o("dismiss"));
    }, a), p = Ec((v) => {
      [...qe.branches].some(
        (g) => g == null ? void 0 : g.contains(v.target)
      ) || (o("focusOutside", v), o("interactOutside", v), v.defaultPrevented || o("dismiss"));
    }, a);
    Zu("Escape", (v) => {
      l.value === i.value.size - 1 && (o("escapeKeyDown", v), v.defaultPrevented || o("dismiss"));
    });
    let f;
    return watchEffect((v) => {
      a.value && (n.disableOutsidePointerEvents && (qe.layersWithOutsidePointerEventsDisabled.size === 0 && (f = s.value.body.style.pointerEvents, s.value.body.style.pointerEvents = "none"), qe.layersWithOutsidePointerEventsDisabled.add(a.value)), i.value.add(a.value), v(() => {
        n.disableOutsidePointerEvents && qe.layersWithOutsidePointerEventsDisabled.size === 1 && (s.value.body.style.pointerEvents = f);
      }));
    }), watchEffect((v) => {
      v(() => {
        a.value && (i.value.delete(a.value), qe.layersWithOutsidePointerEventsDisabled.delete(a.value));
      });
    }), (v, h2) => (openBlock(), createBlock(unref(re), {
      ref: unref(r),
      "as-child": v.asChild,
      as: v.as,
      "data-dismissable-layer": "",
      style: normalizeStyle({
        pointerEvents: c.value ? u.value ? "auto" : "none" : void 0
      }),
      onFocusCapture: unref(p).onFocusCapture,
      onBlurCapture: unref(p).onBlurCapture,
      onPointerdownCapture: unref(d).onPointerDownCapture
    }, {
      default: withCtx(() => [
        renderSlot(v.$slots, "default")
      ]),
      _: 3
    }, 8, ["as-child", "as", "style", "onFocusCapture", "onBlurCapture", "onPointerdownCapture"]));
  }
});
var Sa = defineComponent({
  __name: "DialogContentImpl",
  props: {
    forceMount: { type: Boolean },
    trapFocus: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = He(), { forwardRef: a, currentElement: s } = ae();
    return r.titleId || (r.titleId = Ze(void 0, "reka-dialog-title")), r.descriptionId || (r.descriptionId = Ze(void 0, "reka-dialog-description")), onMounted(() => {
      r.contentElement = s, xe() !== document.body && (r.triggerElement.value = xe());
    }), pc({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: r.titleId,
      descriptionId: r.descriptionId,
      contentElement: s
    }), (i, l) => (openBlock(), createBlock(unref(xa), {
      "as-child": "",
      loop: "",
      trapped: n.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (c) => o("openAutoFocus", c)),
      onUnmountAutoFocus: l[6] || (l[6] = (c) => o("closeAutoFocus", c))
    }, {
      default: withCtx(() => [
        createVNode(unref(Fo), mergeProps({
          id: unref(r).contentId,
          ref: unref(a),
          as: i.as,
          "as-child": i.asChild,
          "disable-outside-pointer-events": i.disableOutsidePointerEvents,
          role: "dialog",
          "aria-describedby": unref(r).descriptionId,
          "aria-labelledby": unref(r).titleId,
          "data-state": unref(cc)(unref(r).open.value)
        }, i.$attrs, {
          onDismiss: l[0] || (l[0] = (c) => unref(r).onOpenChange(false)),
          onEscapeKeyDown: l[1] || (l[1] = (c) => o("escapeKeyDown", c)),
          onFocusOutside: l[2] || (l[2] = (c) => o("focusOutside", c)),
          onInteractOutside: l[3] || (l[3] = (c) => o("interactOutside", c)),
          onPointerDownOutside: l[4] || (l[4] = (c) => o("pointerDownOutside", c))
        }), {
          default: withCtx(() => [
            renderSlot(i.$slots, "default")
          ]),
          _: 3
        }, 16, ["id", "as", "as-child", "disable-outside-pointer-events", "aria-describedby", "aria-labelledby", "data-state"])
      ]),
      _: 3
    }, 8, ["trapped"]));
  }
});
var Oc = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
};
var Ct = /* @__PURE__ */ new WeakMap();
var un = /* @__PURE__ */ new WeakMap();
var cn = {};
var qn = 0;
var Ea = function(e) {
  return e && (e.host || Ea(e.parentNode));
};
var Pc = function(e, t) {
  return t.map(function(n) {
    if (e.contains(n))
      return n;
    var o = Ea(n);
    return o && e.contains(o) ? o : (console.error("aria-hidden", n, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
};
var Ac = function(e, t, n, o) {
  var r = Pc(t, Array.isArray(e) ? e : [e]);
  cn[n] || (cn[n] = /* @__PURE__ */ new WeakMap());
  var a = cn[n], s = [], i = /* @__PURE__ */ new Set(), l = new Set(r), c = function(d) {
    !d || i.has(d) || (i.add(d), c(d.parentNode));
  };
  r.forEach(c);
  var u = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(p) {
      if (i.has(p))
        u(p);
      else
        try {
          var f = p.getAttribute(o), v = f !== null && f !== "false", h2 = (Ct.get(p) || 0) + 1, g = (a.get(p) || 0) + 1;
          Ct.set(p, h2), a.set(p, g), s.push(p), h2 === 1 && v && un.set(p, true), g === 1 && p.setAttribute(n, "true"), v || p.setAttribute(o, "true");
        } catch (x) {
          console.error("aria-hidden: cannot operate on ", p, x);
        }
    });
  };
  return u(t), i.clear(), qn++, function() {
    s.forEach(function(d) {
      var p = Ct.get(d) - 1, f = a.get(d) - 1;
      Ct.set(d, p), a.set(d, f), p || (un.has(d) || d.removeAttribute(o), un.delete(d)), f || d.removeAttribute(n);
    }), qn--, qn || (Ct = /* @__PURE__ */ new WeakMap(), Ct = /* @__PURE__ */ new WeakMap(), un = /* @__PURE__ */ new WeakMap(), cn = {});
  };
};
var $c = function(e, t, n) {
  n === void 0 && (n = "data-aria-hidden");
  var o = Array.from(Array.isArray(e) ? e : [e]), r = Oc(e);
  return r ? (o.push.apply(o, Array.from(r.querySelectorAll("[aria-live], script"))), Ac(o, r, n, "aria-hidden")) : function() {
    return null;
  };
};
function Bo(e) {
  let t;
  watch(() => Be(e), (n) => {
    n ? t = $c(n) : t && t();
  }), onUnmounted(() => {
    t && t();
  });
}
var kc = defineComponent({
  __name: "DialogContentModal",
  props: {
    forceMount: { type: Boolean },
    trapFocus: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = He(), a = Fn(o), { forwardRef: s, currentElement: i } = ae();
    return Bo(i), (l, c) => (openBlock(), createBlock(Sa, mergeProps({ ...n, ...unref(a) }, {
      ref: unref(s),
      "trap-focus": unref(r).open.value,
      "disable-outside-pointer-events": true,
      onCloseAutoFocus: c[0] || (c[0] = (u) => {
        var d;
        u.defaultPrevented || (u.preventDefault(), (d = unref(r).triggerElement.value) == null || d.focus());
      }),
      onPointerDownOutside: c[1] || (c[1] = (u) => {
        const d = u.detail.originalEvent, p = d.button === 0 && d.ctrlKey === true;
        (d.button === 2 || p) && u.preventDefault();
      }),
      onFocusOutside: c[2] || (c[2] = (u) => {
        u.preventDefault();
      })
    }), {
      default: withCtx(() => [
        renderSlot(l.$slots, "default")
      ]),
      _: 3
    }, 16, ["trap-focus"]));
  }
});
var Tc = defineComponent({
  __name: "DialogContentNonModal",
  props: {
    forceMount: { type: Boolean },
    trapFocus: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: t }) {
    const n = e, r = Fn(t);
    ae();
    const a = He(), s = ref(false), i = ref(false);
    return (l, c) => (openBlock(), createBlock(Sa, mergeProps({ ...n, ...unref(r) }, {
      "trap-focus": false,
      "disable-outside-pointer-events": false,
      onCloseAutoFocus: c[0] || (c[0] = (u) => {
        var d;
        u.defaultPrevented || (s.value || (d = unref(a).triggerElement.value) == null || d.focus(), u.preventDefault()), s.value = false, i.value = false;
      }),
      onInteractOutside: c[1] || (c[1] = (u) => {
        var f;
        u.defaultPrevented || (s.value = true, u.detail.originalEvent.type === "pointerdown" && (i.value = true));
        const d = u.target;
        ((f = unref(a).triggerElement.value) == null ? void 0 : f.contains(d)) && u.preventDefault(), u.detail.originalEvent.type === "focusin" && i.value && u.preventDefault();
      })
    }), {
      default: withCtx(() => [
        renderSlot(l.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
});
var Ic = defineComponent({
  __name: "DialogContent",
  props: {
    forceMount: { type: Boolean },
    trapFocus: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = He(), a = Fn(o), { forwardRef: s } = ae();
    return (i, l) => (openBlock(), createBlock(unref(Ln), {
      present: i.forceMount || unref(r).open.value
    }, {
      default: withCtx(() => [
        unref(r).modal.value ? (openBlock(), createBlock(kc, mergeProps({
          key: 0,
          ref: unref(s)
        }, { ...n, ...unref(a), ...i.$attrs }), {
          default: withCtx(() => [
            renderSlot(i.$slots, "default")
          ]),
          _: 3
        }, 16)) : (openBlock(), createBlock(Tc, mergeProps({
          key: 1,
          ref: unref(s)
        }, { ...n, ...unref(a), ...i.$attrs }), {
          default: withCtx(() => [
            renderSlot(i.$slots, "default")
          ]),
          _: 3
        }, 16))
      ]),
      _: 3
    }, 8, ["present"]));
  }
});
var Dc = defineComponent({
  __name: "DialogDescription",
  props: {
    asChild: { type: Boolean },
    as: { default: "p" }
  },
  setup(e) {
    const t = e;
    ae();
    const n = He();
    return (o, r) => (openBlock(), createBlock(unref(re), mergeProps(t, {
      id: unref(n).descriptionId
    }), {
      default: withCtx(() => [
        renderSlot(o.$slots, "default")
      ]),
      _: 3
    }, 16, ["id"]));
  }
});
function Un(e) {
  if (e === null || typeof e != "object")
    return false;
  const t = Object.getPrototypeOf(e);
  return t !== null && t !== Object.prototype && Object.getPrototypeOf(t) !== null || Symbol.iterator in e ? false : Symbol.toStringTag in e ? Object.prototype.toString.call(e) === "[object Module]" : true;
}
function io(e, t, n = ".", o) {
  if (!Un(t))
    return io(e, {}, n, o);
  const r = Object.assign({}, t);
  for (const a in e) {
    if (a === "__proto__" || a === "constructor")
      continue;
    const s = e[a];
    s != null && (o && o(r, a, s, n) || (Array.isArray(s) && Array.isArray(r[a]) ? r[a] = [...s, ...r[a]] : Un(s) && Un(r[a]) ? r[a] = io(
      s,
      r[a],
      (n ? `${n}.` : "") + a.toString(),
      o
    ) : r[a] = s));
  }
  return r;
}
function _c(e) {
  return (...t) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    t.reduce((n, o) => io(n, o, "", e), {})
  );
}
var Lc = _c();
var Fc = zu(() => {
  const e = ref(/* @__PURE__ */ new Map()), t = ref(), n = computed(() => {
    for (const s of e.value.values())
      if (s)
        return true;
    return false;
  }), o = _n({
    scrollBody: ref(true)
  });
  let r = null;
  const a = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = t.value ?? "", fr && (r == null || r()), t.value = void 0;
  };
  return watch(n, (s, i) => {
    var d;
    if (!pt)
      return;
    if (!s) {
      i && a();
      return;
    }
    t.value === void 0 && (t.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, c = { padding: l, margin: 0 }, u = (d = o.scrollBody) != null && d.value ? typeof o.scrollBody.value == "object" ? Lc({
      padding: o.scrollBody.value.padding === true ? l : o.scrollBody.value.padding,
      margin: o.scrollBody.value.margin === true ? l : o.scrollBody.value.margin
    }, c) : c : { padding: 0, margin: 0 };
    l > 0 && (document.body.style.paddingRight = typeof u.padding == "number" ? `${u.padding}px` : String(u.padding), document.body.style.marginRight = typeof u.margin == "number" ? `${u.margin}px` : String(u.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), fr && (r = ya(
      document,
      "touchmove",
      (p) => Bc(p),
      { passive: false }
    )), nextTick(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, { immediate: true, flush: "sync" }), e;
});
function Ro(e) {
  const t = Math.random().toString(36).substring(2, 7), n = Fc();
  n.value.set(t, e ?? false);
  const o = computed({
    get: () => n.value.get(t) ?? false,
    set: (r) => n.value.set(t, r)
  });
  return Uu(() => {
    n.value.delete(t);
  }), o;
}
function Oa(e) {
  const t = window.getComputedStyle(e);
  if (t.overflowX === "scroll" || t.overflowY === "scroll" || t.overflowX === "auto" && e.clientWidth < e.scrollWidth || t.overflowY === "auto" && e.clientHeight < e.scrollHeight)
    return true;
  {
    const n = e.parentNode;
    return !(n instanceof Element) || n.tagName === "BODY" ? false : Oa(n);
  }
}
function Bc(e) {
  const t = e || window.event, n = t.target;
  return n instanceof Element && Oa(n) ? false : t.touches.length > 1 ? true : (t.preventDefault && t.cancelable && t.preventDefault(), false);
}
var Rc = defineComponent({
  __name: "DialogOverlayImpl",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const t = He();
    return Ro(true), ae(), (n, o) => (openBlock(), createBlock(unref(re), {
      as: n.as,
      "as-child": n.asChild,
      "data-state": unref(t).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: withCtx(() => [
        renderSlot(n.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "data-state"]));
  }
});
var Mc = defineComponent({
  __name: "DialogOverlay",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const t = He(), { forwardRef: n } = ae();
    return (o, r) => {
      var a;
      return (a = unref(t)) != null && a.modal.value ? (openBlock(), createBlock(unref(Ln), {
        key: 0,
        present: o.forceMount || unref(t).open.value
      }, {
        default: withCtx(() => [
          createVNode(Rc, mergeProps(o.$attrs, {
            ref: unref(n),
            as: o.as,
            "as-child": o.asChild
          }), {
            default: withCtx(() => [
              renderSlot(o.$slots, "default")
            ]),
            _: 3
          }, 16, ["as", "as-child"])
        ]),
        _: 3
      }, 8, ["present"])) : createCommentVNode("", true);
    };
  }
});
var Mo = defineComponent({
  __name: "Teleport",
  props: {
    to: { default: "body" },
    disabled: { type: Boolean },
    defer: { type: Boolean },
    forceMount: { type: Boolean }
  },
  setup(e) {
    const t = ba();
    return (n, o) => unref(t) || n.forceMount ? (openBlock(), createBlock(Teleport, {
      key: 0,
      to: n.to,
      disabled: n.disabled,
      defer: n.defer
    }, [
      renderSlot(n.$slots, "default")
    ], 8, ["to", "disabled", "defer"])) : createCommentVNode("", true);
  }
});
function Rn(e) {
  const t = getCurrentInstance(), n = Object.keys((t == null ? void 0 : t.type.props) ?? {}).reduce((r, a) => {
    const s = (t == null ? void 0 : t.type.props[a]).default;
    return s !== void 0 && (r[a] = s), r;
  }, {}), o = toRef(e);
  return computed(() => {
    const r = {}, a = (t == null ? void 0 : t.vnode.props) ?? {};
    return Object.keys(a).forEach((s) => {
      r[camelize(s)] = a[s];
    }), Object.keys({ ...n, ...r }).reduce((s, i) => (o.value[i] !== void 0 && (s[i] = o.value[i]), s), {});
  });
}
function Pa(e, t) {
  const n = Rn(e), o = t ? Fn(t) : {};
  return computed(() => ({
    ...n.value,
    ...o
  }));
}
var Nc = defineComponent({
  __name: "DialogTitle",
  props: {
    asChild: { type: Boolean },
    as: { default: "h2" }
  },
  setup(e) {
    const t = e, n = He();
    return ae(), (o, r) => (openBlock(), createBlock(unref(re), mergeProps(t, {
      id: unref(n).titleId
    }), {
      default: withCtx(() => [
        renderSlot(o.$slots, "default")
      ]),
      _: 3
    }, 16, ["id"]));
  }
});
var Vc = defineComponent({
  __name: "DialogTrigger",
  props: {
    asChild: { type: Boolean },
    as: { default: "button" }
  },
  setup(e) {
    const t = e, n = He(), { forwardRef: o, currentElement: r } = ae();
    return n.contentId || (n.contentId = Ze(void 0, "reka-dialog-content")), onMounted(() => {
      n.triggerElement.value = r.value;
    }), (a, s) => (openBlock(), createBlock(unref(re), mergeProps(t, {
      ref: unref(o),
      type: a.as === "button" ? "button" : void 0,
      "aria-haspopup": "dialog",
      "aria-expanded": unref(n).open.value || false,
      "aria-controls": unref(n).open.value ? unref(n).contentId : void 0,
      "data-state": unref(n).open.value ? "open" : "closed",
      onClick: unref(n).onOpenToggle
    }), {
      default: withCtx(() => [
        renderSlot(a.$slots, "default")
      ]),
      _: 3
    }, 16, ["type", "aria-expanded", "aria-controls", "data-state", "onClick"]));
  }
});
function ct() {
  const e = ref(), t = computed(() => {
    var n, o;
    return ["#text", "#comment"].includes((n = e.value) == null ? void 0 : n.$el.nodeName) ? (o = e.value) == null ? void 0 : o.$el.nextElementSibling : Be(e);
  });
  return {
    primitiveElement: e,
    currentElement: t
  };
}
function zc() {
  return {
    ALT: "Alt",
    ARROW_DOWN: "ArrowDown",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
    ARROW_UP: "ArrowUp",
    BACKSPACE: "Backspace",
    CAPS_LOCK: "CapsLock",
    CONTROL: "Control",
    DELETE: "Delete",
    END: "End",
    ENTER: "Enter",
    ESCAPE: "Escape",
    F1: "F1",
    F10: "F10",
    F11: "F11",
    F12: "F12",
    F2: "F2",
    F3: "F3",
    F4: "F4",
    F5: "F5",
    F6: "F6",
    F7: "F7",
    F8: "F8",
    F9: "F9",
    HOME: "Home",
    META: "Meta",
    PAGE_DOWN: "PageDown",
    PAGE_UP: "PageUp",
    SHIFT: "Shift",
    SPACE: " ",
    TAB: "Tab",
    CTRL: "Control",
    ASTERISK: "*",
    SPACE_CODE: "Space"
  };
}
function Aa(e) {
  return computed(() => {
    var t;
    return qu(e) ? !!((t = Be(e)) != null && t.closest("form")) : true;
  });
}
var br = "data-reka-collection-item";
function Ke(e = {}) {
  const { key: t = "", isProvider: n = false } = e, o = `${t}CollectionProvider`;
  let r;
  if (n) {
    const u = ref(/* @__PURE__ */ new Map());
    r = {
      collectionRef: ref(),
      itemMap: u
    }, provide(o, r);
  } else
    r = inject(o);
  const a = (u = false) => {
    const d = r.collectionRef.value;
    if (!d)
      return [];
    const p = Array.from(d.querySelectorAll(`[${br}]`)), v = Array.from(r.itemMap.value.values()).sort(
      (h2, g) => p.indexOf(h2.ref) - p.indexOf(g.ref)
    );
    return u ? v : v.filter((h2) => h2.ref.dataset.disabled !== "");
  }, s = defineComponent({
    name: "CollectionSlot",
    setup(u, { slots: d }) {
      const { primitiveElement: p, currentElement: f } = ct();
      return watch(f, () => {
        r.collectionRef.value = f.value;
      }), () => h(ao, { ref: p }, d);
    }
  }), i = defineComponent({
    name: "CollectionItem",
    inheritAttrs: false,
    props: {
      value: {
        // It accepts any value
        validator: () => true
      }
    },
    setup(u, { slots: d, attrs: p }) {
      const { primitiveElement: f, currentElement: v } = ct();
      return watchEffect((h2) => {
        if (v.value) {
          const g = markRaw(v.value);
          r.itemMap.value.set(g, { ref: v.value, value: u.value }), h2(() => r.itemMap.value.delete(g));
        }
      }), () => h(ao, { ...p, [br]: "", ref: f }, d);
    }
  }), l = computed(() => Array.from(r.itemMap.value.values())), c = computed(() => r.itemMap.value.size);
  return { getItems: a, reactiveItems: l, itemMapSize: c, CollectionSlot: s, CollectionItem: i };
}
var $a = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function jc(e, t) {
  return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function Wc(e, t, n) {
  const o = jc(e.key, n);
  if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(o)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(o)))
    return $a[o];
}
var wr = defineComponent({
  inheritAttrs: false,
  __name: "VisuallyHiddenInputBubble",
  props: {
    name: {},
    value: {},
    checked: { type: Boolean, default: void 0 },
    required: { type: Boolean },
    disabled: { type: Boolean },
    feature: { default: "fully-hidden" }
  },
  setup(e) {
    const t = e, { primitiveElement: n, currentElement: o } = ct(), r = computed(() => t.checked ?? t.value);
    return watch(r, (a, s) => {
      if (!o.value)
        return;
      const i = o.value, l = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(l, "value").set;
      if (u && a !== s) {
        const d = new Event("input", { bubbles: true }), p = new Event("change", { bubbles: true });
        u.call(i, a), i.dispatchEvent(d), i.dispatchEvent(p);
      }
    }), (a, s) => (openBlock(), createBlock(ha, mergeProps({
      ref_key: "primitiveElement",
      ref: n
    }, { ...t, ...a.$attrs }, { as: "input" }), null, 16));
  }
});
var Hc = defineComponent({
  inheritAttrs: false,
  __name: "VisuallyHiddenInput",
  props: {
    name: {},
    value: {},
    checked: { type: Boolean, default: void 0 },
    required: { type: Boolean },
    disabled: { type: Boolean },
    feature: { default: "fully-hidden" }
  },
  setup(e) {
    const t = e, n = computed(
      () => typeof t.value == "object" && Array.isArray(t.value) && t.value.length === 0 && t.required
    ), o = computed(() => typeof t.value == "string" || typeof t.value == "number" || typeof t.value == "boolean" ? [{ name: t.name, value: t.value }] : typeof t.value == "object" && Array.isArray(t.value) ? t.value.flatMap((r, a) => typeof r == "object" ? Object.entries(r).map(([s, i]) => ({ name: `[${t.name}][${a}][${s}]`, value: i })) : { name: `[${t.name}][${a}]`, value: r }) : t.value !== null && typeof t.value == "object" && !Array.isArray(t.value) ? Object.entries(t.value).map(([r, a]) => ({ name: `[${t.name}][${r}]`, value: a })) : []);
    return (r, a) => n.value ? (openBlock(), createBlock(wr, mergeProps({ key: r.name }, { ...t, ...r.$attrs }, {
      name: r.name,
      value: r.value
    }), null, 16, ["name", "value"])) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(o.value, (s) => (openBlock(), createBlock(wr, mergeProps({
      key: s.name,
      ref_for: true
    }, { ...t, ...r.$attrs }, {
      name: s.name,
      value: s.value
    }), null, 16, ["name", "value"]))), 128));
  }
});
var [ka, Kc] = Ce("PopperRoot");
var Ta = defineComponent({
  inheritAttrs: false,
  __name: "PopperRoot",
  setup(e) {
    const t = ref();
    return Kc({
      anchor: t,
      onAnchorChange: (n) => t.value = n
    }), (n, o) => renderSlot(n.$slots, "default");
  }
});
var Ia = defineComponent({
  __name: "PopperAnchor",
  props: {
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const t = e, { forwardRef: n, currentElement: o } = ae(), r = ka();
    return watchPostEffect(() => {
      r.onAnchorChange(t.reference ?? o.value);
    }), (a, s) => (openBlock(), createBlock(unref(re), {
      ref: unref(n),
      as: a.as,
      "as-child": a.asChild
    }, {
      default: withCtx(() => [
        renderSlot(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
});
var qc = defineComponent({
  __name: "ComboboxAnchor",
  props: {
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const { forwardRef: t } = ae();
    return (n, o) => (openBlock(), createBlock(unref(Ia), {
      "as-child": "",
      reference: n.reference
    }, {
      default: withCtx(() => [
        createVNode(unref(re), mergeProps({
          ref: unref(t),
          "as-child": n.asChild,
          as: n.as
        }, n.$attrs), {
          default: withCtx(() => [
            renderSlot(n.$slots, "default")
          ]),
          _: 3
        }, 16, ["as-child", "as"])
      ]),
      _: 3
    }, 8, ["reference"]));
  }
});
function Uc(e) {
  return e !== null;
}
function Gc(e) {
  return {
    name: "transformOrigin",
    options: e,
    fn(t) {
      var g, x, y;
      const { placement: n, rects: o, middlewareData: r } = t, s = ((g = r.arrow) == null ? void 0 : g.centerOffset) !== 0, i = s ? 0 : e.arrowWidth, l = s ? 0 : e.arrowHeight, [c, u] = so(n), d = { start: "0%", center: "50%", end: "100%" }[u], p = (((x = r.arrow) == null ? void 0 : x.x) ?? 0) + i / 2, f = (((y = r.arrow) == null ? void 0 : y.y) ?? 0) + l / 2;
      let v = "", h2 = "";
      return c === "bottom" ? (v = s ? d : `${p}px`, h2 = `${-l}px`) : c === "top" ? (v = s ? d : `${p}px`, h2 = `${o.floating.height + l}px`) : c === "right" ? (v = `${-l}px`, h2 = s ? d : `${f}px`) : c === "left" && (v = `${o.floating.width + l}px`, h2 = s ? d : `${f}px`), { data: { x: v, y: h2 } };
    }
  };
}
function so(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
function Yc(e) {
  const t = ref(), n = computed(() => {
    var r;
    return ((r = t.value) == null ? void 0 : r.width) ?? 0;
  }), o = computed(() => {
    var r;
    return ((r = t.value) == null ? void 0 : r.height) ?? 0;
  });
  return onMounted(() => {
    const r = Be(e);
    if (r) {
      t.value = { width: r.offsetWidth, height: r.offsetHeight };
      const a = new ResizeObserver((s) => {
        if (!Array.isArray(s) || !s.length)
          return;
        const i = s[0];
        let l, c;
        if ("borderBoxSize" in i) {
          const u = i.borderBoxSize, d = Array.isArray(u) ? u[0] : u;
          l = d.inlineSize, c = d.blockSize;
        } else
          l = r.offsetWidth, c = r.offsetHeight;
        t.value = { width: l, height: c };
      });
      return a.observe(r, { box: "border-box" }), () => a.unobserve(r);
    } else
      t.value = void 0;
  }), {
    width: n,
    height: o
  };
}
var Xc = {
  side: "bottom",
  sideOffset: 0,
  align: "center",
  alignOffset: 0,
  arrowPadding: 0,
  avoidCollisions: true,
  collisionBoundary: () => [],
  collisionPadding: 0,
  sticky: "partial",
  hideWhenDetached: false,
  positionStrategy: "fixed",
  updatePositionStrategy: "optimized",
  prioritizePosition: false
};
var [ip, Jc] = Ce("PopperContent");
var Da = defineComponent({
  inheritAttrs: false,
  __name: "PopperContent",
  props: mergeDefaults({
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {}
  }, {
    ...Xc
  }),
  emits: ["placed"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = ka(), { forwardRef: a, currentElement: s } = ae(), i = ref(), l = ref(), { width: c, height: u } = Yc(l), d = computed(
      () => n.side + (n.align !== "center" ? `-${n.align}` : "")
    ), p = computed(() => typeof n.collisionPadding == "number" ? n.collisionPadding : { top: 0, right: 0, bottom: 0, left: 0, ...n.collisionPadding }), f = computed(() => Array.isArray(n.collisionBoundary) ? n.collisionBoundary : [n.collisionBoundary]), v = computed(() => ({
      padding: p.value,
      boundary: f.value.filter(Uc),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: f.value.length > 0
    })), h2 = Mu(() => [
      Au({
        mainAxis: n.sideOffset + u.value,
        alignmentAxis: n.alignOffset
      }),
      n.prioritizePosition && n.avoidCollisions && cr({
        ...v.value
      }),
      n.avoidCollisions && $u({
        mainAxis: true,
        crossAxis: !!n.prioritizePosition,
        limiter: n.sticky === "partial" ? Du() : void 0,
        ...v.value
      }),
      !n.prioritizePosition && n.avoidCollisions && cr({
        ...v.value
      }),
      ku({
        ...v.value,
        apply: ({ elements: M, rects: Z, availableWidth: G, availableHeight: J }) => {
          const { width: N, height: U } = Z.reference, L = M.floating.style;
          L.setProperty(
            "--reka-popper-available-width",
            `${G}px`
          ), L.setProperty(
            "--reka-popper-available-height",
            `${J}px`
          ), L.setProperty(
            "--reka-popper-anchor-width",
            `${N}px`
          ), L.setProperty(
            "--reka-popper-anchor-height",
            `${U}px`
          );
        }
      }),
      l.value && Fu({ element: l.value, padding: n.arrowPadding }),
      Gc({
        arrowWidth: c.value,
        arrowHeight: u.value
      }),
      n.hideWhenDetached && Tu({ strategy: "referenceHidden", ...v.value })
    ]), g = computed(() => n.reference ?? r.anchor.value), { floatingStyles: x, placement: y, isPositioned: b, middlewareData: w } = Bu(
      g,
      i,
      {
        strategy: n.positionStrategy,
        placement: d,
        whileElementsMounted: (...M) => Pu(...M, {
          layoutShift: !n.disableUpdateOnLayoutShift,
          animationFrame: n.updatePositionStrategy === "always"
        }),
        middleware: h2
      }
    ), C = computed(
      () => so(y.value)[0]
    ), E = computed(
      () => so(y.value)[1]
    );
    watchPostEffect(() => {
      b.value && o("placed");
    });
    const O = computed(
      () => {
        var M;
        return ((M = w.value.arrow) == null ? void 0 : M.centerOffset) !== 0;
      }
    ), _ = ref("");
    watchEffect(() => {
      s.value && (_.value = window.getComputedStyle(s.value).zIndex);
    });
    const T = computed(() => {
      var M;
      return ((M = w.value.arrow) == null ? void 0 : M.x) ?? 0;
    }), z = computed(() => {
      var M;
      return ((M = w.value.arrow) == null ? void 0 : M.y) ?? 0;
    });
    return Jc({
      placedSide: C,
      onArrowChange: (M) => l.value = M,
      arrowX: T,
      arrowY: z,
      shouldHideArrow: O
    }), (M, Z) => {
      var G, J, N;
      return openBlock(), createElementBlock("div", {
        ref_key: "floatingRef",
        ref: i,
        "data-reka-popper-content-wrapper": "",
        style: normalizeStyle({
          ...unref(x),
          transform: unref(b) ? unref(x).transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: _.value,
          "--reka-popper-transform-origin": [
            (G = unref(w).transformOrigin) == null ? void 0 : G.x,
            (J = unref(w).transformOrigin) == null ? void 0 : J.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((N = unref(w).hide) == null ? void 0 : N.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        })
      }, [
        createVNode(unref(re), mergeProps({ ref: unref(a) }, M.$attrs, {
          "as-child": n.asChild,
          as: M.as,
          "data-side": C.value,
          "data-align": E.value,
          style: {
            // if the PopperContent hasn't been placed yet (not all measurements done)
            // we prevent animations so that users's animation don't kick in too early referring wrong sides
            animation: unref(b) ? void 0 : "none"
          }
        }), {
          default: withCtx(() => [
            renderSlot(M.$slots, "default")
          ]),
          _: 3
        }, 16, ["as-child", "as", "data-side", "data-align", "style"])
      ], 4);
    };
  }
});
function Zc(e) {
  const t = computed(() => unref(e)), n = computed(() => new Intl.Collator("en", { usage: "search", ...t.value }));
  return {
    startsWith: (s, i) => i.length === 0 ? true : (s = s.normalize("NFC"), i = i.normalize("NFC"), n.value.compare(s.slice(0, i.length), i) === 0),
    endsWith: (s, i) => i.length === 0 ? true : (s = s.normalize("NFC"), i = i.normalize("NFC"), n.value.compare(s.slice(-i.length), i) === 0),
    contains: (s, i) => {
      if (i.length === 0)
        return true;
      s = s.normalize("NFC"), i = i.normalize("NFC");
      let l = 0;
      const c = i.length;
      for (; l + c <= s.length; l++) {
        const u = s.slice(l, l + c);
        if (n.value.compare(i, u) === 0)
          return true;
      }
      return false;
    }
  };
}
function xr(e) {
  return e == null ? void 0 : e.querySelector("[data-state=checked]");
}
function Qc(e, t, n) {
  return e === void 0 ? false : Array.isArray(e) ? e.some((o) => it(o, t, n)) : it(e, t, n);
}
function it(e, t, n) {
  return e === void 0 || t === void 0 ? false : typeof e == "string" ? e === t : typeof n == "function" ? n(e, t) : typeof n == "string" ? (e == null ? void 0 : e[n]) === (t == null ? void 0 : t[n]) : bn(e, t);
}
function No(e) {
  const t = _o("", 1e3);
  return {
    search: t,
    handleTypeaheadSearch: (r, a) => {
      t.value = t.value + r;
      {
        const s = xe(), i = a.map((p) => {
          var f, v;
          return {
            ...p,
            textValue: ((f = p.value) == null ? void 0 : f.textValue) ?? ((v = p.ref.textContent) == null ? void 0 : v.trim()) ?? ""
          };
        }), l = i.find((p) => p.ref === s), c = i.map((p) => p.textValue), u = _a(c, t.value, l == null ? void 0 : l.textValue), d = i.find((p) => p.textValue === u);
        return d && d.ref.focus(), d == null ? void 0 : d.ref;
      }
    },
    resetTypeahead: () => {
      t.value = "";
    }
  };
}
function ed(e, t) {
  return e.map((n, o) => e[(t + o) % e.length]);
}
function _a(e, t, n) {
  const r = t.length > 1 && Array.from(t).every((c) => c === t[0]) ? t[0] : t, a = n ? e.indexOf(n) : -1;
  let s = ed(e, Math.max(a, 0));
  r.length === 1 && (s = s.filter((c) => c !== n));
  const l = s.find(
    (c) => c.toLowerCase().startsWith(r.toLowerCase())
  );
  return l !== n ? l : void 0;
}
function mn(e, t, n) {
  const o = e.findIndex((i) => bn(i, t)), r = e.findIndex((i) => bn(i, n));
  if (o === -1 || r === -1)
    return [];
  const [a, s] = [o, r].sort((i, l) => i - l);
  return e.slice(a, s + 1);
}
var [tn, td] = Ce("ListboxRoot");
var nd = defineComponent({
  __name: "ListboxRoot",
  props: {
    modelValue: {},
    defaultValue: {},
    multiple: { type: Boolean },
    orientation: { default: "vertical" },
    dir: {},
    disabled: { type: Boolean },
    selectionBehavior: { default: "toggle" },
    highlightOnHover: { type: Boolean },
    by: {},
    asChild: { type: Boolean },
    as: {},
    name: {},
    required: { type: Boolean }
  },
  emits: ["update:modelValue", "highlight", "entryFocus", "leave"],
  setup(e, { expose: t, emit: n }) {
    const o = e, r = n, { multiple: a, highlightOnHover: s, orientation: i, disabled: l, selectionBehavior: c, dir: u } = toRefs(o), { getItems: d } = Ke({ isProvider: true }), { handleTypeaheadSearch: p } = No(), { primitiveElement: f, currentElement: v } = ct(), h2 = zc(), g = Lo(u), x = Aa(v), y = ref(), b = ref(false), w = ref(true), C = ut(o, "modelValue", r, {
      defaultValue: o.defaultValue ?? (a.value ? [] : void 0),
      passive: o.modelValue === void 0,
      deep: true
    });
    function E(R) {
      if (b.value = true, o.multiple) {
        const H = Array.isArray(C.value) ? [...C.value] : [], q = H.findIndex((te) => it(te, R, o.by));
        o.selectionBehavior === "toggle" ? (q === -1 ? H.push(R) : H.splice(q, 1), C.value = H) : (C.value = [R], y.value = R);
      } else
        o.selectionBehavior === "toggle" && it(C.value, R, o.by) ? C.value = void 0 : C.value = R;
      setTimeout(() => {
        b.value = false;
      }, 1);
    }
    const O = ref(null), _ = ref(null), T = ref(false), z = ref(false), M = pn(), Z = pn(), G = pn();
    function J() {
      return d().map((R) => R.ref).filter((R) => R.dataset.disabled !== "");
    }
    function N(R, H = true) {
      if (!R)
        return;
      O.value = R, w.value && O.value.focus(), H && O.value.scrollIntoView({ block: "nearest" });
      const q = d().find((te) => te.ref === R);
      r("highlight", q);
    }
    function U(R) {
      if (T.value)
        G.trigger(R);
      else {
        const H = d().find((q) => it(q.value, R, o.by));
        H && (O.value = H.ref, N(H.ref));
      }
    }
    function L(R) {
      O.value && O.value.isConnected && (R.preventDefault(), R.stopPropagation(), z.value || O.value.click());
    }
    function D(R) {
      if (w.value) {
        if (b.value = true, T.value)
          Z.trigger(R);
        else {
          const H = R.altKey || R.ctrlKey || R.metaKey;
          if (H && R.key === "a" && a.value) {
            const q = d(), te = q.map((me) => me.value);
            C.value = [...te], R.preventDefault(), N(q[q.length - 1].ref);
          } else if (!H) {
            const q = p(R.key, d());
            q && N(q);
          }
        }
        setTimeout(() => {
          b.value = false;
        }, 1);
      }
    }
    function j() {
      z.value = true;
    }
    function Y() {
      requestAnimationFrame(() => {
        z.value = false;
      });
    }
    function ye() {
      nextTick(() => {
        const R = new KeyboardEvent("keydown", { key: "PageUp" });
        he(R);
      });
    }
    function be(R) {
      const H = O.value;
      H != null && H.isConnected && (_.value = H), O.value = null, r("leave", R);
    }
    function tt(R) {
      var q, te;
      const H = new CustomEvent("listbox.entryFocus", { bubbles: false, cancelable: true });
      if ((q = R.currentTarget) == null || q.dispatchEvent(H), r("entryFocus", H), !H.defaultPrevented)
        if (_.value)
          N(_.value);
        else {
          const me = (te = J()) == null ? void 0 : te[0];
          N(me);
        }
    }
    function he(R) {
      const H = Wc(R, i.value, g.value);
      if (!H)
        return;
      let q = J();
      if (O.value) {
        if (H === "last")
          q.reverse();
        else if (H === "prev" || H === "next") {
          H === "prev" && q.reverse();
          const te = q.indexOf(O.value);
          q = q.slice(te + 1);
        }
        we(R, q[0]);
      }
      if (q.length) {
        const te = !O.value && H === "prev" ? q.length - 1 : 0;
        N(q[te]);
      }
      if (T.value)
        return Z.trigger(R);
    }
    function we(R, H) {
      var te;
      if (!(T.value || o.selectionBehavior !== "replace" || !a.value || !Array.isArray(C.value) || (R.altKey || R.ctrlKey || R.metaKey) && !R.shiftKey) && R.shiftKey) {
        const me = d().filter((mt) => mt.ref.dataset.disabled !== "");
        let Te = (te = me.find((mt) => mt.ref === H)) == null ? void 0 : te.value;
        if (R.key === h2.END ? Te = me[me.length - 1].value : R.key === h2.HOME && (Te = me[0].value), !Te || !y.value)
          return;
        const ot = mn(me.map((mt) => mt.value), y.value, Te);
        C.value = ot;
      }
    }
    async function nt(R) {
      if (await nextTick(), T.value)
        M.trigger(R);
      else {
        const H = J(), q = H.find((te) => te.dataset.state === "checked");
        q ? N(q) : H.length && N(H[0]);
      }
    }
    return watch(C, () => {
      b.value || nextTick(() => {
        nt();
      });
    }, { immediate: true, deep: true }), t({
      highlightedElement: O,
      highlightItem: U,
      highlightFirstItem: ye,
      highlightSelected: nt,
      getItems: d
    }), td({
      modelValue: C,
      // @ts-expect-error ignoring
      onValueChange: E,
      multiple: a,
      orientation: i,
      dir: g,
      disabled: l,
      highlightOnHover: s,
      highlightedElement: O,
      isVirtual: T,
      virtualFocusHook: M,
      virtualKeydownHook: Z,
      virtualHighlightHook: G,
      by: o.by,
      firstValue: y,
      selectionBehavior: c,
      focusable: w,
      onLeave: be,
      onEnter: tt,
      changeHighlight: N,
      onKeydownEnter: L,
      onKeydownNavigation: he,
      onKeydownTypeAhead: D,
      onCompositionStart: j,
      onCompositionEnd: Y,
      highlightFirstItem: ye
    }), (R, H) => (openBlock(), createBlock(unref(re), {
      ref_key: "primitiveElement",
      ref: f,
      as: R.as,
      "as-child": R.asChild,
      dir: unref(g),
      "data-disabled": unref(l) ? "" : void 0,
      onPointerleave: be,
      onFocusout: H[0] || (H[0] = async (q) => {
        const te = q.relatedTarget || q.target;
        await nextTick(), O.value && unref(v) && !unref(v).contains(te) && be(q);
      })
    }, {
      default: withCtx(() => [
        renderSlot(R.$slots, "default", { modelValue: unref(C) }),
        unref(x) && R.name ? (openBlock(), createBlock(unref(Hc), {
          key: 0,
          name: R.name,
          value: unref(C),
          disabled: unref(l),
          required: R.required
        }, null, 8, ["name", "value", "disabled", "required"])) : createCommentVNode("", true)
      ]),
      _: 3
    }, 8, ["as", "as-child", "dir", "data-disabled"]));
  }
});
var [Rt, od] = Ce("ComboboxRoot");
var rd = defineComponent({
  __name: "ComboboxRoot",
  props: {
    open: { type: Boolean, default: void 0 },
    defaultOpen: { type: Boolean },
    resetSearchTermOnBlur: { type: Boolean, default: true },
    resetSearchTermOnSelect: { type: Boolean, default: true },
    ignoreFilter: { type: Boolean },
    modelValue: {},
    defaultValue: {},
    multiple: { type: Boolean },
    dir: {},
    disabled: { type: Boolean },
    highlightOnHover: { type: Boolean },
    by: {},
    asChild: { type: Boolean },
    as: {},
    name: {},
    required: { type: Boolean }
  },
  emits: ["update:modelValue", "highlight", "update:open"],
  setup(e, { expose: t, emit: n }) {
    var Z, G, J;
    const o = e, r = n, { primitiveElement: a, currentElement: s } = ct(), { multiple: i, disabled: l, ignoreFilter: c, resetSearchTermOnSelect: u, dir: d } = toRefs(o), p = Lo(d), f = ut(o, "modelValue", r, {
      defaultValue: o.defaultValue ?? (i.value ? [] : void 0),
      passive: o.modelValue === void 0,
      deep: true
    }), v = ut(o, "open", r, {
      defaultValue: o.defaultOpen,
      passive: o.open === void 0
    });
    async function h2(N) {
      var U, L;
      v.value = N, T.search = "", N ? (await nextTick(), (U = a.value) == null || U.highlightSelected(), x.value = true) : x.value = false, (L = b.value) == null || L.focus(), setTimeout(() => {
        !N && o.resetSearchTermOnBlur && g.trigger();
      }, 1);
    }
    const g = pn(), x = ref(false), y = ref(false), b = ref(), w = ref(), C = computed(() => {
      var N;
      return ((N = a.value) == null ? void 0 : N.highlightedElement) ?? void 0;
    }), E = ref(/* @__PURE__ */ new Map()), O = ref(/* @__PURE__ */ new Map()), { contains: _ } = Zc({ sensitivity: "base" }), T = reactive({
      search: "",
      filtered: {
        /** The count of all visible items. */
        count: 0,
        /** Map from visible item id to its search score. */
        items: /* @__PURE__ */ new Map(),
        /** Set of groups with at least one visible item. */
        groups: /* @__PURE__ */ new Set()
      }
    });
    function z() {
      if (!T.search || o.ignoreFilter || y.value) {
        T.filtered.count = E.value.size;
        return;
      }
      T.filtered.groups = /* @__PURE__ */ new Set();
      let N = 0;
      for (const [U, L] of E.value) {
        const D = _(L, T.search);
        T.filtered.items.set(U, D ? 1 : 0), D && N++;
      }
      for (const [U, L] of O.value)
        for (const D of L)
          if (T.filtered.items.get(D) > 0) {
            T.filtered.groups.add(U);
            break;
          }
      T.filtered.count = N;
    }
    watch([() => T.search, () => E.value.size], () => {
      z();
    }, { immediate: true }), watch(() => v.value, () => {
      nextTick(() => {
        v.value && z();
      });
    }, { flush: "post" });
    const M = getCurrentInstance();
    return onMounted(() => {
      var N, U, L;
      M != null && M.exposed && (M.exposed.highlightItem = (N = a.value) == null ? void 0 : N.highlightItem, M.exposed.highlightFirstItem = (U = a.value) == null ? void 0 : U.highlightFirstItem, M.exposed.highlightSelected = (L = a.value) == null ? void 0 : L.highlightSelected);
    }), t({
      filtered: computed(() => T.filtered),
      highlightedElement: C,
      highlightItem: (Z = a.value) == null ? void 0 : Z.highlightItem,
      highlightFirstItem: (G = a.value) == null ? void 0 : G.highlightFirstItem,
      highlightSelected: (J = a.value) == null ? void 0 : J.highlightSelected
    }), od({
      modelValue: f,
      multiple: i,
      disabled: l,
      open: v,
      onOpenChange: h2,
      contentId: "",
      isUserInputted: x,
      isVirtual: y,
      inputElement: b,
      highlightedElement: C,
      onInputElementChange: (N) => b.value = N,
      triggerElement: w,
      onTriggerElementChange: (N) => w.value = N,
      parentElement: s,
      resetSearchTermOnSelect: u,
      onResetSearchTerm: g.on,
      allItems: E,
      allGroups: O,
      filterState: T,
      ignoreFilter: c
    }), (N, U) => (openBlock(), createBlock(unref(Ta), null, {
      default: withCtx(() => [
        createVNode(unref(nd), mergeProps({
          ref_key: "primitiveElement",
          ref: a
        }, N.$attrs, {
          modelValue: unref(f),
          "onUpdate:modelValue": U[0] || (U[0] = (L) => isRef(f) ? f.value = L : null),
          style: {
            pointerEvents: unref(v) ? "auto" : void 0
          },
          as: N.as,
          "as-child": N.asChild,
          dir: unref(p),
          multiple: unref(i),
          name: N.name,
          required: N.required,
          disabled: unref(l),
          "highlight-on-hover": true,
          by: o.by,
          onHighlight: U[1] || (U[1] = (L) => r("highlight", L))
        }), {
          default: withCtx(() => [
            renderSlot(N.$slots, "default", {
              open: unref(v),
              modelValue: unref(f)
            })
          ]),
          _: 3
        }, 16, ["modelValue", "style", "as", "as-child", "dir", "multiple", "name", "required", "disabled", "by"])
      ]),
      _: 3
    }));
  }
});
var ad = defineComponent({
  __name: "ListboxContent",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const { CollectionSlot: t } = Ke(), n = tn(), o = _o(false, 10);
    return (r, a) => (openBlock(), createBlock(unref(t), null, {
      default: withCtx(() => [
        createVNode(unref(re), {
          role: "listbox",
          as: r.as,
          "as-child": r.asChild,
          tabindex: unref(n).focusable.value ? unref(n).highlightedElement.value ? "-1" : "0" : void 0,
          "aria-orientation": unref(n).orientation.value,
          "aria-multiselectable": !!unref(n).multiple.value,
          "data-orientation": unref(n).orientation.value,
          onMousedown: a[0] || (a[0] = withModifiers((s) => o.value = true, ["left"])),
          onFocus: a[1] || (a[1] = (s) => {
            unref(o) || unref(n).onEnter(s);
          }),
          onKeydown: [
            a[2] || (a[2] = withKeys(withModifiers((s) => {
              unref(n).focusable.value && unref(n).onKeydownNavigation(s);
            }, ["prevent"]), ["down", "up", "left", "right", "home", "end"])),
            withKeys(unref(n).onKeydownEnter, ["enter"]),
            unref(n).onKeydownTypeAhead
          ]
        }, {
          default: withCtx(() => [
            renderSlot(r.$slots, "default")
          ]),
          _: 3
        }, 8, ["as", "as-child", "tabindex", "aria-orientation", "aria-multiselectable", "data-orientation", "onKeydown"])
      ]),
      _: 3
    }));
  }
});
var [sp, id] = Ce("ComboboxContent");
var sd = defineComponent({
  __name: "ComboboxContentImpl",
  props: {
    position: { default: "inline" },
    bodyLock: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {},
    disableOutsidePointerEvents: { type: Boolean }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside"],
  setup(e, { emit: t }) {
    const n = e, o = t, { position: r } = toRefs(n), a = Rt(), { forwardRef: s, currentElement: i } = ae();
    Ro(n.bodyLock), Bo(a.parentElement);
    const l = computed(() => n.position === "popper" ? n : {}), c = Rn(l.value), u = {
      // Ensure border-box for floating-ui calculations
      boxSizing: "border-box",
      "--reka-combobox-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-combobox-content-available-width": "var(--reka-popper-available-width)",
      "--reka-combobox-content-available-height": "var(--reka-popper-available-height)",
      "--reka-combobox-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-combobox-trigger-height": "var(--reka-popper-anchor-height)"
    };
    id({ position: r });
    const d = ref(false);
    return onMounted(() => {
      a.inputElement.value && (d.value = i.value.contains(a.inputElement.value), d.value && a.inputElement.value.focus());
    }), onUnmounted(() => {
      var p;
      d.value && ((p = a.triggerElement.value) == null || p.focus());
    }), (p, f) => (openBlock(), createBlock(unref(ad), { "as-child": "" }, {
      default: withCtx(() => [
        createVNode(unref(Fo), {
          "as-child": "",
          "disable-outside-pointer-events": p.disableOutsidePointerEvents,
          onDismiss: f[0] || (f[0] = (v) => unref(a).onOpenChange(false)),
          onFocusOutside: f[1] || (f[1] = (v) => {
            var h2;
            (h2 = unref(a).parentElement.value) != null && h2.contains(v.target) && v.preventDefault(), o("focusOutside", v);
          }),
          onInteractOutside: f[2] || (f[2] = (v) => o("interactOutside", v)),
          onEscapeKeyDown: f[3] || (f[3] = (v) => o("escapeKeyDown", v)),
          onPointerDownOutside: f[4] || (f[4] = (v) => {
            var h2;
            (h2 = unref(a).parentElement.value) != null && h2.contains(v.target) && v.preventDefault(), o("pointerDownOutside", v);
          })
        }, {
          default: withCtx(() => [
            (openBlock(), createBlock(resolveDynamicComponent(unref(r) === "popper" ? unref(Da) : unref(re)), mergeProps({ ...p.$attrs, ...unref(c) }, {
              id: unref(a).contentId,
              ref: unref(s),
              "data-state": unref(a).open.value ? "open" : "closed",
              style: {
                // flex layout so we can place the scroll buttons properly
                display: "flex",
                flexDirection: "column",
                // reset the outline by default as the content MAY get focused
                outline: "none",
                ...unref(r) === "popper" ? u : {}
              }
            }), {
              default: withCtx(() => [
                renderSlot(p.$slots, "default")
              ]),
              _: 3
            }, 16, ["id", "data-state", "style"]))
          ]),
          _: 3
        }, 8, ["disable-outside-pointer-events"])
      ]),
      _: 3
    }));
  }
});
var ld = defineComponent({
  __name: "ComboboxContent",
  props: {
    forceMount: { type: Boolean },
    position: {},
    bodyLock: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {},
    disableOutsidePointerEvents: { type: Boolean }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside"],
  setup(e, { emit: t }) {
    const r = Pa(e, t), { forwardRef: a } = ae(), s = Rt();
    return s.contentId || (s.contentId = Ze(void 0, "reka-combobox-content")), (i, l) => (openBlock(), createBlock(unref(Ln), {
      present: i.forceMount || unref(s).open.value
    }, {
      default: withCtx(() => [
        createVNode(sd, mergeProps({ ...unref(r), ...i.$attrs }, { ref: unref(a) }), {
          default: withCtx(() => [
            renderSlot(i.$slots, "default")
          ]),
          _: 3
        }, 16)
      ]),
      _: 3
    }, 8, ["present"]));
  }
});
var [ud, lp] = Ce("ComboboxGroup");
var cd = defineComponent({
  __name: "ListboxFilter",
  props: {
    modelValue: {},
    autoFocus: { type: Boolean },
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: { default: "input" }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, r = ut(n, "modelValue", t, {
      defaultValue: "",
      passive: n.modelValue === void 0
    }), a = tn(), { primitiveElement: s, currentElement: i } = ct(), l = computed(() => n.disabled || a.disabled.value || false), c = ref();
    return watchSyncEffect(() => {
      var u;
      return c.value = (u = a.highlightedElement.value) == null ? void 0 : u.id;
    }), onMounted(() => {
      a.focusable.value = false, setTimeout(() => {
        var u;
        n.autoFocus && ((u = i.value) == null || u.focus());
      }, 1);
    }), onUnmounted(() => {
      a.focusable.value = true;
    }), (u, d) => (openBlock(), createBlock(unref(re), {
      ref_key: "primitiveElement",
      ref: s,
      as: u.as,
      "as-child": u.asChild,
      value: unref(r),
      disabled: l.value ? "" : void 0,
      "data-disabled": l.value ? "" : void 0,
      "aria-disabled": l.value ?? void 0,
      "aria-activedescendant": c.value,
      type: "text",
      onKeydown: [
        withKeys(withModifiers(unref(a).onKeydownNavigation, ["prevent"]), ["down", "up", "home", "end"]),
        withKeys(unref(a).onKeydownEnter, ["enter"])
      ],
      onInput: d[0] || (d[0] = (p) => {
        r.value = p.target.value, unref(a).highlightFirstItem(p);
      }),
      onCompositionstart: unref(a).onCompositionStart,
      onCompositionend: unref(a).onCompositionEnd
    }, {
      default: withCtx(() => [
        renderSlot(u.$slots, "default", { modelValue: unref(r) })
      ]),
      _: 3
    }, 8, ["as", "as-child", "value", "disabled", "data-disabled", "aria-disabled", "aria-activedescendant", "onKeydown", "onCompositionstart", "onCompositionend"]));
  }
});
var dd = defineComponent({
  __name: "ComboboxInput",
  props: {
    displayValue: {},
    modelValue: {},
    autoFocus: { type: Boolean },
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: { default: "input" }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = Rt(), a = tn(), { primitiveElement: s, currentElement: i } = ct(), l = ut(n, "modelValue", o, {
      passive: n.modelValue === void 0
    });
    onMounted(() => {
      i.value && r.onInputElementChange(i.value);
    });
    function c(p) {
      r.open.value || r.onOpenChange(true);
    }
    function u(p) {
      const f = p.target;
      r.open.value ? r.filterState.search = f.value : (r.onOpenChange(true), nextTick(() => {
        f.value && (r.filterState.search = f.value, a.highlightFirstItem(p));
      }));
    }
    function d() {
      const p = r.modelValue.value;
      n.displayValue ? l.value = n.displayValue(p) : !r.multiple.value && p && !Array.isArray(p) && typeof p != "object" ? l.value = p.toString() : l.value = "", nextTick(() => {
        l.value = l.value;
      });
    }
    return r.onResetSearchTerm(() => {
      d();
    }), watch(r.modelValue, async () => {
      !r.isUserInputted.value && r.resetSearchTermOnSelect.value && d();
    }, { immediate: true, deep: true }), watch(
      () => n.modelValue,
      () => {
        n.modelValue !== void 0 && (r.filterState.search = n.modelValue);
      }
    ), (p, f) => (openBlock(), createBlock(unref(cd), {
      ref_key: "primitiveElement",
      ref: s,
      modelValue: unref(l),
      "onUpdate:modelValue": f[0] || (f[0] = (v) => isRef(l) ? l.value = v : null),
      as: p.as,
      "as-child": p.asChild,
      "auto-focus": p.autoFocus,
      "aria-expanded": unref(r).open.value,
      "aria-controls": unref(r).contentId,
      "aria-autocomplete": "list",
      role: "combobox",
      autocomplete: "false",
      onInput: u,
      onKeydown: withKeys(withModifiers(c, ["prevent"]), ["down", "up"])
    }, {
      default: withCtx(() => [
        renderSlot(p.$slots, "default")
      ]),
      _: 3
    }, 8, ["modelValue", "as", "as-child", "auto-focus", "aria-expanded", "aria-controls", "onKeydown"]));
  }
});
var fd = "listbox.select";
var [up, pd] = Ce("ListboxItem");
var md = defineComponent({
  __name: "ListboxItem",
  props: {
    value: {},
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: { default: "div" }
  },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = Ze(void 0, "reka-listbox-item"), { CollectionItem: a } = Ke(), { forwardRef: s, currentElement: i } = ae(), l = tn(), c = computed(() => i.value === l.highlightedElement.value), u = computed(() => Qc(l.modelValue.value, n.value, l.by)), d = computed(() => l.disabled.value || n.disabled);
    async function p(v) {
      o("select", v), !(v != null && v.defaultPrevented) && !d.value && v && (l.onValueChange(n.value), l.changeHighlight(i.value));
    }
    function f(v) {
      const h2 = { originalEvent: v, value: n.value };
      Bn(fd, p, h2);
    }
    return pd({
      isSelected: u
    }), (v, h2) => (openBlock(), createBlock(unref(a), { value: v.value }, {
      default: withCtx(() => [
        withMemo([c.value, u.value], () => createVNode(unref(re), mergeProps({ id: unref(r) }, v.$attrs, {
          ref: unref(s),
          role: "option",
          tabindex: unref(l).focusable.value ? c.value ? "0" : "-1" : -1,
          "aria-selected": u.value,
          as: v.as,
          "as-child": v.asChild,
          disabled: d.value ? "" : void 0,
          "data-disabled": d.value ? "" : void 0,
          "data-highlighted": c.value ? "" : void 0,
          "data-state": u.value ? "checked" : "unchecked",
          onClick: f,
          onKeydown: withKeys(withModifiers(f, ["prevent"]), ["space"]),
          onPointermove: h2[0] || (h2[0] = (g) => {
            unref(l).highlightedElement.value !== unref(i) && (unref(l).highlightOnHover.value ? unref(l).changeHighlight(unref(i), false) : unref(l).focusable.value || unref(l).changeHighlight(unref(i), false));
          })
        }), {
          default: withCtx(() => [
            renderSlot(v.$slots, "default")
          ]),
          _: 3
        }, 16, ["id", "tabindex", "aria-selected", "as", "as-child", "disabled", "data-disabled", "data-highlighted", "data-state", "onKeydown"]), h2, 1)
      ]),
      _: 3
    }, 8, ["value"]));
  }
});
var vd = defineComponent({
  __name: "ComboboxItem",
  props: {
    textValue: {},
    value: {},
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = Ze(void 0, "reka-combobox-item"), a = Rt(), s = ud(null), { primitiveElement: i, currentElement: l } = ct();
    if (n.value === "")
      throw new Error(
        "A <ComboboxItem /> must have a value prop that is not an empty string. This is because the Combobox value can be set to an empty string to clear the selection and show the placeholder."
      );
    const c = computed(() => {
      if (a.isVirtual.value || a.ignoreFilter.value || !a.filterState.search)
        return true;
      {
        const u = a.filterState.filtered.items.get(r);
        return u === void 0 ? true : u > 0;
      }
    });
    return onMounted(() => {
      var d;
      a.allItems.value.set(r, n.textValue || l.value.textContent || l.value.innerText);
      const u = s == null ? void 0 : s.id;
      u && (a.allGroups.value.has(u) ? (d = a.allGroups.value.get(u)) == null || d.add(r) : a.allGroups.value.set(u, /* @__PURE__ */ new Set([r])));
    }), onUnmounted(() => {
      a.allItems.value.delete(r);
    }), (u, d) => c.value ? (openBlock(), createBlock(unref(md), mergeProps({ key: 0 }, n, {
      id: unref(r),
      ref_key: "primitiveElement",
      ref: i,
      disabled: unref(a).disabled.value || u.disabled,
      onSelect: d[0] || (d[0] = (p) => {
        o("select", p), !p.defaultPrevented && !unref(a).multiple.value && !u.disabled && !unref(a).disabled.value && (p.preventDefault(), unref(a).onOpenChange(false), unref(a).modelValue.value = n.value);
      })
    }), {
      default: withCtx(() => [
        renderSlot(u.$slots, "default", {}, () => [
          createTextVNode(toDisplayString(u.value), 1)
        ])
      ]),
      _: 3
    }, 16, ["id", "disabled"])) : createCommentVNode("", true);
  }
});
var hd = defineComponent({
  __name: "ComboboxPortal",
  props: {
    to: {},
    disabled: { type: Boolean },
    defer: { type: Boolean },
    forceMount: { type: Boolean }
  },
  setup(e) {
    const t = e;
    return (n, o) => (openBlock(), createBlock(unref(Mo), normalizeProps(guardReactiveProps(t)), {
      default: withCtx(() => [
        renderSlot(n.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
});
function La(e) {
  const t = _n({
    nonce: ref()
  });
  return computed(() => {
    var n;
    return (e == null ? void 0 : e.value) || ((n = t.nonce) == null ? void 0 : n.value);
  });
}
var gd = defineComponent({
  __name: "ComboboxViewport",
  props: {
    nonce: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const t = e, { forwardRef: n } = ae(), { nonce: o } = toRefs(t), r = La(o), a = Rt();
    return (s, i) => (openBlock(), createElementBlock(Fragment, null, [
      createVNode(unref(re), mergeProps({ ...s.$attrs, ...t }, {
        ref: unref(n),
        "data-reka-combobox-viewport": "",
        role: "presentation",
        style: {
          // we use position: 'relative' here on the `viewport` so that when we call
          // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
          // (independent of the scrollUpButton).
          position: "relative",
          flex: unref(a).isVirtual.value ? void 0 : 1,
          overflow: "auto"
        }
      }), {
        default: withCtx(() => [
          renderSlot(s.$slots, "default")
        ]),
        _: 3
      }, 16, ["style"]),
      createVNode(unref(re), {
        as: "style",
        nonce: unref(r)
      }, {
        default: withCtx(() => i[0] || (i[0] = [
          createTextVNode(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-combobox-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-combobox-viewport]::-webkit-scrollbar { display: none; } ")
        ])),
        _: 1
      }, 8, ["nonce"])
    ], 64));
  }
});
function St(e, t, n) {
  let o = n.initialDeps ?? [], r;
  function a() {
    var s, i, l, c;
    let u;
    n.key && ((s = n.debug) != null && s.call(n)) && (u = Date.now());
    const d = e();
    if (!(d.length !== o.length || d.some((v, h2) => o[h2] !== v)))
      return r;
    o = d;
    let f;
    if (n.key && ((i = n.debug) != null && i.call(n)) && (f = Date.now()), r = t(...d), n.key && ((l = n.debug) != null && l.call(n))) {
      const v = Math.round((Date.now() - u) * 100) / 100, h2 = Math.round((Date.now() - f) * 100) / 100, g = h2 / 16, x = (y, b) => {
        for (y = String(y); y.length < b; )
          y = " " + y;
        return y;
      };
      console.info(
        `%c⏱ ${x(h2, 5)} /${x(v, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * g, 120)
        )}deg 100% 31%);`,
        n == null ? void 0 : n.key
      );
    }
    return (c = n == null ? void 0 : n.onChange) == null || c.call(n, r), r;
  }
  return a.updateDeps = (s) => {
    o = s;
  }, a;
}
function Cr(e, t) {
  if (e === void 0)
    throw new Error("Unexpected undefined");
  return e;
}
var yd = (e, t) => Math.abs(e - t) <= 1;
var bd = (e, t, n) => {
  let o;
  return function(...r) {
    e.clearTimeout(o), o = e.setTimeout(() => t.apply(this, r), n);
  };
};
var Sr = (e) => {
  const { offsetWidth: t, offsetHeight: n } = e;
  return { width: t, height: n };
};
var wd = (e) => e;
var xd = (e) => {
  const t = Math.max(e.startIndex - e.overscan, 0), n = Math.min(e.endIndex + e.overscan, e.count - 1), o = [];
  for (let r = t; r <= n; r++)
    o.push(r);
  return o;
};
var Cd = (e, t) => {
  const n = e.scrollElement;
  if (!n)
    return;
  const o = e.targetWindow;
  if (!o)
    return;
  const r = (s) => {
    const { width: i, height: l } = s;
    t({ width: Math.round(i), height: Math.round(l) });
  };
  if (r(Sr(n)), !o.ResizeObserver)
    return () => {
    };
  const a = new o.ResizeObserver((s) => {
    const i = () => {
      const l = s[0];
      if (l != null && l.borderBoxSize) {
        const c = l.borderBoxSize[0];
        if (c) {
          r({ width: c.inlineSize, height: c.blockSize });
          return;
        }
      }
      r(Sr(n));
    };
    e.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(i) : i();
  });
  return a.observe(n, { box: "border-box" }), () => {
    a.unobserve(n);
  };
};
var Er = {
  passive: true
};
var Or = typeof window > "u" ? true : "onscrollend" in window;
var Sd = (e, t) => {
  const n = e.scrollElement;
  if (!n)
    return;
  const o = e.targetWindow;
  if (!o)
    return;
  let r = 0;
  const a = e.options.useScrollendEvent && Or ? () => {
  } : bd(
    o,
    () => {
      t(r, false);
    },
    e.options.isScrollingResetDelay
  ), s = (u) => () => {
    const { horizontal: d, isRtl: p } = e.options;
    r = d ? n.scrollLeft * (p && -1 || 1) : n.scrollTop, a(), t(r, u);
  }, i = s(true), l = s(false);
  l(), n.addEventListener("scroll", i, Er);
  const c = e.options.useScrollendEvent && Or;
  return c && n.addEventListener("scrollend", l, Er), () => {
    n.removeEventListener("scroll", i), c && n.removeEventListener("scrollend", l);
  };
};
var Ed = (e, t, n) => {
  if (t != null && t.borderBoxSize) {
    const o = t.borderBoxSize[0];
    if (o)
      return Math.round(
        o[n.options.horizontal ? "inlineSize" : "blockSize"]
      );
  }
  return e[n.options.horizontal ? "offsetWidth" : "offsetHeight"];
};
var Od = (e, {
  adjustments: t = 0,
  behavior: n
}, o) => {
  var r, a;
  const s = e + t;
  (a = (r = o.scrollElement) == null ? void 0 : r.scrollTo) == null || a.call(r, {
    [o.options.horizontal ? "left" : "top"]: s,
    behavior: n
  });
};
var Pd = class {
  constructor(t) {
    this.unsubs = [], this.scrollElement = null, this.targetWindow = null, this.isScrolling = false, this.scrollToIndexTimeoutId = null, this.measurementsCache = [], this.itemSizeCache = /* @__PURE__ */ new Map(), this.pendingMeasuredCacheIndexes = [], this.scrollRect = null, this.scrollOffset = null, this.scrollDirection = null, this.scrollAdjustments = 0, this.elementsCache = /* @__PURE__ */ new Map(), this.observer = /* @__PURE__ */ (() => {
      let n = null;
      const o = () => n || (!this.targetWindow || !this.targetWindow.ResizeObserver ? null : n = new this.targetWindow.ResizeObserver((r) => {
        r.forEach((a) => {
          const s = () => {
            this._measureElement(a.target, a);
          };
          this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(s) : s();
        });
      }));
      return {
        disconnect: () => {
          var r;
          (r = o()) == null || r.disconnect(), n = null;
        },
        observe: (r) => {
          var a;
          return (a = o()) == null ? void 0 : a.observe(r, { box: "border-box" });
        },
        unobserve: (r) => {
          var a;
          return (a = o()) == null ? void 0 : a.unobserve(r);
        }
      };
    })(), this.range = null, this.setOptions = (n) => {
      Object.entries(n).forEach(([o, r]) => {
        typeof r > "u" && delete n[o];
      }), this.options = {
        debug: false,
        initialOffset: 0,
        overscan: 1,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        horizontal: false,
        getItemKey: wd,
        rangeExtractor: xd,
        onChange: () => {
        },
        measureElement: Ed,
        initialRect: { width: 0, height: 0 },
        scrollMargin: 0,
        gap: 0,
        indexAttribute: "data-index",
        initialMeasurementsCache: [],
        lanes: 1,
        isScrollingResetDelay: 150,
        enabled: true,
        isRtl: false,
        useScrollendEvent: false,
        useAnimationFrameWithResizeObserver: false,
        ...n
      };
    }, this.notify = (n) => {
      var o, r;
      (r = (o = this.options).onChange) == null || r.call(o, this, n);
    }, this.maybeNotify = St(
      () => (this.calculateRange(), [
        this.isScrolling,
        this.range ? this.range.startIndex : null,
        this.range ? this.range.endIndex : null
      ]),
      (n) => {
        this.notify(n);
      },
      {
        key: "maybeNotify",
        debug: () => this.options.debug,
        initialDeps: [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ]
      }
    ), this.cleanup = () => {
      this.unsubs.filter(Boolean).forEach((n) => n()), this.unsubs = [], this.observer.disconnect(), this.scrollElement = null, this.targetWindow = null;
    }, this._didMount = () => () => {
      this.cleanup();
    }, this._willUpdate = () => {
      var n;
      const o = this.options.enabled ? this.options.getScrollElement() : null;
      if (this.scrollElement !== o) {
        if (this.cleanup(), !o) {
          this.maybeNotify();
          return;
        }
        this.scrollElement = o, this.scrollElement && "ownerDocument" in this.scrollElement ? this.targetWindow = this.scrollElement.ownerDocument.defaultView : this.targetWindow = ((n = this.scrollElement) == null ? void 0 : n.window) ?? null, this.elementsCache.forEach((r) => {
          this.observer.observe(r);
        }), this._scrollToOffset(this.getScrollOffset(), {
          adjustments: void 0,
          behavior: void 0
        }), this.unsubs.push(
          this.options.observeElementRect(this, (r) => {
            this.scrollRect = r, this.maybeNotify();
          })
        ), this.unsubs.push(
          this.options.observeElementOffset(this, (r, a) => {
            this.scrollAdjustments = 0, this.scrollDirection = a ? this.getScrollOffset() < r ? "forward" : "backward" : null, this.scrollOffset = r, this.isScrolling = a, this.maybeNotify();
          })
        );
      }
    }, this.getSize = () => this.options.enabled ? (this.scrollRect = this.scrollRect ?? this.options.initialRect, this.scrollRect[this.options.horizontal ? "width" : "height"]) : (this.scrollRect = null, 0), this.getScrollOffset = () => this.options.enabled ? (this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset == "function" ? this.options.initialOffset() : this.options.initialOffset), this.scrollOffset) : (this.scrollOffset = null, 0), this.getFurthestMeasurement = (n, o) => {
      const r = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
      for (let s = o - 1; s >= 0; s--) {
        const i = n[s];
        if (r.has(i.lane))
          continue;
        const l = a.get(
          i.lane
        );
        if (l == null || i.end > l.end ? a.set(i.lane, i) : i.end < l.end && r.set(i.lane, true), r.size === this.options.lanes)
          break;
      }
      return a.size === this.options.lanes ? Array.from(a.values()).sort((s, i) => s.end === i.end ? s.index - i.index : s.end - i.end)[0] : void 0;
    }, this.getMeasurementOptions = St(
      () => [
        this.options.count,
        this.options.paddingStart,
        this.options.scrollMargin,
        this.options.getItemKey,
        this.options.enabled
      ],
      (n, o, r, a, s) => (this.pendingMeasuredCacheIndexes = [], {
        count: n,
        paddingStart: o,
        scrollMargin: r,
        getItemKey: a,
        enabled: s
      }),
      {
        key: false
      }
    ), this.getMeasurements = St(
      () => [this.getMeasurementOptions(), this.itemSizeCache],
      ({ count: n, paddingStart: o, scrollMargin: r, getItemKey: a, enabled: s }, i) => {
        if (!s)
          return this.measurementsCache = [], this.itemSizeCache.clear(), [];
        this.measurementsCache.length === 0 && (this.measurementsCache = this.options.initialMeasurementsCache, this.measurementsCache.forEach((u) => {
          this.itemSizeCache.set(u.key, u.size);
        }));
        const l = this.pendingMeasuredCacheIndexes.length > 0 ? Math.min(...this.pendingMeasuredCacheIndexes) : 0;
        this.pendingMeasuredCacheIndexes = [];
        const c = this.measurementsCache.slice(0, l);
        for (let u = l; u < n; u++) {
          const d = a(u), p = this.options.lanes === 1 ? c[u - 1] : this.getFurthestMeasurement(c, u), f = p ? p.end + this.options.gap : o + r, v = i.get(d), h2 = typeof v == "number" ? v : this.options.estimateSize(u), g = f + h2, x = p ? p.lane : u % this.options.lanes;
          c[u] = {
            index: u,
            start: f,
            size: h2,
            end: g,
            key: d,
            lane: x
          };
        }
        return this.measurementsCache = c, c;
      },
      {
        key: "getMeasurements",
        debug: () => this.options.debug
      }
    ), this.calculateRange = St(
      () => [
        this.getMeasurements(),
        this.getSize(),
        this.getScrollOffset(),
        this.options.lanes
      ],
      (n, o, r, a) => this.range = n.length > 0 && o > 0 ? Ad({
        measurements: n,
        outerSize: o,
        scrollOffset: r,
        lanes: a
      }) : null,
      {
        key: "calculateRange",
        debug: () => this.options.debug
      }
    ), this.getVirtualIndexes = St(
      () => {
        let n = null, o = null;
        const r = this.calculateRange();
        return r && (n = r.startIndex, o = r.endIndex), this.maybeNotify.updateDeps([this.isScrolling, n, o]), [
          this.options.rangeExtractor,
          this.options.overscan,
          this.options.count,
          n,
          o
        ];
      },
      (n, o, r, a, s) => a === null || s === null ? [] : n({
        startIndex: a,
        endIndex: s,
        overscan: o,
        count: r
      }),
      {
        key: "getVirtualIndexes",
        debug: () => this.options.debug
      }
    ), this.indexFromElement = (n) => {
      const o = this.options.indexAttribute, r = n.getAttribute(o);
      return r ? parseInt(r, 10) : (console.warn(
        `Missing attribute name '${o}={index}' on measured element.`
      ), -1);
    }, this._measureElement = (n, o) => {
      const r = this.indexFromElement(n), a = this.measurementsCache[r];
      if (!a)
        return;
      const s = a.key, i = this.elementsCache.get(s);
      i !== n && (i && this.observer.unobserve(i), this.observer.observe(n), this.elementsCache.set(s, n)), n.isConnected && this.resizeItem(r, this.options.measureElement(n, o, this));
    }, this.resizeItem = (n, o) => {
      const r = this.measurementsCache[n];
      if (!r)
        return;
      const a = this.itemSizeCache.get(r.key) ?? r.size, s = o - a;
      s !== 0 && ((this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(r, s, this) : this.scrollDirection === "backward" && r.start < this.getScrollOffset() + this.scrollAdjustments) && (this.options.debug && console.info("correction", s), this._scrollToOffset(this.getScrollOffset(), {
        adjustments: this.scrollAdjustments += s,
        behavior: void 0
      })), this.pendingMeasuredCacheIndexes.push(r.index), this.itemSizeCache = new Map(this.itemSizeCache.set(r.key, o)), this.notify(false));
    }, this.measureElement = (n) => {
      if (!n) {
        this.elementsCache.forEach((o, r) => {
          o.isConnected || (this.observer.unobserve(o), this.elementsCache.delete(r));
        });
        return;
      }
      this._measureElement(n, void 0);
    }, this.getVirtualItems = St(
      () => [this.getVirtualIndexes(), this.getMeasurements()],
      (n, o) => {
        const r = [];
        for (let a = 0, s = n.length; a < s; a++) {
          const i = n[a], l = o[i];
          r.push(l);
        }
        return r;
      },
      {
        key: "getVirtualItems",
        debug: () => this.options.debug
      }
    ), this.getVirtualItemForOffset = (n) => {
      const o = this.getMeasurements();
      if (o.length !== 0)
        return Cr(
          o[Fa(
            0,
            o.length - 1,
            (r) => Cr(o[r]).start,
            n
          )]
        );
    }, this.getOffsetForAlignment = (n, o, r = 0) => {
      const a = this.getSize(), s = this.getScrollOffset();
      o === "auto" && (o = n >= s + a ? "end" : "start"), o === "center" ? n += (r - a) / 2 : o === "end" && (n -= a);
      const i = this.getTotalSize() - a;
      return Math.max(Math.min(i, n), 0);
    }, this.getOffsetForIndex = (n, o = "auto") => {
      n = Math.max(0, Math.min(n, this.options.count - 1));
      const r = this.measurementsCache[n];
      if (!r)
        return;
      const a = this.getSize(), s = this.getScrollOffset();
      if (o === "auto")
        if (r.end >= s + a - this.options.scrollPaddingEnd)
          o = "end";
        else if (r.start <= s + this.options.scrollPaddingStart)
          o = "start";
        else
          return [s, o];
      const i = o === "end" ? r.end + this.options.scrollPaddingEnd : r.start - this.options.scrollPaddingStart;
      return [
        this.getOffsetForAlignment(i, o, r.size),
        o
      ];
    }, this.isDynamicMode = () => this.elementsCache.size > 0, this.cancelScrollToIndex = () => {
      this.scrollToIndexTimeoutId !== null && this.targetWindow && (this.targetWindow.clearTimeout(this.scrollToIndexTimeoutId), this.scrollToIndexTimeoutId = null);
    }, this.scrollToOffset = (n, { align: o = "start", behavior: r } = {}) => {
      this.cancelScrollToIndex(), r === "smooth" && this.isDynamicMode() && console.warn(
        "The `smooth` scroll behavior is not fully supported with dynamic size."
      ), this._scrollToOffset(this.getOffsetForAlignment(n, o), {
        adjustments: void 0,
        behavior: r
      });
    }, this.scrollToIndex = (n, { align: o = "auto", behavior: r } = {}) => {
      n = Math.max(0, Math.min(n, this.options.count - 1)), this.cancelScrollToIndex(), r === "smooth" && this.isDynamicMode() && console.warn(
        "The `smooth` scroll behavior is not fully supported with dynamic size."
      );
      const a = this.getOffsetForIndex(n, o);
      if (!a) return;
      const [s, i] = a;
      this._scrollToOffset(s, { adjustments: void 0, behavior: r }), r !== "smooth" && this.isDynamicMode() && this.targetWindow && (this.scrollToIndexTimeoutId = this.targetWindow.setTimeout(() => {
        if (this.scrollToIndexTimeoutId = null, this.elementsCache.has(
          this.options.getItemKey(n)
        )) {
          const c = this.getOffsetForIndex(n, i);
          if (!c) return;
          const [u] = c, d = this.getScrollOffset();
          yd(u, d) || this.scrollToIndex(n, { align: i, behavior: r });
        } else
          this.scrollToIndex(n, { align: i, behavior: r });
      }));
    }, this.scrollBy = (n, { behavior: o } = {}) => {
      this.cancelScrollToIndex(), o === "smooth" && this.isDynamicMode() && console.warn(
        "The `smooth` scroll behavior is not fully supported with dynamic size."
      ), this._scrollToOffset(this.getScrollOffset() + n, {
        adjustments: void 0,
        behavior: o
      });
    }, this.getTotalSize = () => {
      var n;
      const o = this.getMeasurements();
      let r;
      if (o.length === 0)
        r = this.options.paddingStart;
      else if (this.options.lanes === 1)
        r = ((n = o[o.length - 1]) == null ? void 0 : n.end) ?? 0;
      else {
        const a = Array(this.options.lanes).fill(null);
        let s = o.length - 1;
        for (; s >= 0 && a.some((i) => i === null); ) {
          const i = o[s];
          a[i.lane] === null && (a[i.lane] = i.end), s--;
        }
        r = Math.max(...a.filter((i) => i !== null));
      }
      return Math.max(
        r - this.options.scrollMargin + this.options.paddingEnd,
        0
      );
    }, this._scrollToOffset = (n, {
      adjustments: o,
      behavior: r
    }) => {
      this.options.scrollToFn(n, { behavior: r, adjustments: o }, this);
    }, this.measure = () => {
      this.itemSizeCache = /* @__PURE__ */ new Map(), this.notify(false);
    }, this.setOptions(t);
  }
};
var Fa = (e, t, n, o) => {
  for (; e <= t; ) {
    const r = (e + t) / 2 | 0, a = n(r);
    if (a < o)
      e = r + 1;
    else if (a > o)
      t = r - 1;
    else
      return r;
  }
  return e > 0 ? e - 1 : 0;
};
function Ad({
  measurements: e,
  outerSize: t,
  scrollOffset: n,
  lanes: o
}) {
  const r = e.length - 1, a = (l) => e[l].start;
  if (e.length <= o)
    return {
      startIndex: 0,
      endIndex: r
    };
  let s = Fa(
    0,
    r,
    a,
    n
  ), i = s;
  if (o === 1)
    for (; i < r && e[i].end < n + t; )
      i++;
  else if (o > 1) {
    const l = Array(o).fill(0);
    for (; i < r && l.some((u) => u < n + t); ) {
      const u = e[i];
      l[u.lane] = u.end, i++;
    }
    const c = Array(o).fill(n + t);
    for (; s >= 0 && c.some((u) => u >= n); ) {
      const u = e[s];
      c[u.lane] = u.start, s--;
    }
    s = Math.max(0, s - s % o), i = Math.min(r, i + (o - 1 - i % o));
  }
  return { startIndex: s, endIndex: i };
}
function $d(e) {
  const t = new Pd(unref(e)), n = shallowRef(t), o = t._didMount();
  return watch(
    () => unref(e).getScrollElement(),
    (r) => {
      r && t._willUpdate();
    },
    {
      immediate: true
    }
  ), watch(
    () => unref(e),
    (r) => {
      t.setOptions({
        ...r,
        onChange: (a, s) => {
          var i;
          triggerRef(n), (i = r.onChange) == null || i.call(r, a, s);
        }
      }), t._willUpdate(), triggerRef(n);
    },
    {
      immediate: true
    }
  ), onScopeDispose(o), n;
}
function kd(e) {
  return $d(
    computed(() => ({
      observeElementRect: Cd,
      observeElementOffset: Sd,
      scrollToFn: Od,
      ...unref(e)
    }))
  );
}
var Td = defineComponent({
  __name: "ListboxVirtualizer",
  props: {
    options: {},
    overscan: {},
    estimateSize: {},
    textContent: { type: Function }
  },
  setup(e) {
    const t = e, n = useSlots(), o = tn(), r = nc(), { getItems: a } = Ke();
    o.isVirtual.value = true;
    const s = computed(() => {
      const p = r.value;
      if (p) {
        const f = window.getComputedStyle(p);
        return {
          start: Number.parseFloat(f.paddingBlockStart || f.paddingTop),
          end: Number.parseFloat(f.paddingBlockEnd || f.paddingBottom)
        };
      } else
        return { start: 0, end: 0 };
    }), i = kd(
      {
        get scrollPaddingStart() {
          return s.value.start;
        },
        get scrollPaddingEnd() {
          return s.value.end;
        },
        get count() {
          return t.options.length;
        },
        get horizontal() {
          return o.orientation.value === "horizontal";
        },
        estimateSize() {
          return t.estimateSize ?? 28;
        },
        getScrollElement() {
          return r.value;
        },
        overscan: t.overscan ?? 12
      }
    ), l = computed(() => i.value.getVirtualItems().map((p) => {
      const f = n.default({
        option: t.options[p.index],
        virtualizer: i.value,
        virtualItem: p
      })[0], v = f.type === Fragment && Array.isArray(f.children) ? f.children[0] : f;
      return {
        item: p,
        is: cloneVNode(v, {
          key: `${p.key}`,
          "data-index": p.index,
          "aria-setsize": t.options.length,
          "aria-posinset": p.index + 1,
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translateY(${p.start}px)`,
            overflowAnchor: "none"
          }
        })
      };
    }));
    o.virtualFocusHook.on((p) => {
      const f = t.options.findIndex((v) => Array.isArray(o.modelValue.value) ? it(v, o.modelValue.value[0], o.by) : it(v, o.modelValue.value, o.by));
      f !== -1 ? (p == null || p.preventDefault(), i.value.scrollToIndex(f, { align: "start" }), requestAnimationFrame(() => {
        const v = xr(r.value);
        v && (o.changeHighlight(v), p && (v == null || v.focus()));
      })) : o.highlightFirstItem(p);
    }), o.virtualHighlightHook.on((p) => {
      const f = t.options.findIndex((v) => it(v, p, o.by));
      i.value.scrollToIndex(f, { align: "start" }), requestAnimationFrame(() => {
        const v = xr(r.value);
        v && o.changeHighlight(v);
      });
    });
    const c = _o("", 1e3), u = computed(() => {
      const p = (f) => t.textContent ? t.textContent(f) : f == null ? void 0 : f.toString().toLowerCase();
      return t.options.map((f, v) => ({
        index: v,
        textContent: p(f)
      }));
    });
    function d(p, f) {
      var x, y, b, w;
      if (!((x = o.firstValue) != null && x.value) || !o.multiple.value || !Array.isArray(o.modelValue.value))
        return;
      const h2 = (y = a().filter((C) => C.ref.dataset.disabled !== "").find((C) => C.ref === o.highlightedElement.value)) == null ? void 0 : y.value;
      if (!h2)
        return;
      let g = null;
      switch (f) {
        case "prev":
        case "next": {
          g = mn(t.options, o.firstValue.value, h2);
          break;
        }
        case "first": {
          g = mn(t.options, o.firstValue.value, (b = t.options) == null ? void 0 : b[0]);
          break;
        }
        case "last": {
          g = mn(t.options, o.firstValue.value, (w = t.options) == null ? void 0 : w[t.options.length - 1]);
          break;
        }
      }
      o.modelValue.value = g;
    }
    return o.virtualKeydownHook.on((p) => {
      var g;
      const f = p.altKey || p.ctrlKey || p.metaKey;
      if (p.key === "Tab" && !f)
        return;
      let h2 = $a[p.key];
      if (f && p.key === "a" && o.multiple.value ? (p.preventDefault(), o.modelValue.value = [...t.options], h2 = "last") : p.shiftKey && h2 && d(p, h2), ["first", "last"].includes(h2)) {
        p.preventDefault();
        const x = h2 === "first" ? 0 : t.options.length - 1;
        i.value.scrollToIndex(x), requestAnimationFrame(() => {
          const y = a(), b = h2 === "first" ? y[0] : y[y.length - 1];
          b && o.changeHighlight(b.ref);
        });
      } else if (!h2 && !f) {
        c.value += p.key;
        const x = Number((g = xe()) == null ? void 0 : g.getAttribute("data-index")), y = u.value[x].textContent, b = u.value.map((E) => E.textContent ?? ""), w = _a(b, c.value, y), C = u.value.find((E) => E.textContent === w);
        C && (i.value.scrollToIndex(C.index, { align: "start" }), requestAnimationFrame(() => {
          const E = r.value.querySelector(`[data-index="${C.index}"]`);
          E instanceof HTMLElement && o.changeHighlight(E);
        }));
      }
    }), (p, f) => (openBlock(), createElementBlock("div", {
      "data-reka-virtualizer": "",
      style: normalizeStyle({
        position: "relative",
        width: "100%",
        height: `${unref(i).getTotalSize()}px`
      })
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(l.value, ({ is: v, item: h2 }) => (openBlock(), createBlock(resolveDynamicComponent(v), {
        key: h2.index
      }))), 128))
    ], 4));
  }
});
var Id = defineComponent({
  __name: "ComboboxVirtualizer",
  props: {
    options: {},
    overscan: {},
    estimateSize: {},
    textContent: { type: Function }
  },
  setup(e) {
    const t = e, n = Rt();
    return n.isVirtual.value = true, (o, r) => (openBlock(), createBlock(Td, normalizeProps(guardReactiveProps(t)), {
      default: withCtx((a) => [
        renderSlot(o.$slots, "default", normalizeProps(guardReactiveProps(a)))
      ]),
      _: 3
    }, 16));
  }
});
var Gn = 0;
function Dd() {
  watchEffect((e) => {
    if (!pt)
      return;
    const t = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement(
      "afterbegin",
      t[0] ?? Pr()
    ), document.body.insertAdjacentElement(
      "beforeend",
      t[1] ?? Pr()
    ), Gn++, e(() => {
      Gn === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((n) => n.remove()), Gn--;
    });
  });
}
function Pr() {
  const e = document.createElement("span");
  return e.setAttribute("data-reka-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var _d = defineComponent({
  __name: "DialogPortal",
  props: {
    to: {},
    disabled: { type: Boolean },
    defer: { type: Boolean },
    forceMount: { type: Boolean }
  },
  setup(e) {
    const t = e;
    return (n, o) => (openBlock(), createBlock(unref(Mo), normalizeProps(guardReactiveProps(t)), {
      default: withCtx(() => [
        renderSlot(n.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
});
function Ar(e, t = Number.NEGATIVE_INFINITY, n = Number.POSITIVE_INFINITY) {
  return Math.min(n, Math.max(t, e));
}
var Ld = [" ", "Enter", "ArrowUp", "ArrowDown"];
var Fd = [" ", "Enter"];
var Ie = 10;
function wn(e, t, n) {
  return e === void 0 ? false : Array.isArray(e) ? e.some((o) => lo(o, t, n)) : lo(e, t, n);
}
function lo(e, t, n) {
  return e === void 0 || t === void 0 ? false : typeof e == "string" ? e === t : typeof n == "function" ? n(e, t) : typeof n == "string" ? (e == null ? void 0 : e[n]) === (t == null ? void 0 : t[n]) : bn(e, t);
}
function Bd(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
var Rd = defineComponent({
  __name: "BubbleSelect",
  props: {
    autocomplete: {},
    autofocus: { type: Boolean },
    disabled: { type: Boolean },
    form: {},
    multiple: { type: Boolean },
    name: {},
    required: { type: Boolean },
    size: {},
    value: {}
  },
  setup(e) {
    const t = e, n = ref();
    return watch(() => t.value, (o, r) => {
      const a = window.HTMLSelectElement.prototype, i = Object.getOwnPropertyDescriptor(
        a,
        "value"
      ).set;
      if (o !== r && i && n.value) {
        const l = new Event("change", { bubbles: true });
        i.call(n.value, o), n.value.dispatchEvent(l);
      }
    }), (o, r) => (openBlock(), createBlock(unref(ha), { "as-child": "" }, {
      default: withCtx(() => [
        createBaseVNode("select", mergeProps({
          ref_key: "selectElement",
          ref: n
        }, t), [
          renderSlot(o.$slots, "default")
        ], 16)
      ]),
      _: 3
    }));
  }
});
var Md = {
  key: 0,
  value: ""
};
var [yt, Ba] = Ce("SelectRoot");
var Nd = defineComponent({
  inheritAttrs: false,
  __name: "SelectRoot",
  props: {
    open: { type: Boolean, default: void 0 },
    defaultOpen: { type: Boolean },
    defaultValue: {},
    modelValue: { default: void 0 },
    by: {},
    dir: {},
    multiple: { type: Boolean },
    autocomplete: {},
    disabled: { type: Boolean },
    name: {},
    required: { type: Boolean }
  },
  emits: ["update:modelValue", "update:open"],
  setup(e, { emit: t }) {
    const n = e, o = t, { required: r, disabled: a, multiple: s, dir: i } = toRefs(n), l = ut(n, "modelValue", o, {
      // @ts-expect-error Missing infer for AcceptableValue
      defaultValue: n.defaultValue ?? (s.value ? [] : void 0),
      passive: n.modelValue === void 0,
      deep: true
    }), c = ut(n, "open", o, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), u = ref(), d = ref(), p = ref({
      x: 0,
      y: 0
    }), f = computed(() => {
      var b;
      return s.value && Array.isArray(l.value) ? ((b = l.value) == null ? void 0 : b.length) === 0 : mr(l.value);
    });
    Ke({ isProvider: true });
    const v = Lo(i), h2 = Aa(u), g = ref(/* @__PURE__ */ new Set()), x = computed(() => Array.from(g.value).map((b) => b.value).join(";"));
    function y(b) {
      if (s.value) {
        const w = Array.isArray(l.value) ? [...l.value] : [], C = w.findIndex((E) => lo(E, b, n.by));
        C === -1 ? w.push(b) : w.splice(C, 1), l.value = [...w];
      } else
        l.value = b;
    }
    return Ba({
      triggerElement: u,
      onTriggerChange: (b) => {
        u.value = b;
      },
      valueElement: d,
      onValueElementChange: (b) => {
        d.value = b;
      },
      contentId: "",
      modelValue: l,
      // @ts-expect-error Missing infer for AcceptableValue
      onValueChange: y,
      // @ts-expect-error Missing infer for AcceptableValue
      by: n.by,
      open: c,
      multiple: s,
      required: r,
      onOpenChange: (b) => {
        c.value = b;
      },
      dir: v,
      triggerPointerDownPosRef: p,
      disabled: a,
      isEmptyModelValue: f,
      optionsSet: g,
      onOptionAdd: (b) => g.value.add(b),
      onOptionRemove: (b) => g.value.delete(b)
    }), (b, w) => (openBlock(), createBlock(unref(Ta), null, {
      default: withCtx(() => [
        renderSlot(b.$slots, "default", {
          modelValue: unref(l),
          open: unref(c)
        }),
        unref(h2) ? (openBlock(), createBlock(Rd, {
          key: x.value,
          "aria-hidden": "true",
          tabindex: "-1",
          multiple: unref(s),
          required: unref(r),
          name: b.name,
          autocomplete: b.autocomplete,
          disabled: unref(a),
          value: unref(l)
        }, {
          default: withCtx(() => [
            unref(mr)(unref(l)) ? (openBlock(), createElementBlock("option", Md)) : createCommentVNode("", true),
            (openBlock(true), createElementBlock(Fragment, null, renderList(Array.from(g.value), (C) => (openBlock(), createElementBlock("option", mergeProps({
              key: C.value ?? "",
              ref_for: true
            }, C), null, 16))), 128))
          ]),
          _: 1
        }, 8, ["multiple", "required", "name", "autocomplete", "disabled", "value"])) : createCommentVNode("", true)
      ]),
      _: 3
    }));
  }
});
var [Vo, Vd] = Ce("SelectItemAlignedPosition");
var zd = defineComponent({
  inheritAttrs: false,
  __name: "SelectItemAlignedPosition",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["placed"],
  setup(e, { emit: t }) {
    const n = e, o = t, { getItems: r } = Ke(), a = yt(), s = bt(), i = ref(false), l = ref(true), c = ref(), { forwardRef: u, currentElement: d } = ae(), { viewport: p, selectedItem: f, selectedItemText: v, focusSelectedItem: h2 } = s;
    function g() {
      if (a.triggerElement.value && a.valueElement.value && c.value && d.value && (p != null && p.value) && (f != null && f.value) && (v != null && v.value)) {
        const b = a.triggerElement.value.getBoundingClientRect(), w = d.value.getBoundingClientRect(), C = a.valueElement.value.getBoundingClientRect(), E = v.value.getBoundingClientRect();
        if (a.dir.value !== "rtl") {
          const R = E.left - w.left, H = C.left - R, q = b.left - H, te = b.width + q, me = Math.max(te, w.width), Te = window.innerWidth - Ie, ot = Ar(H, Ie, Math.max(Ie, Te - me));
          c.value.style.minWidth = `${te}px`, c.value.style.left = `${ot}px`;
        } else {
          const R = w.right - E.right, H = window.innerWidth - C.right - R, q = window.innerWidth - b.right - H, te = b.width + q, me = Math.max(te, w.width), Te = window.innerWidth - Ie, ot = Ar(
            H,
            Ie,
            Math.max(Ie, Te - me)
          );
          c.value.style.minWidth = `${te}px`, c.value.style.right = `${ot}px`;
        }
        const O = r().map((R) => R.ref), _ = window.innerHeight - Ie * 2, T = p.value.scrollHeight, z = window.getComputedStyle(d.value), M = Number.parseInt(
          z.borderTopWidth,
          10
        ), Z = Number.parseInt(z.paddingTop, 10), G = Number.parseInt(
          z.borderBottomWidth,
          10
        ), J = Number.parseInt(
          z.paddingBottom,
          10
        ), N = M + Z + T + J + G, U = Math.min(
          f.value.offsetHeight * 5,
          N
        ), L = window.getComputedStyle(p.value), D = Number.parseInt(L.paddingTop, 10), j = Number.parseInt(
          L.paddingBottom,
          10
        ), Y = b.top + b.height / 2 - Ie, ye = _ - Y, be = f.value.offsetHeight / 2, tt = f.value.offsetTop + be, he = M + Z + tt, we = N - he;
        if (he <= Y) {
          const R = f.value === O[O.length - 1];
          c.value.style.bottom = "0px";
          const H = d.value.clientHeight - p.value.offsetTop - p.value.offsetHeight, q = Math.max(
            ye,
            be + (R ? j : 0) + H + G
          ), te = he + q;
          c.value.style.height = `${te}px`;
        } else {
          const R = f.value === O[0];
          c.value.style.top = "0px";
          const q = Math.max(
            Y,
            M + p.value.offsetTop + (R ? D : 0) + be
          ) + we;
          c.value.style.height = `${q}px`, p.value.scrollTop = he - Y + p.value.offsetTop;
        }
        c.value.style.margin = `${Ie}px 0`, c.value.style.minHeight = `${U}px`, c.value.style.maxHeight = `${_}px`, o("placed"), requestAnimationFrame(() => i.value = true);
      }
    }
    const x = ref("");
    onMounted(async () => {
      await nextTick(), g(), d.value && (x.value = window.getComputedStyle(d.value).zIndex);
    });
    function y(b) {
      b && l.value === true && (g(), h2 == null || h2(), l.value = false);
    }
    return tc(a.triggerElement, () => {
      g();
    }), Vd({
      contentWrapper: c,
      shouldExpandOnScrollRef: i,
      onScrollButtonChange: y
    }), (b, w) => (openBlock(), createElementBlock("div", {
      ref_key: "contentWrapperElement",
      ref: c,
      style: normalizeStyle({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: x.value
      })
    }, [
      createVNode(unref(re), mergeProps({
        ref: unref(u),
        style: {
          // When we get the height of the content, it includes borders. If we were to set
          // the height without having `boxSizing: 'border-box'` it would be too big.
          boxSizing: "border-box",
          // We need to ensure the content doesn't get taller than the wrapper
          maxHeight: "100%"
        }
      }, { ...b.$attrs, ...n }), {
        default: withCtx(() => [
          renderSlot(b.$slots, "default")
        ]),
        _: 3
      }, 16)
    ], 4));
  }
});
var jd = defineComponent({
  __name: "SelectPopperPosition",
  props: {
    side: {},
    sideOffset: {},
    align: { default: "start" },
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: { default: Ie },
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const n = Rn(e);
    return (o, r) => (openBlock(), createBlock(unref(Da), mergeProps(unref(n), { style: {
      // Ensure border-box for floating-ui calculations
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: withCtx(() => [
        renderSlot(o.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
});
var Wd = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
};
var [bt, Ra] = Ce("SelectContent");
var Hd = defineComponent({
  __name: "SelectContentImpl",
  props: {
    position: { default: "item-aligned" },
    bodyLock: { type: Boolean, default: true },
    side: {},
    sideOffset: {},
    align: { default: "start" },
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["closeAutoFocus", "escapeKeyDown", "pointerDownOutside"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = yt();
    Dd(), Ro(n.bodyLock);
    const { CollectionSlot: a, getItems: s } = Ke(), i = ref();
    Bo(i);
    const { search: l, handleTypeaheadSearch: c } = No(), u = ref(), d = ref(), p = ref(), f = ref(false), v = ref(false), h2 = ref(false);
    function g() {
      d.value && i.value && vr([d.value, i.value]);
    }
    watch(f, () => {
      g();
    });
    const { onOpenChange: x, triggerPointerDownPosRef: y } = r;
    watchEffect((E) => {
      if (!i.value)
        return;
      let O = { x: 0, y: 0 };
      const _ = (z) => {
        var M, Z;
        O = {
          x: Math.abs(
            Math.round(z.pageX) - (((M = y.value) == null ? void 0 : M.x) ?? 0)
          ),
          y: Math.abs(
            Math.round(z.pageY) - (((Z = y.value) == null ? void 0 : Z.y) ?? 0)
          )
        };
      }, T = (z) => {
        var M;
        z.pointerType !== "touch" && (O.x <= 10 && O.y <= 10 ? z.preventDefault() : (M = i.value) != null && M.contains(z.target) || x(false), document.removeEventListener("pointermove", _), y.value = null);
      };
      y.value !== null && (document.addEventListener("pointermove", _), document.addEventListener("pointerup", T, {
        capture: true,
        once: true
      })), E(() => {
        document.removeEventListener("pointermove", _), document.removeEventListener("pointerup", T, {
          capture: true
        });
      });
    });
    function b(E) {
      const O = E.ctrlKey || E.altKey || E.metaKey;
      if (E.key === "Tab" && E.preventDefault(), !O && E.key.length === 1 && c(E.key, s()), ["ArrowUp", "ArrowDown", "Home", "End"].includes(E.key)) {
        let T = [...s().map((z) => z.ref)];
        if (["ArrowUp", "End"].includes(E.key) && (T = T.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(E.key)) {
          const z = E.target, M = T.indexOf(z);
          T = T.slice(M + 1);
        }
        setTimeout(() => vr(T)), E.preventDefault();
      }
    }
    const w = computed(() => n.position === "popper" ? n : {}), C = Rn(w.value);
    return Ra({
      content: i,
      viewport: u,
      onViewportChange: (E) => {
        u.value = E;
      },
      itemRefCallback: (E, O, _) => {
        const T = !v.value && !_, z = wn(r.modelValue.value, O, r.by);
        if (r.multiple.value) {
          if (h2.value)
            return;
          (z || T) && (d.value = E, z && (h2.value = true));
        } else
          (z || T) && (d.value = E);
        T && (v.value = true);
      },
      selectedItem: d,
      selectedItemText: p,
      onItemLeave: () => {
        var E;
        (E = i.value) == null || E.focus();
      },
      itemTextRefCallback: (E, O, _) => {
        const T = !v.value && !_;
        (wn(r.modelValue.value, O, r.by) || T) && (p.value = E);
      },
      focusSelectedItem: g,
      position: n.position,
      isPositioned: f,
      searchRef: l
    }), (E, O) => (openBlock(), createBlock(unref(a), null, {
      default: withCtx(() => [
        createVNode(unref(xa), {
          "as-child": "",
          onMountAutoFocus: O[6] || (O[6] = withModifiers(() => {
          }, ["prevent"])),
          onUnmountAutoFocus: O[7] || (O[7] = (_) => {
            var T;
            o("closeAutoFocus", _), !_.defaultPrevented && ((T = unref(r).triggerElement.value) == null || T.focus({ preventScroll: true }), _.preventDefault());
          })
        }, {
          default: withCtx(() => [
            createVNode(unref(Fo), {
              "as-child": "",
              "disable-outside-pointer-events": "",
              onFocusOutside: O[2] || (O[2] = withModifiers(() => {
              }, ["prevent"])),
              onDismiss: O[3] || (O[3] = (_) => unref(r).onOpenChange(false)),
              onEscapeKeyDown: O[4] || (O[4] = (_) => o("escapeKeyDown", _)),
              onPointerDownOutside: O[5] || (O[5] = (_) => o("pointerDownOutside", _))
            }, {
              default: withCtx(() => [
                (openBlock(), createBlock(resolveDynamicComponent(
                  E.position === "popper" ? jd : zd
                ), mergeProps({ ...E.$attrs, ...unref(C) }, {
                  id: unref(r).contentId,
                  ref: (_) => {
                    i.value = unref(Be)(_);
                  },
                  role: "listbox",
                  "data-state": unref(r).open.value ? "open" : "closed",
                  dir: unref(r).dir.value,
                  style: {
                    // flex layout so we can place the scroll buttons properly
                    display: "flex",
                    flexDirection: "column",
                    // reset the outline by default as the content MAY get focused
                    outline: "none"
                  },
                  onContextmenu: O[0] || (O[0] = withModifiers(() => {
                  }, ["prevent"])),
                  onPlaced: O[1] || (O[1] = (_) => f.value = true),
                  onKeydown: b
                }), {
                  default: withCtx(() => [
                    renderSlot(E.$slots, "default")
                  ]),
                  _: 3
                }, 16, ["id", "data-state", "dir", "onKeydown"]))
              ]),
              _: 3
            })
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
});
var Kd = defineComponent({
  inheritAttrs: false,
  __name: "SelectProvider",
  props: {
    context: {}
  },
  setup(e) {
    return Ba(e.context), Ra(Wd), (n, o) => renderSlot(n.$slots, "default");
  }
});
var qd = { key: 1 };
var Ud = defineComponent({
  inheritAttrs: false,
  __name: "SelectContent",
  props: {
    forceMount: { type: Boolean },
    position: {},
    bodyLock: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["closeAutoFocus", "escapeKeyDown", "pointerDownOutside"],
  setup(e, { emit: t }) {
    const n = e, r = Pa(n, t), a = yt(), s = ref();
    onMounted(() => {
      s.value = new DocumentFragment();
    });
    const i = ref(), l = computed(() => n.forceMount || a.open.value);
    return (c, u) => {
      var d;
      return l.value ? (openBlock(), createBlock(unref(Ln), {
        key: 0,
        ref_key: "presenceRef",
        ref: i,
        present: true
      }, {
        default: withCtx(() => [
          createVNode(Hd, normalizeProps(guardReactiveProps({ ...unref(r), ...c.$attrs })), {
            default: withCtx(() => [
              renderSlot(c.$slots, "default")
            ]),
            _: 3
          }, 16)
        ]),
        _: 3
      }, 512)) : !((d = i.value) != null && d.present) && s.value ? (openBlock(), createElementBlock("div", qd, [
        (openBlock(), createBlock(Teleport, { to: s.value }, [
          createVNode(Kd, { context: unref(a) }, {
            default: withCtx(() => [
              renderSlot(c.$slots, "default")
            ]),
            _: 3
          }, 8, ["context"])
        ], 8, ["to"]))
      ])) : createCommentVNode("", true);
    };
  }
});
var [cp, Gd] = Ce("SelectGroup");
var Yd = defineComponent({
  __name: "SelectGroup",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const t = e, n = Ze(void 0, "reka-select-group");
    return Gd({ id: n }), (o, r) => (openBlock(), createBlock(unref(re), mergeProps({ role: "group" }, t, { "aria-labelledby": unref(n) }), {
      default: withCtx(() => [
        renderSlot(o.$slots, "default")
      ]),
      _: 3
    }, 16, ["aria-labelledby"]));
  }
});
var [Ma, Xd] = Ce("SelectItem");
var Jd = defineComponent({
  __name: "SelectItem",
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, o = t, { disabled: r } = toRefs(n), a = yt(), s = bt(), { forwardRef: i, currentElement: l } = ae(), { CollectionItem: c } = Ke(), u = computed(() => {
      var w;
      return wn((w = a.modelValue) == null ? void 0 : w.value, n.value, a.by);
    }), d = ref(false), p = ref(n.textValue ?? ""), f = Ze(void 0, "reka-select-item-text"), v = "select.select";
    async function h2(w) {
      if (w.defaultPrevented)
        return;
      const C = { originalEvent: w, value: n.value };
      Bn(v, g, C);
    }
    async function g(w) {
      await nextTick(), o("select", w), !w.defaultPrevented && (r.value || (a.onValueChange(n.value), a.multiple.value || a.onOpenChange(false)));
    }
    async function x(w) {
      var C, E;
      await nextTick(), !w.defaultPrevented && (r.value ? (C = s.onItemLeave) == null || C.call(s) : (E = w.currentTarget) == null || E.focus({ preventScroll: true }));
    }
    async function y(w) {
      var C;
      await nextTick(), !w.defaultPrevented && w.currentTarget === xe() && ((C = s.onItemLeave) == null || C.call(s));
    }
    async function b(w) {
      var E;
      await nextTick(), !(w.defaultPrevented || ((E = s.searchRef) == null ? void 0 : E.value) !== "" && w.key === " ") && (Fd.includes(w.key) && h2(w), w.key === " " && w.preventDefault());
    }
    if (n.value === "")
      throw new Error(
        "A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
      );
    return onMounted(() => {
      l.value && s.itemRefCallback(
        l.value,
        n.value,
        n.disabled
      );
    }), Xd({
      value: n.value,
      disabled: r,
      textId: f,
      isSelected: u,
      onItemTextChange: (w) => {
        p.value = ((p.value || (w == null ? void 0 : w.textContent)) ?? "").trim();
      }
    }), (w, C) => (openBlock(), createBlock(unref(c), {
      value: { textValue: p.value }
    }, {
      default: withCtx(() => [
        createVNode(unref(re), {
          ref: unref(i),
          role: "option",
          "aria-labelledby": unref(f),
          "data-highlighted": d.value ? "" : void 0,
          "aria-selected": u.value,
          "data-state": u.value ? "checked" : "unchecked",
          "aria-disabled": unref(r) || void 0,
          "data-disabled": unref(r) ? "" : void 0,
          tabindex: unref(r) ? void 0 : -1,
          as: w.as,
          "as-child": w.asChild,
          onFocus: C[0] || (C[0] = (E) => d.value = true),
          onBlur: C[1] || (C[1] = (E) => d.value = false),
          onPointerup: h2,
          onPointerdown: C[2] || (C[2] = (E) => {
            E.currentTarget.focus({ preventScroll: true });
          }),
          onTouchend: C[3] || (C[3] = withModifiers(() => {
          }, ["prevent", "stop"])),
          onPointermove: x,
          onPointerleave: y,
          onKeydown: b
        }, {
          default: withCtx(() => [
            renderSlot(w.$slots, "default")
          ]),
          _: 3
        }, 8, ["aria-labelledby", "data-highlighted", "aria-selected", "data-state", "aria-disabled", "data-disabled", "tabindex", "as", "as-child"])
      ]),
      _: 3
    }, 8, ["value"]));
  }
});
var Zd = defineComponent({
  __name: "SelectItemIndicator",
  props: {
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  setup(e) {
    const t = e, n = Ma();
    return (o, r) => unref(n).isSelected.value ? (openBlock(), createBlock(unref(re), mergeProps({
      key: 0,
      "aria-hidden": "true"
    }, t), {
      default: withCtx(() => [
        renderSlot(o.$slots, "default")
      ]),
      _: 3
    }, 16)) : createCommentVNode("", true);
  }
});
var Qd = defineComponent({
  inheritAttrs: false,
  __name: "SelectItemText",
  props: {
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  setup(e) {
    const t = e, n = yt(), o = bt(), r = Ma(), { forwardRef: a, currentElement: s } = ae(), i = computed(() => {
      var l, c;
      return {
        value: r.value,
        disabled: r.disabled.value,
        textContent: ((l = s.value) == null ? void 0 : l.textContent) ?? ((c = r.value) == null ? void 0 : c.toString()) ?? ""
      };
    });
    return onMounted(() => {
      s.value && (r.onItemTextChange(s.value), o.itemTextRefCallback(
        s.value,
        r.value,
        r.disabled.value
      ), n.onOptionAdd(i.value));
    }), onBeforeUnmount(() => {
      n.onOptionRemove(i.value);
    }), (l, c) => (openBlock(), createBlock(unref(re), mergeProps({
      id: unref(r).textId,
      ref: unref(a)
    }, { ...t, ...l.$attrs }), {
      default: withCtx(() => [
        renderSlot(l.$slots, "default")
      ]),
      _: 3
    }, 16, ["id"]));
  }
});
var ef = defineComponent({
  __name: "SelectPortal",
  props: {
    to: {},
    disabled: { type: Boolean },
    defer: { type: Boolean },
    forceMount: { type: Boolean }
  },
  setup(e) {
    const t = e;
    return (n, o) => (openBlock(), createBlock(unref(Mo), normalizeProps(guardReactiveProps(t)), {
      default: withCtx(() => [
        renderSlot(n.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
});
var Na = defineComponent({
  __name: "SelectScrollButtonImpl",
  emits: ["autoScroll"],
  setup(e, { emit: t }) {
    const n = t, { getItems: o } = Ke(), r = bt(), a = ref(null);
    function s() {
      a.value !== null && (window.clearInterval(a.value), a.value = null);
    }
    watchEffect(() => {
      const c = o().map((u) => u.ref).find(
        (u) => u === xe()
      );
      c == null || c.scrollIntoView({ block: "nearest" });
    });
    function i() {
      a.value === null && (a.value = window.setInterval(() => {
        n("autoScroll");
      }, 50));
    }
    function l() {
      var c;
      (c = r.onItemLeave) == null || c.call(r), a.value === null && (a.value = window.setInterval(() => {
        n("autoScroll");
      }, 50));
    }
    return onBeforeUnmount(() => s()), (c, u) => {
      var d;
      return openBlock(), createBlock(unref(re), mergeProps({
        "aria-hidden": "true",
        style: {
          flexShrink: 0
        }
      }, (d = c.$parent) == null ? void 0 : d.$props, {
        onPointerdown: i,
        onPointermove: l,
        onPointerleave: u[0] || (u[0] = () => {
          s();
        })
      }), {
        default: withCtx(() => [
          renderSlot(c.$slots, "default")
        ]),
        _: 3
      }, 16);
    };
  }
});
var tf = defineComponent({
  __name: "SelectScrollDownButton",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const t = bt(), n = t.position === "item-aligned" ? Vo() : void 0, { forwardRef: o, currentElement: r } = ae(), a = ref(false);
    return watchEffect((s) => {
      var i, l;
      if ((i = t.viewport) != null && i.value && ((l = t.isPositioned) != null && l.value)) {
        let c = function() {
          const d = u.scrollHeight - u.clientHeight;
          a.value = Math.ceil(u.scrollTop) < d;
        };
        const u = t.viewport.value;
        c(), u.addEventListener("scroll", c), s(() => u.removeEventListener("scroll", c));
      }
    }), watch(r, () => {
      r.value && (n == null || n.onScrollButtonChange(r.value));
    }), (s, i) => a.value ? (openBlock(), createBlock(Na, {
      key: 0,
      ref: unref(o),
      onAutoScroll: i[0] || (i[0] = () => {
        const { viewport: l, selectedItem: c } = unref(t);
        l != null && l.value && (c != null && c.value) && (l.value.scrollTop = l.value.scrollTop + c.value.offsetHeight);
      })
    }, {
      default: withCtx(() => [
        renderSlot(s.$slots, "default")
      ]),
      _: 3
    }, 512)) : createCommentVNode("", true);
  }
});
var nf = defineComponent({
  __name: "SelectScrollUpButton",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const t = bt(), n = t.position === "item-aligned" ? Vo() : void 0, { forwardRef: o, currentElement: r } = ae(), a = ref(false);
    return watchEffect((s) => {
      var i, l;
      if ((i = t.viewport) != null && i.value && ((l = t.isPositioned) != null && l.value)) {
        let c = function() {
          a.value = u.scrollTop > 0;
        };
        const u = t.viewport.value;
        c(), u.addEventListener("scroll", c), s(() => u.removeEventListener("scroll", c));
      }
    }), watch(r, () => {
      r.value && (n == null || n.onScrollButtonChange(r.value));
    }), (s, i) => a.value ? (openBlock(), createBlock(Na, {
      key: 0,
      ref: unref(o),
      onAutoScroll: i[0] || (i[0] = () => {
        const { viewport: l, selectedItem: c } = unref(t);
        l != null && l.value && (c != null && c.value) && (l.value.scrollTop = l.value.scrollTop - c.value.offsetHeight);
      })
    }, {
      default: withCtx(() => [
        renderSlot(s.$slots, "default")
      ]),
      _: 3
    }, 512)) : createCommentVNode("", true);
  }
});
var of = defineComponent({
  __name: "SelectTrigger",
  props: {
    disabled: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: { default: "button" }
  },
  setup(e) {
    const t = e, n = yt(), { forwardRef: o, currentElement: r } = ae(), a = computed(() => {
      var p;
      return ((p = n.disabled) == null ? void 0 : p.value) || t.disabled;
    });
    n.contentId || (n.contentId = Ze(void 0, "reka-select-content")), onMounted(() => {
      n.onTriggerChange(r.value);
    });
    const { getItems: s } = Ke(), { search: i, handleTypeaheadSearch: l, resetTypeahead: c } = No();
    function u() {
      a.value || (n.onOpenChange(true), c());
    }
    function d(p) {
      u(), n.triggerPointerDownPosRef.value = {
        x: Math.round(p.pageX),
        y: Math.round(p.pageY)
      };
    }
    return (p, f) => (openBlock(), createBlock(unref(Ia), {
      "as-child": "",
      reference: p.reference
    }, {
      default: withCtx(() => {
        var v, h2, g, x;
        return [
          createVNode(unref(re), {
            ref: unref(o),
            role: "combobox",
            type: p.as === "button" ? "button" : void 0,
            "aria-controls": unref(n).contentId,
            "aria-expanded": unref(n).open.value || false,
            "aria-required": (v = unref(n).required) == null ? void 0 : v.value,
            "aria-autocomplete": "none",
            disabled: a.value,
            dir: (h2 = unref(n)) == null ? void 0 : h2.dir.value,
            "data-state": (g = unref(n)) != null && g.open.value ? "open" : "closed",
            "data-disabled": a.value ? "" : void 0,
            "data-placeholder": unref(Bd)((x = unref(n).modelValue) == null ? void 0 : x.value) ? "" : void 0,
            "as-child": p.asChild,
            as: p.as,
            onClick: f[0] || (f[0] = (y) => {
              var b;
              (b = y == null ? void 0 : y.currentTarget) == null || b.focus();
            }),
            onPointerdown: f[1] || (f[1] = (y) => {
              if (y.pointerType === "touch")
                return y.preventDefault();
              const b = y.target;
              b.hasPointerCapture(y.pointerId) && b.releasePointerCapture(y.pointerId), y.button === 0 && y.ctrlKey === false && (d(y), y.preventDefault());
            }),
            onPointerup: f[2] || (f[2] = withModifiers(
              (y) => {
                y.pointerType === "touch" && d(y);
              },
              ["prevent"]
            )),
            onKeydown: f[3] || (f[3] = (y) => {
              const b = unref(i) !== "";
              !(y.ctrlKey || y.altKey || y.metaKey) && y.key.length === 1 && b && y.key === " " || (unref(l)(y.key, unref(s)()), unref(Ld).includes(y.key) && (u(), y.preventDefault()));
            })
          }, {
            default: withCtx(() => [
              renderSlot(p.$slots, "default")
            ]),
            _: 3
          }, 8, ["type", "aria-controls", "aria-expanded", "aria-required", "disabled", "dir", "data-state", "data-disabled", "data-placeholder", "as-child", "as"])
        ];
      }),
      _: 3
    }, 8, ["reference"]));
  }
});
var rf = defineComponent({
  __name: "SelectValue",
  props: {
    placeholder: { default: "" },
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  setup(e) {
    const t = e, { forwardRef: n, currentElement: o } = ae(), r = yt();
    onMounted(() => {
      r.valueElement = o;
    });
    const a = computed(() => {
      var u;
      let i = [];
      const l = Array.from(r.optionsSet.value), c = (d) => l.find((p) => wn(d, p.value, r.by));
      return Array.isArray(r.modelValue.value) ? i = r.modelValue.value.map((d) => {
        var p;
        return ((p = c(d)) == null ? void 0 : p.textContent) ?? "";
      }) : i = [((u = c(r.modelValue.value)) == null ? void 0 : u.textContent) ?? ""], i.filter(Boolean);
    }), s = computed(() => a.value.length ? a.value.join(", ") : t.placeholder);
    return (i, l) => (openBlock(), createBlock(unref(re), {
      ref: unref(n),
      as: i.as,
      "as-child": i.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": a.value.length ? void 0 : t.placeholder
    }, {
      default: withCtx(() => [
        renderSlot(i.$slots, "default", {
          selectedLabel: a.value,
          modelValue: unref(r).modelValue.value
        }, () => [
          createTextVNode(toDisplayString(s.value), 1)
        ])
      ]),
      _: 3
    }, 8, ["as", "as-child", "data-placeholder"]));
  }
});
var af = defineComponent({
  __name: "SelectViewport",
  props: {
    nonce: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const t = e, { nonce: n } = toRefs(t), o = La(n), r = bt(), a = r.position === "item-aligned" ? Vo() : void 0, { forwardRef: s, currentElement: i } = ae();
    onMounted(() => {
      r == null || r.onViewportChange(i.value);
    });
    const l = ref(0);
    function c(u) {
      const d = u.currentTarget, { shouldExpandOnScrollRef: p, contentWrapper: f } = a ?? {};
      if (p != null && p.value && (f != null && f.value)) {
        const v = Math.abs(l.value - d.scrollTop);
        if (v > 0) {
          const h2 = window.innerHeight - Ie * 2, g = Number.parseFloat(
            f.value.style.minHeight
          ), x = Number.parseFloat(f.value.style.height), y = Math.max(g, x);
          if (y < h2) {
            const b = y + v, w = Math.min(h2, b), C = b - w;
            f.value.style.height = `${w}px`, f.value.style.bottom === "0px" && (d.scrollTop = C > 0 ? C : 0, f.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (u, d) => (openBlock(), createElementBlock(Fragment, null, [
      createVNode(unref(re), mergeProps({
        ref: unref(s),
        "data-reka-select-viewport": "",
        role: "presentation"
      }, { ...u.$attrs, ...t }, {
        style: {
          // we use position: 'relative' here on the `viewport` so that when we call
          // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
          // (independent of the scrollUpButton).
          position: "relative",
          flex: 1,
          overflow: "hidden auto"
        },
        onScroll: c
      }), {
        default: withCtx(() => [
          renderSlot(u.$slots, "default")
        ]),
        _: 3
      }, 16),
      createVNode(unref(re), {
        as: "style",
        nonce: unref(o)
      }, {
        default: withCtx(() => d[0] || (d[0] = [
          createTextVNode(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")
        ])),
        _: 1
      }, 8, ["nonce"])
    ], 64));
  }
});
var Va = (e, t) => (n) => e && e[n] ? e[n] : t && t[n] ? t[n] : "";
var sf = { class: "flex gap-4 justify-end p-3" };
var lf = ["disabled"];
var uf = {
  __name: "DialogComponent",
  props: {
    classes: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    preConfirm: {
      type: Function,
      default() {
        return true;
      }
    },
    confirmDisabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["confirm", "cancel"],
  setup(e, { emit: t }) {
    const n = {
      trigger: "text-default",
      overlay: "fixed inset-0 bg-background/50 dark:bg-background/85 z-499 backdrop-filter backdrop-blur-sm",
      title: "bg-surface text-default text-xl font-semibold leading-6 border-b border-border p-4 rounded-t",
      content: `fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[28rem] translate-x-[-50%] translate-y-[-50%]
        rounded bg-gray-50 dark:bg-moon-800
        shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-500
        border border-border`,
      description: "text-default p-4",
      confirmButton: "bg-primary hover:bg-primary-hover text-onprimary disabled:bg-disabled disabled:text-subtle disabled:hover:cursor-default rounded px-4 h-[2.375rem]",
      cancelButton: "border border-border bg-transparent hover:bg-subtle text-default rounded px-4 h-[2.375rem]"
    }, o = e, { classes: r, preConfirm: a } = toRefs(o), s = Va(n, r), i = t, l = ref(false), c = () => {
      a.value() && (i("confirm"), l.value = false);
    }, u = () => i("cancel");
    return (d, p) => (openBlock(), createBlock(unref(lc), {
      open: l.value,
      "onUpdate:open": p[0] || (p[0] = (f) => l.value = f)
    }, {
      default: withCtx(() => [
        createVNode(unref(Vc), { "as-child": "" }, {
          default: withCtx(() => [
            renderSlot(d.$slots, "trigger", {}, () => [
              p[1] || (p[1] = createBaseVNode("button", { class: "btn-primary-lg rounded px-4 h-[2.375rem]" }, "Settings", -1))
            ])
          ]),
          _: 3
        }),
        createVNode(unref(_d), null, {
          default: withCtx(() => [
            createVNode(unref(Mc), {
              class: normalizeClass(unref(s)("overlay"))
            }, null, 8, ["class"]),
            createVNode(unref(Ic), {
              class: normalizeClass(unref(s)("content"))
            }, {
              default: withCtx(() => [
                createVNode(unref(Nc), {
                  class: normalizeClass(unref(s)("title"))
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(e.title), 1)
                  ]),
                  _: 1
                }, 8, ["class"]),
                createVNode(unref(Dc), {
                  class: normalizeClass(unref(s)("description"))
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(e.description), 1)
                  ]),
                  _: 1
                }, 8, ["class"]),
                renderSlot(d.$slots, "content", normalizeProps(guardReactiveProps({ open: l.value }))),
                createBaseVNode("div", sf, [
                  createVNode(unref(uc), { "as-child": "" }, {
                    default: withCtx(() => [
                      renderSlot(d.$slots, "cancelTrigger", {}, () => [
                        createBaseVNode("button", {
                          onClick: u,
                          class: normalizeClass(unref(s)("cancelButton"))
                        }, [
                          renderSlot(d.$slots, "cancelLabel", {}, () => [
                            p[2] || (p[2] = createBaseVNode("span", null, "Cancel", -1))
                          ])
                        ], 2)
                      ])
                    ]),
                    _: 3
                  }),
                  renderSlot(d.$slots, "confirmTrigger", {}, () => [
                    createBaseVNode("button", {
                      onClick: c,
                      disabled: e.confirmDisabled,
                      class: normalizeClass(unref(s)("confirmButton"))
                    }, [
                      renderSlot(d.$slots, "confirmLabel", {}, () => [
                        p[3] || (p[3] = createBaseVNode("span", null, "OK", -1))
                      ])
                    ], 10, lf)
                  ])
                ])
              ]),
              _: 3
            }, 8, ["class"])
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["open"]));
  }
};
var cf = {
  __name: "SingleSelect",
  props: {
    classes: {
      type: Object,
      default: null
    },
    options: {
      type: Array,
      required: true
    },
    labelKey: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: "Select option"
    },
    modelValue: {
      type: [String, Boolean, Number, Object],
      required: false
    }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = {
      trigger: `inline-flex items-center justify-between gap-2 min-w-[10rem] 
        form-inputfield text-sm text-muted 
        h-[2.375rem] px-3`,
      content: `bg-surface rounded min-w-[11.25rem] 
        border border-border
        shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] z-501`,
      item: `single-select-item 
    leading-none flex items-center pl-8
    outline-none select-none py-1 data-[disabled]:cursor-not-allowed 
    text-default
    highlighted-major
    [&[data-state=checked][data-highlighted]]:selected-hovered-major
    `
    }, o = e, r = t, { classes: a, options: s, labelKey: i } = toRefs(o), l = Va(a.value, n), c = (p) => i.value ? p[i.value] : p, u = (p) => o.labelKey !== null ? o.options.find((f) => f[o.labelKey] === p) : p, d = computed({
      get: () => o.labelKey !== null ? o.modelValue[o.labelKey] : o.modelValue,
      set: (p) => r("update:modelValue", u(p))
    });
    return (p, f) => (openBlock(), createBlock(unref(Nd), {
      modelValue: d.value,
      "onUpdate:modelValue": f[0] || (f[0] = (v) => d.value = v)
    }, {
      default: withCtx(() => [
        createVNode(unref(of), mergeProps({
          class: unref(l)("trigger")
        }, p.$attrs), {
          default: withCtx(() => [
            createVNode(unref(rf), { placeholder: e.placeholder }, {
              default: withCtx(() => [
                renderSlot(p.$slots, "triggerLabel", {}, () => [
                  createBaseVNode("span", null, toDisplayString(d.value), 1)
                ])
              ]),
              _: 3
            }, 8, ["placeholder"]),
            f[1] || (f[1] = createBaseVNode("span", { class: "i-tabler-chevron-down font-light text-muted text-2xl block" }, null, -1))
          ]),
          _: 3,
          __: [1]
        }, 16, ["class"]),
        createVNode(unref(ef), null, {
          default: withCtx(() => [
            createVNode(unref(Ud), {
              class: normalizeClass(unref(l)("content")),
              "side-offset": 5
            }, {
              default: withCtx(() => [
                createVNode(unref(nf), { class: "flex items-center justify-center" }, {
                  default: withCtx(() => f[2] || (f[2] = [
                    createBaseVNode("span", { class: "i-tabler-chevron-up block text-default" }, null, -1)
                  ])),
                  _: 1,
                  __: [2]
                }),
                createVNode(unref(af), { class: "p-3" }, {
                  default: withCtx(() => [
                    createVNode(unref(Yd), null, {
                      default: withCtx(() => [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(s), (v, h2) => (openBlock(), createBlock(unref(Jd), {
                          key: h2,
                          value: c(v),
                          class: normalizeClass(unref(l)("item"))
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Zd), { class: "absolute left-[1rem] w-[1rem] inline-flex items-center justify-center" }, {
                              default: withCtx(() => f[3] || (f[3] = [
                                createBaseVNode("span", { class: "i-tabler-check block" }, null, -1)
                              ])),
                              _: 1,
                              __: [3]
                            }),
                            createVNode(unref(Qd), null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(c(v)), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1032, ["value", "class"]))), 128))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(tf), { class: "flex items-center justify-center" }, {
                  default: withCtx(() => f[4] || (f[4] = [
                    createBaseVNode("span", { class: "i-tabler-chevron-down block text-default" }, null, -1)
                  ])),
                  _: 1,
                  __: [4]
                })
              ]),
              _: 1
            }, 8, ["class"])
          ]),
          _: 1
        })
      ]),
      _: 3
    }, 8, ["modelValue"]));
  }
};
function df({
  modelValue: e,
  options: t,
  isDefaultOption: n = (a) => false,
  getId: o = (a) => a.id,
  multiple: r
}) {
  const a = (p, f) => {
    const v = o(p), h2 = o(f);
    return v === h2;
  }, s = computed(() => t.value.find(n)), i = computed(() => new Set(e.value.map(o)));
  !r && s.value && e.value.length === 0 && (e.value = [s.value]);
  function l(p) {
    return i.value.has(o(p));
  }
  function c(p, f) {
    if (f.length === 1 && a(f[0], p))
      return;
    const v = f.filter((h2) => !a(h2, p));
    e.value = v;
  }
  function u(p, f) {
    const h2 = [...f.filter((y) => !n(y)), p], g = s.value ? t.value.length - 1 : t.value.length, x = h2.length === g;
    e.value = x && s.value ? [s.value] : h2;
  }
  function d(p) {
    const f = [...e.value];
    if (n(p)) {
      e.value = s.value ? [s.value] : [];
      return;
    }
    l(p) ? c(p, f) : u(p, f);
  }
  return {
    isSelected: l,
    toggleSelect: d,
    selectedIds: i,
    selectedOptions: computed(() => e.value)
  };
}
function ff({ itemsRef: e, listTemplateRef: t }) {
  const n = ref(0), o = (u) => {
    const d = e.value;
    d.length && (n.value = (n.value + u + d.length) % d.length, r());
  }, r = () => {
    nextTick(() => {
      var d;
      const u = t.value.querySelectorAll("li");
      (d = u == null ? void 0 : u[n.value]) == null || d.focus();
    });
  }, a = {
    ArrowDown: () => o(1),
    ArrowUp: () => o(-1)
  }, s = (u) => {
    a[u.key] && (u.preventDefault(), a[u.key]());
  }, i = {
    ArrowDown: () => s({ key: "ArrowDown", preventDefault: () => {
    } }),
    ArrowUp: () => s({ key: "ArrowUp", preventDefault: () => {
    } })
  };
  return {
    focusedIndex: n,
    onArrowKey: s,
    onGlobalArrowKey: (u) => {
      if (!(t != null && t.value)) return;
      const d = i[u.key];
      d && (u.preventDefault(), u.stopPropagation(), d());
    },
    resetFocus: () => {
      n.value = 0, r();
    }
  };
}
var pf = {
  key: 0,
  class: "p-3 absolute bg-surface rounded min-w-[15.75rem] w-fit max-h-50rem overflow-auto with-scrollbar border border-border shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] z-501",
  ref: "dropdown"
};
var mf = ["aria-activedescendant"];
var vf = ["id", "onMouseenter", "onFocus", "data-highlighted", "tabindex", "onKeydown", "onClick", "aria-selected", "data-state"];
var hf = { class: "relative inline-flex items-center justify-center" };
var gf = ["data-selected"];
var yf = {
  __name: "MultiSelectContent",
  props: mergeModels({
    options: {
      type: Array,
      required: true
    },
    isDefaultOption: {
      type: Function,
      required: true
    },
    open: {
      type: Boolean,
      required: true
    },
    idFunction: {
      type: Function,
      required: true
    },
    labelFunction: {
      type: Function,
      required: true
    },
    multiple: {
      type: Boolean,
      required: true
    }
  }, {
    modelValue: {
      type: Array,
      default: () => [],
      required: true
    },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    const n = (f, v) => Array.isArray(f) ? v ? f : f.slice(-1) : f ? [f] : [], o = useModel(e, "modelValue", {
      get(f) {
        const v = toValue(f);
        return n(v, r.multiple);
      },
      set(f) {
        return n(f, r.multiple);
      }
    }), r = e, a = toRef(r, "options"), { toggleSelect: s, isSelected: i } = df({
      modelValue: o,
      multiple: r.multiple,
      options: a,
      isDefaultOption: r.isDefaultOption,
      getId: r.idFunction
    }), l = useTemplateRef("listRef"), c = useTemplateRef("dropdown");
    t({ dropdownRef: c });
    const { focusedIndex: u, resetFocus: d, onGlobalArrowKey: p } = ff({
      itemsRef: a,
      listTemplateRef: l
    });
    return watch(
      () => r.open,
      (f) => {
        f ? (window.addEventListener("keydown", p), d()) : window.removeEventListener("keydown", p);
      },
      { immediate: true }
    ), (f, v) => e.open ? (openBlock(), createElementBlock("div", pf, [
      createBaseVNode("ul", {
        ref: "listRef",
        role: "listbox",
        "aria-multiselectable": "true",
        "aria-activedescendant": "option-" + e.idFunction(a.value[unref(u)]),
        onKeydown: v[0] || (v[0] = withKeys(withModifiers((...h2) => f.closeDropdown && f.closeDropdown(...h2), ["prevent"]), ["esc"]))
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(a.value, (h2, g) => (openBlock(), createElementBlock("li", {
          class: normalizeClass(["multi-select-item leading-none flex items-center pl-8 outline-none select-none py-1 data-[disabled]:cursor-not-allowed text-default highlighted-major [&[data-state=checked][data-highlighted]]:selected-hovered-major", [unref(u) === g ? "bg-primary text-onprimary" : ""]]),
          id: "option-" + e.idFunction(h2),
          key: e.idFunction(h2),
          role: "option",
          onMouseenter: (x) => u.value = g,
          onFocus: (x) => u.value = g,
          "data-highlighted": unref(u) === g || null,
          tabindex: g === unref(u) ? 0 : -1,
          onKeydown: withKeys(withModifiers((x) => unref(s)(h2), ["prevent"]), ["enter"]),
          onClick: (x) => unref(s)(h2),
          "aria-selected": unref(i)(h2),
          "data-state": unref(i)(h2) ? "checked" : "unchecked"
        }, [
          createBaseVNode("div", hf, [
            createBaseVNode("span", {
              "data-selected": unref(i)(h2),
              class: "data-[selected=true]:block data-[selected=true]:i-tabler-check absolute left-[-1.75rem]"
            }, null, 8, gf),
            createTextVNode(" " + toDisplayString(e.labelFunction(h2)), 1)
          ])
        ], 42, vf))), 128))
      ], 40, mf)
    ], 512)) : createCommentVNode("", true);
  }
};
var za = Hr ? window : void 0;
function zt(e) {
  var t;
  const n = toValue(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
function vn(...e) {
  const t = [], n = () => {
    t.forEach((i) => i()), t.length = 0;
  }, o = (i, l, c, u) => (i.addEventListener(l, c, u), () => i.removeEventListener(l, c, u)), r = computed(() => {
    const i = Mn(toValue(e[0])).filter((l) => l != null);
    return i.every((l) => typeof l != "string") ? i : void 0;
  }), a = bi(
    () => {
      var i, l;
      return [
        (l = (i = r.value) == null ? void 0 : i.map((c) => zt(c))) != null ? l : [za].filter((c) => c != null),
        Mn(toValue(r.value ? e[1] : e[0])),
        Mn(unref(r.value ? e[2] : e[1])),
        // @ts-expect-error - TypeScript gets the correct types, but somehow still complains
        toValue(r.value ? e[3] : e[2])
      ];
    },
    ([i, l, c, u]) => {
      if (n(), !(i != null && i.length) || !(l != null && l.length) || !(c != null && c.length))
        return;
      const d = pi(u) ? { ...u } : u;
      t.push(
        ...i.flatMap(
          (p) => l.flatMap(
            (f) => c.map((v) => o(p, f, v, d))
          )
        )
      );
    },
    { flush: "post" }
  ), s = () => {
    a(), n();
  };
  return Wr(n), s;
}
var $r = false;
function kr(e, t, n = {}) {
  const { window: o = za, ignore: r = [], capture: a = true, detectIframe: s = false, controls: i = false } = n;
  if (!o)
    return i ? { stop: Ue, cancel: Ue, trigger: Ue } : Ue;
  if (Zn && !$r) {
    $r = true;
    const g = { passive: true };
    Array.from(o.document.body.children).forEach((x) => x.addEventListener("click", Ue, g)), o.document.documentElement.addEventListener("click", Ue, g);
  }
  let l = true;
  const c = (g) => toValue(r).some((x) => {
    if (typeof x == "string")
      return Array.from(o.document.querySelectorAll(x)).some((y) => y === g.target || g.composedPath().includes(y));
    {
      const y = zt(x);
      return y && (g.target === y || g.composedPath().includes(y));
    }
  });
  function u(g) {
    const x = toValue(g);
    return x && x.$.subTree.shapeFlag === 16;
  }
  function d(g, x) {
    const y = toValue(g), b = y.$.subTree && y.$.subTree.children;
    return b == null || !Array.isArray(b) ? false : b.some((w) => w.el === x.target || x.composedPath().includes(w.el));
  }
  const p = (g) => {
    const x = zt(e);
    if (g.target != null && !(!(x instanceof Element) && u(e) && d(e, g)) && !(!x || x === g.target || g.composedPath().includes(x))) {
      if ("detail" in g && g.detail === 0 && (l = !c(g)), !l) {
        l = true;
        return;
      }
      t(g);
    }
  };
  let f = false;
  const v = [
    vn(o, "click", (g) => {
      f || (f = true, setTimeout(() => {
        f = false;
      }, 0), p(g));
    }, { passive: true, capture: a }),
    vn(o, "pointerdown", (g) => {
      const x = zt(e);
      l = !c(g) && !!(x && !g.composedPath().includes(x));
    }, { passive: true }),
    s && vn(o, "blur", (g) => {
      setTimeout(() => {
        var x;
        const y = zt(e);
        ((x = o.document.activeElement) == null ? void 0 : x.tagName) === "IFRAME" && !(y != null && y.contains(o.document.activeElement)) && t(g);
      }, 0);
    }, { passive: true })
  ].filter(Boolean), h2 = () => v.forEach((g) => g());
  return i ? {
    stop: h2,
    cancel: () => {
      l = false;
    },
    trigger: (g) => {
      l = true, p(g), l = false;
    }
  } : h2;
}
var Yn = /* @__PURE__ */ new WeakMap();
var bf = {
  mounted(e, t) {
    const n = !t.modifiers.bubble;
    let o;
    if (typeof t.value == "function")
      o = kr(e, t.value, { capture: n });
    else {
      const [r, a] = t.value;
      o = kr(e, r, Object.assign({ capture: n }, a));
    }
    Yn.set(e, o);
  },
  unmounted(e) {
    const t = Yn.get(e);
    t && typeof t == "function" ? t() : t == null || t.stop(), Yn.delete(e);
  }
};
function Xn(e) {
  return typeof Window < "u" && e instanceof Window ? e.document.documentElement : typeof Document < "u" && e instanceof Document ? e.documentElement : e;
}
function ja(e) {
  const t = window.getComputedStyle(e);
  if (t.overflowX === "scroll" || t.overflowY === "scroll" || t.overflowX === "auto" && e.clientWidth < e.scrollWidth || t.overflowY === "auto" && e.clientHeight < e.scrollHeight)
    return true;
  {
    const n = e.parentNode;
    return !n || n.tagName === "BODY" ? false : ja(n);
  }
}
function wf(e) {
  const t = e || window.event, n = t.target;
  return ja(n) ? false : t.touches.length > 1 ? true : (t.preventDefault && t.preventDefault(), false);
}
var Jn = /* @__PURE__ */ new WeakMap();
function xf(e, t = false) {
  const n = shallowRef(t);
  let o = null, r = "";
  watch(vi(e), (i) => {
    const l = Xn(toValue(i));
    if (l) {
      const c = l;
      if (Jn.get(c) || Jn.set(c, c.style.overflow), c.style.overflow !== "hidden" && (r = c.style.overflow), c.style.overflow === "hidden")
        return n.value = true;
      if (n.value)
        return c.style.overflow = "hidden";
    }
  }, {
    immediate: true
  });
  const a = () => {
    const i = Xn(toValue(e));
    !i || n.value || (Zn && (o = vn(
      i,
      "touchmove",
      (l) => {
        wf(l);
      },
      { passive: false }
    )), i.style.overflow = "hidden", n.value = true);
  }, s = () => {
    const i = Xn(toValue(e));
    !i || !n.value || (Zn && (o == null || o()), i.style.overflow = r, Jn.delete(i), n.value = false);
  };
  return Wr(s), computed({
    get() {
      return n.value;
    },
    set(i) {
      i ? a() : s();
    }
  });
}
function Cf() {
  let e = false;
  const t = shallowRef(false);
  return (n, o) => {
    if (t.value = o.value, e)
      return;
    e = true;
    const r = xf(n, o.value);
    watch(t, (a) => r.value = a);
  };
}
Cf();
var Sf = ["value"];
var Ef = {
  class: "shrink-0 i-tabler-chevron-down block text-2xl text-muted mr-2 hover:cursor-pointer",
  ref: "dropdownToggle"
};
var Of = { class: "relative w-full" };
var Pf = {
  __name: "MultiSelect",
  props: mergeModels({
    options: {
      type: Array,
      required: true
    },
    isDefaultOption: {
      type: Function,
      default: (e) => e.id === "DEFAULT"
    },
    labelFunction: {
      type: Function,
      default: (e) => e.label
    },
    idFunction: {
      type: Function,
      default: (e) => e.id
    },
    multiple: {
      type: Boolean,
      default: true
    },
    placeholderFunction: {
      type: Function
    }
  }, {
    modelValue: {
      type: Array,
      default: () => [],
      required: true
    },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = `selectcomponent-input-${useId()}`, n = useModel(e, "modelValue"), o = ref(false), r = e, a = useTemplateRef("dropdownContent"), s = useTemplateRef("multiSelectWrapper"), i = computed(() => {
      const f = n.value;
      return r.placeholderFunction ? r.placeholderFunction(f) : f.length === 1 ? r.labelFunction(f[0]) : `${f.length} selected`;
    }), l = () => {
      o.value = !o.value, o.value && nextTick().then(() => {
        requestAnimationFrame(() => {
          var f;
          d(ref((f = a == null ? void 0 : a.value) == null ? void 0 : f.dropdownRef));
        });
      });
    }, c = () => {
      o.value = false;
    }, u = [c, { ignore: [s] }], { updateDropdownPosition: d, dropdownStyles: p } = An(s);
    return (f, v) => (openBlock(), createElementBlock("div", {
      onKeydown: [
        v[1] || (v[1] = withKeys((h2) => !o.value && l(), ["space"])),
        v[2] || (v[2] = withKeys((h2) => !o.value && l(), ["arrow-down"])),
        v[3] || (v[3] = withKeys((h2) => !o.value && l(), ["arrow-up"])),
        withKeys(c, ["esc"]),
        withKeys(c, ["tab"])
      ],
      tabindex: "0",
      class: "form-inputfield",
      ref: "multiSelectWrapper"
    }, [
      createBaseVNode("label", {
        class: "selectcomponent__label flex items-center",
        onClick: withModifiers(l, ["prevent"])
      }, [
        createBaseVNode("input", {
          value: i.value,
          readonly: "",
          tabindex: "-1",
          class: normalizeClass(["w-full h-[2.375rem] inline-flex items-center rounded text-muted text-sm bg-inherit outline-none pl-2 hover:cursor-pointer", r.inputClasses]),
          id: t
        }, null, 10, Sf),
        createBaseVNode("div", null, [
          createBaseVNode("span", Ef, null, 512)
        ])
      ]),
      createBaseVNode("div", Of, [
        (openBlock(), createBlock(Teleport, { to: "body" }, [
          withDirectives(createVNode(yf, {
            ref: "dropdownContent",
            class: "invisible",
            disabled: !o.value,
            modelValue: n.value,
            "onUpdate:modelValue": v[0] || (v[0] = (h2) => n.value = h2),
            options: r.options,
            isDefaultOption: r.isDefaultOption,
            open: o.value,
            idFunction: e.idFunction,
            labelFunction: e.labelFunction,
            multiple: r.multiple,
            style: normalizeStyle(unref(p)),
            onKeydown: [
              withKeys(withModifiers(c, ["prevent"]), ["esc"]),
              withKeys(c, ["tab"])
            ]
          }, null, 8, ["disabled", "modelValue", "options", "isDefaultOption", "open", "idFunction", "labelFunction", "multiple", "style", "onKeydown"]), [
            [unref(bf), u]
          ])
        ]))
      ])
    ], 544));
  }
};
var Af = { class: "flex items-center" };
var $f = ["placeholder"];
var kf = {
  __name: "ListSelectInput",
  props: mergeModels({
    inputClasses: String,
    optionsLoading: Boolean,
    inputPlaceholder: String,
    toggleOpen: Function
  }, {
    searchTerm: { type: String, default: null },
    searchTermModifiers: {}
  }),
  emits: ["update:searchTerm"],
  setup(e) {
    const t = e, n = useModel(e, "searchTerm"), o = `listselect-input-${useId()}`;
    return (r, a) => {
      const s = resolveDirective("busy");
      return openBlock(), createElementBlock("label", Af, [
        withDirectives(createBaseVNode("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (i) => n.value = i),
          class: normalizeClass(["w-full h-full bg-inputfield rounded text-sm text-default outline-none pl-2", t.inputClasses]),
          ref: "searchInput",
          placeholder: e.inputPlaceholder,
          id: o,
          tabindex: "0"
        }, null, 10, $f), [
          [vModelText, n.value]
        ]),
        n.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "shrink-0 i-tabler-backspace block text-2xl text-muted hover:cursor-pointer",
          ref: "clearSearchButton",
          onClick: a[1] || (a[1] = withModifiers((i) => n.value = "", ["prevent"]))
        }, null, 512)) : createCommentVNode("", true),
        withDirectives((openBlock(), createElementBlock("div", null, [
          createBaseVNode("span", {
            class: "shrink-0 listselect--dropdown-toggle i-tabler-chevron-down block text-2xl text-muted mr-2 hover:cursor-pointer",
            onClick: a[2] || (a[2] = withModifiers((...i) => e.toggleOpen && e.toggleOpen(...i), ["prevent"])),
            ref: "dropdownToggle"
          }, null, 512)
        ])), [
          [s, e.optionsLoading]
        ])
      ]);
    };
  }
};
var Tf = {
  __name: "ListSelectItem",
  props: {
    option: Object,
    labelFn: Function,
    truncateItems: { type: Boolean, default: false }
  },
  setup(e) {
    const t = e;
    return (n, o) => (openBlock(), createElementBlock("div", {
      class: normalizeClass([{ truncate: t.truncateItems }, "listselectitem w-full h-full ps-2 py-2 hover:cursor-pointer text-default data-[state=checked]:selected-major highlighted-major [&[data-state=checked][data-highlighted]]:bg-error [&[data-state=checked][data-highlighted]]:text-onprimary"])
    }, toDisplayString(t.labelFn(e.option)), 3));
  }
};
var If = {
  ref: "listExcess",
  class: "absolute left-0 right-0 ml-auto mr-auto min-w-10 w-fit z-999999"
};
var Df = { class: "bg-background rounded" };
var _f = {
  key: 0,
  class: "flex gap-3 items-center bg-error-bg dark:bg-error-bg border border-error-border rounded p-2 text-sm text-onerror color-transition"
};
var Lf = {
  __name: "ListSelectExcessIndicator",
  props: {
    listLengthExceeded: Boolean,
    maxSelectionLength: Number,
    maxSelectionLengthTextFn: Function
  },
  setup(e) {
    const t = e;
    return (n, o) => (openBlock(), createElementBlock("div", If, [
      createBaseVNode("div", Df, [
        e.listLengthExceeded ? (openBlock(), createElementBlock("div", _f, [
          o[0] || (o[0] = createBaseVNode("div", { class: "i-tabler-alert-circle text-base block text-error" }, null, -1)),
          createTextVNode(" " + toDisplayString(t.maxSelectionLengthTextFn(t.maxSelectionLength)), 1)
        ])) : createCommentVNode("", true)
      ])
    ], 512));
  }
};
var Ff = { class: "font-semibold uppercase text-muted text-sm py-2" };
var Bf = { class: "flex flex-wrap gap-1 max-w-100" };
var Rf = { class: "hover:bg-surface rounded cursor-pointer" };
var Mf = ["onClick"];
var Wa = {
  __name: "ListSelectPreview",
  props: {
    selectedOptions: Array,
    labelFn: Function,
    selectionTextFn: Function
  },
  emits: ["removeOption"],
  setup(e, { emit: t }) {
    const n = e, o = t;
    return (r, a) => (openBlock(), createElementBlock(Fragment, null, [
      createBaseVNode("div", Ff, toDisplayString(n.selectionTextFn(e.selectedOptions.length)) + ": ", 1),
      createBaseVNode("ul", Bf, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(e.selectedOptions, (s, i) => (openBlock(), createElementBlock("li", {
          key: `selected-option-${i}`,
          class: "px-2 bg-surface border-1 border-border rounded text-default flex items-center gap-2 w-fit"
        }, [
          createBaseVNode("span", null, toDisplayString(n.labelFn(s)), 1),
          createBaseVNode("span", Rf, [
            createBaseVNode("span", {
              class: normalizeClass(["block i-tabler-x text-muted hover:text-default", `remove-option-${i}`]),
              onClick: (l) => o("removeOption", i)
            }, null, 10, Mf)
          ])
        ]))), 128))
      ])
    ], 64));
  }
};
var Nf = (e = 1300) => new Promise((t) => setTimeout(t, e));
var Vf = {
  __name: "ListSelect",
  props: mergeModels({
    options: { type: Array, default: () => [] },
    inputPlaceholder: { type: String },
    labelFn: { type: Function, default: (e) => e.label },
    trackBy: { type: String, default: "id" },
    multiple: { type: Boolean, default: true },
    optionsLoading: { type: Boolean, default: false },
    inputClasses: { type: String, default: "focus:placeholder-transparent" },
    dropdownClasses: { type: String, default: "" },
    optionSize: { type: Number, default: 40 },
    selectionTextFn: { type: Function, default: (e) => `${e} items selected` },
    maxSelectionLength: { type: Number, default: 10 },
    maxSelectionLengthTextFn: {
      type: Function,
      default: (e) => `You can only select ${e} items`
    },
    selectionExceededInfoDuration: { type: Number, default: 1300 },
    searchOptionsTextFn: { type: Function, default: () => "Search items..." },
    itemNameTextFn: { type: Function, default: (e) => e !== 1 ? "items" : "item" },
    searchFn: { type: Function, required: false },
    dropDownZIndex: { type: Number, default: 9999 },
    dropDownWidth: { type: String, default: "30rem" },
    truncateItems: { type: Boolean, default: false },
    portal: { type: Boolean, default: true }
  }, {
    modelValue: {
      type: [Object, Array]
    },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = ref(false), o = (b, w) => Array.isArray(b) ? w ? b : b.slice(-1) : b ? [b] : [], r = (b) => (n.value = true, Nf(t.selectionExceededInfoDuration).then(() => {
      n.value = false;
    }), [...b].splice(0, t.maxSelectionLength)), a = (b, w) => b[t.trackBy] === w[t.trackBy], s = (b) => {
      const w = !t.multiple, C = toValue(t.modelValue), O = Array.isArray(C) && C.length > 0 && a(C[0], b);
      return w && O;
    }, i = useModel(e, "modelValue", {
      get(b) {
        const w = toValue(b);
        return o(w, t.multiple);
      },
      set(b) {
        if (s(b))
          return [];
        const w = o(b, t.multiple);
        return t.multiple && w.length > t.maxSelectionLength ? r(w) : w;
      }
    }), l = (b) => {
      t.multiple ? i.value = i.value.filter((w, C) => C !== b) : i.value = null;
    }, c = ref(false), u = ref(""), d = () => {
      c.value = !c.value;
    };
    watch(u, (b) => {
      b.length > 0 && !c.value && (c.value = true);
    });
    const p = useTemplateRef("listselectRoot");
    watch(c, (b) => {
      var w;
      b ? (w = p.value) == null || w.highlightSelected() : u.value = "";
    });
    const f = () => {
      c.value = false;
    }, v = computed(
      () => u.value === "" ? t.options : t.options.filter((b) => t.labelFn(b).toLowerCase().includes(u.value.toLowerCase()))
    ), h2 = () => i.value && i.value.length === 1 ? t.labelFn(i.value[0]) : t.searchOptionsTextFn(), g = () => {
      var b, w;
      return ((b = i.value) == null ? void 0 : b.length) === 1 ? t.labelFn(i.value[0]) : ((w = i.value) == null ? void 0 : w.length) === 0 ? t.searchOptionsTextFn() : `${i.value.length} ${t.itemNameTextFn(
        i.value.length
      )}`;
    }, x = computed(() => t.inputPlaceholder ? t.inputPlaceholder : t.multiple ? g() : h2()), y = computed(() => {
      var b;
      return t.multiple && c.value && ((b = i.value) == null ? void 0 : b.length);
    });
    return (b, w) => (openBlock(), createBlock(unref(rd), {
      class: "flex flex-col text-nowrap relative",
      modelValue: i.value,
      "onUpdate:modelValue": w[3] || (w[3] = (C) => i.value = C),
      multiple: e.multiple,
      as: "div",
      by: t.trackBy,
      open: c.value,
      "onUpdate:open": w[4] || (w[4] = (C) => c.value = C),
      onKeydown: withKeys(f, ["esc"]),
      resetSearchTermOnBlur: true,
      ref: "listselectRoot"
    }, {
      default: withCtx(() => [
        createVNode(unref(qc), { asChild: "" }, {
          default: withCtx(() => [
            createVNode(unref(dd), {
              searchTerm: u.value,
              "onUpdate:searchTerm": w[2] || (w[2] = (C) => u.value = C),
              asChild: ""
            }, {
              default: withCtx(() => [
                createVNode(kf, {
                  inputClasses: t.inputClasses,
                  optionsLoading: t.optionsLoading,
                  inputPlaceholder: x.value,
                  toggleOpen: d,
                  onKeydown: [
                    w[0] || (w[0] = withKeys((C) => c.value = true, ["arrow-down"])),
                    w[1] || (w[1] = withKeys((C) => c.value = true, ["arrow-up"]))
                  ],
                  class: "form-inputfield-within",
                  ref: "listselectInput"
                }, null, 8, ["inputClasses", "optionsLoading", "inputPlaceholder"])
              ]),
              _: 1
            }, 8, ["searchTerm"])
          ]),
          _: 1
        }),
        createVNode(unref(hd), {
          disabled: !t.portal
        }, {
          default: withCtx(() => [
            createVNode(unref(ld), {
              class: normalizeClass(["min-w-20 fixed left-0 w-fit h-100 bg-surface shadow-lg rounded border border-border", t.dropdownClasses]),
              style: normalizeStyle({ width: t.dropDownWidth, zIndex: t.dropDownZIndex }),
              "position-strategy": "fixed",
              position: "popper",
              align: "start",
              onKeydown: withKeys(f, ["esc"])
            }, {
              default: withCtx(() => [
                n.value ? renderSlot(b.$slots, "list-excess", { key: 0 }, () => [
                  createVNode(Lf, {
                    listLengthExceeded: n.value,
                    maxSelectionLength: t.maxSelectionLength,
                    maxSelectionLengthTextFn: t.maxSelectionLengthTextFn
                  }, null, 8, ["listLengthExceeded", "maxSelectionLength", "maxSelectionLengthTextFn"])
                ]) : createCommentVNode("", true),
                createVNode(unref(gd), null, {
                  default: withCtx(() => [
                    createVNode(unref(Id), {
                      options: v.value,
                      "text-content": t.labelFn,
                      "estimate-size": t.optionSize
                    }, {
                      default: withCtx(({ option: C }) => [
                        createVNode(unref(vd), {
                          value: C,
                          asChild: "",
                          class: "listselect__option flex items-center justify-start w-full min-h-[38px] max-h-[38px] p-0"
                        }, {
                          default: withCtx(() => [
                            createVNode(Tf, {
                              option: C,
                              labelFn: t.labelFn,
                              truncateItems: t.truncateItems
                            }, null, 8, ["option", "labelFn", "truncateItems"])
                          ]),
                          _: 2
                        }, 1032, ["value"])
                      ]),
                      _: 1
                    }, 8, ["options", "text-content", "estimate-size"])
                  ]),
                  _: 1
                }),
                y.value ? renderSlot(b.$slots, "footer", {
                  key: 1,
                  selection: { selectedOptions: i.value }
                }, () => [
                  createVNode(Wa, {
                    selectedOptions: i.value,
                    labelFn: t.labelFn,
                    selectionTextFn: t.selectionTextFn,
                    onRemoveOption: l
                  }, null, 8, ["selectedOptions", "labelFn", "selectionTextFn"])
                ]) : createCommentVNode("", true)
              ]),
              _: 3
            }, 8, ["class", "style"])
          ]),
          _: 3
        }, 8, ["disabled"])
      ]),
      _: 3
    }, 8, ["modelValue", "multiple", "by", "open"]));
  }
};
var zf = {
  key: 0,
  class: "text-default"
};
var jf = ["data-checked"];
var Wf = ["data-checked"];
var Hf = {
  key: 0,
  class: "text-default"
};
var Kf = {
  __name: "ToggleComponent",
  props: mergeModels({
    leftLabel: {
      type: String,
      required: false
    },
    rightLabel: {
      type: String,
      required: false
    }
  }, {
    modelValue: {
      type: Boolean,
      default: false
    },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = useAttrs(), n = useModel(e, "modelValue"), o = ref(false);
    return (r, a) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(["flex items-center", [unref(t).disabled ? "pointer-events-none cursor-default" : ""]])
    }, [
      renderSlot(r.$slots, "leftLabel", normalizeProps(guardReactiveProps({ isChecked: n.value })), () => [
        e.leftLabel ? (openBlock(), createElementBlock("span", zf, toDisplayString(e.leftLabel), 1)) : createCommentVNode("", true)
      ]),
      createBaseVNode("label", {
        class: "relative inline-flex items-center cursor-pointer outline-none",
        tabindex: "0",
        onKeydown: [
          a[1] || (a[1] = withKeys(withModifiers((s) => n.value = !n.value, ["prevent"]), ["space"])),
          a[2] || (a[2] = withKeys(withModifiers((s) => n.value = false, ["prevent"]), ["left"])),
          a[3] || (a[3] = withKeys(withModifiers((s) => n.value = true, ["prevent"]), ["right"]))
        ],
        onFocus: a[4] || (a[4] = (s) => o.value = true),
        onBlur: a[5] || (a[5] = (s) => o.value = false)
      }, [
        withDirectives(createBaseVNode("input", {
          type: "checkbox",
          class: "sr-only",
          "onUpdate:modelValue": a[0] || (a[0] = (s) => n.value = s)
        }, null, 512), [
          [vModelCheckbox, n.value]
        ]),
        createBaseVNode("div", {
          class: normalizeClass(["w-10 h-6 data-[checked=true]:bg-primary data-[checked=false]:bg-inputfield border border-border rounded-full shadow-inner transition duration-150 ease-in-out", [unref(t).disabled ? "bg-disabled!" : ""]]),
          "data-checked": n.value
        }, null, 10, jf),
        createBaseVNode("div", {
          class: normalizeClass(["absolute left-0.5 w-5 h-5 bg-surface border border-2 border-border text-default rounded-full shadow transform transition-transform duration-150 ease-in-out", { "translate-x-4.05 bg-surface": n.value, "border-primary-hover": o.value }])
        }, [
          renderSlot(r.$slots, "toggle-icon", normalizeProps(guardReactiveProps({ isChecked: n.value })), () => [
            createBaseVNode("span", {
              "data-checked": n.value,
              class: "flex mx-auto mt-0.5"
            }, null, 8, Wf)
          ])
        ], 2)
      ], 32),
      renderSlot(r.$slots, "rightLabel", normalizeProps(guardReactiveProps({ isChecked: n.value })), () => [
        e.rightLabel ? (openBlock(), createElementBlock("span", Hf, toDisplayString(e.rightLabel), 1)) : createCommentVNode("", true)
      ])
    ], 2));
  }
};
var qf = { key: 0 };
var Uf = {
  __name: "Fade",
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  setup(e) {
    return (t, n) => (openBlock(), createBlock(Transition, {
      name: "fade",
      mode: "out-in"
    }, {
      default: withCtx(() => [
        e.show ? (openBlock(), createElementBlock("div", qf, [
          renderSlot(t.$slots, "default")
        ])) : createCommentVNode("", true)
      ]),
      _: 3
    }));
  }
};
var Gf = { class: "flex items-center gap-2" };
var Yf = ["id", "value"];
var Xf = ["for"];
var Jf = {
  __name: "CheckboxComponent",
  props: mergeModels({
    name: { type: String, default: null },
    id: { type: String, default: null },
    label: { type: String, default: "" }
  }, {
    modelValue: {
      required: true,
      type: [Boolean, Array]
    },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = e, n = useAttrs(), o = t.id || `checkbox-${useId()}`, r = t.name || o, a = useModel(e, "modelValue");
    return (s, i) => (openBlock(), createElementBlock("div", Gf, [
      withDirectives(createBaseVNode("input", mergeProps({
        type: "checkbox",
        id: unref(o),
        value: unref(r),
        "onUpdate:modelValue": i[0] || (i[0] = (l) => a.value = l)
      }, unref(n), { class: "relative shrink-0 appearance-none formfield rounded checked:bg-primary h-5 w-5 disabled:cursor-pointer-default peer" }), null, 16, Yf), [
        [vModelCheckbox, a.value]
      ]),
      createBaseVNode("label", {
        for: unref(o),
        class: ""
      }, toDisplayString(e.label), 9, Xf),
      i[1] || (i[1] = createBaseVNode("div", { class: "absolute w-5 h-5 hidden text-onprimary i-tabler-check peer-checked:block pointer-events-none" }, null, -1))
    ]));
  }
};
var Zf = {
  key: 0,
  role: "status",
  "aria-live": "polite",
  "aria-busy": "true",
  class: "border rounded-sm overflow-hidden relative bg-surface border-border"
};
var Qf = { class: "relative cursor-wait pointer-events-none" };
var ep = { class: "space-y-3 p-4 z-10" };
var Tr = {
  type: "all",
  speed: "normal"
};
var tp = {
  __name: "TableSkeleton",
  props: {
    rows: {
      type: Number,
      default: 5
    },
    columns: {
      type: Number,
      default: 5
    },
    animation: {
      type: Object,
      default: () => Tr,
      validator: (e) => typeof e == "object" && ["all", "per-row"].includes(e.type) && ["normal", "slow"].includes(e.speed)
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  setup(e) {
    const t = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7",
      8: "grid-cols-8",
      9: "grid-cols-9",
      10: "grid-cols-10",
      11: "grid-cols-11",
      12: "grid-cols-12"
    }, n = {
      normal: "animate-shimmer!",
      slow: "animate-shimmer-slow!"
    }, o = computed(() => ({
      ...Tr,
      ...toValue(r.animation)
    })), r = e;
    return (a, s) => e.show ? (openBlock(), createElementBlock("div", Zf, [
      o.value.type === "all" ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["absolute inset-0 pointer-events-none shimmer-bg z-0 cursor-wait", { [n[o.value.speed]]: o.value.type === "all" }])
      }, null, 2)) : createCommentVNode("", true),
      createBaseVNode("div", Qf, [
        createBaseVNode("div", {
          class: normalizeClass(["grid gap-4 p-4 border-b z-10 border-border", t[e.columns]])
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(e.columns, (i) => (openBlock(), createElementBlock("div", {
            key: "header-" + i,
            class: "h-6 rounded-sm bg-muted"
          }))), 128))
        ], 2),
        createBaseVNode("div", ep, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(e.rows, (i) => (openBlock(), createElementBlock("div", {
            key: "row-" + i,
            class: normalizeClass(["grid gap-4", t[e.columns]])
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(e.columns, (l) => (openBlock(), createElementBlock("div", {
              key: `cell-${i}-${l}`,
              class: normalizeClass(["h-5 rounded-sm bg-muted", {
                "shimmer-bg": o.value.type === "per-row",
                [n[o.value.speed]]: o.value.type === "per-row"
              }])
            }, null, 2))), 128))
          ], 2))), 128))
        ])
      ]),
      renderSlot(a.$slots, "message", {}, () => [
        s[0] || (s[0] = createBaseVNode("div", { class: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" }, [
          createBaseVNode("div", { class: "w-fit flex items-center p-4 gap-2 text-nowrap text-default border border-border bg-surface rounded-sm shadow-lg" }, [
            createBaseVNode("span", { class: "i-tabler-hourglass-high flex text-2xl animate-[spin_2s_ease-in-out_infinite]" }),
            createBaseVNode("span", { class: "text-xl" }, "Fetching data. This may take a while.")
          ])
        ], -1))
      ])
    ])) : createCommentVNode("", true);
  }
};
var Ir = Object.freeze(Object.defineProperty({
  __proto__: null,
  ActionDropdownComponent: ss,
  CardComponent: _l,
  CheckboxComponent: Jf,
  Collapse: ia,
  CollapsibleCard: jl,
  DialogComponent: uf,
  DropdownComponent: Kr,
  Fade: Uf,
  Heading: So,
  ListSelect: Vf,
  ListSelectPreview: Wa,
  LoadingOverlay: Kl,
  MultiSelect: Pf,
  PageTitle: Ml,
  PaginationComponent: Ur,
  SingleSelect: cf,
  TabCardComponent: Bl,
  TableComponent: ts,
  TableSkeleton: tp,
  TabsComponent: aa,
  ToggleComponent: Kf
}, Symbol.toStringTag, { value: "Module" }));
var Dr = ["busy-text-primary", "busy-bg-background"];
var np = (e, t) => {
  t.value ? (e.dataset.busy = true, e.classList.add(...Dr)) : (e.dataset.busy = false, Dr.forEach((n) => e.classList.remove(n)));
};
var _r = Object.freeze(Object.defineProperty({
  __proto__: null,
  busy: np,
  clickOutside: mo
}, Symbol.toStringTag, { value: "Module" }));
var dp = Object.freeze(Object.defineProperty({
  __proto__: null,
  useDropdownPosition: An,
  usePagination: qr
}, Symbol.toStringTag, { value: "Module" }));
var fp = {
  install(e) {
    Object.keys(Ir).forEach((t) => {
      e.component(t, Ir[t]);
    }), Object.keys(_r).forEach((t) => {
      e.directive(t, _r[t]);
    });
  }
};
export {
  ss as ActionDropdownComponent,
  _l as CardComponent,
  Jf as CheckboxComponent,
  ia as Collapse,
  jl as CollapsibleCard,
  uf as DialogComponent,
  Kr as DropdownComponent,
  Uf as Fade,
  So as Heading,
  Vf as ListSelect,
  Wa as ListSelectPreview,
  Kl as LoadingOverlay,
  Pf as MultiSelect,
  Ml as PageTitle,
  Ur as PaginationComponent,
  cf as SingleSelect,
  Bl as TabCardComponent,
  ts as TableComponent,
  tp as TableSkeleton,
  aa as TabsComponent,
  Kf as ToggleComponent,
  Ir as components,
  dp as composables,
  fp as default,
  _r as directives
};
//# sourceMappingURL=@s3_dse_v-tabler.js.map
