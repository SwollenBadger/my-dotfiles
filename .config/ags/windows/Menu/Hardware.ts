import {rootDisk, ram, cpu} from 'lib/_variables'

const Disk = () =>
    Widget.Box({
        hexpand: true,
        classNames: ['hw-item', 'disk'],
        children: [
            Widget.Label({
                classNames: ['disk-size'],
                label: rootDisk.bind().as((availDisk) => {
                    return `󰋊 ${availDisk}GB`
                }),
            }),
        ],
    })

const Ram = () =>
    Widget.Box({
        hexpand: true,
        classNames: ['hw-item', 'ram'],
        children: [
            Widget.Label({
                classNames: ['ram-size'],
                label: ram.bind().as((availram) => {
                    return `󰍛 ${availram}GB`
                }),
            }),
        ],
    })

const Cpu = () =>
    Widget.Box({
        hexpand: true,
        classNames: ['hw-item', 'cpu'],
        children: [
            Widget.Label({
                classNames: ['cpu-size'],
                label: cpu.bind().as((cpu) => `󰻠 ${cpu.toString()}%`),
            }),
        ],
    })

const Hardware = () =>
    Widget.Box({
        classNames: ['hardware'],
        children: [
            Disk(),
            Widget.Box({hexpand: true}),
            Ram(),
            Widget.Box({hexpand: true}),
            Cpu(),
        ],
    })

export default Hardware
