# -------------------------------- Settings -------------------------------- #
setting_grub(){
  GRUB_HANDLED=$(grep 'GRUB_THEME="/usr/share/grub/themes/catppuccin-mocha/theme.txt"' -a /etc/default/grub || true)

  if [[ -z $GRUB_HANDLED ]]; then
    print_color $YELLOW "Setting up grub...\n"

    sudo sed -i 's/^#\(GRUB_THEME="\)\/path\/to\/gfxtheme\"/\1\/usr\/share\/grub\/themes\/catppuccin-mocha\/theme.txt\"/' /etc/default/grub
    sudo grub-mkconfig -o /boot/grub/grub.cfg
    sleep 3

    print_color $GREEN "Grub catppuccin has been applied\n"
    echo -e
  else
    print_color $GREEN "Grub catppuccin has been applied\n"
    echo -e
  fi
  sleep 3
}

setting_sddm(){
  SDDM_HANDLED=$(grep "Theme" -a /etc/sddm.conf 2>/dev/null || true)

  if [[ -z $SDDM_HANDLED ]]; then
    echo -e "[Autologin]\nUser=$(whoami)\nSession=hyprland\n\n[Theme]\nCurrent=catppuccin-mocha" | sudo tee /etc/sddm.conf || true
    echo -e "\n"
    print_color $YELLOW "Enable SDDM service..."

    print_color $CYAN "SDDM catppuccin Has Been set\n"
    echo -e
  else
    print_color $GREEN "SDDM catppuccin Has Been set\n"
    echo -e
  fi

  sudo systemctl enable sddm
  sleep 3
}

settings(){
  if [[ -e "/etc/default/grub" ]]; then
    setting_grub
  fi
  setting_sddm

  sudo brightnessctl set 15%

  pamixer --get-default-sink || true

  sleep 5
  pamixer --set-volume 35 || true
  pamixer --default-source --set-volume 35 || true
  pamixer --default-source -m || true

  sed -i "s/^alias[[:space:]]pman=.*$/alias pman='$AURH'/" ~/.config/zsh/aliases.zsh

  sleep 3
  clear
}
