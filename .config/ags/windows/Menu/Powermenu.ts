import { MenuButton } from './Main'

const Shutdown = () =>
    MenuButton({
        confirm: true,
        title: 'Shutdown',
        command: 'systemctl poweroff',
        classNames: ['shutdown'],
        label: '',
    })
const Reboot = () =>
    MenuButton({
        confirm: true,
        title: 'Reboot',
        command: 'systemctl reboot',
        classNames: ['reboot'],
        label: '',
    })
const Suspend = () =>
    MenuButton({
        title: 'Suspend',
        confirm: true,
        command: 'systemctl suspend',
        classNames: ['suspend'],
        label: '󰙦',
    })
const Lock = () =>
    MenuButton({
        confirm: false,
        title: 'Lock',
        command:
            "sh -c 'loginctl lock-session;hyprlock && loginctl unlock-session'",
        classNames: ['lock'],
        label: '󰌾',
    })
const Hibernate = () =>
    MenuButton({
        title: 'Hibernate',
        confirm: true,
        command: 'systemctl hibernate',
        classNames: ['hibernate'],
        label: '󰒲',
    })
const AppMenu = () =>
    MenuButton({
        title: 'AppMenu',
        confirm: false,
        classNames: ['app-menu'],
        hexpand: false,
        hpack: 'end',
        label: '',
        action: () => {
            Utils.execAsync(['sh', '-c', 'anyrun'])
            App.toggleWindow('menu')
        },
    })

const Powermenu = () =>
    Widget.Box({
        hexpand: true,
        classNames: ['powermenu'],
        children: (() => {
            // Visible property on hibernation did not work can't be bother to figure it out
            // So here's the trick
            const hasHibernation =
                Utils.exec(
                    `sh -c "awk -F'resume=' '{print $2}' /proc/cmdline"`,
                ) === ''
            const powermenuLine = [
                Shutdown(),
                Reboot(),
                Lock(),
                Suspend(),
                Hibernate(),
            ]

            if (hasHibernation) powermenuLine.pop()
            return powermenuLine
        })(),
    })
const GlobalMenu = () =>
    Widget.Box({
        hexpand: true,
        classNames: ['golbal-menu'],
        children: [Powermenu(), AppMenu()],
    })

export default GlobalMenu
