cd html
yarn build
cd ..

rm -rf templates
cp html/build templates/ -r

rm -rf html/build
echo Done !
