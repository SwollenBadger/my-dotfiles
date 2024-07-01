import { systemTray } from 'resource:///com/github/Aylur/ags/service/systemtray.js'
import { TrayItem as ItemType } from 'types/service/systemtray'
import PopupWindow from './PopupWindow'

const TrayItem = (item: ItemType) =>
    Widget.Button({
        classNames: ['tray-item'],
        child: Widget.Icon({ classNames: ['item-icon'] }).bind(
            'icon',
            item,
            'icon',
        ),
        onPrimaryClick: (_, event) => item.activate(event),
        onSecondaryClick: (_, event) => item.openMenu(event),
    })

const TrayItems = Widget.Box({
    hpack: 'end',
    hexpand: true,
    child: Widget.Box({
        classNames: ['sys-tray'],
        vertical: true,
        children: systemTray.bind('items').as((items) => {
            let start = 0
            let end = 4
            let itemsRowCol: ItemType[][] = []

            while (start < items.length) {
                itemsRowCol.push(items.slice(start, end))
                start += 4
                end += 4
            }

            return itemsRowCol.map((items) =>
                Widget.Box({
                    classNames: ['row'],
                    children: items.map((item) => TrayItem(item)),
                }),
            )
        }),
    }),
})

export default function SystemTray() {
    return PopupWindow({
        name: 'systemtray',
        child: TrayItems,
        layout: 'top-right',
        exclusivity: 'normal',
        layer: 'top',
    })
}
