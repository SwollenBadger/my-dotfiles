dependencies(){
  clear
  print_color $YELLOW "Installing dependencies...\n"
  sleep 3

  # -- Main package
  local CORE="hyprland waybar xdg-desktop-portal-hyprland zsh qt5-wayland qt6-wayland polkit-gnome sddm-git"
  local COMPONENT="swww mako rofi-lbonn-wayland btop neofetch network-manager-applet thunar-archive-plugin swayidle swaylock-effects"
  local CORE_COMPONENT="ffmpegthumbnailer tumbler brightnessctl playerctl pamixer xdg-user-dirs gvfs"
  local LIB="colord libqalculate python-pyquery noise-suppression-for-voice imagemagick xorg-xhost rofi-calc rofi-emoji"
  local UTILITY="tldr tmux tmux-plugin-manager hyprpicker grimblast cliphist swappy udiskie file-roller flatpak"
  local APP="foot thunar mpv loupe gparted pavucontrol google-chrome firefox epiphany android-file-transfer okular"
  local CMDLINE="eza jq fzf fd ripgrep bat"
  
  # -- Dev package
  local PROG_LANG="rustup go python-pip fnm-bin pnpm bun-bin composer php-fpm"
  local DEVTOOL="neovim visual-studio-code-bin git github-cli"
  
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

  # -- Bluetooth package
  if [[ ! "$BTH" =~ [Nn] ]]; then
    local BLUETOOTH_PACAKGE="bluez bluez-utils blueman"
  fi

  # -- Docker package
  if [[ ! "$DOCK" =~ [Nn] ]]; then
    local DOCKER_PACKAGE="docker docker-compose"
  fi

  # -- Input method package
  if [[ ! "$IME" =~ [Nn] ]]; then
    local IME_PACKAGE="fcitx5-im fcitx5-hangul fcitx5-mozc fcitx5-kkc"
  fi

  # -- Spotify package
  if [[ ! "$SPT" =~ [Nn] ]]; then
    curl -sS https://download.spotify.com/debian/pubkey_6224F9941A8AA6D1.gpg | gpg --import -
    local SPOTIFY_PACKAGE="spotify spicetify-cli"
  fi

  # Must install one by one to avoid conflict
  pman -Sy --removemake --noconfirm --needed --sudoloop \
    $CORE \
    $COMPONENT \
    $UTILITY 

  pman -Sy --removemake --noconfirm --needed --sudoloop \
    $APP \
  
  pman -Sy --removemake --noconfirm --needed --sudoloop \
    $CORE_COMPONENT \
    $LIB 

  yes | pman -Sy ebtables

  pman -Sy --removemake --noconfirm --needed --sudoloop \
    $MONO_EMOJI_FONTS \
    $LANGUAGE_FONTS \
    $LANGUAGE_SHERIF_FONTS \
    $MS_FONTS \
    $PROG_LANG \
    $DEVTOOL \
    $THEME_PACKAGE \
    $SDDM_PACKAGE \
    $OEM_PACKAGE \
    $BLUETOOTH_PACAKGE \
    $DOCKER_PACKAGE \
    $IME_PACKAGE \
    $SPOTIFY_PACKAGE \
    CMDLINE

  fnm install --lts
  rustup default stable
}

dependencies_settings(){
  unset BROWSER

  xdg-user-dirs-update --force
  xdg-settings set default-web-browser firefox.desktop
  xdg-mime default thunar.desktop inode/directory
  xdg-mime default org.gnome.Loupe.desktop image/png image/jpeg image/gif image/bmp image/tiff
  xdg-mime default mpv.desktop video/mp4 video/webm video/x-matroska video/avi video/x-flv
  xdg-mime default org.kde.okular.desktop application/pdf application/postscript application/epub+zip
  
  xfconf-query --channel thunar --create --property /last-show-hidden --type bool --set true
  xfconf-query --channel thunar --create --property /misc-confirm-close-multiple-tabs --type bool --set false
  xfconf-query --channel thunar --create --property /last-view --type string --set ThunarDetailsView

  if [[ "$CURRENT_HOSTNAME" == "thinkpad" ]]; then
    echo -e "START_THRESHOLD=75\nSTOP_THRESHOLD=80 " | sudo tee /etc/tp-battery-mode.conf
    sudo systemctl enable tp-battery-mode.service --now
  fi

  sudo usermod -aG input $(whoami)
  sudo usermod -aG libvirt $(whoami)

  sudo sed -i 's/^#\(unix_sock_ro_perms = "0777"\)/\1/' /etc/libvirt/libvirtd.conf
  sudo sed -i 's/^#\(unix_sock_group = "libvirt"\)/\1/' /etc/libvirt/libvirtd.conf

  sudo systemctl enable libvirtd.service
  sudo systemctl start libvirtd.service
}

install_dependencies(){
  dependencies
  dependencies_settings

  clear
  print_color $GREEN "Dependencies installed\n"
  sleep 3
}
