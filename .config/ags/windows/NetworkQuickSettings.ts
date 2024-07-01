import {dependencies, truncateText} from 'lib/_utils'
import {getWifiIcon} from './Bar/NetworkSettingsButton'
import PopupWindow from './PopupWindow'
import Gtk from 'types/@girs/gtk-3.0/gtk-3.0'
const bluetooth = await Service.import('bluetooth')
const network = await Service.import('network')

const needPass = Variable(false)
const bssid = Variable('')
const ssid = Variable('')
const password = Variable('')

const icons = {
    headset: '󰋋',
    mouse: '󰍽',
    default: '',
}
const getBluetoothIcon = (type: string) =>
    Object.keys(icons).includes(type.toLowerCase())
        ? icons[type.toLowerCase()]
        : icons.default

const WifiToggle = () =>
    Widget.Button({
        vpack: 'center',
        hexpand: true,
        classNames: network.wifi
            .bind('enabled')
            .as((enabled) =>
                enabled
                    ? ['toggle-button', 'wifi-toggle', 'active']
                    : ['toggle-button', 'wifi-toggle'],
            ),
        setup: (self) => {
            self.hook(network.wifi, (self) => {
                self.toggleClassName('active', network.wifi.enabled)
                self.child = Widget.Box({
                    vertical: true,
                    children: [
                        Widget.Label({
                            classNames: ['icon'],
                            label: getWifiIcon(
                                network.wifi.strength,
                                network.wifi.state,
                                network.wifi.internet,
                            ),
                        }),
                        Widget.Label({
                            classNames: ['ssid'],
                            maxWidthChars: 8,
                            truncate: 'end',
                            label: network.wifi.ssid || 'Not Connected',
                        }),
                    ],
                })
            })
        },
        onClicked: network.toggleWifi,
    })

const WifiList = () =>
    Widget.Box({
        classNames: ['list', 'wifi-list'],
        hexpand: true,
        vertical: true,
        children: [
            Widget.Box({
                classNames: ['header'],
                hexpand: true,
                children: [
                    Widget.Label({
                        classNames: ['title'],
                        label: 'Select wifi',
                    }),
                    Widget.Box({
                        hexpand: true,
                    }),
                    Widget.Button({
                        classNames: ['btn'],
                        label: '󰒓 Settings',
                        onClicked: () => {
                            Utils.execAsync('sh -c nm-connection-editor&')
                            App.toggleWindow('network-quick-settings')
                        },
                    }),
                    Widget.Box({
                        hexpand: true,
                    }),
                    Widget.Button({
                        classNames: ['btn'],
                        label: ' Scan',
                        onClicked: network.wifi.scan,
                    }),
                ],
            }),

            Widget.Scrollable({
                hscroll: 'never',
                classNames: ['scroll'],
                child: Widget.Box({
                    hexpand: true,
                    vertical: true,
                    children: [
                        Widget.Box({
                            visible: Utils.merge(
                                [
                                    network.wifi.bind('enabled'),
                                    network.wifi.bind('access_points'),
                                ],
                                (e, a) => {
                                    return e || a.length > 0
                                },
                            ),
                            vertical: true,
                            children: network.wifi
                                .bind('access_points')
                                .as((access_points) => {
                                    return access_points.map((accesPoint) => {
                                        return Widget.Button({
                                            hexpand: true,
                                            classNames: [
                                                'item',
                                                'access-point',
                                            ],
                                            child: Widget.Label({
                                                classNames: ['ssid'],
                                                hpack: 'start',
                                                vpack: 'center',
                                                label: `${getWifiIcon(accesPoint.strength)} ${truncateText(accesPoint.ssid as string, 15)} ${accesPoint.active ? '' : ''}`,
                                            }),
                                            setup: (self) => {
                                                const itemLabel =
                                                    self.child as Gtk.Label

                                                self.on_clicked = () => {
                                                    if (dependencies('nmcli'))
                                                        Utils.execAsync(
                                                            `nmcli device wifi connect ${accesPoint.bssid}`,
                                                        ).catch((_) => {
                                                            if (
                                                                !accesPoint.bssid
                                                            ) {
                                                                Utils.notify({
                                                                    appName:
                                                                        'Network error',
                                                                    body: 'Empty bassid',
                                                                    timeout: 3000,
                                                                })
                                                                return
                                                            }
                                                            needPass.setValue(
                                                                true,
                                                            )
                                                            bssid.setValue(
                                                                accesPoint.bssid,
                                                            )
                                                            ssid.setValue(
                                                                accesPoint.ssid ??
                                                                    '',
                                                            )
                                                        })

                                                    if (!accesPoint.active) {
                                                        itemLabel.label = `${getWifiIcon(accesPoint.strength)} ${truncateText(accesPoint.ssid as string, 15)} `
                                                    }
                                                }
                                            },
                                        })
                                    })
                                }),
                        }),

                        Widget.Label({
                            label: 'No device detected',
                            css: 'padding: 5rem 0; font-size: 1rem;',
                            visible: Utils.merge(
                                [
                                    network.wifi.bind('enabled'),
                                    network.wifi.bind('access_points'),
                                ],
                                (e, a) => !e || a.length < 1,
                            ),
                        }),
                    ],
                }),
            }),
        ],
    })

const BluetoothToggle = () =>
    Widget.Button({
        vpack: 'center',
        hexpand: true,
        classNames: bluetooth
            .bind('enabled')
            .as((enabled) =>
                enabled
                    ? ['toggle-button', 'bluetooth-toggle', 'active']
                    : ['toggle-button', 'bluetooth-toggle'],
            ),
        setup: (self) => {
            self.hook(bluetooth, (self) => {
                self.toggleClassName('active', bluetooth.enabled)

                self.child = Widget.Box({
                    vertical: true,
                    children: [
                        Widget.Label({
                            classNames: ['icon'],
                            label:
                                bluetooth.connected_devices.length > 0
                                    ? '󰂱'
                                    : '󰂯',
                        }),
                        Widget.Label({
                            classNames: ['ssid'],
                            maxWidthChars: 8,
                            truncate: 'end',
                            label:
                                bluetooth.connected_devices.length > 0
                                    ? bluetooth.connected_devices.filter(
                                          (device) => device.connected,
                                      )[0].alias
                                    : 'Not connected',
                        }),
                    ],
                })
            })
        },
        onClicked: bluetooth.toggle,
    })

const BluetoothList = () =>
    Widget.Box({
        classNames: ['list', 'bluetooth-list'],
        hexpand: true,
        vertical: true,
        children: [
            Widget.Box({
                classNames: ['header'],
                hexpand: true,
                children: [
                    Widget.Label({
                        classNames: ['title'],
                        label: 'Select bluetooth',
                    }),
                    Widget.Box({
                        hexpand: true,
                    }),
                    Widget.Button({
                        classNames: ['btn'],
                        label: '󰒓 Settings',
                        onClicked: () => {
                            Utils.execAsync('sh -c blueman-manager&')
                            App.toggleWindow('network-quick-settings')
                        },
                    }),
                ],
            }),

            Widget.Scrollable({
                classNames: ['scroll'],
                child: Widget.Box({
                    hexpand: true,
                    vertical: true,
                    vpack: 'start',
                    children: [
                        Widget.Box({
                            visible: Utils.merge(
                                [
                                    bluetooth.bind('enabled'),
                                    bluetooth.bind('devices'),
                                ],
                                (e, d) => e && d.length > 0,
                            ),
                            vertical: true,
                            children: bluetooth.bind('devices').as((devices) =>
                                devices.map((device) =>
                                    Widget.Box({
                                        classNames: ['item-bluetooth'],
                                        hexpand: true,
                                        vexpand: false,
                                        vpack: 'center',
                                        children: [
                                            Widget.Label({
                                                hexpand: false,
                                                vexpand: false,
                                                vpack: 'center',
                                                label: Utils.merge(
                                                    [
                                                        device.bind('type'),
                                                        device.bind('alias'),
                                                        device.bind(
                                                            'battery_percentage',
                                                        ),
                                                    ],
                                                    (type, alias, percentage) =>
                                                        `${getBluetoothIcon(type)} ${alias} ~ ${percentage}%`,
                                                ),
                                            }),
                                            Widget.Box({hexpand: true}),
                                            Widget.Switch({
                                                hexpand: false,
                                                vexpand: false,
                                                vpack: 'center',
                                                classNames: ['switch'],
                                                active: device.bind(
                                                    'connected',
                                                ),
                                                onActivate: ({active}) =>
                                                    device.setConnection(
                                                        active,
                                                    ),
                                            }),
                                        ],
                                    }),
                                ),
                            ),
                        }),

                        Widget.Label({
                            label: 'No device detected',
                            css: 'padding: 5rem 0; font-size: 1rem;',
                            visible: Utils.merge(
                                [
                                    bluetooth.bind('enabled'),
                                    bluetooth.bind('devices'),
                                ],
                                (e, d) => {
                                    return !e || d.length < 1
                                },
                            ),
                        }),
                    ],
                }),
            }),
        ],
    })

function connectWifi() {
    needPass.setValue(false)
    Utils.execAsync(
        `nmcli device wifi connect ${bssid.value} password ${password.value}`,
    ).catch((_) => {
        needPass.setValue(true)
    })
}

const NetworkQuickSettings = () =>
    PopupWindow({
        name: 'network-quick-settings',
        transition: 'slide_left',
        layout: 'top-right',
        exclusivity: 'exclusive',
        child: Widget.Box({
            classNames: ['settings'],
            spacing: 8,
            vertical: true,
            children: [
                Widget.Box({
                    hexpand: true,
                    spacing: 8,
                    classNames: ['settings-toggle'],
                    children: [WifiToggle(), BluetoothToggle()],
                }),
                Widget.Box({
                    visible: needPass.bind(),
                    vertical: true,
                    classNames: ['password'],
                    children: [
                        Widget.Label({
                            hpack: 'start',
                            classNames: ['title'],
                            label: ssid
                                .bind()
                                .as((sd) => `${sd.trim()} need authentication`),
                        }),
                        Widget.Entry({
                            classNames: ['input'],
                            placeholderText: 'Enter Wifi password',
                            onAccept: connectWifi,
                            onChange: (e) => password.setValue(e.text ?? ''),
                            setup: (self) => {
                                self.hook(needPass, (_) => {
                                    if (!needPass.value) return
                                    self.grab_focus()
                                })
                            },
                        }),
                        Widget.Box({
                            classNames: ['action'],
                            children: [
                                Widget.Button({
                                    classNames: ['connect'],
                                    label: 'connect',
                                    onClicked: connectWifi,
                                }),
                                Widget.Button({
                                    classNames: ['cancel'],
                                    label: 'cancel',
                                    onClicked: () => {
                                        needPass.setValue(false)
                                        password.setValue('')
                                    },
                                }),
                            ],
                        }),
                    ],
                }),
                WifiList(),
                BluetoothList(),
            ],
        }),
    })

export default NetworkQuickSettings
