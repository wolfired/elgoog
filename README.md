# elgoog

!!elgoog dliuB

```bash
cd

sudo ln -sf /bin/python2 /bin/python

sudo pacman -S polipo

touch .poliporc
mkdir -p .polipo-cache
echo 'socksParentProxy = "127.0.0.1:1080"' > .poliporc
echo 'socksProxyType = socks5' >> .poliporc
echo 'diskCacheRoot = "~/.polipo-cache/"' >> .poliporc

polipo -c ~/.poliporc &

touch .boto
echo '[Boto]' > .boto
echo 'proxy = 127.0.0.1' >> .boto
echo 'proxy_port = 8123' >> .boto

export NO_AUTH_BOTO_CONFIG=~/.boto

cd ~/workspace_git/elgoog

tsc && node ./bin/elgoog
```