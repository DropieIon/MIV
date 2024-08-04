PORT_PACS=4242
PORT_PROXY=4243
run-infra:
	(cd Infra ; docker compose down ; docker compose up -d)

stop-infra:
	(cd Infra; docker compose down)

run-mobile:
	(cd Mobile ; npx expo start)

build-mobile:
	(cd Mobile; npx eas build -p android --profile preview --local)

upload-studies:
	storescu -aec ORTHANC localhost $(PORT_PACS) --propose-lossless ./test.dcm

test-proxy:
	# storescu -aec ORTHANC --propose-lossless localhost $(PORT_PROXY) ../Margaret\ Hamilton/*/*
