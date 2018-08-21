git add .
set /P comment=Enter comment for commit:
git commit -m "%comment%"
pause
git push
pause
