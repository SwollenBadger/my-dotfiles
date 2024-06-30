import { getByIndex } from 'lib/_utils'
const battery = await Service.import('battery')

const Battery = () =>
    Widget.Box({
        classNames: Utils.merge(
            [battery.bind('charging'), battery.bind('percent')],
            (charging, percent) => {
                const batteryLevelMap = {
                    '0': 'critical',
                    '16': 'warning',
                    '31': 'normal',
                }

                if (charging) return ['battery']

                return [
                    'battery',
                    getByIndex(batteryLevelMap, Math.round(percent)),
                ]
            },
        ),
        children: [
            Widget.Label({
                classNames: ['battery-status'],
                label: battery
                    .bind('charging')
                    .as((charging) => (charging ? '󱐋' : '')),
            }),
            Widget.Label({
                classNames: ['battery-icon'],
                label: battery.bind('percent').as((percent) => {
                    const batteryIconsMap = {
                        '0': '',
                        '25': '',
                        '50': '',
                        '75': '',
                        '100': '',
                    }
                    return getByIndex(batteryIconsMap, Math.round(percent))
                }),
            }),
            Widget.Label({
                classNames: ['battery-percent'],
                label: battery
                    .bind('percent')
                    .as((percent) => `${Math.round(percent)}%`),
            }),
        ],
    })

export default Battery
