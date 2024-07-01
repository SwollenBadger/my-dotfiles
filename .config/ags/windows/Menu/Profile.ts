import GLib from 'types/@girs/glib-2.0/glib-2.0'
import {MenuButton} from './Main'
import Hardware from './Hardware'

const capitalize = (s: string | null) =>
    s ? s[0].toUpperCase() + s.slice(1) : ''

export const uptime = Variable('', {
    poll: [
        60000,
        async () =>
            await Utils.execAsync(`sh -c "uptime --pretty | sed s/up//"`),
    ],
})

const Photo = () =>
    Widget.Box({
        css: `background-image:url('${GLib.getenv('HOME')}/.face.icon')`,
        classNames: ['photo'],
    })

const Uptime = () =>
    Widget.Label({
        hpack: 'start',
        classNames: ['uptime'],
        label: uptime.bind().as((uptime) => `${uptime.trim()}`),
    })

const Logout = () =>
    MenuButton({
        title: 'Logout',
        classNames: ['logout', 'action'],
        label: 'Sign Out ',
        confirm: true,
        command: 'hyprctl dispatch exit',
    })

const Folder = () =>
    MenuButton({
        title: 'Folder',
        classNames: ['folder', 'action'],
        label: '',
        confirm: false,
        command: `thunar ${GLib.getenv('HOME')}`,
    })

const Actions = () =>
    Widget.Box({
        hpack: 'start',
        hexpand: true,
        classNames: ['actions'],
        children: [Logout(), Folder()],
    })

const Username = () =>
    Widget.Label({
        hpack: 'start',
        classNames: ['user'],
        label: capitalize(GLib.getenv('USER')),
    })

const info = () =>
    Widget.Box({
        hexpand: true,
        vertical: true,
        classNames: ['info'],
        children: [Username(), Uptime(), Actions()],
    })

const Profile = () =>
    Widget.Box({
        hexpand: true,
        vertical: true,
        classNames: ['profile'],
        children: [
            Widget.Box({
                children: [Photo(), info()],
            }),
            Hardware(),
        ],
    })

export default Profile
