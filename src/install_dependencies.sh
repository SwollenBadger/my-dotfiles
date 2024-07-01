function dependencies() {
	clear
	print_color $YELLOW "Installing dependencies...\n"
	sleep 3

	# -- Dev util package
	local DEV_TOOLS="pnpm composer fnm-bin rustup opam go bun-bin git github-cli sassc neovim visual-studio-code-bin"

	# -- Main package
	local CORE="hyprland xdg-desktop-portal-hyprland zsh qt5-wayland qt6-wayland polkit-gnome sddm"
	local COMPONENT="wofi wofi-calc wofi-emoji aylurs-gtk-shell swww hypridle hyprlock"
	local CORE_COMPONENT="ffmpegthumbnailer tumbler brightnessctl playerctl pamixer xdg-user-dirs gvfs file-roller thunar-archive-plugin"
	local LIB="colord noise-suppression-for-voice xorg-xhost imagemagick gnome-bluetooth-3.0 mpv-mpris vdhcoapp-bin libdbusmenu-gtk3"
	local UTILITY="tldr btop fastfetch tmux tmux-plugin-manager hyprpicker grimblast-git cliphist swappy udiskie socat flatpak"
	local CORE_APP="foot thunar mpv loupe gparted pavucontrol chromium firefox gnome-text-editor okular uget uget-integrator-firefox uget-integrator-chromium"
	local CMDLINE="eza jq fzf fd ripgrep bat wget trash-cli wlr-randr"

	# -- Fonts package
	local MAIN_FONT="inter-font"
	local MONO_EMOJI_FONTS="ttf-jetbrains-mono-nerd noto-fonts-emoji otf-font-awesome"
	local LANGUAGE_FONTS="adobe-source-han-sans-jp-fonts adobe-source-han-sans-kr-fonts adobe-source-han-sans-cn-fonts"
	local LANGUAGE_SHERIF_FONTS="adobe-source-han-serif-jp-fonts adobe-source-han-serif-kr-fonts adobe-source-han-serif-cn-fonts"
	local MS_FONTS="ttf-ms-win11-auto"

	# -- Theme package
	local THEME_PACKAGE="qt5ct qt6ct kvantum nwg-look-bin"

	# -- sddm package
	local SDDM_PACKAGE="qt5-graphicaleffects qt5-svg qt5-quickcontrols2"

	if [[ ! "$PWR" =~ [Nn] ]]; then
		local PWR_PACKAGE="tlp tlpui"
	fi

	# -- Docker package
	if [[ ! "$DOCK" =~ [Nn] ]]; then
		local DOCKER_PACKAGE="docker docker-compose"
	fi

	# -- Input method package
	if [[ ! "$IME" =~ [Nn] ]]; then
		local IME_PACKAGE="fcitx5-im fcitx5-hangul fcitx5-mozc fcitx5-kkc"
	fi

	if [[ ! "$ADD_APP" =~ [Nn] ]]; then
		local ADDITIONAL_APP="gimp inkscape libreoffice-still android-file-transfer epiphany"
	fi

	# Must install one by one to avoid conflict
	pman -Sy --removemake --noconfirm --needed --sudoloop $DEV_TOOLS $DOCKER_PACKAGE

	fnm install --lts
	rustup default stable
	opam init -y

	pman -Sy --removemake --noconfirm --needed --sudoloop $CORE $CORE_COMPONENT

	pman -Sy --removemake --noconfirm --needed --sudoloop $COMPONENT $LIB

	pman -Sy --removemake --noconfirm --needed --sudoloop $PWR_PACKAGE $CMDLINE $UTILITY

	pman -Sy --removemake --noconfirm --needed --sudoloop $MAIN_FONT $MS_FONTS $MONO_EMOJI_FONTS

	pman -Sy --removemake --noconfirm --needed --sudoloop $LANGUAGE_FONTS $LANGUAGE_SHERIF_FONTS

	pman -Sy --removemake --noconfirm --needed --sudoloop $THEME_PACKAGE $SDDM_PACKAGE

	pman -Sy --removemake --noconfirm --needed --sudoloop $CORE_APP $ADDITIONAL_APP $IME_PACKAGE
}

function dependencies_settings() {
	echo "Settings"
	unset BROWSER

	xdg-user-dirs-update --force
	xdg-settings set default-web-browser firefox.desktop
	xdg-mime default thunar.desktop inode/directory
	xdg-mime default org.gnome.TextEditor.desktop plain/text
	xdg-mime default org.gnome.Loupe.desktop image/png image/jpeg image/gif image/bmp image/tiff
	xdg-mime default mpv.desktop video/mp4 video/webm video/x-matroska video/avi video/x-flv
	xdg-mime default org.kde.okular.desktop application/pdf application/postscript application/epub+zip

	mkdir -p $HOME/Downloads/{Video,Documents,Programs,Pictures,Compressed}

	sudo systemctl enable tp.service --now || true
	sudo flatpak override --filesystem=xdg-data/themes
	sudo flatpak override --filesystem=xdg-data/icons
	sudo flatpak override --filesystem=xdg-data/fonts

	sudo flatpak override --env=GTK_THEME="catppuccin-mocha-mauve-standard+default-dark"

	sudo usermod -aG input $(whoami)

	if [[ ! "$PWR" =~ [Nn] ]]; then
		sudo systemctl enable tlp --now
	fi

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
