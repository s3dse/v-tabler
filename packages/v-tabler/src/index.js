import { TableComponent } from '@/components/table'
import { PaginationComponent } from '@/components/pagination'
import { DropdownComponent, ActionDropdownComponent } from '@/components/dropdown'
import { TabsComponent } from '@/components/tabs'
import { CardComponent, TabCardComponent, CollapsibleCard } from '@/components/card'
import { LoadingOverlay } from '@/components/loading-overlay'
import { DialogComponent } from '@/components/dialog'
import { SingleSelect, MultiSelect } from '@/components/select'
import { ListSelect, ListSelectPreview } from '@/components/listselect'
import { ToggleComponent } from '@/components/toggle'
import { Collapse, Fade } from '@/components/transition'
import { CheckboxComponent } from '@/components/checkbox'
import { Heading, PageTitle } from '@/components/typography'
import { TableSkeleton } from '@/components/skeleton'

// Import i18n utilities
import { getDefaultTranslationKeys, setVTablerI18n } from '@/composables/useI18n.js'

// Import the Vue plugin for default export
import VTabler from '@/install.js'

// Export the plugin as default
export default VTabler

export {
    TableComponent,
    PaginationComponent,
    DropdownComponent,
    ActionDropdownComponent,
    CardComponent,
    TabCardComponent,
    CollapsibleCard,
    LoadingOverlay,
    DialogComponent,
    SingleSelect,
    MultiSelect,
    TabsComponent,
    ListSelect,
    ListSelectPreview,
    ToggleComponent,
    Collapse,
    Fade,
    CheckboxComponent,
    Heading,
    PageTitle,
    TableSkeleton,
    getDefaultTranslationKeys,
    setVTablerI18n
}
