rm -rf src/neural_studio_code_kage.egg-info

cd html
yarn build
cd ../src/neural_studio/data

rm -rf templates
mv ../../../html/build templates/ 

cd ../../..

app=`cat app/app.py`
exe=`python -c "import sys;print(sys.executable)"`

rm temp/neural-studio
echo "#!$exe" >> temp/neural-studio
echo "$app" >> temp/neural-studio

py -m build

rm -rf src/neural_studio_code_kage.egg-info