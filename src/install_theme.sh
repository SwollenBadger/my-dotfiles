# -------------------------------- Install Theme -------------------------------- #
install_theme(){
  print_color $YELLOW "\nInstalling neccesarry theme...\n"
  mkdir -p $HOME/.local/share/{themes,icons,fonts}
  mkdir -p $HOME/.local/share/fonts/Roboto 

  curl -s https://api.github.com/repos/googlefonts/roboto/releases/latest \
    | grep -o '"browser_download_url": *"[^"]*"' \
    | grep "roboto-android.zip" \
    | cut -d '"' -f 4 \
    | xargs wget -O $HOME/system-font.zip

  curl -s https://api.github.com/repos/catppuccin/gtk/releases/latest \
    | grep -o '"browser_download_url": *"[^"]*"' \
    | grep "Mocha*" \
    | grep "Pink" \
    | cut -d : -f 2,3 \
    | xargs wget -O $HOME/gtk_theme.zip

  wget -qO- https://git.io/papirus-icon-theme-install | DESTDIR="$HOME/.local/share/icons" sh

  unzip -o $HOME/gtk_theme.zip -d $HOME/.local/share/themes
  unzip -o $HOME/system-font.zip "*.ttf" -d $HOME/.local/share/fonts/Roboto

  gsettings set org.gnome.desktop.interface gtk-theme $GTK_THEME
  gsettings set org.gnome.desktop.interface color-scheme prefer-dark
  gsettings set org.gnome.desktop.interface icon-theme 'ePapirus-Dark'
  gsettings set org.gnome.desktop.interface cursor-theme 'Adwaita'
  gsettings set org.gnome.desktop.interface document-font-name 'Arial Medium 10'
  gsettings set org.gnome.desktop.interface font-name 'Roboto Medium 10'
  gsettings set org.gnome.desktop.interface monospace-font-name 'JetBrainsMono Nerd Font 11'

  settings_dir="$HOME/.config/gtk-3.0/"
  # Ensure the directory exists
  if [ ! -d "$settings_dir" ]; then
    mkdir -p "$settings_dir"
  fi

  # Write settings to the file
  cat <<EOF > "$settings_dir/settings.ini"
[Settings]
gtk-theme-name=Catppuccin-Mocha-Standard-Pink-Dark
gtk-icon-theme-name=ePapirus-Dark
gtk-font-name=Roboto Medium 10
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

  cat <<EOF | tee "$settings_dir/bookmarks" > /dev/null
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
