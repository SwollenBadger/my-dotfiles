import Bar from 'windows/Bar/Main'
import SystemTray from 'windows/SystemTray'
const bat = await Service.import('battery')

const SCSS_DIR = `${App.configDir}/styles`
const CSS_PATH = '/tmp/ags/style.css'

import icons from './lib/icons'
import {Menu} from 'windows/Menu/Main'
import {Confirmation} from 'windows/Menu/Confirmation'
import NotificationPopups from 'windows/NotificationPopups/NotificationPopups'
import ControlQuickSettings from 'windows/ControlQuickSettings'
import NetworkQuickSettings from 'windows/NetworkQuickSettings'
import Calendar from 'windows/Calendar'
import Osd from 'windows/Osd'
// import AppLauncher from 'windows/AppLauncher'
// import ClipHistory from 'windows/ClipHistory'

function monitorBattery() {
    bat.connect('notify::percent', (bat) => {
        const low: number = 30
        const percentRound: number = Math.round(Number(bat.percent))

        if (bat.charging) return
        if (percentRound !== low && percentRound !== low / 2) return

        Utils.notify({
            summary: `${percentRound}% Battery Percentage`,
            iconName: icons.battery.warning,
            appName: 'battery',
            timeout: 1800,
        })
    })
}

Utils.exec(`sassc ${SCSS_DIR}/style.scss ${CSS_PATH}`)
Utils.monitorFile(SCSS_DIR, () => {
    Utils.exec(`sassc ${SCSS_DIR}/style.scss ${CSS_PATH}`)
    App.resetCss()
    App.applyCss(CSS_PATH)
})

App.config({
    style: CSS_PATH,
    windows: [
        ...NotificationPopups(),
        SystemTray(),
        Menu(),
        Confirmation(),
        ControlQuickSettings(),
        NetworkQuickSettings(),
        Calendar(),
        Osd(),
        ...Bar(),
        // AppLauncher(),
        // ClipHistory(),
    ],
    onConfigParsed: () => {
        monitorBattery()
    },
})
