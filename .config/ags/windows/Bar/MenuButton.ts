const MenuButton = () =>
    Widget.Button({
        classNames: ['menu-btn'],
        child: Widget.Box({
            hexpand: false,
            vexpand: false,
            vpack: 'center',
            hpack: 'center',
            children: [
                Widget.Label({
                    hexpand: false,
                    vexpand: false,
                    vpack: 'center',
                    hpack: 'center',
                    classNames: ['menu-icon'],
                    label: '夢',
                }),
            ],
        }),
        onClicked: () => {
            App.closeWindow('systemtray')
            App.closeWindow('control-quick-settings')
            App.closeWindow('network-quick-settings')
            App.closeWindow('calendar-weather')
            App.toggleWindow('menu')
        },
    })

export default MenuButton
