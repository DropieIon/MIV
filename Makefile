run-infra:
	(cd Infra ; docker-compose down ; docker-compose up -d kong-gateway db_auth auth backend)

run-mobile:
	(cd Mobile ; npx expo start)