export type CheckboxStyle = {
    size?: 'lg' | 'md' | 'sm' | 'xs'
    color?: 'primary' | 'secondary' | 'accent'
}

export const computedCheckboxStyle = (style: CheckboxStyle) => {
    const { size = '', color = '' } = style
    let checkboxSize = ''
    let checkboxColor = ''
    switch (size) {
        case 'lg':
            checkboxSize = 'checkbox-lg'
            break
        case 'md':
            checkboxSize = 'checkbox-md'
            break
        case 'sm':
            checkboxSize = 'checkbox-sm'
            break
        case 'xs':
            checkboxSize = 'checkbox-xs'
            break
    }
    switch (color) {
        case 'primary':
            checkboxColor = 'checkbox-primary'
            break
        case 'secondary':
            checkboxColor = 'checkbox-secondary'
            break
        case 'accent':
            checkboxColor = 'checkbox-accent'
            break
    }
    return `${checkboxSize} ${checkboxColor}`
}
