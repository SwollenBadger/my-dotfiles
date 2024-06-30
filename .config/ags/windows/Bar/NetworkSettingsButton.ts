import {getByIndex} from 'lib/_utils'
const bluetooth = await Service.import('bluetooth')
const network = await Service.import('network')

export function getWifiIcon(
    strength: number,
    state: string = '',
    internet: string = '',
): string {
    const wifiIcons = {
        disconnected: '󰤭',
        connecting: '󰤩',
        state: {
            unknown: '󰤭',
            unmanaged: '󰤭',
            unavailable: '󰤭',
            disconnected: '󰤭',
            prepare: '󰤩',
            config: '󰤩',
            need_auth: '󰤩',
            ip_config: '󰤩',
            ip_check: '󰤩',
            secondaries: '󰤩',
            deactivating: '󰤩',
            failed: '󰤭',
        },
        '0': '󰤯',
        '20': '󰤟',
        '45': '󰤢',
        '60': '󰤥',
        '85': '󰤨',
    }

    if (internet === 'disconnected') return wifiIcons.disconnected
    if (Object.keys(wifiIcons.state).includes(state.toLowerCase()))
        return wifiIcons.state[state]

    return getByIndex(wifiIcons, strength)
}

const BluetoothIcon = () =>
    Widget.Label({
        classNames: ['bluetooth-icon'],
        label: bluetooth
            .bind('connected_devices')
            .as((cd) => (cd.length > 0 ? '󰂱' : '')),
        setup: (self) => {
            self.hook(bluetooth, (_) => {
                self.toggleClassName('disconnected', !bluetooth.enabled)
            })
        },
    })

const WifiIcon = () =>
    Widget.Label({
        classNames: ['wifi-icon'],
        setup: (self) => {
            self.hook(network.wifi, (self) => {
                self.label = getWifiIcon(
                    network.wifi.strength,
                    network.wifi.state,
                    network.wifi.internet,
                )
                self.toggleClassName(
                    'disconnected',
                    network.wifi.state !== 'activated' ||
                        network.wifi.internet !== 'connected',
                )
            })
        },
    })

const WiredIcon = () =>
    Widget.Label({
        classNames: ['wired-icon'],
        label: '',
        setup: (self) => {
            self.hook(network.wired, (self) => {
                self.toggleClassName(
                    'disconnected',
                    network.wired.internet === 'disconnected',
                )
            })
        },
    })

const NetworkSettingsButton = () =>
    Widget.Button({
        hexpand: false,
        vexpand: false,
        vpack: 'center',
        hpack: 'center',
        classNames: ['network-settings-button'],
        child: Widget.Box({
            classNames: ['button-holder'],
            children: [WiredIcon(), WifiIcon(), BluetoothIcon()],
        }),
        onClicked: () => {
            App.closeWindow('systemtray')
            App.closeWindow('control-quick-settings')
            App.toggleWindow('network-quick-settings')
            App.closeWindow('calendar-weather')
            App.closeWindow('menu')
            network.wifi.scan()
        },
    })

export default NetworkSettingsButton
