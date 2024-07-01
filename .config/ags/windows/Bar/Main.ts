import {hyprland} from 'resource:///com/github/Aylur/ags/service/hyprland.js'
import MenuButton from './MenuButton'
import WindowTitle from './WindowTitle'
import Workspaces from './Workspaces'
import Clock from './DateTime'
import Battery from './Battery'
import ControlSettingsButton from './ControlSettingsButton'
import NetworkSettingsButton from './NetworkSettingsButton'
import {packageQuery, rootDisk, ram, cpu} from 'lib/_variables'
import type Gtk from 'gi://Gtk?version=3.0'
import {type RevealerProps} from 'types/widgets/revealer'
import {Monitor} from 'types/service/hyprland'
import {ButtonProps} from 'types/widgets/button'
const notifications = await Service.import('notifications')
const bluetooth = await Service.import('bluetooth')
type Transition = RevealerProps['transition']

const Drawer = ({
    buttonProps,
    children,
    icon,
    transition = 'slide_left',
    classNames,
}: {
    buttonProps?: ButtonProps
    children: Gtk.Widget[]
    icon: string
    transition?: Transition
    classNames: string[]
}) =>
    Widget.Button({
        child: Widget.Box({
            classNames: classNames,
            children: [
                Widget.Revealer({
                    transition,
                    transitionDuration: 300,
                    revealChild: false,
                    child: Widget.Box({
                        children: children,
                    }),
                }),
                Widget.Label({
                    classNames: ['icon'],
                    label: icon,
                }),
            ],
        }),
        setup: (self) => {
            const onHover = (state: boolean = false) => {
                const draw = (
                    self.child as Gtk.Box
                ).get_children()[0] as Gtk.Revealer
                draw.reveal_child = state
            }
            self.on_hover = () => onHover(true)
            self.on_hover_lost = () => onHover(false)
        },
        ...buttonProps,
    })

const NotificationCounter = () =>
    Widget.Label({
        hexpand: false,
        vexpand: false,
        vpack: 'center',
        classNames: ['notification-counter'],
        label: notifications
            .bind('notifications')
            .as((notifications) => `(${notifications.length.toString()} )`),
    })

const Updater = () =>
    Widget.Label({
        classNames: ['updater'],
        label: packageQuery.bind().as((packages) => {
            return `(${packages.toString()} 󰇚)`
        }),
    })

const TrayToggle = () =>
    Widget.Button({
        classNames: ['tray-toggle'],
        label: '',
        on_clicked: () => {
            App.closeWindow('network-quick-settings')
            App.closeWindow('control-quick-settings')
            App.closeWindow('calendar-weather')
            App.closeWindow('menu')
            App.toggleWindow('systemtray')
        },
    })

const BluetoothBattery = () =>
    Widget.Box({
        classNames: ['connected-bluetooth'],
        visible: bluetooth
            .bind('connected_devices')
            .as((devices) => devices.length > 0),
        children: bluetooth.bind('connected_devices').as((devices) => {
            return [
                ...devices
                    .filter((device) => device.connected)
                    .map((device) => {
                        const icons = {
                            headset: '󰋋',
                            mouse: '󰍽',
                            default: '󰥉',
                        }

                        const getBluetoothIcon = (type: string) =>
                            Object.keys(icons).includes(type.toLowerCase())
                                ? icons[type.toLowerCase()]
                                : icons.default

                        return Widget.Label({
                            classNames: ['bluetooth-device'],
                            visible: device.connected,
                            label: device
                                .bind('battery_percentage')
                                .as(
                                    (percent) =>
                                        `${getBluetoothIcon(device.type)} ${percent.toString()}%`,
                                ),
                        })
                    }),
            ]
        }),
    })

const Separator = () =>
    Widget.Label({
        classNames: ['separator'],
        label: '',
    })

const KeyboardLayout = () =>
    Widget.Box({
        hexpand: false,
        vexpand: false,
        vpack: 'center',
        classNames: ['keyboard-layout'],
        children: [
            Widget.Label({
                classNames: ['label'],
                label: Utils.exec([
                    'sh',
                    '-c',
                    'hyprctl devices -j | jq -r \'.keyboards[] | select(.name == "at-translated-set-2-keyboard") | .active_keymap\'',
                ]),
                hexpand: false,
                vexpand: false,
                vpack: 'center',
                setup: (self) => {
                    hyprland.connect('keyboard-layout', async () => {
                        self.label = await Utils.execAsync([
                            'sh',
                            '-c',
                            'hyprctl devices -j | jq -r \'.keyboards[] | select(.name == "at-translated-set-2-keyboard") | .active_keymap\'',
                        ])
                    })
                },
            }),
            Widget.Label({
                hexpand: false,
                vexpand: false,
                vpack: 'center',
                classNames: ['icon'],
                label: '',
            }),
        ],
    })

function ModuleStart() {
    return Widget.Box({
        hpack: 'start',
        vpack: 'center',
        classNames: ['module-start'],
        children: [
            MenuButton(),
            Workspaces(),
            NotificationCounter(),
            Updater(),
            BluetoothBattery(),
            // Cpu(),
            // Ram(),
            // Disk(),
        ],
    })
}

function ModuleCenter() {
    return Widget.Box({
        hpack: 'center',
        vpack: 'center',
        classNames: ['module-center'],
        children: [WindowTitle()],
    })
}

function ModuleEnd() {
    return Widget.Box({
        hpack: 'end',
        vpack: 'center',
        classNames: ['module-end'],
        children: [
            KeyboardLayout(),
            TrayToggle(),
            NetworkSettingsButton(),
            ControlSettingsButton(),
            Separator(),
            Battery(),
            Clock(),
        ],
    })
}

const AgsBar = (monitor: number) =>
    Widget.Window({
        monitor: monitor,
        name: `agsbar${monitor}`,
        layer: 'bottom',
        exclusivity: 'exclusive',
        anchor: ['top', 'left', 'right'],
        child: Widget.CenterBox({
            classNames: ['ags-bar'],
            startWidget: ModuleStart(),
            centerWidget: ModuleCenter(),
            endWidget: ModuleEnd(),
        }),
    })

function resetBar(windowName: string, bar: typeof AgsBar, monitors: Monitor[]) {
    try {
        for (const monitor of monitors) {
            const {id} = monitor
            const window = App.getWindow(`${windowName}${id}`)

            if (typeof window !== 'undefined') {
                App.removeWindow(window.name as string)
            }

            App.addWindow(bar(id))
        }
    } catch (e) {}
}

export default function Bar() {
    hyprland.connect('monitor-added', ({monitors}) =>
        resetBar('agsbar', AgsBar, monitors),
    )
    hyprland.connect('monitor-removed', ({monitors}) =>
        resetBar('agsbar', AgsBar, monitors),
    )

    return hyprland.monitors.map((monitor) => AgsBar(monitor.id))
}
