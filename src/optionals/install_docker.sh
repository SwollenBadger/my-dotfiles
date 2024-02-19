# -------------------------------- Install virtualization -------------------------------- #
install_docker(){
  if [[ ! "$DOCK" =~ [Nn] ]]; then
    print_color $YELLOW "\nInstalling Docker,Qemu...\n"

    getent group docker || sudo groupadd docker
    sudo usermod -aG docker $USER

    if [[ ! "$DCKPTH" =~ [Nn] ]];then
      LOC_DOC=/etc/docker

      sudo rm -rf  $LOC_DOC

      sudo mkdir -p $LOC_DOC
      
      echo -e "{\n\"data-root\": \"$ROOT_DOC\"\n}" |     sudo tee $LOC_DOC/daemon.json

      if [[ ! "$DKRCM" =~ [Nn] ]]; then
        echo -e "Create directory for docker\n"
        sudo mkdir -p $ROOT_DOC
      fi
    fi

    
    sudo systemctl enable docker --now

    echo -e
    print_color $GREEN "Docker installed\n"
  else
    echo -e
    print_color $YELLOW "Docker not installed\n"
  fi

  sleep 2
}
