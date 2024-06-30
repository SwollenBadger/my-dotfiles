import Gtk from 'types/@girs/gtk-3.0/gtk-3.0'
import PopupWindow from './PopupWindow'
const clipHistory = Variable<string[]>([])

const getClipHistory = async () => {
    const history = await Utils.execAsync("sh -c 'cliphist list'")

    if (history.length < 1) {
        return []
    }
    return history.split('\n').slice(0, 100)
}
const wlCopy = (text: string) =>
    Utils.execAsync(
        `sh -c "cliphist decode ${text.split('\t')[0]} | wl-copy"`,
    ).catch((e) => console.log(e))

const Entry = Widget.Box({
    classNames: ['entry'],
    hexpand: true,
    children: [
        Widget.Entry({
            classNames: ['input'],
            canFocus: true,
            hexpand: true,
            placeholderText: 'Clipboard history',
            onChange: async ({ text }) => {
                clipHistory.setValue(
                    (await getClipHistory()).filter((h, _) => {
                        return h.split('\t')[1].includes(text ?? '')
                    }),
                )
            },
            onAccept: clipHistory.bind().as((clipHist) => {
                return () => {
                    if (clipHist.length > 0) {
                        wlCopy(clipHist[0][1])
                    }
                    App.closeWindow('clip-history')
                }
            }),
        }),
        Widget.Button({
            classNames: ['trash'],
            label: '󰩹',
            cursor: 'pointer',
            canFocus: false,
            onClicked: () => {
                App.closeWindow('clip-history')
                Utils.execAsync(`sh -c "cliphist wipe"`).catch((e) =>
                    console.log(e),
                )
            },
        }),
    ],
})

const Item = (h: string) =>
    Widget.Button({
        hexpand: true,
        classNames: ['item'],
        child: Widget.Box({
            hexpand: true,
            children: [
                Widget.Label({
                    classNames: ['id'],
                    label: h.split('\t')[0],
                    hpack: 'start',
                }),
                Widget.Label({
                    classNames: ['text'],
                    label: h.split('\t')[1],
                    maxWidthChars: 100,
                    truncate: 'end',
                    hpack: 'start',
                }),
            ],
        }),
        onClicked: () => {
            wlCopy(h)
            App.closeWindow('clip-history')
        },
    })

const History = () =>
    Widget.Scrollable({
        classNames: ['scroll'],
        hscroll: 'never',
        hexpand: true,
        child: Widget.Box({
            classNames: ['history'],
            hexpand: true,
            vertical: true,
            children: clipHistory.bind().as((clipHist) => {
                return [
                    Widget.Label({
                        classNames: ['placeholder'],
                        label: 'No clipboard history',
                        visible: clipHistory
                            .bind()
                            .as((clipHist) => clipHist.length < 1),
                    }),
                    ...clipHist.map((h) => Item(h)),
                ]
            }),
        }),
    })

const ClipHistory = () =>
    PopupWindow({
        name: 'clip-history',
        layout: 'top-center',
        layer: 'top',
        child: Widget.Box({
            vertical: true,
            classNames: ['cliphist'],
            children: [Entry, History()],
            setup: (_) => {
                App.connect('window-toggled', (_, wname, visible) => {
                    if (wname === 'clip-history' && visible) {
                        ; (Entry.get_children()[0] as Gtk.Entry).text = ''
                        Entry.child.grab_focus()
                        getClipHistory().then((h) => {
                            clipHistory.setValue(h)

                            if (h.length >= 150) {
                                const ids = h
                                    .reverse()
                                    .slice(0, 50)
                                    .map((hs) => hs.split('\t')[0])

                                for (const id of ids) {
                                    Utils.execAsync(
                                        `sh -c 'echo ${id} | cliphist delete'`,
                                    )
                                }
                            }
                        })
                    }
                    if (wname === 'clip-history' && !visible) {
                        clipHistory.setValue([])
                    }
                })
            },
        }),
    })

export default ClipHistory
