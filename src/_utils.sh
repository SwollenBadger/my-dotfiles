# Color code
BLACK=30
RED=31
GREEN=32
YELLOW=33
BLUE=34
MAGENTA=35
CYAN=36
WHITE=37

# Global var
CURRENT_DIRECTORY=$(pwd)
AURH="paru" # Change me to yay or other compatible aur helper

pman(){
  local pacman=$(which $AURH)
  $pacman "$@"
}

print_color() {
  local color="$1"
  local text="$2"
  local reset="\e[0m"  # Reset color

  printf "\e[%sm%b$reset" "$color" "$text" 
}

package_exist() {
  package_name=$1

  # Use pacman to check if the package is installed
  if pacman -Qi "$package_name" &> /dev/null; then
    return 0
  else
    return 1
  fi
}

