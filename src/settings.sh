# -------------------------------- Settings -------------------------------- #
function setting_grub() {
    if [[ -e "/etc/default/grub" ]]; then
        GRUB_HANDLED=$(grep 'GRUB_THEME="/usr/share/grub/themes/catppuccin-mocha-grub-theme/theme.txt"' -a /etc/default/grub || true)

        if [[ -z $GRUB_HANDLED ]]; then
            print_color $YELLOW "Setting up grub...\n"

            sudo rm -rf $HOME/grub-catppuccin
            git clone https://github.com/catppuccin/grub.git $HOME/grub-catppuccin
            sed -i '/^+ label {/,/^}/ s/top = 82%/top = 15%/' $HOME/grub-catppuccin/src/*/theme.txt
            sudo cp -r $HOME/grub-catppuccin/src/*mocha* /usr/share/grub/themes/

            sudo sed -i 's/^#\(GRUB_THEME="\)\/path\/to\/gfxtheme\"/\1\/usr\/share\/grub\/themes\/catppuccin-mocha-grub-theme\/theme.txt\"/' /etc/default/grub
            sudo grub-mkconfig -o /boot/grub/grub.cfg
            sleep 3

            print_color $GREEN "Grub catppuccin has been applied\n"
            echo -e
        else
            print_color $GREEN "Grub catppuccin has been applied\n"
            echo -e
        fi
    fi
    sleep 3
}

function setting_sddm() {
    SDDM_HANDLED=$(grep "Theme" -a /etc/sddm.conf 2>/dev/null || true)

    if [[ -z $SDDM_HANDLED ]]; then
        print_color $YELLOW "Setting up sddm...\n"

        curl -s https://api.github.com/repos/catppuccin/sddm/releases/latest |
            grep -o '"browser_download_url": *"[^"]*"' |
            grep "mocha" |
            cut -d : -f 2,3 |
            xargs wget -O $HOME/sddm-mocha.zip

        sudo unzip -o $HOME/sddm-mocha.zip -d /usr/share/sddm/themes

        echo -e "[Autologin]\nUser=$(whoami)\nSession=hyprland\n\n[Theme]\nCurrent=catppuccin-mocha\n" | sudo tee /etc/sddm.conf || true
        echo -e "\n"
        print_color $YELLOW "Enable SDDM service...\n"

        print_color $CYAN "SDDM catppuccin Has Been set\n"
        echo -e
    else
        print_color $GREEN "SDDM catppuccin Has Been set\n"
        echo -e
    fi

    sudo systemctl enable sddm

    sleep 3
}

function settings() {
    if [[ -e "/etc/default/grub" ]]; then
        setting_grub
    fi
    setting_sddm

    sudo brightnessctl set 25%

    pamixer --get-default-sink || true

    sleep 5
    pamixer --set-volume 45 || true
    pamixer --default-source --set-volume 45 || true
    pamixer --default-source -m || true

    sed -i "s/^alias[[:space:]]pman=.*$/alias pman='$AURH'/" ~/.config/zsh/aliases.zsh

    sleep 3
    clear
}
