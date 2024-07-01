import {dependencies} from './_utils'

export const time = Variable('', {
    poll: [1000, "date '+%A %I:%M%P'"],
})

export const rootDisk = Variable(0, {
    poll: [
        60000,
        async () => {
            return Number(
                await Utils.execAsync(
                    `sh -c "df -h / | awk 'NR==2{print $4}' | sed 's/[^0-9]*//g'"`,
                ),
            )
        },
    ],
})

export const ram = Variable(0, {
    poll: [
        60000,
        async () => {
            return Number(
                await Utils.execAsync([
                    'sh',
                    '-c',
                    `free -h | awk 'NR==2{gsub(/[^0-9]/, "", $4); printf "%.1f", $4/10}'`,
                ]),
            )
        },
    ],
})

export const cpu = Variable(0, {
    poll: [
        2000,
        `sh -c 'top -b -n 1 | grep "Cpu(s)"'`,
        (out) => {
            return Number(out.split(/\s+/)[1].replace(',', '.'))
        },
    ],
})

export const weather = Variable(
    {
        current_condition: [
            {
                FeelsLikeC: ' -',
                weatherCode: 'fetching',
            },
        ],
    },
    {
        poll: [
            60000,
            async () => {
                try {
                    const weather = await Utils.fetch(
                        'https://wttr.in/Klaten?format=j1',
                    )
                    return await weather.json()
                } catch (e) {
                    return {
                        current_condition: [
                            {
                                FeelsLikeC: ' -',
                                weatherCode: 'error',
                            },
                        ],
                    }
                }
            },
        ],
    },
)

export const packageQuery = Variable(0, {
    poll: [
        60000,
        async () => {
            const command = `sh -c "${dependencies('yay') ? 'yay' : dependencies('paru') ? 'paru' : 'pacman'} -Qua | wc -l"`
            return Number(await Utils.execAsync(command))
        },
    ],
})

export const WEATHER_ICONS = {
    fetching: '󱣶',
    error: '󰼯',
    '113': '☀️',
    '116': '⛅️',
    '119': '☁️',
    '122': '☁️',
    '143': '󰖑',
    '176': '🌦',
    '179': '🌧',
    '182': '🌧',
    '185': '🌧',
    '200': '⛈',
    '227': '🌨',
    '230': '❄️',
    '248': '󰖑',
    '260': '󰖑',
    '263': '🌦',
    '266': '🌦',
    '281': '🌧',
    '284': '🌧',
    '293': '🌦',
    '296': '🌦',
    '299': '🌧',
    '302': '🌧',
    '305': '🌧',
    '308': '🌧',
    '311': '🌧',
    '314': '🌧',
    '317': '🌧',
    '320': '🌨',
    '323': '🌨',
    '326': '🌨',
    '329': '❄️',
    '332': '❄️',
    '335': '❄️',
    '338': '❄️',
    '350': '🌧',
    '353': '🌦',
    '356': '🌧',
    '359': '🌧',
    '362': '🌧',
    '365': '🌧',
    '368': '🌨',
    '371': '❄️',
    '374': '🌧',
    '377': '🌧',
    '386': '⛈',
    '389': '🌩',
    '392': '⛈',
    '395': '❄️',
}
