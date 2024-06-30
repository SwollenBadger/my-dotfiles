const {speaker, microphone} = await Service.import('audio')
import {getByIndex} from 'lib/_utils'
import brightness from '../services/brightness'

const icon = Variable('')
const levelPercent = Variable('')
const level = Variable(0)
const className = Variable<string[]>([])

const OsdPopup = () =>
    Widget.Revealer({
        classNames: ['osd-drawer'],
        transitionDuration: 300,
        transition: 'slide_up',
        hexpand: true,
        vexpand: false,
        hpack: 'center',
        vpack: 'end',
        child: Widget.Box({
            hexpand: false,
            vexpand: false,
            hpack: 'center',
            vpack: 'end',
            classNames: className.bind().as((c) => ['osd-popup', ...c]),
            children: [
                Widget.Label({
                    className: 'icon',
                    label: icon.bind(),
                }),
                Widget.LevelBar({
                    vpack: 'center',
                    vexpand: false,
                    hexpand: true,
                    classNames: ['level'],
                    value: level.bind(),
                }),
                Widget.Label({
                    className: 'level-percent',
                    label: levelPercent.bind(),
                }),
            ],
        }),
        setup: (self) => {
            self.hook(App, (_, wname, visible) => {
                if (wname !== 'osd') return

                if (visible) {
                    self.reveal_child = true
                    return
                }

                self.reveal_child = false
            })
        },
    })

const Osd = () => {
    let count = 0
    function openPopup(
        iconC: string,
        levelP: string,
        levelC: number,
        classNamesC: string[] = [],
    ): void {
        icon.setValue(iconC)
        level.setValue(levelC)
        levelPercent.setValue(levelP)
        className.setValue(classNamesC)
        App.openWindow('osd')

        count++
        Utils.timeout(900, () => {
            count--
            if (count === 0) App.closeWindow('osd')
        })
    }
    speaker.connect('notify::volume', (audio) => {
        openPopup('', `${Math.round(audio.volume * 100)}%`, audio.volume, [
            'speaker',
        ])
        Utils.execAsync(`canberra-gtk-play -i dialog-error -d "error"`)
    })
    speaker.connect('notify::is-muted', (audio) => {
        openPopup(
            '',
            `${Math.round(audio.volume * 100)}%`,
            audio.volume,
            audio.is_muted ? ['muted'] : ['speaker'],
        )
        Utils.execAsync(`canberra-gtk-play -i dialog-error -d "error"`)
    })
    microphone.connect('notify::volume', (audio) => {
        openPopup('', `${Math.round(audio.volume * 100)}%`, audio.volume, [
            'microphone',
        ])
    })
    microphone.connect('notify::is-muted', (audio) => {
        openPopup(
            '',
            `${Math.round(audio.volume * 100)}%`,
            audio.volume,
            audio.is_muted ? ['muted'] : ['microphone'],
        )
    })
    brightness.connect(
        'notify::screen-value',
        (screen: {screen_value: number}) => {
            const brightnessIcons = {'0': '󰃞', '25': '󰃟', '50': '󰃝', '75': '󰃠'}
            const brightnessPercent = Math.round(screen.screen_value * 100)

            openPopup(
                getByIndex(brightnessIcons, brightnessPercent),
                `${brightnessPercent}%`,
                screen.screen_value,
                ['brightness'],
            )
        },
    )

    return Widget.Window({
        name: 'osd',
        anchor: ['top', 'bottom', 'left', 'right'],
        layer: 'overlay',
        exclusivity: 'normal',
        keymode: 'none',
        clickThrough: true,
        visible: false,
        child: Widget.Box({
            classNames: ['osd'],
            hexpand: true,
            child: OsdPopup(),
        }),
    })
}

export default Osd
