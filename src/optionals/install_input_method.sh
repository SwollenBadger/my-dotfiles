# -------------------------------- Install bluetooth -------------------------------- #
install_input_method(){
  if [[ ! "$IME" =~ [Nn] ]]; then
    print_color $YELLOW "\nInstalling Input Method...\n"

    mkdir -p ~/.local/share/fcitx5/themes/

    git clone https://github.com/catppuccin/fcitx5.git $CURRENT_DIRECTORY/fcitx5 || true

    cp -r $CURRENT_DIRECTORY/fcitx5/src/* ~/.local/share/fcitx5/themes
    cp -r $CURRENT_DIRECTORY/.config/{fcitx,fcitx5} ~/.config/

    rm -rf $CURRENT_DIRECTORY/fcitx5

    echo -e
    print_color $GREEN "Input Method installed\n"
  else
    echo -e
    print_color $YELLOW "Input method not installed\n"
  fi

  sleep 2
}
