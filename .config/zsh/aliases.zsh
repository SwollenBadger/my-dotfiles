alias c="clear"
alias q="exit"
alias cleanram="sudo sh -c 'sync; echo 3 > /proc/sys/vm/drop_caches'"
alias mkgrub='sudo grub-mkconfig -o /boot/grub/grub.cfg'
alias mtar='tar -zcvf' # mtar <archive_compress>
alias utar='tar -zxvf' # utar <archive_decompress> <file_list>
alias z='zip -r' # z <archive_compress> <file_list>
alias uz='unzip' # uz <archive_decompress> -d <dir>
alias sr='source ~/.config/zsh/env.zsh'
alias ..="cd .."
alias psg="ps aux | grep -v grep | grep -i -e VSZ -e"
alias mkdir="mkdir -p"
alias cleanpac='pman -Sc;pman -Rns $(pman -Qtdq);'
alias installed="grep -i installed /var/log/pacman.log"
alias ls="eza --group-directories-first --oneline --color=auto --icons"
alias l="ls -l"
alias la="ls -a"
alias lla="ls -la"
alias lt="ls --tree"
alias cat="bat --color always --plain --theme=Catppuccin-mocha"
alias grep='grep --color=auto'
alias mv='mv -v'
alias cp='cp -vr'
alias rm='trash-put -v'
alias vim='nvim'
alias pman='yay'
