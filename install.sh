#!/bin/bash

clear

set -e

# ---------------------- Main Source Install ---------------------- #
source "./src/_utils.sh"
source "./src/install_dependencies.sh"
source "./src/install_config.sh"
source "./src/install_theme.sh"
source "./src/settings.sh"

# ---------------------- Optional Source Install ---------------------- #
source "./src/optionals/install_bluetooth.sh"
source "./src/optionals/install_spotify.sh"
source "./src/optionals/install_docker.sh"
source "./src/optionals/install_input_method.sh"

echo -e "\e[35m   
 ██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗
 ██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝
 ██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗  
 ██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝  
 ╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗
  ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
\e[0m"

print_color $CYAN "Welcome to the Arch Linux based $AURH Hyprland installer!\n\n"
print_color $CYAN "This installation is intended for my setup, something might break and need your own config\n\n"
print_color $CYAN "Proceed to install? (yes/no) " 
read -n1 -rep '' PROC
if [[ "$PROC" =~ [Nn] ]];then
  clear
  print_color $RED "\n ▄︻テ══━一"
  print_color $MAGENTA " (づ｡◕‿‿◕｡)づ\n"
  print_color $MAGENTA "\n Good bye\n\n"
  exit 0
fi

echo -e 
print_color $MAGENTA "Install Bluetooth using bluez\n"
print_color $MAGENTA "Proceed to install? (yes/no) "
read -n1 -rep '' BTH

echo -e 
print_color $MAGENTA "Install Input method contain fcitx5-hangul fcitx5-mozc fcitx5-kkc by default\n"
print_color $MAGENTA "Proceed to install? (yes/no) "
read -n1 -rep '' IME

echo -e 
print_color $MAGENTA "Install Spotify will include spicetify mocha by default\n"
print_color $MAGENTA "Proceed to install? (yes/no) "
read -n1 -rep '' SPT

echo -e 
print_color $MAGENTA "Would you like to install docker?\n"
print_color $MAGENTA "Proceed to install? (yes/no) "
read -n1 -rep '' DOCK

if [[ ! "$DOCK" =~ [Nn] ]]; then
  print_color $CYAN "would you like to change docker root path (yes/no) "
  read -n1 -rep '' DCKPTH

  if [[ ! "$DCKPTH" =~ [Nn] ]]; then
    read -p "Enter your docker root path: " ROOT_DOC 
  fi

  if [ ! -d "$ROOT_DOC" ]; then
    print_color $CYAN "Path that you enter doesn't exist, would you like to create the folder? (yes/no) "
    read -n1 -rep "" DKRCM
  fi
fi

# -- Global variable
CURRENT_HOSTNAME=$(tr "[:upper:]" "[:lower:]" < /etc/hostname)
GTK_THEME="Catppuccin-Mocha-Standard-Pink-Dark"

# ---------------------- Install aur helper ---------------------- #
install_aur_helper(){
  if package_exist $AURH; then
    pman -Syu --noconfirm  
  else
    sudo pacman -Syu --noconfirm
    print_color $MAGENTA "Installing $AURH (AUR Helper)\n"

    rm -rf ~/$AURH || true
    git clone https://aur.archlinux.org/$AURH-bin.git ~/$AURH
    cd ~/$AURH
    makepkg -si --noconfirm

    cd $CURRENT_DIRECTORY
    rm -rf ~/$AURH
  fi
}

clean(){
  cd $HOME
  rm -rf $CURRENT_DIRECTORY
}

# ---------------------- Main Install ---------------------- #
install_aur_helper
install_dependencies
install_config
install_theme
settings

# ---------------------- Optional Install ---------------------- #
install_bluetooth
install_input_method
install_spotify
install_docker

print_color $GREEN "Installation has finished, would you like to [ start hyprland(s or S) ] or [ restart your machine(r or R) ], leave empty to do nothing: "
read -n1 -rep '' CHOICE

if [[ "$CHOICE" =~ [Ss] ]]; then
  clean
  Hyprland
elif [[ "$CHOICE" =~ [Rr] ]]; then
  clean
  systemctl reboot
else
  clean
  clear
  print_color $MAGENTA "\n ⸜ (｡˃ ᵕ ˂ )⸝♡\n"
  print_color $MAGENTA "\n Enjoy your hyprland\n"
fi
