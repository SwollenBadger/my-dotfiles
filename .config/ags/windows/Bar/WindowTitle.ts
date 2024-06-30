import {truncateText} from 'lib/_utils'
import {hyprland} from 'resource:///com/github/Aylur/ags/service/hyprland.js'

const WindowTitle = () =>
    Widget.Label({
        classNames: ['window-title'],
        label: hyprland.active.client
            .bind('title')
            .as((title) => `~ ${truncateText(title, 25)} ~`),
    })

export default WindowTitle
