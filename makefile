update:
	git pull
	npm i
	pm2 restart all
git:
	git add .
	git commit -m "$m"
	git push