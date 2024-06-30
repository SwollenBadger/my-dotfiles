# -------------------------------- Install Theme -------------------------------- #
function install_theme() {
    print_color $YELLOW "\nInstalling neccesarry theme...\n"
    mkdir -p $HOME/.local/share/{themes,icons,fonts}
    mkdir -p $HOME/.config/gtk-4.0

    curl -LsSO "https://raw.githubusercontent.com/catppuccin/gtk/v1.0.2/install.py"
    python3 install.py "mocha" "mauve"

    wget -qO- https://git.io/papirus-icon-theme-install | DESTDIR="$HOME/.local/share/icons" sh

    cp -r $HOME/.local/share/themes/catppuccin-mocha-mauve-standard+default-dark/gtk-4.0/* $HOME/.config/gtk-4.0
    rm install.py

    if [[ ! "$ADD_APP" =~ [Nn] ]]; then
        curl -s https://api.github.com/repos/Diolinux/PhotoGIMP/releases/latest |
            grep -o '"browser_download_url": *"[^"]*"' |
            cut -d '"' -f 4 |
            xargs wget -O $HOME/photogimp.zip

        unzip -o $HOME/photogimp.zip -d $HOME
        cp -r $HOME/PhotoGIMP-master/.var/app/org.gimp.GIMP/config/GIMP $HOME/.config
        rm -rf $HOME/PhotoGIMP-master
    fi

    gsettings set org.gnome.desktop.interface gtk-theme 'catppuccin-mocha-mauve-standard+default-dark'
    gsettings set org.gnome.desktop.wm.preferences theme 'catppuccin-mocha-mauve-standard+default-dark'
    gsettings set org.gnome.desktop.interface color-scheme prefer-dark
    gsettings set org.gnome.desktop.interface icon-theme 'ePapirus-Dark'
    gsettings set org.gnome.desktop.interface cursor-theme 'Adwaita'
    gsettings set org.gnome.desktop.interface document-font-name 'Arial Medium 11'
    gsettings set org.gnome.desktop.interface font-name 'Inter Display Semi-Bold 11'
    gsettings set org.gnome.desktop.interface monospace-font-name 'JetBrainsMono Nerd Font 11'

    settings_dir="$HOME/.config/gtk-3.0/"
    # Ensure the directory exists
    if [ ! -d "$settings_dir" ]; then
        mkdir -p "$settings_dir"
    fi

    # Write settings to the file
    cat <<EOF >"$settings_dir/settings.ini"
[Settings]
gtk-theme-name=catppuccin-mocha-mauve-standard+default-dark
gtk-icon-theme-name=ePapirus-Dark
gtk-font-name=Inter Display Semi-Bold 11
gtk-cursor-theme-name=Adwaita
gtk-cursor-theme-size=26
gtk-toolbar-style=GTK_TOOLBAR_ICONS
gtk-toolbar-icon-size=GTK_ICON_SIZE_LARGE_TOOLBAR
gtk-button-images=0
gtk-menu-images=0
gtk-enable-event-sounds=1
gtk-enable-input-feedback-sounds=0
gtk-xft-antialias=1
gtk-xft-hinting=1
gtk-xft-hintstyle=hintslight
gtk-xft-rgba=rgb
gtk-application-prefer-dark-theme=1
EOF

    cat <<EOF | tee "$settings_dir/bookmarks" >/dev/null
file://$HOME/Documents
file://$HOME/Downloads
file://$HOME/Pictures
file://$HOME/Public
file://$HOME/Templates
file://$HOME/Videos
EOF

    print_color $GREEN "Theme has been Applied\n"
    echo -e
    sleep 3
}
