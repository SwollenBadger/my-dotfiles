# -------------------------------- Config -------------------------------- #
shopt -s extglob

function install_config() {
	WPP_DIR=~/.wallpaper

	print_color $YELLOW "\nInstalling config files...\n"
	sleep 3

	mkdir -p ~/.local/share/
	mkdir -p ~/.config/
	mkdir -p ~/.cache/zsh
	touch ~/.cache/zsh/.histfile

	cp -r $CURRENT_DIRECTORY/.local/* $HOME/.local/
	cp -r $CURRENT_DIRECTORY/.config/!(fcitx*) $HOME/.config/
	cp -r $CURRENT_DIRECTORY/.cache/* $HOME/.cache/
	cp -r $CURRENT_DIRECTORY/.face.icon $HOME
	cp -r $CURRENT_DIRECTORY/.gitconfig $HOME
	cp -r $CURRENT_DIRECTORY/.mime.types $HOME
	cp -r $CURRENT_DIRECTORY/.zshenv $HOME

	ags --init -c $HOME/.config/ags/config.js

	rm -rf ~/.config/starship || true
	git clone https://github.com/SwollenBadger/my-starshiprompt ~/.config/starship || true

	if [[ ! -d $WPP_DIR ]]; then
		print_color $YELLOW "\nInstalling wallpaper...\n"
		git clone https://github.com/SwollenBadger/my-wallpaper ~/.wallpaper
		rm -rf ~/.wallpaper/.git

		print_color $BLUE "INFO: "
		echo "you can Add your own wallpaper directory from hyprland startup.conf to wallpaper daemon"
		sleep 3
	else
		print_color $YELLOW "Default wallpaper already installed\n"
		print_color $BLUE "INFO: "

		sleep 3
		echo "Default wallpapaper located in $WPP_DIR"
		print_color $BLUE "INFO: "
		echo "you can Add your wallpaper directory from hyprland startup.conf to wallpaper daemon"
	fi

	print_color $YELLOW "\nInstalling neovim config from https://github.com/CreativeKittens/neo-kitty...\n"
	sleep 3
	rm -rf ~/.config/nvim || true
	git clone https://github.com/SwollenBadger/my-nvim ~/.config/nvim || true

	if [[ -z "$(awk -F'resume=' '{print $2}' /proc/cmdline)" ]]; then
		if [[ -z "$(grep -i "suspend" $HOME/.config/hypr/hypridle.conf)" ]]; then
			echo "" >>$HOME/.config/hypr/hypridle.conf
			echo -e "listener {" >>$HOME/.config/hypr/hypridle.conf
			echo -e "    timeout = 1800" >>$HOME/.config/hypr/hypridle.conf
			echo -e "    on-timeout = systemctl suspend" >>$HOME/.config/hypr/hypridle.conf
			echo -e "}" >>$HOME/.config/hypr/hypridle.conf
		fi
	else
		if [[ -z "$(grep -i "suspend" $HOME/.config/hypr/hypridle.conf)" ]]; then
			echo "" >>$HOME/.config/hypr/hypridle.conf
			echo -e "listener {" >>$HOME/.config/hypr/hypridle.conf
			echo -e "    timeout = 10800" >>$HOME/.config/hypr/hypridle.conf
			echo -e "    on-timeout = systemctl hibernate" >>$HOME/.config/hypr/hypridle.conf
			echo -e "}" >>$HOME/.config/hypr/hypridle.conf
		fi
	fi

	# if [[ -z "$(awk -F'resume=' '{print $2}' /proc/cmdline)" ]]; then
	#     printf $WHITE "Hibernation is not supported"
	#     sed -i '/"modules": \[/,/^\s*\],/ s/"custom\/hibernate"/\/\/ "custom\/hibernate"/' ~/.config/waybar/modules/left.jsonc
	# fi

	# if [[ -z "$(awk -F'resume=' '{print $2}' /proc/cmdline)" ]]; then
	#     echo -e "timeout 1800 'systemctl suspend'" >> $HOME/.config/swayidle/config
	# else
	#     echo -e "timeout 10800 'systemctl hibernate'" >> $HOME/.config/swayidle/config
	# fi
	# sed -i 's/"exec": "[^"]*"/"exec": "'"$AURH"' -Qua | wc -l"/' ~/.config/waybar/modules/left.jsonc

	chmod +x ~/.local/bin/**/*

	print_color $GREEN "Config installed\n"
	echo -e
	sleep 3
}
