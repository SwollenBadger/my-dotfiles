import GLib from 'types/@girs/glib-2.0/glib-2.0'

const hyprland = await Service.import('hyprland')

const workspacesIcons = {
    default: '',
    // active: '',
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
}
// const dispatch = (ws: any) => hyprland.messageAsync(`dispatch workspace ${ws}`)

const Workspaces = () =>
    Widget.Box({
        className: 'workspaces',
        hexpand: false,
        vexpand: false,
        vpack: 'center',
        children: [
            ...Array.from({length: 8}, (_, i) => i + 1).map((i) =>
                Widget.Button({
                    classNames: ['workspace-item'],
                    child: Widget.Label({
                        attribute: {
                            id: i,
                            defaultIcons: Object.hasOwn(workspacesIcons, i)
                                ? workspacesIcons[i]
                                : workspacesIcons.default,
                        },
                        setup: (self) => {
                            self.hook(hyprland.active.workspace, () => {
                                self.label = i.toString()
                                // self.label = self.attribute.defaultIcons
                                // self.label =
                                //     hyprland.active.workspace.id ===
                                //     self.attribute.id
                                //         ? workspacesIcons.active
                                //         : self.attribute.defaultIcons
                            })
                        },
                    }),
                    setup: (self) => {
                        self.hook(hyprland, () => {
                            self.toggleClassName(
                                'active',
                                hyprland.active.workspace.id === i,
                            )
                            self.toggleClassName(
                                'occupied',
                                (hyprland.getWorkspace(i)?.windows || 0) > 0,
                            )
                        })
                    },
                    onClicked: () => {
                        Utils.execAsync([
                            'sh',
                            '-c',
                            `${GLib.getenv('HOME')}/.local/bin/hypr/workspace toworkspace ${i}`,
                        ])
                    },
                }),
            ),
        ],
    })

export default Workspaces
