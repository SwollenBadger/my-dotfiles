while read file 
do 
  source "$ZDOTDIR/$file.zsh"
done <<- EOF
	env
	options
	aliases
  plugins
  prompt
EOF
