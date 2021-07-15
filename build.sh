rm -rf src/neural_studio.egg-info
rm -rf dist/

cd html
yarn build
cd ../src/neural_studio/data
rm -rf studio
mv ../../../html/build studio/ 
cd ../../..

py -m build

rm -rf src/neural_studio.egg-info