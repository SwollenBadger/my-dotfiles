# -------------------------------- Install bluetooth -------------------------------- #
function install_input_method() {
    if [[ ! "$IME" =~ [Nn] ]]; then
        print_color $YELLOW "\nInstalling Input Method...\n"

        mkdir -p ~/.local/share/fcitx5/themes/

        rm -rf $HOME/fcitx5
        git clone https://github.com/catppuccin/fcitx5.git $HOME/fcitx5 || true

        cp -r $HOME/fcitx5/src/* ~/.local/share/fcitx5/themes
        cp -r $CURRENT_DIRECTORY/.config/fcitx5 ~/.config/

        echo -e
        print_color $GREEN "Input Method installed\n"
    else
        echo -e
        print_color $YELLOW "Input method not installed\n"
    fi

    sleep 2
}
