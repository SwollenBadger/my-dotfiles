import PopupWindow from 'windows/PopupWindow'
import { titleConfirm, powerCommand } from './Main'
import GLib from 'types/@girs/glib-2.0/glib-2.0'

const imgPath = {
    Shutdown: 'doodle2.jpg',
    Reboot: 'doodle3.jpg',
    Suspend: 'doodle4.jpg',
    Hibernate: 'doodle5.jpg',
    Logout: 'doodle6.jpg',
}

export const Confirmation = () =>
    PopupWindow({
        name: 'confirmation',
        exclusivity: 'ignore',
        layout: 'top',
        transition: 'slide_down',
        child: Widget.Box({
            classNames: ['confirmation-body'],
            vertical: true,
            children: [
                Widget.Box({
                    vertical: true,
                    classNames: ['title-body'],
                    css: titleConfirm.bind().as(
                        (title) => `background-image: linear-gradient(
                                                        rgba(0, 0, 0, 0.6),
                                                        rgba(0, 0, 0, 0.6)),
                        url('${GLib.getenv('HOME')}/.config/ags/assets/${imgPath[title]}');`,
                    ),
                    children: [
                        Widget.Label({
                            hpack: 'start',
                            classNames: ['title'],
                            justification: 'left',
                            hexpand: false,
                            label: titleConfirm
                                .bind()
                                .as((title) => `${title} the machine`),
                        }),
                        Widget.Label({
                            hpack: 'start',
                            justification: 'left',
                            classNames: ['desc'],
                            hexpand: false,
                            label: `Confirm your action ?`,
                        }),
                    ],
                }),
                Widget.Box({
                    classNames: ['confirmation-button'],
                    hexpand: true,
                    spacing: 8,
                    children: [
                        Widget.Button({
                            label: 'Confirm',
                            classNames: ['confirm'],
                            hexpand: true,
                            onClicked: powerCommand.bind().as((command) => {
                                return () => {
                                    Utils.exec(command)
                                    App.toggleWindow('confirmation')
                                }
                            }),
                        }),
                        Widget.Button({
                            classNames: ['cancel'],
                            label: 'Cancel',
                            hexpand: true,
                            onClicked: () => {
                                App.toggleWindow('confirmation')
                            },
                        }),
                    ],
                }),
            ],
        }),
    })
