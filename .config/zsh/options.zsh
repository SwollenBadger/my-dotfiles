# Lines configured by zsh-newuser-install
HISTFILE=~/.cache/zsh/.histfile
HISTSIZE=1000
SAVEHIST=1000
bindkey -e

autoload -Uz compinit
compinit

# Bind Ctrl + F to the custom widget
bindkey -s '^f' "$HOME/.local/bin/tmux/tmux-sessionaizer\n"
bindkey -s '^n' "$HOME/.local/bin/tmux/tmux-sessionaizer main\n"

bindkey '^[w' vi-forward-blank-word
bindkey '^[b' vi-backward-blank-word
