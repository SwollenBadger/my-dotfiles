import {getByIndex} from 'lib/_utils'
const audio = await Service.import('audio')
import brightness from '../../services/brightness'

const SpeakerIcon = () =>
    Widget.Label({
        classNames: Utils.merge(
            [audio.speaker.bind('is_muted'), audio.speaker.bind('volume')],
            (isMuted, volume) => {
                const volumeFixed = Math.round(volume * 100)
                const classNamesMap = {
                    '0': 'low',
                    '50': 'medium',
                    '75': 'high',
                }
                const classNames = ['speaker-icon']

                return isMuted
                    ? [...classNames, 'muted']
                    : [...classNames, getByIndex(classNamesMap, volumeFixed)]
            },
        ),
        label: '',
    })

const MicrophoneIcon = () =>
    Widget.Label({
        classNames: Utils.merge(
            [
                audio.microphone.bind('is_muted'),
                audio.microphone.bind('volume'),
            ],
            (isMuted, volume) => {
                const volumeFixed = Math.round(volume * 100)
                const classNamesMap = {
                    '0': 'low',
                    '50': 'medium',
                    '75': 'high',
                }
                const classNames = ['microphone-icon']

                return isMuted
                    ? [...classNames, 'muted']
                    : [...classNames, getByIndex(classNamesMap, volumeFixed)]
            },
        ),
        label: '',
    })

const BrightnessIcon = () =>
    Widget.Label({
        classNames: ['brightness-icon'],
        label: brightness.bind('screen_value').as((screenValue) => {
            const brightnessIcons = {'0': '󰃞', '25': '󰃟', '50': '󰃝', '75': '󰃠'}
            const brightnessPercent = Math.round(screenValue * 100)
            return getByIndex(brightnessIcons, brightnessPercent)
        }),
    })

const ControlSettingsButton = () =>
    Widget.Button({
        hexpand: false,
        vexpand: false,
        vpack: 'center',
        hpack: 'center',
        classNames: ['control-settings-button'],
        child: Widget.Box({
            classNames: ['button-holder'],
            children: [SpeakerIcon(), MicrophoneIcon(), BrightnessIcon()],
        }),
        tooltipMarkup: Utils.merge(
            [
                audio.speaker.bind('volume'),
                audio.microphone.bind('volume'),
                brightness.bind('screen_value'),
            ],
            (speaker, microphone, brightness) => {
                return `Volume: ${Math.round(speaker * 100)}%
Microphone: ${Math.round(microphone * 100)}%
Brightness: ${Math.round(brightness * 100)}%`
            },
        ),
        onClicked: () => {
            App.closeWindow('systemtray')
            App.closeWindow('network-quick-settings')
            App.closeWindow('menu')
            App.closeWindow('calendar-weather')
            App.toggleWindow('control-quick-settings')
        },
    })

export default ControlSettingsButton
