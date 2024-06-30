import { Notification } from 'types/service/notifications'

import GLib from 'gi://GLib'
import { truncateText } from 'lib/_utils'
const notifications = await Service.import('notifications')
const time = (time: number, format = '%H:%M') =>
    GLib.DateTime.new_from_unix_local(time).format(format)

const NotificationHeader = () =>
    Widget.Box({
        classNames: ['notification-header'],
        hexpand: true,
        children: [
            Widget.Label({
                hpack: 'start',
                hexpand: true,
                label: 'Notifications',
                classNames: ['title'],
            }),
            Widget.Button({
                label: '󱏧',
                hpack: 'end',
                classNames: ['dnd-btn'],
                cursor: 'pointer',
                onClicked: () => (notifications.dnd = !notifications.dnd),
                setup(self) {
                    self.hook(notifications, () => {
                        self.toggleClassName('dnd', notifications.dnd)
                    })
                },
            }),
            Widget.Button({
                hpack: 'end',
                label: '󱏩',
                classNames: ['clear-btn'],
                cursor: 'pointer',
                onClicked: notifications.clear,
            }),
        ],
    })

const NotificationItem = (notification: Notification) =>
    Widget.Box({
        classNames: ['notification-item'],
        hexpand: true,
        children: [
            Widget.Box({
                hexpand: true,
                vertical: true,
                classNames: ['notification-content'],
                children: [
                    Widget.Label({
                        classNames: ['time'],
                        vpack: 'start',
                        hpack: 'start',
                        label: time(notification.time),
                    }),
                    Widget.Label({
                        classNames: ['summary'],
                        label: notification.summary,
                        wrap: true,
                        useMarkup: true,
                        justification: 'left',
                        hpack: 'start',
                        xalign: 0,
                    }),
                    Widget.Label({
                        classNames: ['body'],
                        label: notification.body,
                        wrap: true,
                        useMarkup: true,
                        justification: 'left',
                        xalign: 0,
                        hpack: 'start',
                    }),
                    Widget.Box({
                        classNames: ['actions'],
                        spacing: 8,
                        children: notification.actions.map((action) => {
                            return Widget.Button({
                                hexpand: true,
                                classNames: ['action-btn'],
                                label: truncateText(action.label, 10),
                                onClicked: () => notification.invoke(action.id),
                            })
                        }),
                    }),
                ],
            }),
            Widget.Button({
                classNames: ['close-item'],
                hpack: 'end',
                vpack: 'start',
                label: '',
                onClicked: notification.close,
            }),
        ],
        setup: (_) => {
            if (notification.actions.length < 1) {
                Utils.timeout(300000, () => {
                    notification.close()
                })
            }
        },
    })

const NotificationBody = () =>
    Widget.Scrollable({
        hscroll: 'never',
        classNames: ['notification-body'],
        visible: notifications
            .bind('notifications')
            .as((notifications) => notifications.length > 0),
        child: Widget.Box({
            vertical: true,
            classNames: ['notification-holder'],
            children: notifications
                .bind('notifications')
                .as((notifications) =>
                    notifications
                        .reverse()
                        .map((notification) => NotificationItem(notification)),
                ),
        }),
    })

const Notifications = () =>
    Widget.Box({
        hexpand: true,
        vertical: true,
        classNames: ['notifications'],
        children: [
            NotificationHeader(),
            Widget.Label({
                classNames: ['placeholder'],
                visible: notifications
                    .bind('notifications')
                    .as((notifications) => notifications.length < 1),
                label: 'No notifications',
            }),
            NotificationBody(),
        ],
    })

export default Notifications
