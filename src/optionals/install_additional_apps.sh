# -------------------------------- Install Spotify -------------------------------- #
function install_additional_apps() {
    if [[ ! "$SPT" =~ [Nn] ]]; then
        local ADDITIONAL_APP="spotify spicetify-cli gimp inkscape blender libreoffice-still kdenlive obs-studio"
        print_color $YELLOW "\nInstalling additional apps...\n"

        pman -Sy --removemake --noconfirm --needed --sudoloop $ADDITIONAL_APP

        sudo chmod a+wr /opt/spotify
        sudo chmod a+wr /opt/spotify/Apps -R

        rm -rf $HOME/spicetify-catppuccin || true
        git clone https://github.com/catppuccin/spicetify $HOME/spicetify-catppuccin

        if [[ ! -d ~/.config/spotify ]]; then
            mkdir -p ~/.config/spotify
            touch ~/.config/spotify/prefs
        fi

        sleep 3
        rm -rf ~/.config/spicetify/Themes/catppuccin || true
        cp -r ~/spicetify-catppuccin/catppuccin ~/.config/spicetify/Themes/
        rm -rf $HOME/spicetify-catppuccin || true

        spicetify config current_theme catppuccin || true
        spicetify config color_scheme mocha || true
        spicetify config inject_css 1 inject_theme_js 1 replace_colors 1 overwrite_assets 1 || true
        spicetify backup apply || true
        spicetify refresh || true

        echo -e
        print_color $GREEN "Spotify installed\n"
    else
        echo -e
        print_color $YELLOW "Spotify not installed\n"
    fi

    sleep 2
}
