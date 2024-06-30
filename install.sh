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
print_color $CYAN "Proceed to install? (y/n) "
read -n1 -rep '' PROC
if [[ "$PROC" =~ [Nn] ]]; then
	clear
	print_color $RED "\n ▄︻テ══━一"
	print_color $MAGENTA " (づ｡◕‿‿◕｡)づ\n"
	print_color $MAGENTA "\n Good bye\n\n"
	exit 0
fi

echo -e
print_color $MAGENTA "Install Input method contain fcitx5-hangul fcitx5-mozc fcitx5-kkc by default\n"
print_color $CYAN "Proceed to install? (y/n) "
read -n1 -rep '' IME

echo -e
print_color $MAGENTA "Install TLP(Power management) recommended if using a laptop\n"
print_color $CYAN "Proceed to install? (y/n) "
read -n1 -rep '' PWR

echo -e
print_color $MAGENTA "Would you like to install additional app following:\n"
print_color $MAGENTA "gimp\n"
print_color $MAGENTA "inkscape\n"
print_color $MAGENTA "libreoffice-still\n"
print_color $CYAN "Proceed to install? (y/n) "
read -n1 -rep '' ADD_APP

echo -e
print_color $MAGENTA "Would you like to install docker?\n"
print_color $CYAN "Proceed to install? (y/n) "
read -n1 -rep '' DOCK

if [[ ! "$DOCK" =~ [Nn] ]]; then
	print_color $CYAN "would you like to change docker root path (y/n) "
	read -n1 -rep '' DCKPTH

	if [[ ! "$DCKPTH" =~ [Nn] ]]; then
		QUICKPATH_DOC="$HOME/Datacenter/Containers/Docker/_root"

		print_color $GREEN "Quick path: "
		print_color $WHITE "$QUICKPATH_DOC"
		echo -e
		read -p "Enter your Docker root path (Leave it empty to use quick path): " ROOT_DOC

		if [[ -z "$ROOT_DOC" ]]; then
			ROOT_DOC="$QUICKPATH_DOC"
		fi
	fi

	if [[ ! "$DCKPTH" =~ [Nn] ]] && [[ ! -d "$ROOT_DOC" ]]; then
		print_color $CYAN "Path that you enter doesn't exist, would you like to create the folder? (y/n) "
		read -n1 -rep "" DKRCM
	fi
fi

# -- Global variable
CURRENT_HOSTNAME=$(tr "[:upper:]" "[:lower:]" </etc/hostname)
GTK_THEME="Catppuccin-Mocha-Standard-Pink-Dark"

# ---------------------- Install aur helper ---------------------- #
function install_aur_helper() {
	if package_exist $AURH; then
		print_color $GREEN "\n$AURH Updating package...\n"
		sleep 3
		pman -Syu --noconfirm
	else
		print_color $GREEN "\n$AURH not installed, updating package using pacman...\n"
		sleep 3
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

function clean() {
	rm -rf $HOME/*.zip
	rm -rf $HOME/grub-catppuccin
	rm -rf $HOME/sddm-catppuccin
	rm -rf $HOME/fcitx5
	sudo rm -rf $HOME/rofi*
	rm -rf $CURRENT_DIRECTORY

	cd $HOME
}

# ---------------------- Main Install ---------------------- #
sudo timedatectl set-ntp true
install_aur_helper
install_dependencies
install_config
settings

# ---------------------- Optional Install ---------------------- #
install_input_method
install_docker
install_theme

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
