function rofi_library() {
    sudo rm -rf $HOME/rofi*

    git clone https://github.com/svenstaro/rofi-calc.git $HOME/rofi-calc
    git clone https://github.com/Mange/rofi-emoji $HOME/rofi-emoji

    cd $HOME/rofi-calc
    mkdir m4
    autoreconf -i
    mkdir build
    cd build
    ../configure
    sudo make install

    cd $HOME/rofi-emoji
    autoreconf -i
    mkdir build
    cd build/
    ../configure
    make
    sudo make install

    cd $CURRENT_DIRECTORY
}

function dependencies() {
    clear
    print_color $YELLOW "Installing dependencies...\n"
    sleep 3

    # -- Dev util package
    local DEV_TOOLS="pnpm composer fnm-bin rustup opam go bun-bin git github-cli neovim visual-studio-code-bin"

    # -- Main package
    local CORE="hyprland waybar xdg-desktop-portal-hyprland zsh qt5-wayland qt6-wayland polkit-gnome sddm upower"
    # local COMPONENT="swww mako rofi-lbonn-wayland hypridle hyprlock-git btop neofetch network-manager-applet thunar-archive-plugin"
    local COMPONENT="swww mako rofi-lbonn-wayland swayidle sway-audio-idle-inhibit-git swaylock btop neofetch network-manager-applet thunar-archive-plugin"
    local CORE_COMPONENT="ffmpegthumbnailer tumbler brightnessctl playerctl pamixer xdg-user-dirs gvfs"
    local LIB="colord libqalculate python-pyquery noise-suppression-for-voice imagemagick xorg-xhost"
    local UTILITY="tldr tmux tmux-plugin-manager hyprpicker grimblast cliphist swappy udiskie file-roller socat flatpak"
    local CORE_APP="foot thunar mpv loupe pavucontrol google-chrome firefox epiphany android-file-transfer gnome-text-editor"
    local CMDLINE="eza jq fzf fd ripgrep bat wget"

    # -- Fonts package
    local MONO_EMOJI_FONTS="ttf-jetbrains-mono-nerd noto-fonts-emoji otf-font-awesome"
    local LANGUAGE_FONTS="adobe-source-han-sans-jp-fonts adobe-source-han-sans-kr-fonts adobe-source-han-sans-cn-fonts"
    local LANGUAGE_SHERIF_FONTS="adobe-source-han-serif-jp-fonts adobe-source-han-serif-kr-fonts adobe-source-han-serif-cn-fonts"
    local MS_FONTS="ttf-tahoma ttf-ms-fonts"

    # -- Theme package
    local THEME_PACKAGE="qt5ct qt6ct kvantum nwg-look-bin"

    # -- sddm package
    local SDDM_PACKAGE="qt5-graphicaleffects qt5-svg qt5-quickcontrols2"

    # -- OEM package
    if [[ "$CURRENT_HOSTNAME" == "thinkpad" ]]; then
        local OEM_PACKAGE="tp-battery-mode"
    fi

    # -- Docker package
    if [[ ! "$DOCK" =~ [Nn] ]]; then
        local DOCKER_PACKAGE="docker docker-compose"
    fi

    # -- Input method package
    if [[ ! "$IME" =~ [Nn] ]]; then
        local IME_PACKAGE="fcitx5-im fcitx5-hangul fcitx5-mozc fcitx5-kkc"
    fi

    # Must install one by one to avoid conflict
    pman -Sy --removemake --noconfirm --needed --sudoloop \
        $DEV_TOOLS

    pman -Sy --removemake --noconfirm --needed --sudoloop \
        $CORE \
        $COMPONENT \
        $UTILITY \
        $CORE_APP

    pman -Sy --removemake --noconfirm --needed --sudoloop \
        $CORE_COMPONENT \
        $LIB \
        $MONO_EMOJI_FONTS \
        $LANGUAGE_FONTS \
        $LANGUAGE_SHERIF_FONTS \
        $MS_FONTS \
        $THEME_PACKAGE \
        $SDDM_PACKAGE \
        $OEM_PACKAGE \
        $BLUETOOTH_PACAKGE \
        $DOCKER_PACKAGE \
        $IME_PACKAGE \
        $CMDLINE

    rofi_library
}

function dependencies_settings() {
    unset BROWSER

    fnm install --lts
    rustup default stable
    opam init -y

    xdg-user-dirs-update --force
    xdg-settings set default-web-browser google-chrome.desktop
    xdg-mime default thunar.desktop inode/directory
    xdg-mime default org.gnome.TextEditor.desktop plain/text
    xdg-mime default org.gnome.Loupe.desktop image/png image/jpeg image/gif image/bmp image/tiff
    xdg-mime default mpv.desktop video/mp4 video/webm video/x-matroska video/avi video/x-flv
    xdg-mime default org.kde.okular.desktop application/pdf application/postscript application/epub+zip

    # xfconf-query --channel thunar --create --property /last-show-hidden --type bool --set true
    # xfconf-query --channel thunar --create --property /misc-confirm-close-multiple-tabs --type bool --set false
    # xfconf-query --channel thunar --create --property /last-view --type string --set ThunarDetailsView

    if [[ "$CURRENT_HOSTNAME" == "thinkpad" ]]; then
        echo -e "START_THRESHOLD=75\nSTOP_THRESHOLD=80 " | sudo tee /etc/tp-battery-mode.conf
        sudo systemctl enable tp-battery-mode.service --now
    fi

    sudo flatpak override --filesystem=xdg-data/themes
    sudo flatpak override --filesystem=xdg-data/icons
    sudo flatpak override --filesystem=xdg-data/fonts
    sudo flatpak override --filesystem=xdg-config/Kvantum:ro
    sudo flatpak override --filesystem=xdg-config/kdeglobals:ro

    sudo flatpak override --env=GTK_THEME="Catppuccin-Mocha-Standard-Pink-Dark"
    sudo flatpak override --env=QT_STYLE_OVERRIDE=kvantum

    sudo usermod -aG input $(whoami)

    echo -e "ENV{ID_FS_USAGE}==\"filesystem|other|crypto\", ENV{UDISKS_FILESYSTEM_SHARED}=\"1\"" | sudo tee /etc/udev/rules.d/99-udisks2.rules || true
    echo -e "D /media 0755 root root 0 -" | sudo tee /etc/tmpfiles.d/media.conf
}

function install_dependencies() {
    dependencies
    dependencies_settings

    clear
    print_color $GREEN "Dependencies installed\n"
    sleep 3
}
