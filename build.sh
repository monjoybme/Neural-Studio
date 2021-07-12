rm -rf src/neural_studio_code_kage.egg-info

cd html
yarn build
cd ../src/neural_studio/data
rm -rf templates
mv ../../../html/build templates/ 
cd ../../..

py -m build

rm -rf src/neural_studio_code_kage.egg-info