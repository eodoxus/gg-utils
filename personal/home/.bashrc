#
# Environment variables
#

#
# Path
#
export PATH=$HOME/bin:$PATH
export PATH=$HOME/Applications:$PATH
export PATH=$HOME/.yarn/bin:$PATH
export PATH=/usr/local/bin:$PATH

#
# Aliases
#
alias la='ls -Al'
alias lc='ls -ltcr'
alias lk='ls -lSr'
alias ll='ls -l'
alias lm='ls -al |more'
alias lr='ls -lR'
alias ls='ls -hFG'
alias lt='ls -ltr'
alias lu='ls -ltur'
alias lx='ls -lXB'
alias tree='tree -Csu'
alias explore='xdg-open'

#
# Utilities
#
# Terminal prompt showing current git branch and current working directory
parse_git_branch() {
    git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}
PS1="\e[0;32m\\w\e[1;33m\$(parse_git_branch)\e[m\n$> "

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

