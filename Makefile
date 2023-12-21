run-infra:
	(cd Infra ; docker-compose down ; docker-compose up -d kong-gateway db_auth auth backend db_orthanc orthanc)

run-mobile:
	(cd Mobile ; npx expo start)

upload-studies:
	(cd ../2_skull_ct/DICOM; storescu -aec ORTHANC  --propose-lossless localhost 4242 *)