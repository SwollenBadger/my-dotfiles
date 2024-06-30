import { WEATHER_ICONS, time, weather } from 'lib/_variables'
import PopupWindow from './PopupWindow'

const date = Variable('', {
    poll: [1000, "date '+%A %d %B %Y'"],
})

const Calendar = () =>
    Widget.Calendar({
        classNames: ['calendar'],
        showDayNames: true,
        showDetails: true,
        showHeading: true,
    })

const Weather = () =>
    Widget.Box({
        classNames: ['weather'],
        hexpand: true,
        vertical: true,
        children: [
            Widget.Label({
                vpack: 'start',
                hpack: 'center',
                hexpand: true,
                classNames: ['time'],
                label: time.bind().as((time) => {
                    return time.split(' ')[0]
                }),
            }),
            Widget.Label({
                classNames: ['date'],
                label: date.bind(),
            }),
            Widget.Box({
                classNames: ['weather-info'],
                hpack: 'center',
                vertical: true,
                hexpand: true,
                children: weather.bind().as((weatherData) => {
                    const currentCondition = weatherData.current_condition[0]

                    if (currentCondition.weatherCode === 'fetching')
                        return [
                            Widget.Label({
                                justification: 'center',
                                vpack: 'center',
                                hpack: 'center',
                                wrap: true,
                                hexpand: true,
                                label: 'Fetching weather info',
                            }),
                        ]

                    if (currentCondition.weatherCode === 'error')
                        return [
                            Widget.Label({
                                justification: 'center',
                                vpack: 'center',
                                hpack: 'center',
                                wrap: true,
                                hexpand: true,
                                label: 'error fetching data',
                            }),
                        ]

                    const {
                        FeelsLikeC,
                        FeelsLikeF,
                        humidity,
                        weatherCode,
                        weatherDesc,
                        winddir16Point,
                        winddirDegree,
                        windspeedKmph,
                        windspeedMiles,
                        uvIndex,
                        visibility,
                        visibilityMiles,
                    } = currentCondition

                    return [
                        Widget.Label({
                            classNames: ['weather-data'],
                            label: weatherDesc[0].value,
                        }),
                        Widget.Label({
                            classNames: ['weather-data'],
                            label: `${WEATHER_ICONS[weatherCode]} ~ ${FeelsLikeC}°C/${FeelsLikeF}°F`,
                        }),
                        Widget.Label({
                            classNames: ['weather-data'],
                            label: ` ~ ${humidity}%`,
                        }),
                        Widget.Label({
                            classNames: ['weather-data'],
                            label: ` ~ ${winddirDegree}deg/${winddir16Point}`,
                        }),
                        Widget.Label({
                            classNames: ['weather-data'],
                            label: ` ~ ${windspeedKmph}kmh/${windspeedMiles}mih`,
                        }),
                        Widget.Label({
                            classNames: ['weather-data'],
                            label: `󱣖 ~ ${uvIndex}  ~ ${visibility}km/${visibilityMiles}mi`,
                        }),
                    ]
                }),
            }),
        ],
    })

const CalendarWeather = () =>
    PopupWindow({
        name: 'calendar-weather',
        transition: 'slide_down',
        layout: 'top-right',
        exclusivity: 'exclusive',
        child: Widget.Box({
            classNames: ['holder'],
            children: [Weather(), Calendar()],
        }),
    })

export default CalendarWeather
