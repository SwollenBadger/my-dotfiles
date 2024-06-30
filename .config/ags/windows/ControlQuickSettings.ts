import PopupWindow from './PopupWindow'
const audio = await Service.import('audio')
import brightness from '../services/brightness'
import { getByIndex } from 'lib/_utils'
import { ButtonProps } from 'types/widgets/button'
import { SliderProps } from 'types/widgets/slider'
import { EventBoxProps } from 'types/widgets/eventbox'
import Gtk from 'types/@girs/gtk-3.0/gtk-3.0'

const ControlButton = ({
    toggleProps,
    sliderProps,
    children = [],
    ...rest
}: {
    toggleProps?: ButtonProps
    sliderProps?: SliderProps
    children?: Gtk.Widget[]
} & EventBoxProps) =>
    Widget.EventBox({
        ...rest,
        hexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Widget.Box({
                    classNames: ['control'],
                    children: [
                        Widget.Button({
                            classNames: ['toggle'],
                            ...toggleProps,
                        }),
                        Widget.Slider({
                            classNames: ['slider'],
                            hexpand: true,
                            drawValue: false,
                            ...sliderProps,
                        }),
                    ],
                }),
                ...children,
            ],
        }),
    })

const SpeakerList = () =>
    Widget.Revealer({
        revealChild: false,
        transition: 'slide_down',
        transitionDuration: 300,
        hexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Widget.Box({
                    classNames: ['lists'],
                    hexpand: true,
                    vertical: true,
                    children: audio.bind('speakers').as((speakers) => [
                        ...speakers.map((speaker) =>
                            Widget.Button({
                                classNames: ['list'],
                                hexpand: true,
                                child: Widget.Label({
                                    hpack: 'start',
                                    maxWidthChars: 35,
                                    truncate: 'end',
                                    label: speaker
                                        .bind('state')
                                        .as(
                                            (state) =>
                                                `${state === 'ready' ? '' : ''} ${speaker.description}`,
                                        ),
                                }),
                                onClicked: () => {
                                    if (!speaker.stream) return

                                    audio.control.set_default_sink(
                                        speaker.stream,
                                    )
                                },
                            }),
                        ),
                        Widget.Button({
                            classNames: ['list', 'setting'],
                            hexpand: true,
                            label: '󰓃 Pavucontrol',
                            onClicked: () =>
                                Utils.execAsync('pavucontrol -t 3'),
                        }),
                    ]),
                }),
                Widget.Box({
                    classNames: ['lists'],
                    hexpand: true,
                    vertical: true,
                    children: audio.bind('apps').as((speakerApps) =>
                        speakerApps.map((app) => {
                            return Widget.Box({
                                classNames: app
                                    .bind('is_muted')
                                    .as((isMuted) =>
                                        isMuted
                                            ? ['app-list', 'muted']
                                            : ['app-list'],
                                    ),
                                children: [
                                    Widget.Button({
                                        label: '',
                                        classNames: ['icon'],
                                        onClicked: () => {
                                            app.is_muted = !app.is_muted
                                        },
                                    }),
                                    Widget.Box({
                                        vertical: true,
                                        children: [
                                            Widget.Label({
                                                classNames: ['description'],
                                                maxWidthChars: 25,
                                                truncate: 'end',
                                                hpack: 'start',
                                                label: app.description,
                                            }),
                                            Widget.Slider({
                                                classNames: ['slider'],
                                                hexpand: true,
                                                drawValue: false,
                                                value: app.bind('volume'),
                                                onChange: ({ value }) =>
                                                    (app.volume = value),
                                            }),
                                        ],
                                    }),
                                ],
                            })
                        }),
                    ),
                }),
            ],
        }),
    })

const MicrophoneList = () =>
    Widget.Revealer({
        revealChild: false,
        transition: 'slide_down',
        transitionDuration: 300,
        hexpand: true,
        child: Widget.Box({
            classNames: ['lists'],
            hexpand: true,
            vertical: true,
            children: audio.bind('microphones').as((microphones) => {
                return [
                    ...microphones.map((microphone) =>
                        Widget.Button({
                            classNames: ['list'],
                            hexpand: true,
                            child: Widget.Label({
                                hpack: 'start',
                                maxWidthChars: 35,
                                truncate: 'end',
                                label: microphone
                                    .bind('state')
                                    .as(
                                        (state) =>
                                            `${state === 'ready' ? '' : ''} ${microphone.description}`,
                                    ),
                            }),
                            onClicked: () => {
                                if (!microphone.stream) return

                                audio.control.set_default_source(
                                    microphone.stream,
                                )
                            },
                        }),
                    ),

                    Widget.Button({
                        classNames: ['list', 'setting'],
                        hexpand: true,
                        label: '󰓃 Pavucontrol',
                        onClicked: () => Utils.execAsync('pavucontrol -t 4'),
                    }),
                ]
            }),
        }),
    })

const SpeakerControl = () =>
    ControlButton({
        toggleProps: {
            label: '',
            onClicked: () => (audio.speaker.is_muted = !audio.speaker.is_muted),
        },
        sliderProps: {
            value: audio.speaker.bind('volume'),
            onChange: ({ value }) => (audio.speaker.volume = value),
        },
        classNames: audio.speaker
            .bind('is_muted')
            .as((isMuted) =>
                isMuted ? ['speaker-control', 'muted'] : ['speaker-control'],
            ),
        children: [SpeakerList()],
        setup: (self) => {
            const drawer = (
                self.child as Gtk.Box
            ).get_children()[1] as Gtk.Revealer

            self.on_primary_click = () => {
                drawer.reveal_child = !drawer.reveal_child
            }

            self.hook(App, (_, wname, visible) => {
                if (wname === 'control-quick-settings' && !visible) {
                    drawer.reveal_child = false
                }
            })
        },
    })

const MicrophoneControl = () =>
    ControlButton({
        toggleProps: {
            label: '',
            onClicked: () =>
                (audio.microphone.is_muted = !audio.microphone.is_muted),
        },
        sliderProps: {
            value: audio.microphone.bind('volume'),
            onChange: ({ value }) => (audio.microphone.volume = value),
        },
        classNames: audio.microphone
            .bind('is_muted')
            .as((isMuted) =>
                isMuted
                    ? ['microphone-control', 'muted']
                    : ['microphone-control'],
            ),
        children: [MicrophoneList()],
        setup: (self) => {
            const drawer = (
                self.child as Gtk.Box
            ).get_children()[1] as Gtk.Revealer

            self.on_primary_click = () => {
                drawer.reveal_child = !drawer.reveal_child
            }

            self.hook(App, (_, wname, visible) => {
                if (wname === 'control-quick-settings' && !visible) {
                    drawer.reveal_child = false
                }
            })
        },
    })

const BrightnessControl = () =>
    ControlButton({
        toggleProps: {
            label: brightness.bind('screen_value').as((screenValue) => {
                const brightnessIcons = {
                    '0': '󰃞',
                    '25': '󰃟',
                    '50': '󰃝',
                    '75': '󰃠',
                }
                const brightnessPercent = Math.round(screenValue * 100)
                return getByIndex(brightnessIcons, brightnessPercent)
            }),
        },
        sliderProps: {
            value: brightness.bind('screen_value'),
            onChange: ({ value }) => (brightness.screen_value = value),
        },
        classNames: ['brightness-control'],
    })

const ControlQuickSettings = () =>
    PopupWindow({
        name: 'control-quick-settings',
        transition: 'slide_left',
        layout: 'top-right',
        exclusivity: 'exclusive',
        child: Widget.Box({
            classNames: ['settings'],
            vertical: true,
            spacing: 10,
            children: [
                SpeakerControl(),
                MicrophoneControl(),
                BrightnessControl(),
            ],
        }),
    })

export default ControlQuickSettings
