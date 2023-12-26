run-infra:
	(cd Infra ; docker compose down ; docker compose up -d)

run-mobile:
	(cd Mobile ; npx expo start)

upload-studies:
	(storescu -aec ORTHANC  --propose-lossless localhost 4242 ../2_skull_ct/DICOM/*; storescu -aec ORTHANC localhost 4242 --propose-lossless test.dcm)

#storescu -aec ORTHANC localhost 4242 --propose-lossless ../Dicomuri\ primite/*;