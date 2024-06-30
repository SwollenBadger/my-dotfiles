import {ButtonProps} from 'types/widgets/button'
import PopupWindow from '../PopupWindow'
import Notifications from './Notifications'
import Profile from './Profile'
import type Gtk from 'gi://Gtk?version=3.0'
import GlobalMenu from './Powermenu'
import Media from './Media'
import Hardware from './Hardware'

export const powerCommand = Variable('')
export const titleConfirm = Variable('')

export const MenuButton = ({
    command = '',
    label,
    title,
    confirm = false,
    content = Widget.Label({
        label,
    }),
    classNames = [],
    action = () => null,
    ...rest
}: {
    command?: string
    label?: string
    title: string
    confirm?: boolean
    content?: Gtk.Widget
    classNames?: string[]
    action?: () => void
} & ButtonProps) =>
    Widget.Button({
        hexpand: true,
        classNames: ['power-button', ...classNames],
        child: content,
        onClicked: () => {
            if (confirm) {
                powerCommand.setValue(command)
                titleConfirm.setValue(title)
                App.toggleWindow('menu')
                App.toggleWindow('confirmation')
                return
            }

            if (command !== '') {
                Utils.execAsync(command)
                App.toggleWindow('menu')
            }

            return action()
        },
        ...rest,
    })

export const Menu = () =>
    PopupWindow({
        name: 'menu',
        layout: 'top-left',
        transition: 'slide_right',
        exclusivity: 'normal',
        child: Widget.Box({
            children: [
                Widget.Box({
                    classNames: ['menu-holder'],
                    vertical: true,
                    children: [
                        Profile(),
                        GlobalMenu(),
                        Widget.Box({
                            vertical: true,
                            classNames: ['media'],
                            hexpand: true,
                            children: [
                                Widget.Box({
                                    classNames: ['media-header'],
                                    hexpand: true,
                                    children: [
                                        Widget.Label({
                                            label: 'Media player',
                                            classNames: ['title'],
                                        }),
                                    ],
                                }),
                                Widget.Scrollable({
                                    hexpand: true,
                                    classNames: ['media-body'],
                                    child: Media(),
                                }),
                            ],
                        }),
                    ],
                }),
                Notifications(),
            ],
        }),
    })
