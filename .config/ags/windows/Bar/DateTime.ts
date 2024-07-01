import {WEATHER_ICONS, time, weather} from 'lib/_variables'

function getTimeIcon(time: string): string {
    const timeIcons = {
        '00': '󱑊',
        '01': '󱐿',
        '02': '󱑀',
        '03': '󱑁',
        '04': '󱑂',
        '05': '󱑃',
        '06': '󱑄',
        '07': '󱑅',
        '08': '󱑆',
        '09': '󱑇',
        '10': '󱑈',
        '11': '󱑉',
        '12': '󱑊',
    }
    const hour = time.split(':')[0].split(' ')[1]
    return timeIcons[hour]
}

const Weather = () =>
    Widget.Label({
        classNames: ['weather'],
        hexpand: false,
        vexpand: false,
        vpack: 'center',
        label: weather.bind().as((weatherData) => {
            const weatherCodes =
                weatherData['current_condition'][0]['weatherCode']
            const weatherTemp = `${weatherData['current_condition'][0]['FeelsLikeC']}°`
            return `(${WEATHER_ICONS[weatherCodes]}${weatherTemp}C)`
        }),
    })

const Clock = () =>
    Widget.Button({
        classNames: ['clock'],
        hexpand: false,
        vexpand: false,
        vpack: 'center',
        child: Widget.Box({
            hexpand: false,
            vexpand: false,
            vpack: 'center',
            children: [
                Weather(),
                Widget.Label({
                    hexpand: false,
                    vexpand: false,
                    vpack: 'center',
                    classNames: ['time'],
                    label: time.bind(),
                }),
                Widget.Label({
                    hexpand: false,
                    vexpand: false,
                    vpack: 'center',
                    classNames: ['time-icon'],
                    label: time.bind().as((time) => getTimeIcon(time)),
                }),
            ],
        }),
        onClicked: () => {
            App.closeWindow('menu')
            App.closeWindow('systemtray')
            App.closeWindow('network-quick-settings')
            App.closeWindow('control-quick-settings')
            App.toggleWindow('calendar-weather')
        },
    })

export default Clock
