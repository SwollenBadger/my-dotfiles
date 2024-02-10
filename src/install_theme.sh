# -------------------------------- Install Theme -------------------------------- #
install_theme(){
  print_color $YELLOW "\nInstalling neccesarry theme...\n"

  gsettings set org.gnome.desktop.interface gtk-theme $GTK_THEME
  gsettings set org.gnome.desktop.interface color-scheme prefer-dark
  gsettings set org.gnome.desktop.interface icon-theme 'Papirus-Dark'
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
gtk-icon-theme-name=Papirus-Dark
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
