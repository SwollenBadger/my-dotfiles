# -------------------------------- Bluetooth -------------------------------- #
install_bluetooth(){
  if [[ ! "$BTH" =~ [Nn] ]]; then
    print_color $YELLOW "\nInstalling bluetooth...\n"
    sudo systemctl enable bluetooth

    print_color $GREEN "Bluetooth installed\n"
    echo -e
  else
    print_color $YELLOW "Bluetooth not installed\n"
    echo -e
  fi

  sleep 2
}
