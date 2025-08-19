import ButtonsSection from './ButtonsSection.vue'
import CardSection from './CardSection.vue'
import CheckboxSection from './CheckboxSection.vue'
import DialogsSection from './DialogsSection.vue'
import DropdownsSection from './DropdownsSection.vue'
import LoadingSection from './LoadingSection.vue'
import TablesSection from './TablesSection.vue'
import TypographySection from './TypographySection.vue'

export const sections = {
    buttons: { label: 'Buttons', component: ButtonsSection },
    card: { label: 'Card', component: CardSection },
    checkbox: { label: 'Checkbox', component: CheckboxSection },
    dialogs: { label: 'Dialogs', component: DialogsSection },
    dropdowns: { label: 'Dropdowns', component: DropdownsSection },
    loading: { label: 'Loading', component: LoadingSection },
    tables: { label: 'Tables', component: TablesSection },
    typography: { label: 'Typography', component: TypographySection }
}
