PORT=4242
run-infra:
	(cd Infra ; docker compose down ; docker compose up -d)

run-mobile:
	(cd Mobile ; npx expo start)

build-mobile:
	(cd Mobile; npx eas build -p android --profile preview --local)

upload-studies:
	storescu -aec ORTHANC --propose-lossless localhost $(PORT) ../Dicoms/3Dicom\ -\ DICOM\ Library/*/*
	storescu -aec ORTHANC --propose-lossless localhost $(PORT) ../Dicoms/Ankle/*/*
	storescu -aec ORTHANC --propose-jpeg8 localhost $(PORT) ../Dicoms/rubo.dcm
	storescu -aec ORTHANC localhost $(PORT) --propose-lossless ../Dicoms/skull_ct/*
	storescu -aec ORTHANC localhost $(PORT) --propose-lossless ./test.dcm