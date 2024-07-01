import {Application} from 'types/service/applications'
import PopupWindow from './PopupWindow'
import GLib from 'types/@girs/glib-2.0/glib-2.0'
import Gtk from 'types/@girs/gtk-3.0/gtk-3.0'
import Box from 'types/widgets/box'
import Button from 'types/widgets/button'
import Icon from 'types/widgets/icon'
import Label from 'types/widgets/label'

const applications = await Service.import('applications')
const WINDOW_NAME = 'app-launcher'

const searchQuery = Variable('')
const selectedApp = Variable<Gtk.Button | null>(null)

const Entry = () =>
    Widget.Box({
        classNames: ['entry'],
        hexpand: true,
        css: `background-image:linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),url('${GLib.getenv('HOME')}/.config/ags/assets/doodle0.jpg')`,
        child: Widget.Entry({
            classNames: ['input'],
            placeholderText: 'Applications..',
            hexpand: true,
            vexpand: false,
            vpack: 'center',
            onChange: ({text}) => searchQuery.setValue(text ?? ''),
            onAccept: (e) => {
                applications.reload()
                applications
                    .query('')
                    .filter((v) => v.match(e.text ?? ''))[0]
                    .launch()

                App.closeWindow(WINDOW_NAME)
            },
        }),
    })

const Item = (appData: Application) =>
    Widget.Button({
        classNames: ['item'],
        attribute: {
            name: appData.name,
            match: appData.match,
        },
        visible: searchQuery.bind().as((sq) => appData.match(sq)),
        child: Widget.Box({
            children: [
                Widget.Icon({
                    icon: appData.icon_name || '',
                    classNames: ['icon'],
                }),
                Widget.Box({
                    classNames: ['app-info'],
                    vertical: true,
                    vpack: 'center',
                    children: [
                        Widget.Label({
                            classNames: ['name'],
                            label: appData.name,
                            maxWidthChars: 100,
                            truncate: 'end',
                            hpack: 'start',
                        }),
                        Widget.Label({
                            classNames: ['desc'],
                            label: appData.description,
                            maxWidthChars: 60,
                            truncate: 'end',
                            hpack: 'start',
                        }),
                    ],
                }),
            ],
        }),
        onClicked: () => {
            appData.launch()
            App.closeWindow(WINDOW_NAME)
        },
    })

const Applications = () => {
    return Widget.Scrollable({
        classNames: ['applications'],
        child: Widget.Box({
            vertical: true,
            classNames: ['applications-holder'],
            setup: (self) => {
                self.hook(App, (_, wname, visible) => {
                    if (wname !== WINDOW_NAME && !visible) return

                    applications.reload()
                    const appList = applications.query('').map(Item)
                    appList[0].toggleClassName('selected', true)
                    selectedApp.setValue(appList[0])
                    self.children = appList
                })

                self.hook(searchQuery, () => {
                    const visibleApp = self.children.filter(
                        (v) => v.visible,
                    ) as Button<
                        Box<
                            Icon<unknown> | Box<Label<unknown>, unknown>,
                            unknown
                        >,
                        {
                            name: string
                            match: (term: string) => boolean
                        }
                    >[]

                    if (selectedApp.value) {
                        if (
                            visibleApp.length > 0 &&
                            selectedApp.value !== visibleApp[0]
                        ) {
                            ;(
                                selectedApp.value as (typeof visibleApp)[0]
                            ).toggleClassName('selected', false)
                        }
                    }

                    if (visibleApp.length > 0) {
                        visibleApp[0].toggleClassName('selected', true)
                        const setSelectedState = (
                            state: boolean,
                            check: (typeof visibleApp)[0],
                        ) => {
                            if (
                                selectedApp.value &&
                                selectedApp.value !== check
                            ) {
                                ;(
                                    selectedApp.value as (typeof visibleApp)[0]
                                ).toggleClassName('selected', state)
                            }
                        }
                        visibleApp.slice(1).forEach((a) => {
                            a.on_hover = () => setSelectedState(false, a)
                            a.on_hover_lost = () => setSelectedState(true, a)
                            a.on('focus-in-event', () =>
                                setSelectedState(false, a),
                            )
                            a.on('focus-out-event', () =>
                                setSelectedState(true, a),
                            )
                        })
                        selectedApp.setValue(visibleApp[0])
                    }
                })
            },
        }),
    })
}

const Launcher = () =>
    Widget.Box({
        classNames: ['launcher'],
        vertical: true,
        children: [Entry(), Applications()],
        setup(self) {
            self.hook(App, (_, wname, visible) => {
                if (wname !== WINDOW_NAME && !visible) return

                const input = (self.get_children()[0] as Gtk.Box)
                    .child as Gtk.Entry

                input.text = ''
                input.grab_focus()
            })
        },
    })

// there needs to be only one instance
const AppLauncher = () =>
    PopupWindow({
        name: WINDOW_NAME,
        keymode: 'exclusive',
        layout: 'center',
        transition: 'crossfade',
        child: Launcher(),
    })

export default AppLauncher
