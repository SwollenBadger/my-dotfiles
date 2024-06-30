import Notification from './Notification'
import {hyprland} from 'resource:///com/github/Aylur/ags/service/hyprland.js'
import GLib from 'types/@girs/glib-2.0/glib-2.0'
import {Monitor} from 'types/service/hyprland'
const notifications = await Service.import('notifications')
const {timeout, idle} = Utils

const ringtones = {
    battery: 'low_battery.ogg',
    default: 'f1.ogg',
}

function Animated(id: number) {
    const n = notifications.getNotification(id)!
    const widget = Notification(n)

    const inner = Widget.Revealer({
        transition: 'slide_left',
        transition_duration: 300,
        child: widget,
    })

    const outer = Widget.Revealer({
        transition: 'slide_down',
        transition_duration: 300,
        child: inner,
    })

    const box = Widget.Box({
        hpack: 'end',
        child: outer,
    })

    idle(() => {
        const appName = outer.child.child.attribute.app_name
        const ringtone = !Object.keys(ringtones).includes(appName)
            ? ringtones.default
            : ringtones[appName]

        outer.reveal_child = true

        Utils.execAsync(
            `canberra-gtk-play --file=${GLib.getenv('HOME')}/.config/ags/assets/ringtones/${ringtone}`,
        )

        timeout(300, () => {
            inner.reveal_child = true
        })
    })

    return Object.assign(box, {
        dismiss() {
            inner.reveal_child = false
            timeout(300, () => {
                outer.reveal_child = false
                timeout(300, () => {
                    box.destroy()
                })
            })
        },
    })
}

function PopupList() {
    const map: Map<number, ReturnType<typeof Animated>> = new Map()
    const box = Widget.Box({
        hpack: 'end',
        vertical: true,
        css: 'min-width: 20rem;',
    })

    function remove(_: unknown, id: number) {
        map.get(id)?.dismiss()
        map.delete(id)
    }

    return box
        .hook(
            notifications,
            (_, id: number) => {
                if (id !== undefined) {
                    if (map.has(id)) remove(null, id)

                    if (notifications.dnd) return

                    const w = Animated(id)
                    map.set(id, w)
                    box.children = [w, ...box.children]
                }
            },
            'notified',
        )
        .hook(notifications, remove, 'dismissed')
        .hook(notifications, remove, 'closed')
}

const NotificatonPop = (monitor: number) =>
    Widget.Window({
        monitor,
        name: `notifications${monitor}`,
        anchor: ['top', 'right'],
        class_name: 'notifications',
        layer: 'overlay',
        child: Widget.Box({
            css: 'padding: 2px;',
            child: PopupList(),
        }),
    })

function resetNotification(
    windowName: string,
    notPopups: typeof NotificatonPop,
    monitors: Monitor[],
) {
    try {
        for (const monitor of monitors) {
            const {id} = monitor
            const window = App.getWindow(`${windowName}${id}`)

            if (typeof window !== 'undefined') {
                App.removeWindow(window.name as string)
            }

            App.addWindow(notPopups(id))
        }
    } catch (e) {}
}

export default function NotificationPopups() {
    hyprland.connect('monitor-added', ({monitors}) =>
        resetNotification('notifications', NotificatonPop, monitors),
    )
    hyprland.connect('monitor-removed', ({monitors}) =>
        resetNotification('notifications', NotificatonPop, monitors),
    )
    return hyprland.monitors.map(({id}) => NotificatonPop(id))
}
