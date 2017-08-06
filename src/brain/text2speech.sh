#!/bin/bash

export WORKON_HOME=~/Envs
source /usr/local/bin/virtualenvwrapper.sh

workon scrapyd_py3.6.1 
python text2speech.py